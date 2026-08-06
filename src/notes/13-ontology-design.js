NOTES.push({
  title: 'Client need · the company brain',
  onscreen: 'One nested scope map shown twice: the governance reading with Unity Catalog inside and an enterprise catalog outside, then the same shape with OntoBricks inside and Ontos spanning.',
  say: 'This is a genuinely different need, not a bigger version of the last one. The customer wants an enterprise-wide semantic layer — one company brain — and they are telling you up front that Databricks is part of the picture and not all of it. The good news is that they have already answered this scope question once. Look at the diagram as it stands. Unity Catalog governs everything inside the Databricks estate, and almost every organisation this size also runs an enterprise catalog — Atlan, Collibra, something in that family — to define the things that sit outside the data estate. Nobody argues about that; it is just how the two layers divide. Now watch the same diagram one layer up. OntoBricks sits exactly where Unity Catalog sits: Databricks-native, extracting the relationships out of Unity Catalog assets and feeding them into a broader company knowledge graph. Ontos sits exactly where the enterprise catalog sits: governing that graph plus the resources that were never in Databricks to begin with. Same shape, same division of labour, one layer up from technical governance into meaning. Both are open source Databricks Labs projects that run as Databricks Apps, and both expose themselves to agents over MCP.',
  bullets: [
    ['Purpose', ['Separate the enterprise-semantics ask from the managed-Genie ask, and let the customer place the two Labs projects using a scope decision they have already made']],
    ['How to demo live', [
      'Leave the diagram on Governance while you describe it and get a nod — you want agreement on the familiar reading before you reuse it',
      'Switch to Semantics and pause. The ghost labels underneath each box say where Unity Catalog and the enterprise catalog were, so the mapping is on screen',
      'Only then name the two projects underneath, and keep it to one line each — builds the graph, governs the meaning. The detail is the next slide and this one is the scope argument',
    ]],
    ['Key nuance', [
      'Be careful with the analogy in one direction: OntoBricks is not a catalog and Ontos does not replace Collibra. The parallel is about scope and position, not feature-for-feature substitution. If someone pushes on it, say the analogy is about where each thing sits, not what it is',
      'What OntoBricks actually does: OWL ontology design, R2RML mapping to Unity Catalog tables, a materialized Delta triple store plus a Lakebase Postgres graph engine, and reasoning with OWL 2 RL, SWRL rules and SHACL validation. Nothing lighter in this deck offers that inference tier',
      'What Ontos actually does: data products and contracts on the ODCS and ODPS standards, a semantic-model layer linking technical UC assets to business concepts, domains, teams and projects, steward review workflows with audit trails, and compliance automation',
      'OntoBricks can go from Unity Catalog metadata to a queryable reasoning graph in a handful of clicks. That makes it the cheapest way to pressure-test whether formal semantics are genuinely needed before anyone budgets for them',
      'With Ontos the software is the easy part and organisational adoption is the work. Say so, because a customer who hears otherwise is disappointed by month three',
      'Ontop VKG is the virtualization counterpart if the customer refuses to materialize anything: SPARQL translated to SQL at runtime, no triple store',
    ]],
    ['Discovery', [
      'Is an enterprise catalog like Atlan or Collibra already in play, and who owns it?',
      'What lives outside Databricks that has to be in this picture — SaaS applications, a warehouse, third-party data, documents?',
      'Is formal OWL reasoning or SHACL validation a stated requirement, or a preference someone inherited from a previous role?',
      'Do you need to interoperate with an ontology that already exists outside Databricks?',
      'Do you have data stewards with allocated time, and what is your appetite for a review workflow?',
    ]],
  ],
  transition: 'Transition: "Two names is not enough to choose from. Here is the whole family, and what each one is actually for."'
});
