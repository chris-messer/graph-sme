/* 16 · graph answer — everything the four documents on the previous slide
   contain, extracted once into nodes and typed edges. Tracing either question
   lights the edges that answer it; the superseded record stays on the canvas,
   retired. Beta is drawn as the hub it is: the answer path leaves it to the
   upper right, and the two facts the corpus holds about Beta itself hang off it
   below, close enough to read as its neighbourhood rather than as strays. */
DECK.registerViz('16-graph-answer', (slide) => {
  /* `place` is where the name sits relative to the mark — under it unless an
     edge or another label already owns that space */
  const N = {
    beta:   { x: .260, y: .305, label: 'Beta Logistics', kind: 'company', place: 'left' },
    acme:   { x: .520, y: .185, label: 'Acme Holdings',  kind: 'company', place: 'above' },
    /* Acme and Maya both carry their name clear of the mark: the space under
       Acme is where the retired edge leaves, and the space under Maya is where
       the two walks arrive */
    maya:   { x: .800, y: .400, label: 'Maya Okonjo',    kind: 'person', place: 'right' },
    ray:    { x: .620, y: .730, label: 'Ray Duval',      kind: 'person', retired: true },
    priya:  { x: .195, y: .650, label: 'Priya Raman',    kind: 'person' },
    austin: { x: .378, y: .715, label: 'Austin, TX',     kind: 'place' },
  };
  /* dx / dy / text-anchor for each of those placements, given the node radius */
  const PLACE = {
    below: r => ({ dx: 0, dy: r + 15, anchor: 'middle' }),
    above: r => ({ dx: 0, dy: -(r + 10), anchor: 'middle' }),
    left:  r => ({ dx: -(r + 8), dy: 4, anchor: 'end' }),
    right: r => ({ dx: r + 8, dy: 4, anchor: 'start' }),
  };
  /* meta carries the document each edge was extracted from, so provenance rides
     on the edge instead of needing its own tangle of connectors */
  const E = [
    { a: 'acme', b: 'beta',   type: 'PARENT_OF',     meta: 'A',        path: 'parent', hop: 1 },
    { a: 'acme', b: 'maya',   type: 'LED_BY',        meta: 'C · 2019', path: 'parent', hop: 2 },
    { a: 'ray',  b: 'maya',   type: 'SUPERSEDED_BY', meta: 'C+D',      path: 'expired' },
    { a: 'acme', b: 'ray',    type: 'LED_BY',        meta: 'D · 2018', retired: true },
    { a: 'beta', b: 'priya',  type: 'COO',           meta: 'B' },
    { a: 'beta', b: 'austin', type: 'HQ_IN',         meta: 'B' },
  ];
  const PATH = { parent: C.blue, expired: C.signal };
  const view = { mode: 'both', link: null, label: null, node: null, hop: null };

  const active = e => (view.mode === 'both' ? !!e.path : e.path === view.mode);

  function paint() {
    slide.querySelectorAll('[data-ga]').forEach(b => {
      const on = b.dataset.ga === view.mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    slide.querySelectorAll('[data-ga-card]').forEach(card => {
      card.classList.toggle('off', view.mode !== 'both' && card.dataset.gaCard !== view.mode);
    });
    if (!view.link) return;

    /* an untraced edge is context, not noise: in Both it stays legible enough to
       read as an attachment, and only recedes when one question is isolated.
       Weight and colour, not opacity, are what keep the traced paths on top */
    const rest = view.mode === 'both' ? .68 : .2;
    const restText = view.mode === 'both' ? .85 : .24;
    view.link
      .attr('stroke', d => (active(d) ? PATH[d.path] : d.retired ? C.faint : C.dim))
      .attr('stroke-width', d => (active(d) ? 3 : 1.7))
      .attr('opacity', d => (active(d) ? .95 : rest))
      .attr('marker-end', d => `url(#ga-arrow-${active(d) ? d.path : d.retired ? 'faint' : 'soft'})`);
    view.label
      .attr('opacity', d => (active(d) ? 1 : restText))
      .select('tspan.ga-type')
      /* blue and coral belong to the two walks — an untraced type reads slate */
      .attr('fill', d => (active(d) ? PATH[d.path] : d.retired ? C.dim : C.muted));
    view.hop.attr('opacity', d => (active(d) ? 1 : 0));

    const ringOf = (id) => {
      const e = E.find(x => active(x) && (x.a === id || x.b === id));
      return e ? PATH[e.path] : null;
    };
    const touched = new Set();
    E.forEach(e => { if (active(e)) { touched.add(e.a); touched.add(e.b); } });
    view.node.attr('opacity', d => (view.mode === 'both' || touched.has(d) ? 1 : .3));
    view.node.select('circle.ga-ring')
      .attr('stroke', d => ringOf(d) || 'none')
      .attr('opacity', d => (ringOf(d) ? 1 : 0));
  }

  function draw() {
    const host = slide.querySelector('#viz-graph-answer');
    if (!host) return;
    const { svg, w, h } = newSvg(host);
    const small = w < 620;
    const R = { company: small ? 12 : 15, person: small ? 10 : 12, place: small ? 6 : 8 };
    const P = id => ({ x: N[id].x * w, y: N[id].y * h });

    const defs = svg.append('defs');
    const marker = (id, color) => {
      defs.append('marker').attr('id', id)
        .attr('viewBox', '0 -4 8 8').attr('refX', 7).attr('refY', 0)
        .attr('markerWidth', 5.5).attr('markerHeight', 5.5).attr('orient', 'auto')
        .append('path').attr('d', 'M0,-4L8,0L0,4').attr('fill', color);
    };
    marker('ga-arrow-base', C.line);
    marker('ga-arrow-soft', C.dim);
    marker('ga-arrow-faint', C.faint);
    marker('ga-arrow-parent', PATH.parent);
    marker('ga-arrow-expired', PATH.expired);

    /* endpoints stop clear of both node marks, and every label rides above its
       own line while the hop badge rides below it. On a steep edge that normal
       is nearly horizontal, so a centred label would straddle the line it names
       — those get set alongside the edge and anchored away from it instead */
    const geom = (e) => {
      const s = P(e.a), t = P(e.b);
      const dx = t.x - s.x, dy = t.y - s.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      const gap = 9;
      const x1 = s.x + ux * (R[N[e.a].kind] + gap), y1 = s.y + uy * (R[N[e.a].kind] + gap);
      const x2 = t.x - ux * (R[N[e.b].kind] + gap), y2 = t.y - uy * (R[N[e.b].kind] + gap);
      let nx = -uy, ny = ux;
      if (ny > 0) { nx = -nx; ny = -ny; }
      const off = small ? 11 : 14;
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const base = { x1, y1, x2, y2, hx: mx - nx * off, hy: my - ny * off };
      if (Math.abs(uy) > Math.abs(ux)) {
        const pad = small ? 6 : 7.5;
        return { ...base, anchor: nx > 0 ? 'start' : 'end', lx: mx + nx * pad, ly: my + ny * pad + 3 };
      }
      return { ...base, anchor: 'middle', lx: mx + nx * off, ly: my + ny * off };
    };

    /* the source strip: four documents on the left, feeding the whole picture */
    const gx = small ? 24 : 32;
    const gw = small ? 30 : 40;
    const gh = small ? 17 : 21;
    const gy = [0, 1, 2, 3].map(i => h * (.17 + i * .15));
    svg.append('text').attr('class', 'axis-label')
      .attr('x', gx - gw / 2).attr('y', 15)
      .style('font-size', small ? '7px' : '8px')
      .text('extracted once · at write time');
    const docs = svg.append('g').selectAll('g').data(['A', 'B', 'C', 'D']).join('g')
      .attr('transform', (d, i) => `translate(${gx},${gy[i]})`);
    docs.append('rect')
      .attr('x', -gw / 2).attr('y', -gh / 2).attr('width', gw).attr('height', gh).attr('rx', 3)
      .attr('fill', C.panel).attr('stroke', C.line);
    docs.append('text').attr('text-anchor', 'middle').attr('dy', '.34em')
      .attr('font-family', 'var(--display)').attr('font-weight', 700)
      .attr('font-size', small ? '8px' : '9.5px').attr('fill', C.dim)
      .text(d => `doc ${d}`);
    const bx = gx + gw / 2 + 11;
    const by = (gy[0] + gy[3]) / 2;
    svg.append('path').attr('d', `M${bx},${gy[0]} L${bx},${gy[3]}`)
      .attr('fill', 'none').attr('stroke', C.line).attr('stroke-width', 1.2);
    /* the feed stops in the gutter between the strip and the graph, so it points
       at the whole picture rather than at whichever node sits furthest left */
    svg.append('path')
      .attr('d', `M${bx},${by} L${(w * .135).toFixed(1)},${by}`)
      .attr('fill', 'none').attr('stroke', C.line).attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '4 4')
      .attr('marker-end', 'url(#ga-arrow-base)');

    view.link = svg.append('g').selectAll('line').data(E).join('line')
      .attr('x1', d => geom(d).x1).attr('y1', d => geom(d).y1)
      .attr('x2', d => geom(d).x2).attr('y2', d => geom(d).y2)
      .attr('stroke-dasharray', d => (d.retired ? '5 4' : null))
      .attr('stroke-linecap', 'round');

    view.label = svg.append('g').selectAll('text').data(E).join('text')
      .attr('class', 'link-label').attr('text-anchor', d => geom(d).anchor)
      .attr('x', d => geom(d).lx).attr('y', d => geom(d).ly)
      .style('font-size', small ? '8px' : '9px')
      /* a paper-coloured halo behind every label, so a type never has to
         compete with the line or the node name it sits over */
      .attr('stroke', C.panel).attr('stroke-width', 3).attr('paint-order', 'stroke');
    view.label.append('tspan').attr('class', 'ga-type').text(d => d.type);
    view.label.append('tspan').attr('dx', 4).attr('fill', C.dim).text(d => `· ${d.meta}`);

    /* the hop counter is the whole point of question one, so it is drawn on the
       edges rather than only stated in the card beside the canvas */
    view.hop = svg.append('g').selectAll('g').data(E.filter(d => d.hop)).join('g')
      .attr('transform', d => `translate(${geom(d).hx},${geom(d).hy})`);
    view.hop.append('circle').attr('r', small ? 7 : 8.5)
      .attr('fill', PATH.parent).attr('stroke', C.panel).attr('stroke-width', 1.5);
    view.hop.append('text').attr('text-anchor', 'middle').attr('dy', '.34em')
      .attr('font-family', 'var(--display)').attr('font-weight', 700)
      .attr('font-size', small ? '7.5px' : '9px').attr('fill', C.panel)
      .text(d => d.hop);

    /* a place is subordinate to the companies and people, but it is not retired
       — only the retired record gets the faint mark */
    const fill = id => (N[id].retired ? C.faint : N[id].kind === 'company' ? C.ink
      : N[id].kind === 'person' ? C.green : C.muted);
    view.node = svg.append('g').selectAll('g').data(Object.keys(N)).join('g')
      .attr('transform', d => `translate(${P(d).x},${P(d).y})`);
    view.node.append('circle').attr('class', 'ga-ring')
      .attr('r', d => R[N[d].kind] + 6).attr('fill', 'none')
      .attr('stroke-width', 2).attr('stroke-dasharray', '4 3');
    view.node.append('circle').attr('r', d => R[N[d].kind])
      .attr('fill', d => fill(d))
      .attr('stroke', C.panel).attr('stroke-width', 2)
      .attr('stroke-dasharray', d => (N[d].retired ? '3 2' : null));
    const nameAt = d => PLACE[N[d].place || 'below'](R[N[d].kind]);
    view.node.append('text').attr('class', 'node-label')
      .attr('text-anchor', d => nameAt(d).anchor)
      .attr('dx', d => nameAt(d).dx)
      .attr('dy', d => nameAt(d).dy)
      .style('font-size', small ? '9.5px' : '11px')
      .attr('fill', d => (N[d].retired ? C.dim : C.ink))
      .attr('text-decoration', d => (N[d].retired ? 'line-through' : null))
      .attr('stroke', C.panel).attr('stroke-width', 3.5).attr('paint-order', 'stroke')
      .text(d => N[d].label);
    view.node.filter(d => N[d].retired).append('text').attr('class', 'axis-label')
      .attr('text-anchor', 'middle').attr('dy', d => R[N[d].kind] + 27)
      .style('font-size', small ? '7px' : '8px').attr('fill', C.dim)
      .text('retired, not deleted');

    paint();
  }

  slide.querySelectorAll('[data-ga]').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      view.mode = btn.dataset.ga;
      paint();
    });
  });
  slide.querySelectorAll('[data-ga-card]').forEach(card => {
    card.addEventListener('click', (ev) => {
      ev.stopPropagation();
      view.mode = view.mode === card.dataset.gaCard ? 'both' : card.dataset.gaCard;
      paint();
    });
  });

  return { enter: draw };
});
