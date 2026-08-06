/* 14 · Knowledge graph overview — the same entities as rows, then as a network.
   Both layouts are solved up front, so the toggle is a transition between two
   static target positions rather than a live simulation. */
DECK.registerViz('15-kg-overview', (slide) => {
  const STRUCT = (() => {
    const nodes = [];
    for (let i = 0; i < 9; i++) nodes.push({ id: `a${i}`, cluster: 0 });
    for (let i = 0; i < 9; i++) nodes.push({ id: `b${i}`, cluster: 1 });
    nodes.push({ id: 'hub', cluster: 0, role: 'hub' });
    nodes.push({ id: 'bridge', cluster: 1, role: 'bridge' });
    const links = [];
    const ring = (prefix, n) => {
      for (let i = 0; i < n; i++) links.push({ source: `${prefix}${i}`, target: `${prefix}${(i + 1) % n}` });
    };
    ring('a', 9); ring('b', 9);
    ['a0', 'a1', 'a2', 'a3', 'a4', 'a5'].forEach(t => links.push({ source: 'hub', target: t }));
    ['b0', 'b1', 'b2'].forEach(t => links.push({ source: 'bridge', target: t }));
    /* the bridge is the only crossing between the two rings */
    links.push({ source: 'bridge', target: 'a6' });
    links.push({ source: 'bridge', target: 'a7' });
    return { nodes, links };
  })();

  const COPY = {
    attributes: '<b>Rows and columns</b>Twenty entities, one row each, holding every value a row can hold. Nothing in this view records which entities touch each other.',
    relationships: '<b>Nodes and edges</b>Same twenty entities, same values. One is a hub inside a dense group, one is the only crossing between two groups, and neither fact is available to a query over the columns.',
  };
  const ROLE_LABEL = { hub: 'hub', bridge: 'bridge' };

  let view = null;

  function build(host) {
    const { svg, w, h } = newSvg(host);
    const nodes = STRUCT.nodes.map(n => ({ ...n }));
    const links = STRUCT.links.map(l => ({ ...l }));

    /* ── target A: a tidy grid, one row per entity ── */
    const cols = 5, rows = 4;
    const gridW = Math.min(w * .66, 740);
    const stepX = gridW / cols;
    const stepY = Math.min(46, Math.max(24, (h - 108) / (rows - 1)));
    const x0 = (w - gridW) / 2 + stepX * .3;
    const y0 = h * .58 - (stepY * (rows - 1)) / 2;
    nodes.forEach((d, i) => {
      d.gx = x0 + (i % cols) * stepX;
      d.gy = y0 + Math.floor(i / cols) * stepY;
      d.x = d.gx; d.y = d.gy;
    });

    /* ── target B: the solved network ── */
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(42).strength(.75))
      .force('charge', d3.forceManyBody().strength(-185))
      .force('center', d3.forceCenter(w / 2, h * .56))
      .force('collide', d3.forceCollide(13))
      .force('cluster', alpha => {
        for (const d of nodes) {
          d.vx += (w * (d.cluster === 0 ? .33 : .67) - d.x) * .09 * alpha;
          d.vy += (h * .56 - d.y) * .035 * alpha;
        }
      })
      .stop();
    for (let i = 0; i < 320; i++) sim.tick();
    const padX = 44, padTop = 62, padBottom = 26;
    nodes.forEach(d => {
      d.nx = Math.max(padX, Math.min(w - padX, d.x));
      d.ny = Math.max(padTop, Math.min(h - padBottom, d.y));
      d.x = d.gx; d.y = d.gy;
    });

    const rowLabel = svg.append('text').attr('class', 'axis-label')
      .attr('x', x0 - stepX * .3).attr('y', y0 - 24)
      .text('one row per entity · every value a row can hold');

    const link = svg.append('g').selectAll('line').data(links).join('line')
      .attr('stroke', C.line).attr('stroke-width', 1).attr('opacity', 0);

    const cells = svg.append('g').selectAll('g').data(nodes).join('g');
    cells.each(function () {
      const g = d3.select(this);
      for (let k = 0; k < 3; k++) {
        g.append('rect').attr('x', 14 + k * 12).attr('y', -5).attr('width', 8).attr('height', 10)
          .attr('rx', 2).attr('fill', 'rgba(27,49,57,.06)')
          .attr('stroke', 'rgba(27,49,57,.2)').attr('stroke-width', .8);
      }
    });

    const node = svg.append('g').selectAll('circle').data(nodes).join('circle')
      .attr('stroke', C.panel).attr('stroke-width', 1.4);

    const roleLabel = svg.append('g').selectAll('text').data(nodes.filter(d => d.role)).join('text')
      .attr('class', 'node-label').attr('text-anchor', 'middle').attr('dy', -18)
      .text(d => ROLE_LABEL[d.role]);

    return { link, node, cells, roleLabel, rowLabel };
  }

  function activeMode() {
    return slide.querySelector('[data-struct].active')?.dataset.struct || 'attributes';
  }

  function setMode(mode, animate) {
    slide.querySelectorAll('[data-struct]').forEach(b => {
      const on = b.dataset.struct === mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const callout = slide.querySelector('#struct-callout');
    if (callout) callout.innerHTML = COPY[mode];
    if (!view) return;

    const grid = mode === 'attributes';
    const at = (d, axis) => grid ? d[axis === 'x' ? 'gx' : 'gy'] : d[axis === 'x' ? 'nx' : 'ny'];
    const t = sel => (animate ? sel.transition().duration(640).ease(d3.easeCubicInOut) : sel);

    t(view.link).attr('opacity', grid ? 0 : .7)
      .attr('x1', d => at(d.source, 'x')).attr('y1', d => at(d.source, 'y'))
      .attr('x2', d => at(d.target, 'x')).attr('y2', d => at(d.target, 'y'));
    t(view.node)
      .attr('cx', d => at(d, 'x')).attr('cy', d => at(d, 'y'))
      .attr('r', d => grid ? 6.5 : d.role ? 13 : 8)
      .attr('fill', d => {
        if (grid) return C.faint;
        if (d.role === 'hub') return C.blue;
        if (d.role === 'bridge') return C.signal;
        return d.cluster === 0 ? 'rgba(34,114,180,.5)' : 'rgba(0,169,114,.45)';
      });
    t(view.cells).attr('opacity', grid ? 1 : 0)
      .attr('transform', d => `translate(${at(d, 'x')},${at(d, 'y')})`);
    t(view.roleLabel).attr('opacity', grid ? 0 : 1)
      .attr('x', d => at(d, 'x')).attr('y', d => at(d, 'y'));
    t(view.rowLabel).attr('opacity', grid ? 1 : 0);
  }

  slide.querySelectorAll('[data-struct]').forEach(b => {
    b.addEventListener('click', (ev) => {
      ev.stopPropagation();
      setMode(b.dataset.struct, true);
    });
  });

  return {
    enter() {
      const host = slide.querySelector('#viz-struct');
      if (!host) return;
      view = build(host);
      setMode(activeMode(), false);
    },
  };
});
