/* 18 · graph construction options — the sibling of slide 19. A vertical rail on
   the left drives one stage on the right, both keyed on the paradigm rather than
   its position, and the stage's three tracks are fixed height so the rail never
   moves when a card or a domain toggle is clicked.

   All three paradigms produce a graph, so all three draw one. The networks are
   inline SVG in the deck's own idiom (slides 04, 16, 21): deterministic
   positions rather than a force simulation, so the picture is identical on every
   entry and every assertion about it is reproducible.

   The first paradigm carries a nested toggle over three domains. Each domain
   declares a schema and an instance of it — real multiplicity, so the graph
   branches instead of running in a line — and every caption number is counted
   off those arrays rather than written out. A domain's rels are ordered to match
   its layers, so rel i always joins layer i to layer i+1; that invariant is what
   lets one label per gap name every edge crossing it.

   Paradigm two runs on the same four documents as slides 15 and 16, and the
   graph beat draws exactly the rows of the table beside it — no more, no fewer.
   The superseded record is drawn the way slide 16 draws it, dimmed and struck
   through with the supersession edge in coral, because it is the same fact.
   Paradigm three's numbers are the evaluation table published on
   huggingface.co/AventIQ-AI/bert-medical-entity-extraction; its graph shows the
   two entities it returns and, dashed between them, the relation it does not. */
DECK.registerViz('18-build-options', (slide) => {
  const KW = /\b(SELECT|FROM|WHERE|JOIN|ON|AND|AS|MAP)\b/g;
  const code = (src) => src
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/'[^']*'/g, m => `<span class="lit">${m}</span>`)
    .replace(KW, m => `<span class="kw">${m}</span>`);

  const pre = (src) => `<pre class="bv-code">${code(src)}</pre>`;
  const beat = (label, body, cls) => `<div class="bv-beat${cls ? ' ' + cls : ''}"><b>${label}</b>${body}</div>`;
  const arrow = (label) =>
    `<i class="bv-arrow" aria-hidden="true">${label ? `<em>${label}</em>` : ''}<span>&rarr;</span></i>`;
  const row = (cols, cells) => `<div class="bv-row" style="grid-template-columns:${cols}">${cells.join('')}</div>`;
  const note = (label, body) => `<div class="bv-note"><b>${label}</b><span>${body}</span></div>`;
  const cap = (text) => `<p class="bv-cap">${text}</p>`;

  /* ── paradigm one · the graph already sitting in a warehouse ───────────────
     Each domain declares a schema and one instance of it. `tables` is what the
     warehouse holds; `layers` are the tables that become node types, in order;
     `rels` are the edge types, ordered so that rel i joins layer i to layer
     i+1, each carrying the foreign key it is read off. A table that is not a
     layer has to say which rel it became — that is how the manufacturing
     sales_order stays accounted for without a footnote.

     `nodes` and `edges` are the instance, with deliberate multiplicity: edges
     fan out and share endpoints, so the drawing is a network rather than a
     chain of boxes, and the domain's question resolves to a walk you can see. */
  const DOMAINS = {
    supply: {
      name: 'Manufacturing',
      tables: [
        ['supplier', 'supplier_id', 'one row per vendor'],
        ['material', 'material_id', 'each material, and who supplies it'],
        ['product', 'product_id', 'each product, and what it is made of'],
        ['sales_order', 'order_id', 'what was sold, and to whom', 'SOLD_TO'],
        ['customer', 'customer_id', 'one row per buyer'],
      ],
      keys: ['supplier_id', 'material_id', 'product_id', 'customer_id'],
      layers: ['supplier', 'material', 'product', 'customer'],
      rels: [
        { type: 'SUPPLIES', src: 'material.supplier_id' },
        { type: 'USED_IN', src: 'product.material_id' },
        { type: 'SOLD_TO', src: 'sales_order · product_id + customer_id' },
      ],
      nodes: {
        s1: ['Kesler Metals', 0], s2: ['Ardent Polymer', 0],
        m1: ['Cold-rolled steel', 1], m2: ['ABS resin', 1], m3: ['Copper wire', 1],
        p1: ['Drive unit', 2], p2: ['Housing', 2], p3: ['Wiring loom', 2],
        c1: ['Northwind', 3], c2: ['Talos Motors', 3], c3: ['Vela Robotics', 3],
      },
      edges: [
        ['s1', 'm1'], ['s2', 'm2'], ['s2', 'm3'],
        ['m1', 'p1'], ['m1', 'p2'], ['m2', 'p2'], ['m3', 'p3'],
        ['p1', 'c1'], ['p1', 'c2'], ['p2', 'c2'], ['p3', 'c3'],
      ],
      seed: 's1',
      terminal: 'customers',
      ask: '&ldquo;Which customers are exposed to this supplier?&rdquo;',
    },
    bank: {
      name: 'Banking',
      tables: [
        ['customer', 'customer_id', 'one row per account holder'],
        ['account', 'account_id', 'each account, and who holds it'],
        ['txn', 'txn_id', 'each payment, its account and its counterparty'],
        ['counterparty', 'counterparty_id', 'who was paid'],
      ],
      keys: ['customer_id', 'account_id', 'counterparty_id'],
      layers: ['customer', 'account', 'txn', 'counterparty'],
      rels: [
        { type: 'HOLDS', src: 'account.customer_id' },
        { type: 'SENT', src: 'txn.account_id' },
        { type: 'PAID_TO', src: 'txn.counterparty_id' },
      ],
      nodes: {
        b1: ['Aster Foods', 0], b2: ['Bram Iyer', 0],
        a1: ['ACC-1102', 1], a2: ['ACC-1109', 1], a3: ['ACC-2044', 1],
        t1: ['TXN-88', 2], t2: ['TXN-91', 2], t3: ['TXN-93', 2], t4: ['TXN-97', 2],
        k1: ['Vantor Freight', 3], k2: ['Kepler Rent', 3], k3: ['Ola Diallo', 3],
      },
      edges: [
        ['b1', 'a1'], ['b1', 'a2'], ['b2', 'a3'],
        ['a1', 't1'], ['a1', 't2'], ['a2', 't3'], ['a3', 't4'],
        ['t1', 'k1'], ['t2', 'k2'], ['t3', 'k2'], ['t4', 'k3'],
      ],
      seed: 'b1',
      terminal: 'counterparties',
      ask: '&ldquo;Who did this customer pay, and who did they pay?&rdquo;',
    },
    network: {
      name: 'Network',
      tables: [
        ['site', 'site_id', 'one row per physical location'],
        ['device', 'device_id', 'each device, and where it sits'],
        ['circuit', 'circuit_id', 'each circuit, and what terminates it'],
        ['service', 'service_id', 'each customer service, and its circuit'],
      ],
      keys: ['site_id', 'device_id', 'circuit_id'],
      layers: ['site', 'device', 'circuit', 'service'],
      rels: [
        { type: 'HOSTS', src: 'device.site_id' },
        { type: 'TERMINATES', src: 'circuit.device_id' },
        { type: 'CARRIES', src: 'service.circuit_id' },
      ],
      nodes: {
        n1: ['DC-East', 0], n2: ['DC-West', 0],
        d1: ['rtr-01', 1], d2: ['sw-11', 1], d3: ['rtr-04', 1],
        k1: ['CKT-220', 2], k2: ['CKT-231', 2], k3: ['CKT-245', 2],
        v1: ['Payments API', 3], v2: ['Store POS', 3], v3: ['Telemetry', 3],
      },
      edges: [
        ['n1', 'd1'], ['n1', 'd2'], ['n2', 'd3'],
        ['d1', 'k1'], ['d1', 'k2'], ['d2', 'k1'], ['d3', 'k3'],
        ['k1', 'v1'], ['k2', 'v2'], ['k3', 'v3'],
      ],
      seed: 'n1',
      terminal: 'services',
      ask: '&ldquo;Which services go dark if this site drops?&rdquo;',
    },
  };
  const DOMAIN_IDS = Object.keys(DOMAINS);

  /* the count words the caption uses, so "five tables, four foreign keys" is
     read off the arrays above rather than typed next to them */
  const WORD = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

  /* an edge's type is its layer gap: rel i joins layer i to layer i+1 */
  const relOf = (d, e) => d.rels[d.nodes[e[0]][1]].type;

  /* every edge the walk from `seed` can use, and every node it lands on —
     this is what the highlight draws and what the caption counts, so neither
     can claim a reach the edge list does not support */
  function reachFrom(d, seed) {
    const out = new Map();
    d.edges.forEach(e => {
      if (!out.has(e[0])) out.set(e[0], []);
      out.get(e[0]).push(e);
    });
    const nodes = new Set([seed]);
    const edges = new Set();
    const queue = [seed];
    while (queue.length) {
      (out.get(queue.shift()) || []).forEach(e => {
        edges.add(e);
        if (!nodes.has(e[1])) { nodes.add(e[1]); queue.push(e[1]); }
      });
    }
    return { nodes, edges };
  }

  /* ── the layered network ───────────────────────────────────────────────────
     Columns are the layers, rows are the members of each. Positions come from
     the data, not from a simulation, so the same domain draws the same picture
     every time and a screenshot is worth asserting against. */
  const LAYER_INK = [C.ink, C.blue, C.green, C.muted];

  function drawNetwork(host, d) {
    if (!host) return;
    const { svg, w, h } = newSvg(host);
    const R = 6.5;
    const padX = 58;
    const padTop = 52;
    const padBottom = 30;
    const colX = i => padX + (i * (w - padX * 2)) / (d.layers.length - 1);
    const members = i => Object.keys(d.nodes).filter(k => d.nodes[k][1] === i);

    /* one row pitch for the whole drawing, and every column centred on it — a
       layer with fewer members sits in the middle rather than stretching to the
       extremes, so the columns read as a network instead of a matrix */
    const span = h - padTop - padBottom;
    const widest = Math.max(...d.layers.map((_, i) => members(i).length));
    const pitch = widest > 1 ? span / (widest - 1) : 0;
    const midY = padTop + span / 2;
    const pos = new Map();
    d.layers.forEach((_, i) => {
      const ids = members(i);
      const top = midY - ((ids.length - 1) * pitch) / 2;
      ids.forEach((id, j) => pos.set(id, { x: colX(i), y: top + j * pitch }));
    });

    const walk = reachFrom(d, d.seed);
    const lit = e => walk.edges.has(e);

    /* the table each column came from, and between the columns the edge type
       with the foreign key it is read off — one label for every edge in that
       gap, which the layer/rel ordering guarantees is honest */
    svg.append('g').selectAll('text').data(d.layers).join('text')
      .attr('class', 'axis-label').attr('text-anchor', 'middle')
      .attr('x', (_, i) => colX(i)).attr('y', 13)
      .style('font-size', '8.5px')
      .text(t => t);

    const gap = svg.append('g').selectAll('g').data(d.rels).join('g')
      .attr('transform', (_, i) => `translate(${(colX(i) + colX(i + 1)) / 2},0)`);
    gap.append('text').attr('class', 'link-label').attr('text-anchor', 'middle')
      .attr('y', 30).style('font-size', '9.5px').text(r => r.type);
    gap.append('text').attr('text-anchor', 'middle').attr('y', 41)
      .attr('font-family', 'var(--mono)').attr('font-size', '8px').attr('fill', C.dim)
      .text(r => r.src);

    /* endpoints stop clear of both marks so an arrowhead never sits on a node */
    const geom = (e) => {
      const s = pos.get(e[0]), t = pos.get(e[1]);
      const dx = t.x - s.x, dy = t.y - s.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      return {
        x1: s.x + ux * (R + 3), y1: s.y + uy * (R + 3),
        x2: t.x - ux * (R + 5), y2: t.y - uy * (R + 5),
      };
    };

    arrowDef(svg, 'bo-net-soft', C.line);
    arrowDef(svg, 'bo-net-hot', C.signal);
    svg.selectAll('marker').attr('refX', 5);

    svg.append('g').selectAll('line').data(d.edges).join('line')
      .attr('x1', e => geom(e).x1).attr('y1', e => geom(e).y1)
      .attr('x2', e => geom(e).x2).attr('y2', e => geom(e).y2)
      .attr('stroke', e => (lit(e) ? C.signal : C.line))
      .attr('stroke-width', e => (lit(e) ? 2.4 : 1.3))
      .attr('opacity', e => (lit(e) ? .95 : .8))
      .attr('marker-end', e => `url(#bo-net-${lit(e) ? 'hot' : 'soft'})`);

    const node = svg.append('g').selectAll('g').data(Object.keys(d.nodes)).join('g')
      .attr('transform', id => `translate(${pos.get(id).x},${pos.get(id).y})`);
    /* the seed and everything the walk reaches carry the ring, so the answer to
       the domain's question is legible without reading the caption */
    node.filter(id => walk.nodes.has(id)).append('circle')
      .attr('r', R + 4.5).attr('fill', 'none')
      .attr('stroke', C.signal).attr('stroke-width', id => (id === d.seed ? 2 : 1.3))
      .attr('stroke-dasharray', id => (id === d.seed ? null : '3 2.5'));
    node.append('circle').attr('r', R)
      .attr('fill', id => LAYER_INK[d.nodes[id][1]])
      .attr('stroke', C.panel).attr('stroke-width', 1.6);
    node.append('text').attr('class', 'node-label').attr('text-anchor', 'middle')
      .attr('dy', R + 13).style('font-size', '9.5px')
      /* the shared label classes set fill in CSS, so per-datum colour has to be
         set as a style or it is silently ignored */
      .style('fill', id => (walk.nodes.has(id) ? C.ink : C.muted))
      .attr('stroke', C.panel).attr('stroke-width', 3).attr('paint-order', 'stroke')
      .text(id => d.nodes[id][0]);
  }

  const VIZ = {
    structured: () => {
      const d = DOMAINS[domain];
      const toggle = '<div class="bv-toggle"><span class="bv-tlabel">Domain</span>'
        + DOMAIN_IDS.map(id =>
          `<button type="button" class="mode-btn${id === domain ? ' active' : ''}" `
          + `data-dom="${id}" aria-pressed="${id === domain}">${DOMAINS[id].name}</button>`).join('')
        + '</div>';
      const joins = d.keys.length;
      const walk = reachFrom(d, d.seed);
      const ends = [...walk.nodes].filter(id => d.nodes[id][1] === d.layers.length - 1);
      const total = Object.keys(d.nodes).filter(id => d.nodes[id][1] === d.layers.length - 1);

      /* the schema stays on screen, subordinate to the network — a table that
         became an edge rather than a node type says so on its own row */
      const schema = '<div class="bv-schema"><span class="bv-lane-tag">In the warehouse today</span><ul>'
        + d.tables.map(t =>
          `<li${t[3] ? ' class="became"' : ''} title="${t[0]} · ${t[2]}"><b>${t[0]}</b>`
          + `<em>${t[3] ? '&rarr; ' + t[3] : t[1]}</em></li>`).join('')
        + '</ul><p>Node types are tables. Edge types are the foreign keys between them.</p></div>';

      return toggle
        + `<div class="bv-stage2"><div class="bv-net" id="bo-net"></div>${schema}</div>`
        + cap(
          `<b>${WORD[d.tables.length]} tables, ${WORD[joins]} foreign keys — and nothing to extract.</b> `
          + `${d.ask} is already a ${WORD[joins]}-join query. Traced from ${d.nodes[d.seed][0]}, it reaches `
          + `${WORD[ends.length]} of ${WORD[total.length]} ${d.terminal} — the walk is there, nobody has called it an edge.`
        );
    },

    /* Doc A, C and D are three of the four documents on slide 15, and the three
       predicates below are exactly the enum labels the statement asks for. The
       supersession row is marked C + D because it is the one edge no
       single-document pass can produce. */
    extract: () => note('Input', 'The same four indexed documents, read once')
      + row('minmax(0,.56fr) 50px minmax(0,1.6fr) 50px minmax(0,1.2fr) 50px minmax(0,.9fr)', [
        beat('doc C · Acme leadership, 2019',
          '<p class="bv-quote">&hellip; the board appointed <b>Maya Okonjo</b> chief executive of '
          + '<b>Acme Holdings</b>, effective 2019 &hellip;</p>'
          + '<span class="bv-docs">doc A &middot; B &middot; C &middot; D</span>'),
        arrow('ai_extract'),
        /* indented shallowly on purpose: the block is `pre`, so the widest line
           is what has to fit the column, and the enum is the widest line */
        beat('One statement over the corpus', pre(
`SELECT ai_extract(
  text,
  '{"relations": {"type": "array", "items": {
    "type": "object", "properties": {
     "subject":   {"type": "string"},
     "predicate": {"type": "enum", "labels":
       ["PARENT_OF","LED_BY","SUPERSEDED_BY"]},
     "object":    {"type": "string"}}}}}',
  MAP('version', '2.1')
):response:relations AS triples
FROM docs.corpus`)),
        arrow('lands as'),
        beat('graph.edges',
          '<table class="bv-tblx"><thead><tr><th>subject</th><th>predicate</th><th>object</th><th>src</th></tr></thead>'
          + '<tbody>'
          + TRIPLES.map(t =>
            `<tr${t.assembled ? ' class="asm"' : ''}><td>${t.s}</td><td class="p">${t.p}</td>`
            + `<td>${t.o}</td><td>${t.src}</td></tr>`).join('')
          + '</tbody></table>'
          + '<p class="bv-flag">the last row is assembled, not extracted &mdash; no single document says it</p>', 'good'),
        arrow('read as'),
        beat('The same rows',
          '<div class="bv-gfx" id="bo-triples"></div>'
          + `<p class="bv-set">${WORD[TRIPLES.length]} rows &middot; ${WORD[TRIPLES.length]} edges</p>`),
      ])
      + cap('<b>One pass, one vocabulary.</b> The predicate enum is not a tuning knob &mdash; that list is exactly '
        + 'the set of edge types your graph is allowed to contain.'),

    /* Ten tokens, two entities, and the four F1 scores are the per-class column
       of the model card's evaluation table. Drug is drawn shortest because it
       is the lowest of the four. */
    finetuned: () => note('Model', 'AventIQ-AI/bert-medical-entity-extraction &middot; bert-base-cased fine-tuned on tner/bc5cdr, float16')
      + row('minmax(0,1.34fr) 54px minmax(0,1fr) 54px minmax(0,1.1fr)', [
        beat('Physician note · token classification',
          '<div class="bv-tok">'
          + [['An'], ['overdose'], ['of'], ['Ibuprofen', 'B-Drug', 'drug'], ['can'], ['lead'], ['to'],
             ['severe', 'B-Symptom', 'sym'], ['gastric', 'I-Symptom', 'sym'], ['issues', 'I-Symptom', 'sym']]
            .map(([w, tag, cls]) =>
              `<span class="bv-t${tag ? ' on ' + cls : ''}">${w}<em>${tag || 'O'}</em></span>`).join('')
          + '</div>'
          + '<p class="bv-bio">B- begins an entity &middot; I- continues it &middot; O is outside one</p>'),
        arrow('tags'),
        beat('Entities out, and what is missing',
          '<ul class="bv-ent">'
          + '<li><span class="bv-e drug">Drug</span>Ibuprofen</li>'
          + '<li><span class="bv-e sym">Symptom</span>severe gastric issues</li>'
          + '</ul>'
          + '<div class="bv-gfx" id="bo-ents"></div>'
          + '<p class="bv-set">label set &middot; Disease &middot; Drug &middot; Symptom &middot; Treatment</p>'),
        arrow('scored'),
        beat('F1 by entity type',
          '<div class="bv-bars">'
          + [['Disease', 91.76], ['Symptom', 91.40], ['Treatment', 90.40], ['Drug', 72.03]]
            .map(([k, v]) =>
              `<div class="bv-bar${v < 80 ? ' low' : ''}"><b>${k}</b>`
              + `<i><s style="width:${v}%"></s></i><em>${v.toFixed(2)}</em></div>`).join('')
          + '</div>'
          + '<p class="bv-flag">overall accuracy 93.27 &middot; F1 92.31</p>', 'hot'),
      ])
      + cap('<b>Two entities out of ten tokens.</b> The headline F1 is 92 and Drug is 72 &mdash; the gap between '
        + 'the classes is the number to look at, not the average.'),
  };

  /* ── paradigm two · the triples table, drawn ───────────────────────────────
     TRIPLES is the single source for the table beat and the graph beat both, so
     the graph cannot show an edge the table does not list. `assembled` marks the
     row no single document produces; it is drawn the way slide 16 draws the same
     fact — the superseded person dimmed and struck through, the edge in coral. */
  const TRIPLES = [
    { s: 'Acme Holdings', p: 'PARENT_OF', o: 'Beta Logistics', src: 'A' },
    { s: 'Acme Holdings', p: 'LED_BY', o: 'Maya Okonjo', src: 'C' },
    { s: 'Acme Holdings', p: 'LED_BY', o: 'Ray Duval', src: 'D', retired: true },
    { s: 'Ray Duval', p: 'SUPERSEDED_BY', o: 'Maya Okonjo', src: 'C + D', assembled: true },
  ];
  /* whoever an assembled SUPERSEDED_BY edge points away from is the retired
     record — derived, so the dimming can never disagree with the table */
  const RETIRED = TRIPLES.filter(t => t.assembled && t.p === 'SUPERSEDED_BY').map(t => t.s);

  const TRIPLE_POS = {
    'Acme Holdings': { x: .50, y: .12 },
    'Beta Logistics': { x: .17, y: .50 },
    'Maya Okonjo': { x: .83, y: .50 },
    'Ray Duval': { x: .50, y: .80 },
  };

  function drawTriples(host) {
    if (!host) return;
    const { svg, w, h } = newSvg(host);
    const R = 5.5;
    const P = name => ({ x: TRIPLE_POS[name].x * w, y: TRIPLE_POS[name].y * h });
    const names = [...new Set(TRIPLES.flatMap(t => [t.s, t.o]))];

    arrowDef(svg, 'bo-tri-soft', C.dim);
    arrowDef(svg, 'bo-tri-faint', C.faint);
    arrowDef(svg, 'bo-tri-hot', C.signal);
    svg.selectAll('marker').attr('refX', 4);

    const ink = t => (t.assembled ? C.signal : t.retired ? C.faint : C.dim);
    const key = t => (t.assembled ? 'hot' : t.retired ? 'faint' : 'soft');
    const geom = (t) => {
      const s = P(t.s), e = P(t.o);
      const dx = e.x - s.x, dy = e.y - s.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      const x1 = s.x + ux * (R + 2), y1 = s.y + uy * (R + 2);
      const x2 = e.x - ux * (R + 4), y2 = e.y - uy * (R + 4);
      let nx = -uy, ny = ux;
      if (ny > 0) { nx = -nx; ny = -ny; }
      return { x1, y1, x2, y2, lx: (x1 + x2) / 2 + nx * 9, ly: (y1 + y2) / 2 + ny * 9 + 2 };
    };

    svg.append('g').selectAll('line').data(TRIPLES).join('line')
      .attr('x1', t => geom(t).x1).attr('y1', t => geom(t).y1)
      .attr('x2', t => geom(t).x2).attr('y2', t => geom(t).y2)
      .attr('stroke', ink).attr('stroke-width', t => (t.assembled ? 2 : 1.3))
      .attr('stroke-dasharray', t => (t.retired ? '4 3' : null))
      .attr('marker-end', t => `url(#bo-tri-${key(t)})`);

    svg.append('g').selectAll('text').data(TRIPLES).join('text')
      .attr('class', 'link-label').attr('text-anchor', 'middle')
      .attr('x', t => geom(t).lx).attr('y', t => geom(t).ly)
      .style('font-size', '7px').style('fill', ink)
      .attr('stroke', C.panel).attr('stroke-width', 2.5).attr('paint-order', 'stroke')
      .text(t => t.p);

    const node = svg.append('g').selectAll('g').data(names).join('g')
      .attr('transform', n => `translate(${P(n).x},${P(n).y})`);
    node.append('circle').attr('r', R)
      .attr('fill', n => (RETIRED.includes(n) ? C.faint : C.ink))
      .attr('stroke', C.panel).attr('stroke-width', 1.4)
      .attr('stroke-dasharray', n => (RETIRED.includes(n) ? '3 2' : null));
    node.append('text').attr('class', 'node-label').attr('text-anchor', 'middle')
      .attr('dy', n => (TRIPLE_POS[n].y > .7 ? R + 12 : -(R + 6)))
      .style('font-size', '9px')
      .style('fill', n => (RETIRED.includes(n) ? C.dim : C.ink))
      .attr('text-decoration', n => (RETIRED.includes(n) ? 'line-through' : null))
      .attr('stroke', C.panel).attr('stroke-width', 3.5).attr('paint-order', 'stroke')
      .text(n => n);
  }

  /* ── paradigm three · two entities and the edge nobody extracted ───────────
     A token classifier returns spans, not relations. Drawing the pair with the
     relation dashed and unnamed is the honest picture, and it is the same point
     the tradeoff row makes in words. */
  const ENTS = [
    { label: 'Ibuprofen', type: 'Drug', ink: C.amber, x: .26 },
    { label: 'severe gastric issues', type: 'Symptom', ink: C.blue, x: .74 },
  ];

  function drawEnts(host) {
    if (!host) return;
    const { svg, w, h } = newSvg(host);
    const R = 5.5;
    const y = h * .42;
    const X = e => e.x * w;

    svg.append('line')
      .attr('x1', X(ENTS[0]) + R + 3).attr('y1', y)
      .attr('x2', X(ENTS[1]) - R - 3).attr('y2', y)
      .attr('stroke', C.dim).attr('stroke-width', 1.3).attr('stroke-dasharray', '4 3');
    svg.append('text').attr('text-anchor', 'middle')
      .attr('x', w / 2).attr('y', y - 7)
      .attr('font-family', 'var(--display)').attr('font-weight', 700)
      .attr('font-size', '10px').attr('fill', C.dim)
      .attr('stroke', C.panel).attr('stroke-width', 3).attr('paint-order', 'stroke')
      .text('?');
    svg.append('text').attr('class', 'axis-label').attr('text-anchor', 'middle')
      .attr('x', w / 2).attr('y', h - 3).style('font-size', '7.5px')
      .text('relation not extracted');

    const node = svg.append('g').selectAll('g').data(ENTS).join('g')
      .attr('transform', e => `translate(${X(e)},${y})`);
    node.append('circle').attr('r', R).attr('fill', e => e.ink)
      .attr('stroke', C.panel).attr('stroke-width', 1.4);
    node.append('text').attr('class', 'node-label').attr('text-anchor', 'middle')
      .attr('dy', R + 12).style('font-size', '8.5px')
      .attr('stroke', C.panel).attr('stroke-width', 3).attr('paint-order', 'stroke')
      .text(e => e.label);
  }

  /* ── the detail rows that travel with each illustration ─────────────────── */
  const PARADIGMS = {
    structured: {
      how: 'The foreign keys in your warehouse are already edges. A node table and an edge table are two more views over tables you have, refreshed by the pipeline that already refreshes them.',
      fits: 'The relationships you need are the ones the schema already models, and the entities are already keyed.',
      fails: 'The relationship lives in prose and nowhere in the schema — who superseded whom, who was named alongside whom, what a contract actually obliges.',
      trade: 'No extraction, no model and no new pipeline, bought in exchange for a graph that can only hold relationships somebody already modelled as a key.',
    },
    extract: {
      how: 'One ai_extract pass over the corpus returns subject, predicate and object per document, and those rows land in the same node and edge tables the first option produces.',
      fits: 'The relationships live in documents, and the predicate vocabulary is small enough to write down in advance.',
      fails: 'Vocabulary a general model does not hold, and anything needing two documents compared — supersession is assembled after extraction, never inside it.',
      trade: 'Governed extraction with nothing to train and nothing to host, bought in exchange for output you have to evaluate rather than trust.',
      aside: 'This is the step that produced the graph two slides ago. Doc A, C and D are three of those four documents.',
    },
    finetuned: {
      how: 'A small encoder fine-tuned on a domain corpus tags every token with an entity type, so the vocabulary comes from the domain rather than from a general model.',
      fits: 'Dense domain language at volume — clinical notes, filings, engineering logs — where a general extractor keeps missing the terms that carry the meaning.',
      fails: 'Per-class quality is uneven and the average hides it. Drug scores 72 F1 here against 90-plus for the other three, and drugs are half the point of reading a physician note.',
      trade: 'Domain precision, bought in exchange for a model to fine-tune, host and re-evaluate — and entities only, with the relations between them still yours to assemble.',
      aside: 'Published on Hugging Face as AventIQ-AI/bert-medical-entity-extraction. The four scores on the right are its own evaluation table.',
    },
  };

  const viz = slide.querySelector('#bo-viz');
  const panel = slide.querySelector('#bo-panel');
  const buttons = [...slide.querySelectorAll('.bo-card[data-para]')];
  let current = slide.querySelector('.bo-card.active')?.dataset.para || 'structured';
  let domain = DOMAIN_IDS[0];

  /* newSvg clears the host first, so a redraw replaces rather than stacks —
     re-entering the slide cannot leave two SVGs behind */
  function paintNets() {
    if (current === 'structured') drawNetwork(viz.querySelector('#bo-net'), DOMAINS[domain]);
    if (current === 'extract') drawTriples(viz.querySelector('#bo-triples'));
    if (current === 'finetuned') drawEnts(viz.querySelector('#bo-ents'));
  }

  function render() {
    const p = PARADIGMS[current];
    if (!p) return;
    viz.innerHTML = `<div class="bv">${VIZ[current]()}</div>`;
    /* the domain toggle is redrawn with the illustration, so it is bound here */
    viz.querySelectorAll('[data-dom]').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        domain = btn.dataset.dom;
        render();
      });
    });
    paintNets();
    /* a host measured while the slide is still hidden comes back zero-sized, so
       take a second pass once layout has settled */
    requestAnimationFrame(paintNets);
    const rows = [
      ['How it works', p.how],
      ['Fits when', p.fits],
      ['Fails when', p.fails],
      ['The tradeoff', p.trade],
    ];
    panel.innerHTML =
      '<div class="bo-rows">' +
      rows.map(([k, v], i) =>
        `<div class="bo-row${i === 2 ? ' fail' : ''}${i === 3 ? ' trade' : ''}">` +
        `<b>${k}</b><span>${v}</span></div>`).join('') +
      '</div>' +
      (p.aside ? `<p class="bo-aside">${p.aside}</p>` : '');
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      current = btn.dataset.para;
      buttons.forEach(b => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      render();
    });
  });

  return { enter: render };
});
