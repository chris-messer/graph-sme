/* 20 · algorithm engines — the edge-count range each engine covers, on a log axis
   shared by all three so the overlaps are visible. */
DECK.registerViz('24-algorithm-engines', (slide) => {
  const TIERS = [
    {
      name: 'NetworkX on serverless', lo: 1e4, hi: 2e6, color: C.blue,
      note: 'a notebook, no cluster libraries',
    },
    {
      name: 'SparkGraph on serverless', lo: 1e5, hi: 1e8, color: C.green,
      note: 'tiers itself: driver path, coarsen-then-solve, then fully distributed',
    },
    {
      name: 'cuGraph on GPU', lo: 1e7, hi: 1e9, color: C.signal,
      note: 'large batch analytics, order-of-magnitude speedups',
    },
  ];

  function drawTiers(host) {
    if (!host) return;
    const { svg, w, h } = newSvg(host);
    const left = 8, right = w - 12;
    const axisY = h - 16;
    const x = d3.scaleLog().domain([1e4, 1e9]).range([left, right]).clamp(true);
    const ticks = [
      [1e4, '10K'], [1e5, '100K'], [1e6, '1M'], [1e7, '10M'], [1e8, '100M'], [1e9, '1B'],
    ];

    svg.append('line').attr('x1', left).attr('x2', right).attr('y1', axisY).attr('y2', axisY)
      .attr('stroke', C.line).attr('stroke-width', 1);
    ticks.forEach(([value, label]) => {
      svg.append('line').attr('x1', x(value)).attr('x2', x(value)).attr('y1', 6).attr('y2', axisY)
        .attr('stroke', C.line).attr('stroke-width', 1).attr('opacity', .4).attr('stroke-dasharray', '3 4');
      svg.append('text').attr('class', 'axis-label').attr('x', x(value)).attr('y', axisY + 12)
        .attr('text-anchor', value === 1e4 ? 'start' : value === 1e9 ? 'end' : 'middle').text(label);
    });

    const band = (axisY - 14) / TIERS.length;
    TIERS.forEach((tier, i) => {
      const top = 4 + i * band;
      svg.append('rect')
        .attr('x', x(tier.lo)).attr('y', top + band - 20)
        .attr('width', Math.max(6, x(tier.hi) - x(tier.lo))).attr('height', 13)
        .attr('rx', 6.5).attr('fill', tier.color).attr('opacity', .22)
        .attr('stroke', tier.color).attr('stroke-width', 1);
      svg.append('text')
        .attr('x', x(tier.lo) + 2).attr('y', top + band - 25)
        .attr('class', 'node-label').style('font-size', '11.5px').attr('fill', C.ink)
        .text(tier.name)
        .append('tspan').attr('fill', C.dim).style('font-weight', '400')
        .text(` — ${tier.note}`);
    });
  }

  return {
    enter() { drawTiers(slide.querySelector('#viz-eng-tiers')); },
  };
});
