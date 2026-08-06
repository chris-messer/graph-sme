/* 05 · Three semantic layers — three mini visuals */
DECK.registerViz('05-semantic-layers', (slide) => {
  function initMiniTree(host) {
    if (!host) return;
    const { svg, w, h } = newSvg(host);
    const data = { name: 'All', children: [
      { name: 'Electronics', children: [{ name: 'Computers' }, { name: 'Phones' }] },
      { name: 'Home', children: [{ name: 'Furniture' }] },
    ]};
    const root = d3.hierarchy(data);
    d3.tree().size([w - 56, h - 52])(root);
    const g = svg.append('g').attr('transform', 'translate(28,24)');
    g.selectAll('path').data(root.links()).join('path')
      .attr('fill', 'none').attr('stroke', C.green).attr('stroke-width', 1.4).attr('opacity', .7)
      .attr('d', d3.linkVertical().x(d => d.x).y(d => d.y));
    const n = g.selectAll('g').data(root.descendants()).join('g').attr('transform', d => `translate(${d.x},${d.y})`);
    n.append('circle').attr('r', 5).attr('fill', d => d.depth === 0 ? C.green : C.blue).attr('stroke', C.panel).attr('stroke-width', 1.5);
    n.append('text').attr('dy', -10).attr('text-anchor', 'middle').attr('class', 'node-label')
      .style('font-size', '9.5px').text(d => d.data.name);
  }

  function initMiniOnto(host) {
    if (!host) return;
    const { svg, w, h } = newSvg(host);
    svg.append('text').attr('class', 'axis-label').attr('x', 10).attr('y', 15).text('Types · no rows');
    const types = [
      { id: 'Company', x: w * .24, y: h * .42 },
      { id: 'Person', x: w * .76, y: h * .42 },
      { id: 'Account', x: w * .5, y: h * .84 },
    ];
    const rules = [
      { s: 0, t: 1, label: 'EMPLOYS' },
      { s: 1, t: 2, label: 'CONTROLS' },
      { s: 0, t: 2, label: 'OWNS' },
    ];
    svg.selectAll('line').data(rules).join('line')
      .attr('x1', d => types[d.s].x).attr('y1', d => types[d.s].y)
      .attr('x2', d => types[d.t].x).attr('y2', d => types[d.t].y)
      .attr('stroke', C.blue).attr('stroke-width', 1.3).attr('stroke-dasharray', '4 3');
    svg.selectAll('text.rule').data(rules).join('text').attr('class', 'link-label')
      .attr('x', d => (types[d.s].x + types[d.t].x) / 2)
      .attr('y', d => (types[d.s].y + types[d.t].y) / 2 - 5)
      .attr('text-anchor', 'middle').style('font-size', '8.5px').text(d => d.label);
    const g = svg.selectAll('g.t').data(types).join('g').attr('class', 't').attr('transform', d => `translate(${d.x},${d.y})`);
    g.append('rect').attr('x', -36).attr('y', -12).attr('width', 72).attr('height', 24).attr('rx', 7)
      .attr('fill', 'none').attr('stroke', C.blue).attr('stroke-width', 1.4).attr('stroke-dasharray', '3 2');
    g.append('text').attr('text-anchor', 'middle').attr('dy', 4).attr('class', 'node-label').style('font-size', '9.5px').text(d => d.id);
  }

  function initMiniKg(host) {
    if (!host) return;
    const { svg, w, h } = newSvg(host);
    arrowDef(svg, 'kg-arrow', C.muted);
    svg.append('text').attr('class', 'axis-label').attr('x', 10).attr('y', 15).text('Instances · predicate values');
    const nodes = [
      { id: 'Acme', x: w * .5, y: h * .34, t: 'c' },
      { id: 'Beta', x: w * .16, y: h * .74, t: 'c' },
      { id: 'Maya', x: w * .84, y: h * .74, t: 'p' },
      { id: '441', x: w * .5, y: h * .92, t: 'a' },
    ];
    const idx = Object.fromEntries(nodes.map((n, i) => [n.id, i]));
    const links = [
      { s: 'Acme', t: 'Beta', label: 'OWNS 82%' },
      { s: 'Acme', t: 'Maya', label: 'EMPLOYS' },
      { s: 'Maya', t: '441', label: 'CONTROLS' },
    ];
    svg.selectAll('line').data(links).join('line')
      .attr('x1', d => nodes[idx[d.s]].x).attr('y1', d => nodes[idx[d.s]].y)
      .attr('x2', d => nodes[idx[d.t]].x).attr('y2', d => nodes[idx[d.t]].y)
      .attr('stroke', C.muted).attr('stroke-width', 1.4).attr('marker-end', 'url(#kg-arrow)').attr('opacity', .8);
    svg.selectAll('text.el').data(links).join('text').attr('class', 'link-label')
      .attr('x', d => (nodes[idx[d.s]].x + nodes[idx[d.t]].x) / 2)
      .attr('y', d => (nodes[idx[d.s]].y + nodes[idx[d.t]].y) / 2 - 5)
      .attr('text-anchor', 'middle').style('font-size', '8.5px').attr('fill', C.signal).text(d => d.label);
    const fill = t => t === 'c' ? C.blue : t === 'p' ? C.green : C.signal;
    const g = svg.selectAll('g.n').data(nodes).join('g').attr('class', 'n').attr('transform', d => `translate(${d.x},${d.y})`);
    g.append('circle').attr('r', 9).attr('fill', d => fill(d.t)).attr('stroke', C.panel).attr('stroke-width', 1.6);
    g.append('text').attr('class', 'node-label').attr('dy', -13).attr('text-anchor', 'middle').style('font-size', '9.5px').text(d => d.id);
  }

  return {
    enter: () => {
      initMiniTree(document.getElementById('viz-tax'));
      initMiniOnto(document.getElementById('viz-onto'));
      initMiniKg(document.getElementById('viz-kg'));
    },
  };
});
