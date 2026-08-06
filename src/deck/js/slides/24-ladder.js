/* 24 · Closing synthesis — the three-step climb rail drives one detail column */
DECK.registerViz('24-ladder', (slide) => {
  const RUNGS = {
    1: {
      title: 'Managed semantics',
      qual: 'A product surface rather than a project. It is enabled and then curated, and nothing new is added to the estate to operate.',
      tintBg: 'rgba(0,169,114,.1)', tintLine: 'var(--green)',
      parts: [
        ['Genie Ontology', 'A semantic map generated over the assets you already have, scored by authority, usage and freshness.'],
        ['Unity Catalog Glossary', 'Governed business terms defined once, so a word like &ldquo;enterprise&rdquo; carries the same meaning to every tool that reads it.'],
        ['Metric views', 'Certified measures over your core entities, so a number resolves to an authored definition rather than a fresh derivation.'],
        ['Declared relationships', 'Entity relationships registered as a governed semantic asset instead of rediscovered by every query.'],
      ],
      fits: 'Questions about what your assets mean, and governed numbers over tables that already exist.',
      get: 'Better answers out of Genie, and one place every tool, user and agent reads meaning from.',
      own: 'Curation and stewardship. No new store, no refresh job, nothing to run.',
      backTag: 'Seen already · the managed path and the metadata boundary',
      back: 'This rung reasons over metadata — definitions, business rules, usage and freshness — filtered to the assets the asking user can already see. It never reads your rows, which is exactly what the next gate is about.',
    },
    2: {
      title: 'Tailored agentic context',
      qual: 'Engineering rather than curation, and no third party enters the estate. One edge contract in Delta, then several ways to encode and serve it.',
      tintBg: 'rgba(34,114,180,.1)', tintLine: 'var(--blue)',
      parts: [
        ['Closure table plus segments', 'The tree stored so a rollup is one equality join, with the business sets that ignore the tree named as data beside it.'],
        ['Agent-generated recursive SQL', '<b>WITH RECURSIVE</b> over one edge table at query time. Nothing materialized, nothing to refresh, and the lowest-effort way in.'],
        ['Materialized hop tables', 'Five, ten and fifteen-hop closures built ahead of the question, so the traversals you repeat have a cost you can quote.'],
        ['Text → SPARQL → SQL', 'Structured graph questions compiled deterministically down to SQL over those same edges. Still no engine underneath.'],
        ['Graph RAG on Lakebase', 'A Delta triple store with a Lakebase Postgres graph surface served to agents — the graph engine option that never leaves Databricks.'],
        ['Lakehouse-native graph libraries', 'NetworkX, SparkGraph or cuGraph in a notebook — precompute centrality and communities to Delta, then serve cheap lookups.'],
      ],
      fits: 'Hierarchy rollups, multi-hop traversal, agent context that has to be governed, and algorithms over your own edges.',
      get: 'One governed edge contract that Genie, explorers, algorithms and agents all read unchanged.',
      own: 'The edge contract and entity resolution, plus whatever refresh the closures and hop tables need.',
      backTag: 'Seen already · nearly every options and recommendation slide in this deck',
      back: 'Taxonomy storage patterns and the closure-plus-segment recommendation, the five hop retrieval options and where we said to start, and the three algorithm engines. Nothing here is new, and because all of it reads one edge contract, changing your mind later is not a rebuild.',
    },
    3: {
      title: 'Partner-accelerated use cases',
      qual: 'A partner or specialist team joins, because the scope now reaches past the platform or past the patterns. Delta stays the system of record throughout.',
      tintBg: 'rgba(255,54,33,.09)', tintLine: 'var(--signal)',
      parts: [
        ['Enterprise knowledge graph', 'Business semantics, data contracts and steward workflows across the estate with Ontos, including the resources that were never in Databricks.'],
        ['Billion-node graphs', 'The full source estate rather than a scoped cut — 1.45 billion edges over 635 million companies, with the scope kept in configuration.'],
        ['Graph neural networks', 'Structure itself as the model input, once an edge contract and labeled outcomes both already exist.'],
        ['Graph foundation models', 'Fine-tuning a pretrained graph model where one exists for the domain, which today means chemistry and materials rather than every industry.'],
      ],
      fits: 'An enterprise-wide graph beyond Databricks, hundreds of millions of nodes against a latency target, or a decision that turns on the shape of a neighborhood.',
      get: 'Capability the rungs below cannot reach, delivered with people who have shipped it before.',
      own: 'A second governed surface and a sync path — and on an enterprise graph, organisational adoption is the work rather than the software.',
      backTag: 'Seen already · ontology design, extreme scale and the GNN options',
      back: 'Each of these had its own slide and its own honest ceiling. What they share is that none of them is a first project, and every one of them is cheaper to justify after a rung below it has visibly run out.',
    },
  };

  const detail = slide.querySelector('#lad-detail');
  const buttons = [...slide.querySelectorAll('.lad-rung[data-rung]')];
  let current = 1;

  function render() {
    const copy = RUNGS[current];
    if (!detail || !copy) return;
    detail.dataset.rung = String(current);
    detail.style.setProperty('--lad-cd-bg', copy.tintBg);
    detail.style.setProperty('--lad-cd-line', copy.tintLine);
    detail.innerHTML = `
      <div class="lad-cd-head">
        <span class="lad-cd-tag">Rung ${current} · ${copy.title}</span>
        <p class="lad-cd-qual">${copy.qual}</p>
      </div>
      <div class="lad-climb-parts">
        ${copy.parts.map(([name, desc]) => `<div class="lad-cp"><b>${name}</b><span>${desc}</span></div>`).join('')}
      </div>
      <div class="lad-cd-facets">
        <div><b>Fits when</b><span>${copy.fits}</span></div>
        <div><b>What you get</b><span>${copy.get}</span></div>
        <div><b>What you own</b><span>${copy.own}</span></div>
      </div>
      <div class="lad-cd-back"><b>${copy.backTag}</b><span>${copy.back}</span></div>`;
  }

  function select(n) {
    if (!RUNGS[n]) return;
    current = n;
    buttons.forEach(btn => {
      const on = Number(btn.dataset.rung) === n;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
    render();
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      select(Number(btn.dataset.rung));
    });
  });

  return { enter: () => select(current) };
});
