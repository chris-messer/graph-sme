/* 23 · Graph neural networks — two accounts whose feature rows are effectively
   identical, separated only by where they sit. Message passing is drawn on the
   real topology: layer 1 and layer 2 aggregate inward toward the selected node. */
DECK.registerViz('23-gnn', (slide) => {
  const LAYER2 = '#8fb8d8';

  const GNN_GRAPH = (() => {
    const nodes = [];
    const links = [];
    const add = (id, extra) => nodes.push({ id, ...extra });
    const edge = (source, target) => links.push({ source, target });

    /* A sits inside one dense, well-connected group */
    add('A', { focus: true, group: 'p' });
    for (let i = 1; i <= 8; i++) add(`p${i}`, { group: 'p' });
    [['A', 'p1'], ['A', 'p2'], ['A', 'p3'], ['A', 'p4'], ['p1', 'p2'], ['p2', 'p3'], ['p3', 'p4'],
      ['p1', 'p5'], ['p2', 'p6'], ['p5', 'p6'], ['p4', 'p7'], ['p6', 'p7'], ['p7', 'p8'], ['p5', 'p8'],
    ].forEach(([s, t]) => edge(s, t));

    /* two groups that touch nowhere except through B */
    add('B', { focus: true, group: 'x' });
    for (let i = 1; i <= 6; i++) add(`q${i}`, { group: 'q' });
    for (let i = 1; i <= 6; i++) add(`r${i}`, { group: 'r' });
    [['q1', 'q2'], ['q2', 'q3'], ['q3', 'q4'], ['q4', 'q5'], ['q5', 'q6'], ['q1', 'q3'], ['q4', 'q6'],
      ['r1', 'r2'], ['r2', 'r3'], ['r3', 'r4'], ['r4', 'r5'], ['r5', 'r6'], ['r1', 'r4'], ['r2', 'r5'],
      ['B', 'q1'], ['B', 'q5'], ['B', 'r1'], ['B', 'r6'],
    ].forEach(([s, t]) => edge(s, t));

    return { nodes, links };
  })();

  const COPY = {
    A: 'sits inside one dense group, and every neighbor it aggregates from is already connected to the others. Remove it and nothing changes about who can reach whom.',
    B: 'is the only path between two groups that otherwise never touch. Remove it and they have no route to each other at all.',
  };

  const GROUP_TINT = { p: 'rgba(34,114,180,.35)', q: 'rgba(0,169,114,.32)', r: 'rgba(176,96,0,.3)', x: C.faint };
  let view = null;

  /* Laid out by hand rather than simulated: A at the heart of one dense ring,
     B alone between two rings that touch nothing else. */
  function build(host) {
    const { svg, w, h } = newSvg(host);
    const nodes = GNN_GRAPH.nodes.map(n => ({ ...n }));
    const links = GNN_GRAPH.links.map(l => ({ ...l }));
    const byId = new Map(nodes.map(n => [n.id, n]));

    const ring = (ids, cx, cy, r) => ids.forEach((id, i) => {
      const angle = -Math.PI / 2 + (i / ids.length) * Math.PI * 2;
      Object.assign(byId.get(id), { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    });
    const rP = Math.min(w * .17, h * .36);
    const rQ = Math.min(w * .095, h * .17);
    const groups = [
      [w * .22, h * .52, rP],
      [w * .78, h * .24, rQ],
      [w * .78, h * .80, rQ],
    ];
    Object.assign(byId.get('A'), { x: groups[0][0], y: groups[0][1] });
    ring(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'], ...groups[0]);
    ring(['q1', 'q2', 'q3', 'q4', 'q5', 'q6'], ...groups[1]);
    ring(['r1', 'r2', 'r3', 'r4', 'r5', 'r6'], ...groups[2]);
    Object.assign(byId.get('B'), { x: w * .49, y: h * .52 });

    links.forEach(l => { l.source = byId.get(l.source); l.target = byId.get(l.target); });

    svg.append('g').selectAll('circle').data(groups).join('circle')
      .attr('cx', d => d[0]).attr('cy', d => d[1]).attr('r', d => d[2] + 20)
      .attr('fill', 'none').attr('stroke', C.line).attr('stroke-width', 1)
      .attr('stroke-dasharray', '4 5').attr('opacity', .7);

    arrowDef(svg, 'gnn-msg', C.blue);

    const link = svg.append('g').selectAll('line').data(links).join('line')
      .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
      .attr('stroke', C.line).attr('stroke-width', 1);
    const msg = svg.append('g').selectAll('line').data(links).join('line')
      .attr('stroke', C.blue).attr('stroke-width', 1.5).attr('opacity', 0)
      .attr('marker-end', 'url(#gnn-msg)');
    const node = svg.append('g').selectAll('circle').data(nodes).join('circle')
      .attr('cx', d => d.x).attr('cy', d => d.y)
      .attr('stroke', '#fff').attr('stroke-width', 1.5);
    const label = svg.append('g').selectAll('text').data(nodes.filter(d => d.focus)).join('text')
      .attr('class', 'node-label').attr('text-anchor', 'middle')
      .attr('x', d => d.x).attr('y', d => d.y - 19)
      .attr('stroke', '#fff').attr('stroke-width', 3.5).attr('paint-order', 'stroke')
      .text(d => `Account ${d.id}`);

    return { link, msg, node, label, nodes, links };
  }

  function paint(target) {
    slide.querySelectorAll('[data-gnn]').forEach(b => {
      const on = b.dataset.gnn === target;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    if (!view) return;

    const depth = neighborhood(target, 2, view.links);
    const at = id => depth.has(id) ? depth.get(id) : 99;

    view.node.transition().duration(320)
      .attr('r', d => at(d.id) === 0 ? 12 : at(d.id) === 1 ? 7.5 : at(d.id) === 2 ? 6 : 5)
      .attr('fill', d => {
        const k = at(d.id);
        if (k === 0) return C.signal;
        if (k === 1) return C.blue;
        if (k === 2) return LAYER2;
        return GROUP_TINT[d.group];
      })
      .attr('opacity', d => at(d.id) <= 2 ? 1 : .45);
    view.link.transition().duration(320)
      .attr('opacity', d => {
        const a = at(endId(d.source)), b = at(endId(d.target));
        return a <= 2 && b <= 2 ? .5 : .22;
      });
    /* one arrow per edge that carries a message inward by exactly one layer */
    view.msg.transition().duration(320)
      .attr('opacity', d => {
        const a = at(endId(d.source)), b = at(endId(d.target));
        return Math.abs(a - b) === 1 && Math.max(a, b) <= 2 ? .85 : 0;
      })
      .attr('x1', d => (at(endId(d.source)) > at(endId(d.target)) ? d.source : d.target).x)
      .attr('y1', d => (at(endId(d.source)) > at(endId(d.target)) ? d.source : d.target).y)
      .attr('x2', d => (at(endId(d.source)) > at(endId(d.target)) ? d.target : d.source).x)
      .attr('y2', d => (at(endId(d.source)) > at(endId(d.target)) ? d.target : d.source).y);
    view.label.transition().duration(320)
      .attr('opacity', d => d.id === target ? 1 : .45)
      .attr('fill', d => d.id === target ? C.signal : C.muted);

    const callout = slide.querySelector('#gnn-callout');
    if (callout) {
      const reach = depth.size - 1;
      callout.innerHTML = `<b>Account ${target} · two layers</b>`
        + `${reach} nodes reached in two hops. Account ${target} ${COPY[target]}`;
    }
  }

  slide.querySelectorAll('[data-gnn]').forEach(b => {
    b.addEventListener('click', (ev) => { ev.stopPropagation(); paint(b.dataset.gnn); });
  });

  return {
    enter() {
      const host = slide.querySelector('#viz-gnn');
      if (!host) return;
      view = build(host);
      paint(slide.querySelector('[data-gnn].active')?.dataset.gnn || 'A');
    },
  };
});
