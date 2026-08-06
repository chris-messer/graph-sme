/* 10 · Ontology overview — the toggle drives both the answer card and the diagram,
   so "what the agent can read" is visible as a plane appearing, not just as text. */
DECK.registerViz('10-ontology-overview', (slide) => {
  let mode = 'without';

  const TYPES = [
    { id: 'Account', fx: .26, fy: .21 },
    { id: 'Contract', fx: .58, fy: .13 },
    { id: 'Invoice', fx: .85, fy: .26 },
    { id: 'churn_rate', fx: .33, fy: .44, metric: true },
  ];
  const RELS = [
    { s: 'Account', t: 'Contract', l: 'HOLDS' },
    { s: 'Contract', t: 'Invoice', l: 'BILLED_BY' },
    { s: 'churn_rate', t: 'Account', l: 'MEASURES' },
  ];
  const TABLES = ['dim_account', 'fact_invoice', 'dim_contract', 'fact_usage'];
  const AUTHORITATIVE = 0;

  function draw() {
    const host = slide.querySelector('#viz-onto-schema');
    if (!host) return;
    const { svg, w, h } = newSvg(host);
    const on = mode === 'with';
    const midY = h * .62;
    const pos = Object.fromEntries(TYPES.map(t => [t.id, { x: t.fx * w, y: t.fy * h }]));

    /* rows below the line — identical in both states, because they never move */
    const tw = (w - 80) / TABLES.length;
    const tableCx = i => 40 + i * tw + (tw - 16) / 2;
    TABLES.forEach((name, i) => {
      const x = 40 + i * tw;
      svg.append('rect').attr('x', x).attr('y', midY + 32).attr('width', tw - 16).attr('height', 34).attr('rx', 6)
        .attr('fill', 'none').attr('stroke', C.line);
      svg.append('text').attr('x', tableCx(i)).attr('y', midY + 53).attr('text-anchor', 'middle')
        .attr('class', 'node-label').style('font-size', '10px').attr('fill', C.muted).text(name);
      svg.append('line').attr('x1', tableCx(i)).attr('y1', midY + 32).attr('x2', tableCx(i)).attr('y2', midY)
        .attr('stroke', C.line).attr('stroke-width', 1).attr('stroke-dasharray', '2 3');
    });

    svg.append('line').attr('x1', 24).attr('y1', midY).attr('x2', w - 24).attr('y2', midY)
      .attr('stroke', C.line).attr('stroke-width', 1).attr('stroke-dasharray', '6 4');
    svg.append('text').attr('class', 'axis-label').attr('x', 26).attr('y', midY - 11)
      .attr('fill', on ? C.blue : C.faint).text('Metadata · meaning');
    svg.append('text').attr('class', 'axis-label').attr('x', 26).attr('y', midY + 20)
      .text('Data · rows in Unity Catalog');

    /* the meaning plane — the whole point of the toggle */
    const plane = svg.append('g').attr('opacity', on ? 1 : .12);

    if (on) {
      /* the resolved path, drawn under the nodes: certified metric → entity type → trusted source */
      const a = pos.Account;
      plane.append('line')
        .attr('x1', pos.churn_rate.x).attr('y1', pos.churn_rate.y - 15)
        .attr('x2', a.x).attr('y2', a.y + 15)
        .attr('stroke', C.signal).attr('stroke-width', 2.6).attr('opacity', .8);
      plane.append('line')
        .attr('x1', a.x).attr('y1', a.y + 15)
        .attr('x2', tableCx(AUTHORITATIVE)).attr('y2', midY + 32)
        .attr('stroke', C.signal).attr('stroke-width', 2).attr('stroke-dasharray', '4 3').attr('opacity', .75);
      plane.append('text').attr('class', 'axis-label').attr('fill', C.signal)
        .attr('x', tableCx(AUTHORITATIVE)).attr('y', midY + 84).attr('text-anchor', 'middle')
        .text('authoritative source');
    }

    plane.selectAll('line.rel').data(RELS).join('line').attr('class', 'rel')
      .attr('x1', d => pos[d.s].x).attr('y1', d => pos[d.s].y)
      .attr('x2', d => pos[d.t].x).attr('y2', d => pos[d.t].y)
      .attr('stroke', C.blue).attr('stroke-width', 1.4).attr('stroke-dasharray', '5 3').attr('opacity', .85);
    if (on) {
      plane.selectAll('text.rl').data(RELS).join('text').attr('class', 'rl link-label')
        .attr('x', d => (pos[d.s].x + pos[d.t].x) / 2)
        .attr('y', d => (pos[d.s].y + pos[d.t].y) / 2 - 6)
        .attr('text-anchor', 'middle').text(d => d.l);
    }

    const g = plane.selectAll('g.ty').data(TYPES).join('g').attr('class', 'ty')
      .attr('transform', d => `translate(${pos[d.id].x},${pos[d.id].y})`);
    g.append('rect').attr('x', -54).attr('y', -15).attr('width', 108).attr('height', 30).attr('rx', 8)
      .attr('fill', C.panel).attr('stroke', d => d.metric ? C.signal : C.blue).attr('stroke-width', 1.5)
      .attr('stroke-dasharray', d => d.metric ? null : '4 2');
    g.append('text').attr('text-anchor', 'middle').attr('dy', 4).attr('class', 'node-label').text(d => d.id);
    g.filter(d => d.metric).append('text').attr('text-anchor', 'middle').attr('dy', 28)
      .attr('class', 'axis-label').attr('fill', C.signal).text('certified metric');

    if (!on) {
      svg.append('text').attr('class', 'axis-label').attr('fill', C.amber)
        .attr('x', w - 26).attr('y', 22).attr('text-anchor', 'end')
        .text('names only · everything above is inferred');
    }
  }

  function setMode(next) {
    mode = next;
    slide.querySelectorAll('[data-ans]').forEach(b => {
      const active = b.dataset.ans === mode;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    slide.querySelectorAll('[data-ans-pane]').forEach(p => {
      p.classList.toggle('live', p.dataset.ansPane === mode);
    });
    draw();
  }

  slide.querySelectorAll('[data-ans]').forEach(b => {
    b.addEventListener('click', (ev) => { ev.stopPropagation(); setMode(b.dataset.ans); });
  });

  return { enter: () => setMode(mode) };
});
