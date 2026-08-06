/* 12 · The company brain — one nested scope map, drawn twice. The governance
   reading is the one the room already accepts; the semantic reading reuses it. */
DECK.registerViz('12-ontology-design', (slide) => {
  let scope = 'governance';

  const STATES = {
    governance: {
      inner: { title: 'Unity Catalog', sub: 'governs the Databricks assets', color: C.blue },
      outer: { title: 'Enterprise catalog', sub: 'Atlan, Collibra — defines what sits outside', color: C.dim },
      link: null,
      note: 'Unity Catalog is the right place to govern Databricks assets. Most organisations still need a catalog that reaches past them.',
    },
    semantics: {
      inner: { title: 'OntoBricks', sub: 'extracts relationships out of Unity Catalog', color: C.blue, ghost: 'where Unity Catalog sits' },
      outer: { title: 'Ontos', sub: 'governs that graph plus non-Databricks resources', color: C.green, ghost: 'where Atlan or Collibra sits' },
      link: 'feeds the company knowledge graph',
      note: 'Databricks-native extraction feeding, and governance spanning, a scope wider than Databricks alone.',
    },
  };

  function badge(g, cx, cy, bw, spec) {
    const bh = 66;
    const node = g.append('g').attr('opacity', 0);
    node.append('rect').attr('x', cx - bw / 2).attr('y', cy - bh / 2).attr('width', bw).attr('height', bh)
      .attr('rx', 12).attr('fill', '#fff').attr('stroke', spec.color).attr('stroke-width', 2);
    node.append('text').attr('x', cx).attr('y', cy - 6).attr('text-anchor', 'middle')
      .attr('class', 'node-label').style('font-size', '17px').attr('fill', C.ink).text(spec.title);
    node.append('text').attr('x', cx).attr('y', cy + 16).attr('text-anchor', 'middle')
      .attr('class', 'badge-sub').text(spec.sub);
    if (spec.ghost) {
      node.append('text').attr('x', cx).attr('y', cy + bh / 2 + 18).attr('text-anchor', 'middle')
        .attr('class', 'axis-label').attr('fill', C.faint).text(spec.ghost);
    }
    node.transition().duration(280).attr('opacity', 1);
    return { left: cx - bw / 2, right: cx + bw / 2 };
  }

  function draw() {
    const host = slide.querySelector('#viz-brain-scope');
    if (!host) return;
    const { svg, w, h } = newSvg(host);
    const state = STATES[scope];

    arrowDef(svg, 'brain-arrow', C.signal);

    const outerX0 = 26, outerX1 = w - 26, outerY0 = 30, outerY1 = h - 26;
    const innerX0 = 62, innerX1 = w * .44, innerY0 = 60, innerY1 = h - 72;

    svg.append('rect').attr('x', outerX0).attr('y', outerY0)
      .attr('width', outerX1 - outerX0).attr('height', outerY1 - outerY0).attr('rx', 16)
      .attr('fill', 'rgba(34,114,180,.035)').attr('stroke', C.line).attr('stroke-width', 1.4)
      .attr('stroke-dasharray', '8 5');
    svg.append('text').attr('class', 'axis-label').attr('x', outerX0 + 16).attr('y', outerY0 - 9)
      .text('Enterprise scope · apps, warehouses, files, third-party data, business definitions');

    svg.append('rect').attr('x', innerX0).attr('y', innerY0)
      .attr('width', innerX1 - innerX0).attr('height', innerY1 - innerY0).attr('rx', 13)
      .attr('fill', 'rgba(255,255,255,.8)').attr('stroke', C.blue).attr('stroke-width', 1.6);
    svg.append('text').attr('class', 'axis-label').attr('fill', C.blue)
      .attr('x', innerX0 + 18).attr('y', innerY0 + 22).text('Databricks estate · Unity Catalog assets');

    const cy = (innerY0 + innerY1) / 2 - 2;
    const innerBox = badge(svg, (innerX0 + innerX1) / 2, cy, 300, state.inner);
    const outerBox = badge(svg, (innerX1 + outerX1) / 2, cy, 360, state.outer);

    if (state.link) {
      const link = svg.append('g').attr('opacity', 0);
      link.append('line').attr('x1', innerBox.right + 10).attr('y1', cy)
        .attr('x2', outerBox.left - 4).attr('y2', cy)
        .attr('stroke', C.signal).attr('stroke-width', 2.2).attr('marker-end', 'url(#brain-arrow)');
      link.append('text').attr('class', 'axis-label').attr('fill', C.signal)
        .attr('x', (innerBox.right + outerBox.left) / 2).attr('y', cy - 12)
        .attr('text-anchor', 'middle').text(state.link);
      link.transition().delay(180).duration(280).attr('opacity', 1);
    }

    svg.append('text').attr('x', innerX0).attr('y', outerY1 - 14)
      .attr('class', 'brain-note').text(state.note);
  }

  function setScope(next) {
    scope = next;
    slide.querySelectorAll('[data-scope]').forEach(b => {
      const active = b.dataset.scope === scope;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    draw();
  }

  slide.querySelectorAll('[data-scope]').forEach(b => {
    b.addEventListener('click', (ev) => { ev.stopPropagation(); setScope(b.dataset.scope); });
  });

  return { enter: () => setScope(scope) };
});
