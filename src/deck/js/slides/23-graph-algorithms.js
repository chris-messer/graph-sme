/* 19 · Graph algorithms — one network solved once, rendered four ways as small
   multiples. The engines that run them are slide 20. */
DECK.registerViz('23-graph-algorithms', (slide) => {
  const FAMILIES = ['centrality', 'community', 'pathfinding', 'similarity'];

  const DETAIL = {
    centrality: '<b>Centrality · who matters</b>PageRank, degree, betweenness. Node size here is influence — a property of position in the network, not of any column on the row. Used for influence ranking, fraud priority, and finding critical infrastructure.',
    community: '<b>Community detection · who clusters together</b>Louvain, connected components, label propagation. Used for segments and rings. Naive connected components percolates on real data, so corroboration comes before clustering.',
    pathfinding: '<b>Pathfinding · how one entity reaches another</b>Shortest path and single-source shortest path. The highlighted route is the whole answer. Used for supply chains, network routing, and blast-radius analysis.',
    similarity: '<b>Similarity and link prediction · who looks alike</b>Node similarity and graph embeddings. These two candidates look alike because they share neighbors, not because their columns match. Used for recommendations and entity resolution.',
  };

  const GRAPH = (() => {
    const nodes = d3.range(18).map(i => ({
      id: i,
      label: `${String.fromCharCode(65 + Math.floor(i / 6))}${(i % 6) + 1}`,
      cluster: Math.floor(i / 6),
      score: [1.2, .78, .62, .55, .42, .34, .94, .72, .58, .48, .40, .32, .88, .68, .57, .46, .38, .30][i],
    }));
    const pairs = [
      [0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 5], [2, 3], [3, 4], [4, 5],
      [6, 7], [6, 8], [6, 9], [6, 10], [7, 8], [7, 11], [8, 9], [9, 10], [10, 11],
      [12, 13], [12, 14], [12, 15], [12, 16], [13, 14], [13, 17], [14, 15], [15, 16], [16, 17],
      [1, 6], [7, 12], [3, 13], [2, 8], [8, 14],
    ];
    return { nodes, links: pairs.map(([source, target]) => ({ source, target })) };
  })();

  const PATH_NODES = new Set([5, 1, 6, 7, 12, 17]);
  const PATH_EDGES = new Set(['1-5', '1-6', '6-7', '7-12', '12-17']);
  const CANDIDATES = new Set([2, 14]);
  const SHARED = new Set([8, 3]);
  const SIM_EDGES = new Set(['2-8', '8-14', '2-3', '3-14']);
  const CLUSTER_COLORS = [C.blue, C.green, C.signal];

  /* One layout, reused by all four panels — that is what makes them comparable. */
  function solve(w, h) {
    const nodes = GRAPH.nodes.map(n => ({ ...n }));
    const links = GRAPH.links.map(l => ({ ...l }));
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(Math.min(30, w * .1)).strength(.6))
      .force('charge', d3.forceManyBody().strength(-58))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collide', d3.forceCollide(8))
      .force('cluster', alpha => {
        for (const d of nodes) {
          d.vx += (w * (0.24 + d.cluster * 0.26) - d.x) * .09 * alpha;
          d.vy += (h * (d.cluster === 1 ? .74 : .3) - d.y) * .09 * alpha;
        }
      })
      .stop();
    for (let i = 0; i < 400; i++) sim.tick();
    const pad = 12;
    nodes.forEach(d => {
      d.x = Math.max(pad, Math.min(w - pad, d.x));
      d.y = Math.max(pad, Math.min(h - pad, d.y));
    });
    return { nodes, links };
  }

  const edgeKey = d => {
    const a = endId(d.source), b = endId(d.target);
    return `${Math.min(a, b)}-${Math.max(a, b)}`;
  };

  function drawFamily(host, mode, layout) {
    if (!host) return;
    const { svg } = newSvg(host);
    const nodes = layout.nodes;
    const links = layout.links;
    const hot = d => mode === 'pathfinding' ? PATH_EDGES.has(edgeKey(d)) : (mode === 'similarity' && SIM_EDGES.has(edgeKey(d)));

    svg.append('g').selectAll('line').data(links).join('line')
      .attr('x1', d => nodes[endId(d.source)].x).attr('y1', d => nodes[endId(d.source)].y)
      .attr('x2', d => nodes[endId(d.target)].x).attr('y2', d => nodes[endId(d.target)].y)
      .attr('stroke', d => hot(d) ? (mode === 'pathfinding' ? C.signal : C.green) : C.line)
      .attr('stroke-width', d => hot(d) ? 2.6 : 1)
      .attr('opacity', d => (mode === 'pathfinding' || mode === 'similarity') && !hot(d) ? .28 : .7);

    svg.append('g').selectAll('circle').data(nodes).join('circle')
      .attr('cx', d => d.x).attr('cy', d => d.y)
      .attr('r', d => {
        if (mode === 'centrality') return 3.4 + d.score * 6.4;
        if (mode === 'pathfinding') return PATH_NODES.has(d.id) ? 6 : 4.4;
        if (mode === 'similarity') return CANDIDATES.has(d.id) ? 6.5 : SHARED.has(d.id) ? 5.6 : 4.4;
        return 5.4;
      })
      .attr('fill', d => {
        if (mode === 'community') return CLUSTER_COLORS[d.cluster];
        if (mode === 'pathfinding') return PATH_NODES.has(d.id) ? C.signal : C.faint;
        if (mode === 'similarity') {
          if (CANDIDATES.has(d.id)) return C.blue;
          if (SHARED.has(d.id)) return C.green;
          return C.faint;
        }
        return d.id === 0 ? C.signal : C.blue;
      })
      .attr('stroke', '#fff').attr('stroke-width', 1.1)
      .attr('opacity', d => {
        if (mode === 'pathfinding') return PATH_NODES.has(d.id) ? 1 : .38;
        if (mode === 'similarity') return CANDIDATES.has(d.id) || SHARED.has(d.id) ? 1 : .32;
        return .92;
      });
  }

  function setFamily(mode) {
    slide.querySelectorAll('.algo-cell').forEach(b => {
      const on = b.dataset.algo === mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const detail = slide.querySelector('#algo-detail');
    if (detail) detail.innerHTML = DETAIL[mode];
  }

  slide.querySelectorAll('.algo-cell').forEach(b => {
    b.addEventListener('click', (ev) => { ev.stopPropagation(); setFamily(b.dataset.algo); });
  });

  return {
    enter() {
      const first = slide.querySelector('#viz-algo-centrality');
      if (!first) return;
      const { w, h } = sizeOf(first);
      const layout = solve(w, h);
      FAMILIES.forEach(mode => drawFamily(slide.querySelector(`#viz-algo-${mode}`), mode, layout));
      setFamily(slide.querySelector('.algo-cell.active')?.dataset.algo || 'centrality');
    },
  };
});
