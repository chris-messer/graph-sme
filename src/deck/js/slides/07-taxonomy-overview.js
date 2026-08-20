/* 07 · Taxonomy overview — the section's product tree drawn once, with every
   depth band named, so the shape of a classification hierarchy is the whole
   visual. One edge is drawn hot to name what all eleven of them are. Uses the
   shared hierarchy helpers unchanged; slides 07 and 08 draw the same tree. */
DECK.registerViz('07-taxonomy-overview', (slide) => {
  /* Electronics → Computers, the one edge we name out loud */
  const NAMED = { from: 2, to: 3 };

  function draw() {
    const host = slide.querySelector('#viz-tax-tree');
    if (!host) return;
    const { svg, w, h } = newSvg(host);
    const small = w < 720;
    const R = small ? 10 : 12;
    const pos = hierLayout(w, h, {
      /* the left gutter has to clear the longest band name */
      padX: small ? 124 : 160,
      padTop: 46,
      padBottom: 64,
    });

    hierDepthBands(svg, pos, w, { x: small ? 10 : 16 });

    const isNamed = e => e.from === NAMED.from && e.to === NAMED.to;
    svg.append('g').selectAll('line').data(hierEdges()).join('line')
      .attr('x1', d => pos.get(d.from).x).attr('y1', d => pos.get(d.from).y)
      .attr('x2', d => pos.get(d.to).x).attr('y2', d => pos.get(d.to).y)
      .attr('stroke', d => (isNamed(d) ? C.signal : C.green))
      .attr('stroke-width', d => (isNamed(d) ? 2.8 : 1.4))
      .attr('opacity', d => (isNamed(d) ? .95 : .55));

    const a = pos.get(NAMED.from);
    const b = pos.get(NAMED.to);
    svg.append('text').attr('class', 'link-label').attr('fill', C.signal)
      .attr('x', (a.x + b.x) / 2 - 14).attr('y', (a.y + b.y) / 2 - 8)
      .attr('text-anchor', 'end').style('font-size', small ? '8.5px' : '10px')
      .text('one edge type · is a child of');

    svg.append('text').attr('class', 'axis-label').attr('x', w - (small ? 10 : 16)).attr('y', 20)
      .attr('text-anchor', 'end').attr('fill', C.muted)
      .text('12 nodes · 11 edges · exactly one parent each');

    svg.append('text').attr('class', 'link-label').attr('x', small ? 10 : 16).attr('y', h - 12)
      .attr('fill', C.ink).style('font-size', small ? '9.5px' : '11px')
      .text('a tree is a graph — and every question over this one is answerable in SQL');

    drawHierNodes(svg, pos, {
      R,
      nameSize: small ? '9px' : '10.5px',
      idSize: small ? '9.5px' : '11px',
      ring: id => (id === NAMED.from || id === NAMED.to ? C.signal : null),
    });
  }

  return { enter: draw };
});
