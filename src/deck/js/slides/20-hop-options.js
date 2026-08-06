/* 16 · traversal serving options — banded strip drives one detail panel */
DECK.registerViz('20-hop-options', (slide) => {
  const OPTIONS = {
    hops: {
      runs: 'Hop tables are generated ahead of the question and handed to a Genie space alongside the edge table, so multi-hop analysis is a join rather than a walk.',
      fits: 'Depth is known and bounded, and predictable query cost matters more than flexibility. This is the fastest route to multi-hop answers in Genie.',
      fails: 'Depth is genuinely open-ended, or the hierarchy is restructured often enough that the closures are permanently mid-rebuild.',
      trade: 'Storage and a standing refresh job, bought in exchange for a query cost you can quote in advance.',
      ext: 'The source pattern calculates the hop tables as a step and stops there. Maintaining them as a declarative pipeline — Lakeflow, with <b>spark-r2r</b> for the R2RML-style transforms inside Spark Declarative Pipelines — is our addition, and it is the part to pressure-test rather than assume.',
    },
    cte: {
      runs: 'WITH RECURSIVE is native in Databricks SQL and Spark, so the agent writes the traversal itself at query time over the edge table. Nothing is materialized ahead of the question and no engine is involved.',
      fits: 'The walk is shallow and tree-shaped, depth is exploratory rather than fixed, and you would rather not own a set of closures at all.',
      fails: 'Genuinely complex graphs. This lifts how much an agent can retrieve from a graph held in a traditional database, and the ceiling is still low — long or branching walks, supernodes and cycles are past what a generated recursive CTE gets right, and cost per query is unbounded. The shape it suits is a DAG or a tree-like taxonomy, not a true graph problem.',
      trade: 'Nothing to materialize and nothing to refresh, bought in exchange for query cost you cannot predict and a hard limit on how graph-shaped the question is allowed to be.',
      back: 'The taxonomy section walked this same ground on the product hierarchy: how the tree is <b>encoded</b> is what decided whether the model wrote a correct recursive rollup — adjacency forced it and it never landed, a closure table paid the walk once at write time and the read became one equality. The edges here behave the same way, and the sets that do not follow the tree still need naming beside it.',
    },
    sparql: {
      runs: 'Structured graph questions compile deterministically from SPARQL down to SQL against the edge table. No separate database engine runs at any point.',
      fits: 'The questions are structured and genuinely graph-shaped, and you want roughly one-second answers from a query a reviewer can read.',
      fails: 'Open-ended exploratory questions. Those route to the agentic path instead, at thirty to forty-five seconds, with the router choosing per question.',
      trade: 'A compiler to build and maintain, bought in exchange for real graph query semantics with no engine underneath.',
    },
    engine: {
      runs: 'A Delta-backed triple store plus a Postgres graph engine, with OWL and SHACL reasoning, served through a model serving endpoint, an MCP tool, or a Unity Catalog function an agent calls.',
      fits: 'You want true graph query semantics and formal reasoning, and the data is not permitted to leave the lakehouse to get them.',
      fails: 'Model serving endpoints have no Spark. Any engine served that way needs an in-memory execution path, and heavy traversals still have to be precomputed to Delta and served as lookups.',
      trade: 'Graph-native semantics and inference, bought in exchange for an engine you now operate inside your own platform.',
      aside: 'This is the materialized option. The virtualized counterpart — SPARQL translated to SQL at runtime with nothing stored — is covered in the ontology section.',
    },
    partner: {
      runs: 'Edges are built and refreshed in Delta and synced outward, either by a Lakeflow Jobs push or a partner-native connector. Delta stays the system of record and governance stays in Unity Catalog.',
      fits: 'There are graph applications already in production, deep Cypher or SPARQL expertise on staff, or a genuine sub-second traversal requirement at high concurrency.',
      fails: 'Not the traversal itself, which these engines do well. The cost lands on operations: two systems to govern, secure, and keep in sync.',
      trade: 'Full graph-native capability, bought in exchange for a second governed system and the drift that comes with it.',
    },
  };

  const panel = slide.querySelector('#opt-panel');
  const buttons = [...slide.querySelectorAll('.opt[data-opt]')];
  let current = 'hops';

  function render() {
    const o = OPTIONS[current];
    if (!o) return;
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
      (o.aside ? `<p class="opt-aside">${o.aside}</p>` : '') +
      (o.ext ? `<div class="opt-ext"><b>Extension · beyond the source pattern</b><span>${o.ext}</span></div>` : '');
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
