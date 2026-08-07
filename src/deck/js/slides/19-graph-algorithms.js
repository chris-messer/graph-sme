/* 19 · Graph algorithms — one network on the left, the four families selectable
   on the right. Selecting a family re-solves the same graph the way that
   algorithm would: the nodes move into the arrangement it computes and recolour
   to its answer, so the picture becomes the result rather than illustrating it.
   The engines that run any of this are slide 20. */
DECK.registerViz('19-graph-algorithms', (slide) => {
  const FAMILIES = ['centrality', 'community', 'pathfinding', 'similarity'];

  /* One network: 18 nodes in three natural groups, five edges bridging them.
     Every family reads this same graph — that is the point of the slide. */
  const NODES = d3.range(18).map(i => ({
    id: i,
    label: `${String.fromCharCode(65 + Math.floor(i / 6))}${(i % 6) + 1}`,
    cluster: Math.floor(i / 6),
    score: [1.2, .78, .62, .55, .42, .34, .94, .72, .58, .48, .40, .32, .88, .68, .57, .46, .38, .30][i],
  }));
  const LINKS = [
    [0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 5], [2, 3], [3, 4], [4, 5],
    [6, 7], [6, 8], [6, 9], [6, 10], [7, 8], [7, 11], [8, 9], [9, 10], [10, 11],
    [12, 13], [12, 14], [12, 15], [12, 16], [13, 14], [13, 17], [14, 15], [15, 16], [16, 17],
    [1, 6], [7, 12], [3, 13], [2, 8], [8, 14],
  ].map(([source, target]) => ({ source, target }));

  const key = (a, b) => `${Math.min(a, b)}-${Math.max(a, b)}`;
  const edgeKey = d => key(endId(d.source), endId(d.target));

  /* A6 out to C5, crossing both bridges. Five hops is genuinely the distance
     between those two — nothing in this network sits further from A6 — which is
     what the legend's "shortest path" is asserting, and every hop below is a
     real edge in the list above. C6 is four hops out and its last leg is not an
     edge at all, so it cannot be the target however inviting it looks.
     PATH_LINKS is the single source for the highlight, the hop badges and the
     count in the caption, so those three can no longer disagree. */
  const WALK = [5, 1, 6, 7, 12, 16];
  const ON_PATH = new Set(WALK);
  const HOP_NO = new Map(WALK.slice(1).map((id, i) => [key(WALK[i], id), i + 1]));
  const PATH_LINKS = LINKS.filter(d => HOP_NO.has(edgeKey(d)));
  const PATH_EDGES = new Set(PATH_LINKS.map(edgeKey));
  const HOPWORD = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];

  /* C2 and C4 share both C1 and C3 and have no edge between them — the shape
     node similarity is actually looking for. */
  const CANDIDATES = new Set([13, 15]);
  const SHARED = new Set([12, 14]);
  const LOOKALIKE = new Set([...CANDIDATES, ...SHARED]);
  const SIM_EDGES = new Set([key(12, 13), key(12, 15), key(13, 14), key(14, 15)]);

  const CLUSTER_FILL = [C.blue, C.green, C.signal];
  const CLUSTER_NAME = ['community A', 'community B', 'community C'];
  const SCORES = NODES.map(n => n.score);
  const HI = Math.max(...SCORES);
  const LO = Math.min(...SCORES);
  /* how far out from the middle a node sits in the centrality reading: the
     top-ranked node lands dead centre, the quietest on the rim */
  const outFrom = d => (HI - d.score) / (HI - LO);
  const tier = d => (d.score > .85 ? 0 : d.score >= .5 ? 1 : 2);

  const COPY = {
    centrality: {
      name: 'Centrality',
      algos: 'PageRank · degree ·\nbetweenness',
      use: 'Influence ranking, fraud priority, critical infrastructure. Size and distance from the middle are position in the network, not a column on the row.',
      qs: ['Which suppliers hurt most if they fail?', 'Which accounts sit at the centre of this ring?'],
      caption: 'closer to the middle · more influence',
      legend: [[C.signal, 'Top influence'], [C.blue, 'Mid influence'], [C.faint, 'Periphery']],
    },
    community: {
      name: 'Community detection',
      algos: 'Louvain · connected\ncomponents · LPA',
      use: 'Segments and rings. Naive connected components percolates on real data, so corroboration comes before clustering.',
      qs: ['Which customers behave as one group?', 'Which accounts move money as a ring?'],
      caption: 'three groups the edges make · the long links are the bridges',
      legend: [[C.blue, 'Community A'], [C.green, 'Community B'], [C.signal, 'Community C']],
    },
    pathfinding: {
      name: 'Pathfinding',
      algos: 'Shortest path · single-\nsource shortest path',
      use: 'Supply chains, network routing, blast radius. The highlighted route is the whole answer, and its length is the second half of it.',
      qs: ['How does this part reach that finished good?', 'What goes down if this node fails?'],
      caption: `${NODES[WALK[0]].label} → ${NODES[WALK[WALK.length - 1]].label}`
        + ` · ${HOPWORD[PATH_LINKS.length]} hops, and the route is the answer`,
      legend: [[C.signal, 'Shortest path'], [C.faint, 'Off the route']],
    },
    similarity: {
      name: 'Similarity',
      algos: 'Node similarity ·\ngraph embeddings',
      use: 'Recommendations and entity resolution. These two look alike because they share neighbours, not because their columns match.',
      qs: ['Which records are the same entity?', 'Who else looks like our best accounts?'],
      caption: 'C2 and C4 never touch · both reach C1 and C3',
      legend: [[C.blue, 'Candidates'], [C.green, 'Shared neighbours'], [C.faint, 'Rest of network']],
    },
  };

  const PAD = { x: 40, y: 34 };
  const view = {
    mode: 'centrality', layouts: null, small: false,
    under: null, link: null, anno: null, node: null, mark: null, name: null, caption: null,
  };

  function radiusOf(mode, d) {
    if (mode === 'centrality') return 6 + d.score * 11;
    if (mode === 'community') return 8.5;
    if (mode === 'pathfinding') return ON_PATH.has(d.id) ? 10 : 5.5;
    return CANDIDATES.has(d.id) ? 11 : SHARED.has(d.id) ? 9 : 5;
  }
  function fillOf(mode, d) {
    if (mode === 'centrality') return [C.signal, C.blue, C.faint][tier(d)];
    if (mode === 'community') return CLUSTER_FILL[d.cluster];
    if (mode === 'pathfinding') return ON_PATH.has(d.id) ? C.signal : C.faint;
    return CANDIDATES.has(d.id) ? C.blue : SHARED.has(d.id) ? C.green : C.faint;
  }
  function nodeFade(mode, d) {
    if (mode === 'centrality') return tier(d) === 2 ? .6 : 1;
    if (mode === 'community') return .95;
    if (mode === 'pathfinding') return ON_PATH.has(d.id) ? 1 : .42;
    return LOOKALIKE.has(d.id) ? 1 : .38;
  }
  function named(mode, d) {
    if (mode === 'centrality') return tier(d) === 0;
    if (mode === 'community') return false;
    if (mode === 'pathfinding') return ON_PATH.has(d.id);
    return LOOKALIKE.has(d.id);
  }
  /* stroke, width and opacity for one edge under one reading */
  function edgeStyle(mode, d) {
    const k = edgeKey(d);
    if (mode === 'pathfinding') {
      return PATH_EDGES.has(k) ? [C.signal, 3.2, .95] : [C.line, 1, .22];
    }
    if (mode === 'similarity') {
      return SIM_EDGES.has(k) ? [C.green, 2.8, .95] : [C.line, 1, .2];
    }
    if (mode === 'community') {
      const a = NODES[endId(d.source)].cluster;
      const b = NODES[endId(d.target)].cluster;
      /* a bridge is the interesting edge here, so it reads darker than the
         edges inside a group rather than lighter */
      return a === b ? [CLUSTER_FILL[a], 1.4, .42] : [C.muted, 1.8, .8];
    }
    return [C.line, 1.2, .5];
  }

  /* One solved arrangement per family. Seeded deterministically and ticked to
     rest up front, so the same click always lands the same picture and the
     transition between two of them is a move rather than a re-roll. */
  function solve(w, h, mode) {
    const nodes = NODES.map(n => ({ ...n }));
    const links = LINKS.map(l => ({ ...l }));
    const cx = w / 2;
    const cy = h / 2;
    nodes.forEach((d, i) => {
      const a = i * 2.399963229728653;
      const rad = Math.min(w, h) * .32 * Math.sqrt((i + .5) / nodes.length);
      d.x = cx + rad * Math.cos(a);
      d.y = cy + rad * Math.sin(a);
      d.vx = 0; d.vy = 0;
    });

    const sim = d3.forceSimulation(nodes).stop()
      .force('collide', d3.forceCollide(d => radiusOf(mode, d) + 8));
    let stretchX = 1;
    let rings = null;

    if (mode === 'centrality') {
      /* solved in a circle, then widened to the panel — stretching only ever
         pushes nodes further apart, so the collide result survives it. The link
         force is held almost off here: rank has to win over adjacency, or the
         hubs never make it to the middle. */
      const ry = Math.min(h / 2 - PAD.y - 22, (w / 2 - PAD.x - 22) / 2.15);
      stretchX = Math.min(2.15, (w / 2 - PAD.x - 22) / ry);
      /* the top-ranked node is pinned dead centre — it is the one position on
         this reading that has to be exact, and collide would otherwise nudge
         it off the middle it is supposed to define */
      const top = nodes.reduce((a, b) => (b.score > a.score ? b : a));
      top.fx = cx; top.fy = cy; top.x = cx; top.y = cy;
      sim.force('link', d3.forceLink(links).id(d => d.id).distance(40).strength(.06))
        .force('charge', d3.forceManyBody().strength(-55))
        .force('radial', d3.forceRadial(d => outFrom(d) * ry, cx, cy).strength(.95));
      /* two faint contours, so "further out is quieter" is a thing you can see
         rather than a thing the caption has to assert */
      rings = [.46, .86].map(k => ({ cx, cy, rx: k * ry * stretchX, ry: k * ry }));
    } else if (mode === 'community') {
      const seat = [[.17, .40], [.50, .70], [.83, .38]];
      sim.force('link', d3.forceLink(links).id(d => d.id).distance(44).strength(.16))
        .force('charge', d3.forceManyBody().strength(-105))
        .force('x', d3.forceX(d => seat[d.cluster][0] * w).strength(.4))
        .force('y', d3.forceY(d => seat[d.cluster][1] * h).strength(.4));
    } else if (mode === 'pathfinding') {
      const px = [.09, .25, .41, .57, .74, .90];
      const py = [.76, .52, .34, .30, .48, .72];
      nodes.forEach(d => {
        const k = WALK.indexOf(d.id);
        if (k < 0) return;
        d.fx = px[k] * w; d.fy = py[k] * h;
        d.x = d.fx; d.y = d.fy;
      });
      sim.force('link', d3.forceLink(links).id(d => d.id).distance(44).strength(.3))
        .force('charge', d3.forceManyBody().strength(-180))
        .force('y', d3.forceY(cy).strength(.02));
    } else {
      /* the four that matter make a diamond in the middle; everything else is
         parked on the rim, because none of it is what the answer is about */
      const seat = { 13: [.33, .50], 15: [.67, .50], 12: [.50, .27], 14: [.50, .73] };
      const rim = nodes.filter(d => !LOOKALIKE.has(d.id));
      const rx = w / 2 - PAD.x - 18;
      const ryy = h / 2 - PAD.y - 18;
      rim.forEach((d, i) => {
        const a = -Math.PI / 2 + (i / rim.length) * Math.PI * 2;
        d.tx = cx + Math.cos(a) * rx;
        d.ty = cy + Math.sin(a) * ryy;
      });
      nodes.forEach(d => {
        const s = seat[d.id];
        if (!s) return;
        d.fx = s[0] * w; d.fy = s[1] * h;
        d.x = d.fx; d.y = d.fy;
      });
      sim.force('charge', d3.forceManyBody().strength(-30))
        .force('x', d3.forceX(d => (d.tx == null ? d.x : d.tx)).strength(d => (d.tx == null ? 0 : .8)))
        .force('y', d3.forceY(d => (d.ty == null ? d.y : d.ty)).strength(d => (d.ty == null ? 0 : .8)));
    }

    for (let i = 0; i < 480; i++) sim.tick();

    const at = new Map();
    nodes.forEach(d => {
      const r = radiusOf(mode, d);
      const x = cx + (d.x - cx) * stretchX;
      at.set(d.id, {
        x: Math.max(PAD.x + r, Math.min(w - PAD.x - r, x)),
        y: Math.max(PAD.y + r, Math.min(h - PAD.y - r, d.y)),
      });
    });
    return { at, rings };
  }

  /* The per-family marks that are not nodes or edges: group names, hop badges.
     Rebuilt on every paint and faded in behind the nodes once they have
     arrived, so they never sit over an arrangement they do not describe. */
  function annotate(mode, at, animate) {
    view.anno.selectAll('*').remove();
    const g = view.anno.attr('opacity', 0);

    if (mode === 'community') {
      [0, 1, 2].forEach(c => {
        const own = NODES.filter(n => n.cluster === c).map(n => at.get(n.id));
        const top = Math.min(...own.map(p => p.y));
        g.append('text').attr('class', 'axis-label')
          .attr('x', d3.mean(own, p => p.x)).attr('y', top - 15)
          .attr('text-anchor', 'middle').attr('fill', CLUSTER_FILL[c])
          .style('font-size', view.small ? '8px' : '9px')
          .text(CLUSTER_NAME[c]);
      });
    }

    if (mode === 'pathfinding') {
      const R = view.small ? 7 : 8.5;
      /* one badge per drawn segment, off the same list the highlight is drawn
         from — so a badge can never end up floating over a leg that is not
         there, which is what a walk built out of node pairs allowed */
      PATH_LINKS.forEach(d => {
        const s = at.get(endId(d.source));
        const t = at.get(endId(d.target));
        const dx = t.x - s.x, dy = t.y - s.y;
        const len = Math.hypot(dx, dy) || 1;
        let nx = -dy / len, ny = dx / len;
        if (ny > 0) { nx = -nx; ny = -ny; }
        const off = view.small ? 13 : 16;
        const hop = g.append('g')
          .attr('transform', `translate(${(s.x + t.x) / 2 + nx * off},${(s.y + t.y) / 2 + ny * off})`);
        hop.append('circle').attr('r', R)
          .attr('fill', C.signal).attr('stroke', C.panel).attr('stroke-width', 1.5);
        hop.append('text').attr('text-anchor', 'middle').attr('dy', '.34em')
          .attr('font-family', 'var(--display)').attr('font-weight', 700)
          .attr('font-size', view.small ? '7.5px' : '9px').attr('fill', C.panel)
          .text(HOP_NO.get(edgeKey(d)));
      });
    }

    (animate ? g.transition().delay(300).duration(200) : g).attr('opacity', 1);
  }

  /* Contours behind everything else, for the readings that have one. */
  function contour(rings, animate) {
    view.under.selectAll('*').remove();
    const g = view.under.attr('opacity', 0);
    (rings || []).forEach(r => {
      g.append('ellipse')
        .attr('cx', r.cx).attr('cy', r.cy).attr('rx', r.rx).attr('ry', r.ry)
        .attr('fill', 'none').attr('stroke', C.line).attr('stroke-dasharray', '3 5');
    });
    if (!rings) return;
    (animate ? g.transition().delay(240).duration(200) : g).attr('opacity', 1);
  }

  function paint(animate) {
    const mode = view.mode;
    slide.querySelectorAll('.algo-item').forEach(b => {
      const on = b.dataset.algo === mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });

    const copy = COPY[mode];
    const legend = slide.querySelector('#algo-legend');
    if (legend) {
      legend.innerHTML = copy.legend
        .map(([color, text]) => `<span><i style="background:${color}"></i> ${text}</span>`).join('');
    }
    const info = slide.querySelector('#algo-info');
    if (info) {
      info.innerHTML = `<div class="ai-head"><b>${copy.name}</b><span>${copy.algos.replace('\n', '<br>')}</span></div>`
        + `<p class="ai-use"><b>Use case</b>${copy.use}</p>`
        + `<div class="ai-qs"><b>Questions it answers</b>`
        + copy.qs.map(q => `<span class="ai-q">&ldquo;${q}&rdquo;</span>`).join('')
        + `</div>`;
    }

    if (!view.layouts) return;
    const { at, rings } = view.layouts[mode];
    const move = sel => (animate ? sel.transition().duration(520).ease(d3.easeCubicInOut) : sel);
    contour(rings, animate);

    move(view.link)
      .attr('x1', d => at.get(endId(d.source)).x).attr('y1', d => at.get(endId(d.source)).y)
      .attr('x2', d => at.get(endId(d.target)).x).attr('y2', d => at.get(endId(d.target)).y)
      .attr('stroke', d => edgeStyle(mode, d)[0])
      .attr('stroke-width', d => edgeStyle(mode, d)[1])
      .attr('opacity', d => edgeStyle(mode, d)[2]);

    move(view.node).attr('transform', d => `translate(${at.get(d.id).x},${at.get(d.id).y})`);
    move(view.mark)
      .attr('r', d => radiusOf(mode, d))
      .attr('fill', d => fillOf(mode, d))
      .attr('opacity', d => nodeFade(mode, d));
    move(view.name)
      .attr('dy', d => radiusOf(mode, d) + (view.small ? 13 : 15))
      .attr('opacity', d => (named(mode, d) ? 1 : 0));
    view.caption.text(copy.caption);
    annotate(mode, at, animate);
  }

  function draw() {
    const host = slide.querySelector('#viz-graph-algorithms');
    if (!host) return;
    const { svg, w, h } = newSvg(host);
    view.small = w < 620;
    view.layouts = {};
    FAMILIES.forEach(mode => { view.layouts[mode] = solve(w, h, mode); });

    view.under = svg.append('g');
    view.link = svg.append('g').selectAll('line').data(LINKS).join('line')
      .attr('stroke-linecap', 'round');
    view.anno = svg.append('g');
    view.node = svg.append('g').selectAll('g').data(NODES, d => d.id).join('g');
    view.mark = view.node.append('circle')
      .attr('stroke', C.panel).attr('stroke-width', 2);
    view.name = view.node.append('text').attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .style('font-size', view.small ? '9.5px' : '11px')
      .attr('stroke', C.panel).attr('stroke-width', 3.5).attr('paint-order', 'stroke')
      .text(d => d.label);
    view.caption = svg.append('text').attr('class', 'axis-label')
      .attr('x', 18).attr('y', 16).style('font-size', view.small ? '7.5px' : '9px');

    paint(false);
  }

  slide.querySelectorAll('.algo-item').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (view.mode === btn.dataset.algo) return;
      view.mode = btn.dataset.algo;
      paint(true);
    });
  });

  return { enter: draw };
});
