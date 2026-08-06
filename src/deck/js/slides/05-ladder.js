/* 05 · Managed path and ladder — rung selector drives one panel */
DECK.registerViz('05-ladder', (slide) => {
  const RUNGS = {
    1: {
      title: 'Managed semantics',
      qual: 'Product surface, not a build. Enable it, then curate it.',
      tintBg: 'rgba(0,169,114,.1)', tintLine: 'var(--green)',
      parts: [
        ['Genie Ontology', 'Maintained semantic map, scored by authority, usage, and freshness.'],
        ['UC Glossary', 'Curated business terms every agent, user, and tool reads from.'],
        ['Metric Views', 'Governed metrics with low-code authoring over core entities.'],
        ['Relationships', 'Entity relationships declared as a governed semantic asset.'],
      ],
      fits: 'Semantic exploration and governed metrics, with no custom program to staff.',
      get: 'Managed semantics over the tables you already have, gated by Unity Catalog.',
      time: 'Days. The only rung measured in days, because nothing is being built. Curation is the ongoing work.',
      fails: 'A question needs relationships between records, not the meaning of assets.',
    },
    2: {
      title: 'Edge table + Genie',
      qual: 'First build. One Delta edge set with a Genie space over it.',
      tintBg: 'rgba(34,114,180,.1)', tintLine: 'var(--blue)',
      parts: [
        ['Edge table', 'Subject, predicate, object rows in Delta, with an entity type per edge.'],
        ['Enriched views', 'Joins written once, so Genie stops guessing which column holds a level.'],
        ['Hop views', 'Two- and three-hop rollups materialized for the questions that repeat.'],
        ['Genie space', 'Pointed at the edge set rather than raw dimensions and facts.'],
      ],
      fits: 'Interconnectivity questions Genie can answer once the joins are explicit.',
      get: 'One edge set driving joins, rollups, and hop views for a single audience.',
      time: '2–4 weeks. Source data readiness and a first pass at entity resolution set the pace.',
      fails: 'Agents and applications each rebuild their own edge logic, and definitions drift.',
    },
    3: {
      title: 'Edge contract + agents',
      qual: 'The edge set becomes a governed contract with several consumers.',
      tintBg: 'rgba(61,143,191,.12)', tintLine: '#3d8fbf',
      parts: [
        ['gold_triplets contract', 'One governed edge table in Unity Catalog that every consumer reads.'],
        ['UC traversal functions', 'Ancestors, descendants, and neighborhood exposed as callable SQL.'],
        ['Supervisor agent', 'Routes between Genie, traversal tools, and the Knowledge Assistant.'],
        ['Knowledge explorer app', 'Analysts browse the graph without writing traversal SQL.'],
      ],
      fits: 'Multiple consumers need one governed contract: Genie, tools, and an explorer.',
      get: 'A versioned edge contract plus the agent and application surfaces over it.',
      time: '4–8 weeks. Longer when entity types are still moving or resolution needs human review.',
      fails: 'Questions are genuinely graph-shaped — deep or open-ended traversal, not joins.',
    },
    4: {
      title: 'Traversal / SPARQL',
      qual: 'Graph query semantics over the same Delta edges. No new engine.',
      tintBg: 'rgba(176,96,0,.1)', tintLine: 'var(--amber)',
      parts: [
        ['Precomputed hop closures', '5, 10, and 15 hops materialized to Delta for predictable latency.'],
        ['Text → SPARQL → SQL', 'Graph questions compiled deterministically to SQL over the same edges.'],
        ['Recursive CTEs', 'Open-ended traversal, native to Databricks SQL and Spark.'],
        ['Serving endpoint · MCP tool', 'Traversal published as a governed tool that agents can call.'],
      ],
      fits: 'Deep or open-ended traversal, or graph query semantics the team already speaks.',
      get: 'Traversal and graph query over Delta, with nothing new to operate.',
      time: '6–12 weeks. Hop depth, precompute cost, and ontology curation drive the upper end.',
      fails: 'Latency and concurrency targets are missed, or formal reasoning is a requirement.',
    },
    5: {
      title: 'Engine or partner DB',
      qual: 'A second system enters the estate. Delta stays the system of record.',
      tintBg: 'rgba(255,54,33,.09)', tintLine: 'var(--signal)',
      parts: [
        ['OntoBricks', 'Databricks Labs app: OWL authoring, R2RML mapping, OWL 2 RL and SHACL.'],
        ['Neo4j · Stardog · Kobai', 'Established engines alongside the lakehouse for Cypher, SPARQL, or reasoning.'],
        ['PuppyGraph', 'Graph virtualization over Delta, with no second copy of the data.'],
        ['Delta sync + governance', 'Sync, lineage, access, and security review for two systems instead of one.'],
      ],
      fits: 'Existing Cypher/SPARQL estates, sub-second traversal at concurrency, or OWL reasoning.',
      get: 'A graph engine in the estate, fed from Delta and governed alongside it.',
      time: '3–6 months. Two-system sync, security review, and governance design dominate the schedule.',
      fails: 'Nothing above this. Keep Delta as the system of record and sync outward.',
    },
  };

  function selectRung(n) {
    slide.querySelectorAll('.rung').forEach(r => {
      const on = Number(r.dataset.rung) === n;
      r.classList.toggle('active', on);
      r.setAttribute('aria-pressed', String(on));
    });
    const panel = document.getElementById('rung-panel');
    const copy = RUNGS[n];
    if (!panel || !copy) return;
    panel.style.setProperty('--tint-bg', copy.tintBg);
    panel.style.setProperty('--tint-line', copy.tintLine);
    panel.innerHTML = `
      <div class="rung-lane">
        <div class="lane-tag"><b>Rung ${n} · ${copy.title}</b><span>${copy.qual}</span></div>
        ${copy.parts.map(([name, desc]) => `<div class="lane-cell"><b>${name}</b><span>${desc}</span></div>`).join('')}
      </div>
      <div class="rd-facets">
        <div><b>When it fits</b><span>${copy.fits}</span></div>
        <div><b>What you get</b><span>${copy.get}</span></div>
        <div><b>Typical delivery</b><span>${copy.time}</span></div>
        <div><b>When it fails</b><span>${copy.fails}</span></div>
      </div>
      <p class="rung-note">Planning ranges, not quotes. Each assumes the edge data still has to be produced and resolved — entity resolution is reliably the longest pole.</p>`;
  }
  slide.querySelectorAll('.rung').forEach(r => {
    r.addEventListener('click', (ev) => { ev.stopPropagation(); selectRung(Number(r.dataset.rung)); });
  });
  selectRung(1);
});
