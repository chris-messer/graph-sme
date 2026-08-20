/* 19 · GraphRAG serving options — a vertical option rail drives one stage that
   carries that option's illustration over its detail rows. Both are keyed on
   the option rather than its position, so reordering the rail in the markup
   carries the stage with it.

   Every illustration answers the same two-hop question so the comparison is
   between mechanisms rather than between examples: Delta Holdings owns the
   subsidiaries, the subsidiaries have the suppliers. Relation names and the
   business-key id shape follow the Lakebase GraphRAG schema, which is the one
   option here with a published one. */
DECK.registerViz('19-hop-options', (slide) => {
  const Q = 'Who supplies the subsidiaries of Delta Holdings?';

  const KW = /\b(WITH RECURSIVE|UNION ALL|ORDER BY|GROUP BY|SELECT|FROM|WHERE|JOIN|ON|AND|AS|LIMIT|MATCH|RETURN|MAX)\b/g;
  const code = (src) => src
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/--[^\n]*/g, m => `<span class="cm">${m}</span>`)
    .replace(/'[^']*'/g, m => `<span class="lit">${m}</span>`)
    .replace(KW, m => `<span class="kw">${m}</span>`);

  const pre = (src) => `<pre class="ov-code">${code(src)}</pre>`;
  const beat = (label, body, cls) => `<div class="ov-beat${cls ? ' ' + cls : ''}"><b>${label}</b>${body}</div>`;
  const arrow = (label) =>
    `<i class="ov-arrow" aria-hidden="true">${label ? `<em>${label}</em>` : ''}<span>&rarr;</span></i>`;
  const row = (cols, cells) => `<div class="ov-row" style="grid-template-columns:${cols}">${cells.join('')}</div>`;
  const ask = () => `<div class="ov-q"><b>Question</b>${Q}</div>`;
  const table = (cols, rows) =>
    '<table class="ov-tbl"><thead><tr>' + cols.map(c => `<th>${c}</th>`).join('') +
    '</tr></thead><tbody>' + rows.map(r =>
      `<tr${r[0] ? ' class="hit"' : ''}>` + r[1].map(c => `<td>${c}</td>`).join('') + '</tr>'
    ).join('') + '</tbody></table>';
  const trip = (rows) => '<ul class="ov-trip">' + rows.map(([s, r, o]) =>
    `<li><span class="ov-n">${s}</span><span class="ov-r">${r}</span><span class="ov-n">${o}</span></li>`
  ).join('') + '</ul>';

  /* ── the five illustrations ─────────────────────────────────────────── */
  const VIZ = {
    /* The agent is handed the tables and tries. What it produces is a real
       attempt at a recursive walk — and the markers are what the attempt is
       missing, which is the whole reason this is the cheapest rung and not the
       recommended one. */
    traverse: () => ask() + row('minmax(0,1.62fr) 54px minmax(0,1fr)', [
      beat('Best-effort attempt', pre(
`WITH RECURSIVE walk AS (
  SELECT dst_id, rel, 1 AS hop
    FROM graph.edges
   WHERE src_id = 'co:delta'
  UNION ALL
  SELECT e.dst_id, e.rel, w.hop + 1
    FROM graph.edges e
    JOIN walk w ON e.src_id = w.dst_id
)
SELECT * FROM walk;`)),
      arrow('runs'),
      beat('What it never bounds',
        '<ul class="ov-warn"><li>no depth cap</li><li>no cycle guard</li><li>no row budget</li></ul>' +
        '<div class="ov-meter"><b>rows back</b><span>12,480</span></div>', 'hot'),
    ]),

    hops: () => ask() + row('minmax(0,1.3fr) 58px minmax(0,1fr) 50px minmax(0,.86fr)', [
      beat('graph.hops_2 · built ahead', table(
        ['src_id', 'dst_id', 'hop', 'rel_path'],
        [
          [0, ['co:delta', 'co:halden', '1', 'OWNS']],
          [0, ['co:delta', 'co:peralta', '1', 'OWNS']],
          [1, ['co:delta', 'sup:S2', '2', 'OWNS·SUPPLIED_BY']],
          [1, ['co:delta', 'sup:S7', '2', 'OWNS·SUPPLIED_BY']],
          [1, ['co:delta', 'sup:S4', '2', 'OWNS·SUPPLIED_BY']],
        ])),
      arrow('agent writes'),
      beat('Generated SQL', pre(
`SELECT dst_id
  FROM graph.hops_2
 WHERE src_id = 'co:delta'
   AND hop = 2;`)),
      arrow('3 rows'),
      beat('Back to the agent',
        '<div class="ov-chips"><span>sup:S2</span><span>sup:S7</span><span>sup:S4</span></div>' +
        '<span class="ov-agent">Agent</span>', 'good'),
    ]),

    sparql: () => ask() + row('minmax(0,1fr) 56px minmax(0,1.3fr) 62px minmax(0,.9fr)', [
      beat('Agent writes SPARQL', pre(
`SELECT ?supplier
WHERE {
  :delta :owns       ?sub .
  ?sub   :suppliedBy ?supplier .
}`)),
      arrow('compiler'),
      beat('Compiled SQL', pre(
`SELECT e2.dst_id
  FROM graph.edges e1
  JOIN graph.edges e2
    ON e2.src_id = e1.dst_id
 WHERE e1.src_id = 'co:delta'
   AND e1.rel = 'OWNS'
   AND e2.rel = 'SUPPLIED_BY';`)),
      arrow('executes on'),
      beat('graph.edges', table(
        ['src_id', 'rel', 'dst_id'],
        [
          [0, ['co:delta', 'OWNS', 'co:halden']],
          [0, ['co:halden', 'SUPPLIED_BY', 'sup:S2']],
          [0, ['co:peralta', 'SUPPLIED_BY', 'sup:S7']],
        ])),
    ]),

    /* The Lakebase GraphRAG pattern: three tables and one three-stage statement
       inside a managed Postgres, with model serving on both ends. Drawn from
       lakebase-cookbook.com/docs/examples/graphrag — including the part the
       card used to get wrong, that there is no property-graph engine under it. */
    engine: () => ask() + row('minmax(0,.62fr) 44px minmax(0,2.6fr) 58px minmax(0,.62fr)', [
      beat('Model serving · embed', pre('gte-large-en\nVECTOR(1024)')),
      arrow(''),
      `<div class="ov-box"><b>Lakebase · managed Postgres</b>` +
      '<div class="ov-schema"><span>graph.nodes</span><span>graph.edges</span>' +
      '<span>graph.node_embeddings</span></div>' +
      row('minmax(0,1fr) 40px minmax(0,1.12fr) 40px minmax(0,1fr)', [
        beat('1 · semantic seed', pre('ORDER BY\n  embedding <=> :q\nHNSW · cosine')),
        arrow('seeds'),
        beat('2 · graph expansion', pre('WITH RECURSIVE walk\n  hop < :max_hops (2)\n  visited[] guard')),
        arrow('k-hop'),
        beat('3 · blended rank', pre('MAX(sim * 0.5 ^ hop)\ntop 25 + rel types')),
      ]) +
      '<p class="ov-flag">relational + vector primitives · no cypher, no property-graph engine</p></div>',
      arrow('context'),
      beat('Model serving · answer', '<span class="ov-agent">Agent</span>', 'good'),
    ]),

    partner: () => ask() + row('minmax(0,1.18fr) 46px minmax(0,1.6fr) 46px minmax(0,.58fr)', [
      beat('Neo4j · Cypher', pre(
`MATCH (:Company {id:'co:delta'})
  -[:OWNS]->(s)-[:SUPPLIED_BY]->(v)
RETURN s, v`)),
      arrow('returns'),
      beat('Triplets back', trip([
        ['Delta Holdings', 'OWNS', 'Halden Foods'],
        ['Halden Foods', 'SUPPLIED_BY', 'Corveq Plastics'],
        ['Halden Foods', 'SUPPLIED_BY', 'Ilex Packaging'],
        ['Peralta Metals', 'SUPPLIED_BY', 'Norwood Steel'],
      ])),
      arrow('context'),
      beat('Answer', '<span class="ov-agent">Agent</span>', 'good'),
    ]),
  };

  /* ── the detail rows that travel with each illustration ─────────────── */
  const OPTIONS = {
    hops: {
      runs: 'Hop tables are generated ahead of the question and handed to a Genie space alongside the edge table, so multi-hop analysis is a join rather than a walk.',
      fits: 'Depth is known and bounded, and predictable query cost matters more than flexibility.',
      fails: 'Depth is genuinely open-ended, or the hierarchy is restructured often enough that the closures are permanently mid-rebuild.',
      trade: 'Storage and a standing refresh job, bought in exchange for a query cost and a result size you can quote in advance.',
    },
    traverse: {
      runs: 'The agent queries the node and edge tables directly, issuing one query per hop and following the edges out. Nothing is materialized and no engine is involved.',
      fits: 'The walk is shallow and tree-shaped, and you would rather not own a set of closures at all.',
      fails: 'Real graphs. Branching walks and cycles become round trip after round trip, and one hop into a supernode floods the context with far more than the question needed.',
      trade: 'Nothing to materialize, bought in exchange for latency you cannot predict and a hard limit on how graph-shaped the question is allowed to be.',
      back: 'The taxonomy section walked this ground: how the tree is <b>encoded</b> decided whether a rollup was one join or a walk. These edges behave the same way.',
    },
    sparql: {
      runs: 'Structured graph questions compile deterministically from SPARQL down to SQL against the edge table. No separate database engine runs at any point.',
      fits: 'The questions are structured and genuinely graph-shaped, and you want an answer from a query a reviewer can read.',
      fails: 'Open-ended exploratory questions. Those route to the agentic path instead, with the router choosing per question.',
      trade: 'A compiler to build and maintain, bought in exchange for real graph query semantics with no engine underneath.',
    },
    engine: {
      runs: 'Nodes, edges and 1024-dim embeddings in Lakebase Postgres, with pgvector finding the seed and a bounded recursive walk expanding it.',
      fits: 'You want graph retrieval next to your operational data, and nothing is permitted to leave the platform to get it.',
      fails: 'Analytics over the whole network. This is bounded k-hop retrieval, and there is no property-graph engine or Cypher underneath it.',
      trade: 'Seeding and traversal in one statement, bought in exchange for a Postgres instance you now operate inside your own platform.',
      aside: 'This is the materialized option. The virtualized counterpart — SPARQL translated to SQL at runtime with nothing stored — is covered in the ontology section.',
    },
    partner: {
      runs: 'Edges are built and refreshed in Delta and synced outward. Delta stays the system of record and governance stays in Unity Catalog.',
      fits: 'Graph applications already in production, deep Cypher or SPARQL expertise on staff, or a genuine sub-second traversal requirement at high concurrency.',
      fails: 'Not the traversal itself, which these engines do well. The cost lands on operations: two systems to govern, secure, and keep in sync.',
      trade: 'Full graph-native capability, bought in exchange for a second governed system and the drift that comes with it.',
    },
  };

  const viz = slide.querySelector('#opt-viz');
  const panel = slide.querySelector('#opt-panel');
  const buttons = [...slide.querySelectorAll('.opt-card[data-opt]')];
  let current = slide.querySelector('.opt-card.active')?.dataset.opt || 'traverse';

  function render() {
    const o = OPTIONS[current];
    if (!o) return;
    viz.innerHTML = `<div class="ov">${VIZ[current]()}</div>`;
    const rows = [
      ['What runs', o.runs],
      ['Fits when', o.fits],
      ['Fails when', o.fails],
      ['The tradeoff', o.trade],
    ];
    panel.innerHTML =
      '<div class="opt-rows">' +
      rows.map(([k, v], i) =>
        `<div class="opt-row${i === 2 ? ' fail' : ''}${i === 3 ? ' trade' : ''}">` +
        `<b>${k}</b><span>${v}</span></div>`).join('') +
      '</div>' +
      (o.back ? `<div class="opt-back"><b>Seen already · Taxonomy, slides 07–10</b><span>${o.back}</span></div>` : '') +
      (o.aside ? `<p class="opt-aside">${o.aside}</p>` : '');
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      current = btn.dataset.opt;
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
