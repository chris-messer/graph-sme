/* 07 · reference inset for the ask/result matrix. The same product tree and
   the same depth bands as slide 07, plus the product row the tree itself has
   no nodes for — because "levels to roll up" counts from a category down to
   that row. Deliberately small: the matrix is the slide, this only says what
   a level is. Nothing here is interactive. */
DECK.registerViz('07-interconnectivity', (slide) => {
  /* the node each matrix row names, against the number in its first column */
  const ASKED = new Map([[2, 3], [3, 2], [4, 1]]);
  /* the one row that comes back with a number */
  const ANSWERED = 4;

  function draw() {
    const host = slide.querySelector('#viz-gap-ref');
    if (!host) return;
    const { svg, w, h } = newSvg(host);
    const small = w < 460;
    const R = small ? 5.5 : 6.5;
    const padTop = 17;
    const floor = 15;
    /* four depths plus the product row = four equal gaps between five rows */
    const gap = (h - padTop - floor) / 4;
    const pos = hierLayout(w, h, {
      /* the left gutter carries the band names, the right one the level counts */
      padX: small ? 120 : 152,
      padRight: small ? 46 : 58,
      padTop,
      padBottom: gap + floor,
    });
    const labelX = small ? 8 : 12;
    const fontSize = small ? '7px' : '8px';

    hierDepthBands(svg, pos, w, { x: labelX, fontSize });
    const productY = padTop + gap * 4;
    hierExtraBand(svg, w, productY, gap, '4 · products', { x: labelX, fontSize });

    svg.append('g').selectAll('line').data(hierEdges()).join('line')
      .attr('x1', d => pos.get(d.from).x).attr('y1', d => pos.get(d.from).y)
      .attr('x2', d => pos.get(d.to).x).attr('y2', d => pos.get(d.to).y)
      .attr('stroke', C.green).attr('stroke-width', 1.2).attr('opacity', .5);

    /* the product rows themselves — one lettered chip per sku, hung off the
       leaf category it belongs to */
    const leaves = H_NODES.filter(n => n.products.length);
    const cw = small ? 24 : 27;
    const ch = small ? 10 : 11.5;
    leaves.forEach(n => {
      const p = pos.get(n.id);
      const skus = n.products;
      const span = skus.length * cw + (skus.length - 1) * 3;
      svg.append('line')
        .attr('x1', p.x).attr('y1', p.y + R).attr('x2', p.x).attr('y2', productY - ch / 2)
        .attr('stroke', C.line).attr('stroke-width', 1);
      skus.forEach((sku, i) => {
        const x = p.x - span / 2 + i * (cw + 3);
        svg.append('rect').attr('x', x).attr('y', productY - ch / 2)
          .attr('width', cw).attr('height', ch).attr('rx', 3)
          .attr('fill', C.panel).attr('stroke', C.muted).attr('stroke-width', .9);
        svg.append('text').attr('x', x + cw / 2).attr('y', productY).attr('dy', '.34em')
          .attr('text-anchor', 'middle').attr('font-family', 'var(--display)')
          .attr('font-weight', 700).attr('font-size', small ? '6px' : '6.8px')
          .attr('fill', C.muted).text(sku);
      });
    });

    /* the first column of the matrix, read off the bands: how many levels sit
       between a node and the products carrying the revenue */
    svg.append('text').attr('class', 'axis-label')
      .attr('x', w - labelX).attr('y', 9).attr('text-anchor', 'end')
      .style('font-size', fontSize).text('levels to roll up');
    [...ASKED].forEach(([id, levels]) => {
      svg.append('text')
        .attr('x', w - labelX).attr('y', pos.get(id).y).attr('dy', '.34em')
        .attr('text-anchor', 'end').attr('font-family', 'var(--display)')
        .attr('font-weight', 800).attr('font-size', small ? '12px' : '14px')
        .attr('fill', id === ANSWERED ? C.green : C.signal).text(levels);
    });

    drawHierNodes(svg, pos, {
      R,
      nameSize: small ? '6.5px' : '7.5px',
      idSize: small ? '7px' : '8px',
      /* names sit beside the circle, not under it — there is a band boundary
         a few pixels below every node at this size */
      nameAnchor: 'start',
      nameDx: R + 5,
      nameDy: 3,
      /* only the nodes the matrix names carry a label — the rest stay context */
      label: d => (ASKED.has(d.id) ? d.name : null),
      ring: id => (ASKED.has(id) ? (id === ANSWERED ? C.green : C.signal) : null),
    });
  }

  return { enter: draw };
});
