/* Shared helpers, in scope for every per-slide module.
   Only put something here when two or more slides need it. */

const C = {
  ink: '#1b3139', blue: '#2272b4', green: '#00a972', signal: '#ff3621',
  muted: '#52666d', line: '#d7d6d1', dim: '#75868b', amber: '#b06000',
  danger: '#98102a', faint: '#c9cecf', oat2: '#eeede9',
  /* mirrors --panel · fills and haloes a node mark so it separates from the
     links running behind it and from the oat paper */
  panel: '#ffffff',
};

function clearHost(host) {
  if (host) host.querySelectorAll('svg').forEach(s => s.remove());
}
function sizeOf(el) {
  const r = el.getBoundingClientRect();
  return { w: Math.max(160, r.width), h: Math.max(56, r.height) };
}
function newSvg(host) {
  clearHost(host);
  const { w, h } = sizeOf(host);
  const svg = d3.select(host).append('svg').attr('viewBox', `0 0 ${w} ${h}`);
  return { svg, w, h };
}
function arrowDef(svg, id, color) {
  svg.append('defs').append('marker').attr('id', id)
    .attr('viewBox', '0 -4 8 8').attr('refX', 17).attr('refY', 0)
    .attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
    .append('path').attr('d', 'M0,-4L8,0L0,4').attr('fill', color);
}

/* ── graph traversal helpers (slides 04, 15) ── */
function endId(v) { return typeof v === 'object' ? v.id : v; }

function neighborhood(seed, hops, links) {
  const adj = new Map();
  links.forEach(l => {
    const s = endId(l.source), t = endId(l.target);
    if (!adj.has(s)) adj.set(s, []);
    if (!adj.has(t)) adj.set(t, []);
    adj.get(s).push(t); adj.get(t).push(s);
  });
  const reached = new Map([[seed, 0]]);
  const q = [seed];
  while (q.length) {
    const cur = q.shift();
    const d = reached.get(cur);
    if (d >= hops) continue;
    for (const n of (adj.get(cur) || [])) {
      if (!reached.has(n)) { reached.set(n, d + 1); q.push(n); }
    }
  }
  return reached;
}

/* ── product hierarchy model + diagram (slides 07, 08, 09) ──────────────────
   Node ids are the ids the hierarchy benchmark actually uses, so a number
   drawn in the diagram is the same number in ancestor_id / descendant_id /
   parent_id. Any table rendered next to this diagram must use these ids.
   Products are lettered rather than numbered so that a number on any of these
   slides can only ever mean a node. */
const H_NODES = [
  { id: 1, name: 'All Products', parent: null, products: [] },
  { id: 2, name: 'Electronics', parent: 1, products: [] },
  { id: 3, name: 'Computers', parent: 2, products: [] },
  { id: 4, name: 'Laptops', parent: 3, products: ['SKU-A', 'SKU-B'] },
  { id: 5, name: 'Desktops', parent: 3, products: ['SKU-C'] },
  { id: 6, name: 'Phones', parent: 2, products: [] },
  { id: 7, name: 'Smartphones', parent: 6, products: ['SKU-D', 'SKU-E'] },
  { id: 8, name: 'Feature Phones', parent: 6, products: ['SKU-F'] },
  { id: 9, name: 'Home', parent: 1, products: [] },
  { id: 10, name: 'Furniture', parent: 9, products: [] },
  { id: 11, name: 'Living Room', parent: 10, products: ['SKU-G'] },
  { id: 12, name: 'Bedroom', parent: 10, products: ['SKU-H'] },
];
const H_BY_ID = new Map(H_NODES.map(n => [n.id, n]));
const H_CHILD = id => H_NODES.filter(n => n.parent === id);
const H_IS_LEAF = id => H_CHILD(id).length === 0;
const H_NAME = id => H_BY_ID.get(id)?.name || String(id);

function hDepth(id) {
  let d = 0;
  let n = H_BY_ID.get(id);
  while (n && n.parent !== null) { n = H_BY_ID.get(n.parent); d += 1; }
  return d;
}
function descendantsOf(id) {
  const out = [];
  (function walk(cur, depth) {
    H_CHILD(cur).forEach(c => { out.push({ id: c.id, depth: depth + 1 }); walk(c.id, depth + 1); });
  })(id, 0);
  return out;
}
function nestedIntervals() {
  const iv = {};
  let counter = 0;
  (function walk(id) {
    iv[id] = [++counter, null];
    H_CHILD(id).forEach(c => walk(c.id));
    iv[id][1] = ++counter;
  })(1);
  return iv;
}
function pathOf(id) {
  const parts = [];
  let cur = H_BY_ID.get(id);
  while (cur) { parts.unshift(cur.name); cur = cur.parent === null ? null : H_BY_ID.get(cur.parent); }
  return '/' + parts.join('/');
}

/* Leaves get an even slot, every parent is centred over its own children, and
   depth drives y — so the drawing stays a readable tree at any panel width. */
function hierLayout(w, h, opts = {}) {
  const padX = opts.padX ?? 40;
  /* asymmetric only when a caller asks for it — a wide left gutter for band
     names does not need matching space on the right */
  const padRight = opts.padRight ?? padX;
  const padTop = opts.padTop ?? 34;
  const padBottom = opts.padBottom ?? 40;
  const leaves = H_NODES.filter(n => H_IS_LEAF(n.id));
  const slot = new Map(leaves.map((n, i) => [n.id, i]));
  const cache = new Map();
  const frac = (id) => {
    if (cache.has(id)) return cache.get(id);
    const kids = H_CHILD(id);
    const v = kids.length ? d3.mean(kids, k => frac(k.id)) : slot.get(id);
    cache.set(id, v);
    return v;
  };
  const span = Math.max(1, leaves.length - 1);
  const maxDepth = Math.max(...H_NODES.map(n => hDepth(n.id)));
  const pos = new Map();
  H_NODES.forEach(n => pos.set(n.id, {
    x: padX + (frac(n.id) / span) * (w - padX - padRight),
    y: padTop + (hDepth(n.id) / maxDepth) * (h - padTop - padBottom),
  }));
  return pos;
}

function hierEdges() {
  return H_NODES.filter(n => n.parent !== null).map(n => ({ from: n.parent, to: n.id }));
}

/* Named horizontal stripes behind a hierarchy drawing, one per depth. Slides
   07 and 08 share them so a depth means the same thing on both. Returns each
   depth's y and the spacing between depths, so a caller can hang a further
   row — the product rows, on 08 — off the bottom band. */
const H_DEPTH_LABEL = ['root', 'category', 'subcategory', 'leaf category'];

function hierDepthBands(svg, pos, w, opts = {}) {
  const labels = opts.labels ?? H_DEPTH_LABEL;
  const x = opts.x ?? 16;
  const bandY = new Map();
  H_NODES.forEach(n => {
    const d = hDepth(n.id);
    if (!bandY.has(d)) bandY.set(d, pos.get(n.id).y);
  });
  const depths = [...bandY.keys()].sort((a, b) => a - b);
  const gap = depths.length > 1 ? bandY.get(depths[1]) - bandY.get(depths[0]) : 60;

  svg.append('g').selectAll('rect').data(depths).join('rect')
    .attr('x', 0).attr('y', d => bandY.get(d) - gap * .44)
    .attr('width', w).attr('height', gap * .88)
    .attr('fill', d => (d % 2 ? 'rgba(27,49,57,.05)' : 'rgba(0,169,114,.05)'));

  const text = svg.append('g').selectAll('text').data(depths).join('text')
    .attr('class', 'axis-label').attr('x', x)
    .attr('y', d => bandY.get(d) + 3)
    .text(d => `${d} · ${labels[d]}`);
  if (opts.fontSize) text.style('font-size', opts.fontSize);

  return { bandY, gap, depths };
}

/* One more stripe in the same treatment, for a row the tree itself has no
   nodes for. */
function hierExtraBand(svg, w, y, gap, label, opts = {}) {
  svg.append('rect').attr('x', 0).attr('y', y - gap * .44)
    .attr('width', w).attr('height', gap * .88)
    .attr('fill', 'rgba(0,169,114,.05)');
  const text = svg.append('text').attr('class', 'axis-label')
    .attr('x', opts.x ?? 16).attr('y', y + 3).text(label);
  if (opts.fontSize) text.style('font-size', opts.fontSize);
}

function hRole(id) {
  if (H_BY_ID.get(id)?.parent === null) return C.green;
  return H_IS_LEAF(id) ? C.muted : C.blue;
}

/* Curved connector between two nodes, plus the point to hang a label on. */
function hArc(pos, a, b, bow = .18) {
  const s = pos.get(a);
  const t = pos.get(b);
  const cx = (s.x + t.x) / 2 - (t.y - s.y) * bow;
  const cy = (s.y + t.y) / 2 + (t.x - s.x) * bow;
  return {
    d: `M${s.x},${s.y} Q${cx},${cy} ${t.x},${t.y}`,
    lx: .25 * s.x + .5 * cx + .25 * t.x,
    ly: .25 * s.y + .5 * cy + .25 * t.y,
  };
}

/* Every node drawn as a numbered ring: id inside, name underneath. Callers
   pass `ring` to highlight ids and `fade` to push context back, and `label`
   to rewrite or drop a node's name — returning null draws no name at all. */
function drawHierNodes(svg, pos, opts = {}) {
  const R = opts.R ?? 11;
  const label = opts.label || (d => d.name);
  const nameSize = opts.nameSize ?? '9.5px';
  const idSize = opts.idSize ?? '10px';
  const nodeFill = opts.nodeFill ?? '#fff';
  const ring = opts.ring || (() => null);
  const fade = opts.fade || (() => 1);
  const g = svg.append('g').selectAll('g.hnode').data(H_NODES).join('g').attr('class', 'hnode')
    .attr('transform', d => `translate(${pos.get(d.id).x},${pos.get(d.id).y})`)
    .attr('opacity', d => fade(d.id));
  g.filter(d => !!ring(d.id)).append('circle')
    .attr('r', R + 5).attr('fill', 'none')
    .attr('stroke', d => ring(d.id)).attr('stroke-width', 2).attr('stroke-dasharray', '4 3');
  g.append('circle').attr('r', R)
    .attr('fill', nodeFill).attr('stroke', d => hRole(d.id)).attr('stroke-width', 2);
  g.append('text').attr('text-anchor', 'middle').attr('dy', '.34em')
    .attr('font-family', 'var(--display)').attr('font-weight', 700).attr('font-size', idSize)
    .attr('fill', d => hRole(d.id)).attr('pointer-events', 'none')
    .text(d => d.id);
  g.filter(d => label(d) != null).append('text').attr('class', 'node-label')
    .attr('text-anchor', opts.nameAnchor ?? 'middle')
    .attr('dx', opts.nameDx ?? 0).attr('dy', opts.nameDy ?? R + 13)
    .style('font-size', nameSize).text(d => label(d));
  return g;
}

function drawEncoding(host, kind) {
  if (!host) return;
  const { svg, w, h } = newSvg(host);
  const small = w < 520;
  const R = small ? 9 : 11;
  const nameSize = small ? '8px' : '9.5px';
  const idSize = small ? '8.5px' : '10px';
  const segments = kind === 'segments';
  const pos = hierLayout(w, h, {
    padX: small ? 30 : 42,
    padTop: 32,
    /* the segment band lives below the leaf row, so reserve room for it */
    padBottom: segments ? (small ? 74 : 88) : (small ? 30 : 38),
  });
  arrowDef(svg, 'enc-arrow', C.muted);
  arrowDef(svg, 'enc-arrow-hot', C.signal);
  arrowDef(svg, 'enc-arrow-good', C.green);

  const faded = kind === 'closure' || segments;
  const note = t => svg.append('text').attr('class', 'axis-label').attr('x', small ? 18 : 24).attr('y', 15).text(t);
  const label = (x, y, text, fill) => svg.append('text').attr('class', 'link-label')
    .attr('x', x).attr('y', y).attr('text-anchor', 'middle')
    .style('font-size', small ? '8px' : '9.5px').attr('fill', fill).text(text);

  /* The closure view centres on one ancestor, so its subtree is what stays at
     full strength — the edges below and the nodes at the end both read from it. */
  const CLOSURE_ANCESTOR = 2;
  const closureKids = descendantsOf(CLOSURE_ANCESTOR);
  const closureSubtree = new Set([CLOSURE_ANCESTOR, ...closureKids.map(k => k.id)]);
  const inFocus = kind === 'closure' ? (id => closureSubtree.has(id)) : (() => true);

  svg.append('g').selectAll('line.tree').data(hierEdges()).join('line').attr('class', 'tree')
    .attr('x1', d => pos.get(d.from).x).attr('y1', d => pos.get(d.from).y)
    .attr('x2', d => pos.get(d.to).x).attr('y2', d => pos.get(d.to).y)
    .attr('stroke', faded ? C.line : C.green)
    .attr('stroke-width', 1.3)
    .attr('stroke-dasharray', kind === 'adjacency' ? '5 3' : null)
    .attr('opacity', d => (faded ? .45 : .7) * (inFocus(d.to) ? 1 : .55));

  let ring = () => null;
  let fade = () => 1;

  if (kind === 'flattened') {
    const leaves = new Set(H_NODES.filter(n => H_IS_LEAF(n.id)).map(n => n.id));
    ring = id => (leaves.has(id) ? C.signal : null);
    note('the circled leaves are the only rows · ancestors repeat as text · no ids anywhere');
  }

  if (kind === 'adjacency') {
    svg.append('g').selectAll('line.up').data(hierEdges()).join('line').attr('class', 'up')
      .attr('x1', d => pos.get(d.to).x).attr('y1', d => pos.get(d.to).y)
      .attr('x2', d => pos.get(d.from).x).attr('y2', d => pos.get(d.from).y)
      .attr('stroke', C.blue).attr('stroke-width', 1.2)
      .attr('marker-end', 'url(#enc-arrow)').attr('opacity', .55);
    note('every row stores one hop: node_id → parent_id');
  }

  if (kind === 'path') {
    const chain = [1, 2, 3, 4];
    svg.append('g').selectAll('line.hot')
      .data(hierEdges().filter(e => chain.includes(e.from) && chain.includes(e.to)))
      .join('line').attr('class', 'hot')
      .attr('x1', d => pos.get(d.from).x).attr('y1', d => pos.get(d.from).y)
      .attr('x2', d => pos.get(d.to).x).attr('y2', d => pos.get(d.to).y)
      .attr('stroke', C.signal).attr('stroke-width', 3).attr('opacity', .9);
    ring = id => (chain.includes(id) ? C.signal : null);
    svg.append('text').attr('class', 'link-label').attr('x', small ? 18 : 24).attr('y', 15)
      .attr('fill', C.signal).style('font-size', small ? '8px' : '9.5px').text(pathOf(4));
  }

  if (kind === 'nested') {
    const iv = nestedIntervals();
    note('lft / rgt intervals from one depth-first walk');
    svg.append('g').selectAll('text.iv').data(H_NODES).join('text').attr('class', 'iv link-label')
      .attr('x', d => pos.get(d.id).x).attr('y', d => pos.get(d.id).y - R - 7)
      .attr('text-anchor', 'middle').style('font-size', small ? '7.5px' : '9px')
      .attr('fill', C.amber).text(d => `${iv[d.id][0]}·${iv[d.id][1]}`);
  }

  if (kind === 'closure') {
    /* The payoff view: one ancestor, and every row `ancestor_id = 2` returns.
       Leaf descendants read green because they are what the question wanted;
       the intermediate ones stay quiet but present, since the equality returns
       them too. Everything outside the Electronics subtree recedes. */
    const leaves = closureKids.filter(k => H_IS_LEAF(k.id)).map(k => k.id);
    fade = id => (inFocus(id) ? 1 : .3);

    closureKids.forEach(k => {
      const isLeaf = leaves.includes(k.id);
      const arc = hArc(pos, CLOSURE_ANCESTOR, k.id, isLeaf ? .2 : .34);
      svg.append('path').attr('d', arc.d).attr('fill', 'none')
        .attr('stroke', isLeaf ? C.green : C.blue)
        .attr('stroke-width', isLeaf ? 1.8 : 1.1)
        .attr('opacity', isLeaf ? .9 : .4)
        .attr('marker-end', isLeaf ? 'url(#enc-arrow-good)' : 'url(#enc-arrow)');
      label(arc.lx, arc.ly - 6, k.depth, isLeaf ? C.green : C.blue);
    });
    ring = id => (id === CLOSURE_ANCESTOR ? C.signal : (leaves.includes(id) ? C.green : null));
    note(`ancestor_id = ${CLOSURE_ANCESTOR} · ${H_NAME(CLOSURE_ANCESTOR)} — one equality returns the whole `
      + `subtree, leaf categories ${leaves.join(' · ')} included`);
  }

  if (segments) {
    /* A segment is not a node in the tree. Draw it as one, off the tree, and
       let it reach across branches to the members it names. */
    const members = [4, 5, 11];
    const bandY = h - (small ? 20 : 24);
    const bandH = small ? 22 : 24;
    const bandX = Math.min(Math.max(d3.mean(members, id => pos.get(id).x), w * .3), w * .72);
    members.forEach(id => {
      const p = pos.get(id);
      /* start below the node name so the connector never crosses a label */
      const y0 = p.y + R + 18;
      svg.append('path')
        .attr('d', `M${p.x},${y0} C${p.x},${(y0 + bandY) / 2} ${bandX},${(y0 + bandY) / 2} ${bandX},${bandY - bandH / 2}`)
        .attr('fill', 'none').attr('stroke', C.signal).attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4 3').attr('opacity', .85);
    });
    const bw = Math.min(w - 32, small ? 210 : 268);
    svg.append('rect').attr('x', bandX - bw / 2).attr('y', bandY - bandH / 2).attr('width', bw).attr('height', bandH)
      .attr('rx', bandH / 2).attr('fill', 'rgba(255,54,33,.1)').attr('stroke', C.signal).attr('stroke-width', 1.4);
    svg.append('text').attr('x', bandX).attr('y', bandY).attr('dy', '.34em').attr('text-anchor', 'middle')
      .attr('font-family', 'var(--display)').attr('font-weight', 700)
      .attr('font-size', small ? '8.5px' : '10px').attr('fill', C.signal)
      .text('segment · Strategic Assortment');
    ring = id => (members.includes(id) ? C.signal : null);
    note('the set reaches under 3 and under 11 — no single ancestor covers both');
  }

  drawHierNodes(svg, pos, { R, nameSize, idSize, ring, fade });
}
