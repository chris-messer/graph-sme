NOTES.push({
  title: 'Ontology · building the semantic layer',
  onscreen: 'A four-row ledger ascending from describing meaning to governing it, each project with what runs, when it fits, when it fails, and the tradeoff.',
  say: 'Two names were on the previous slide and here they are with two more, arranged by the tier of meaning each one owns rather than by which is best — because they are not competing. Bottom row up. dbxmetagen is where you go when nobody has written down what anything means yet: it classifies tables and columns into an entity taxonomy with AI and emits tags, metric views, even a graph. Fast, and the honest limit is that a taxonomy of entity types is not an ontology and will not infer anything for you. Ontop is the virtual option — a Virtual Knowledge Graph running as a Databricks App, where SPARQL gets translated at runtime into SQL over your Unity Catalog tables through R2RML mappings, and it will federate out to sources that are not in the lakehouse at all. Nothing is copied. That is the whole appeal and also the catch: no materialization to maintain, and no precomputation to lean on when a query turns out to be expensive. Then the two the source treats as primary. OntoBricks is the one to reach for when a client says the word ontology and means it — real OWL, R2RML mapping down to UC tables, triples materialized into Delta and Lakebase, and actual reasoning with OWL 2 RL, SWRL rules and SHACL validation, with a generated GraphQL API on top. Days to a working graph. Which means it is also the cheapest way to find out whether they need one. And Ontos is the other half: where OntoBricks builds the graph, Ontos governs what the meaning is — data products and contracts, domains, stewards, review workflows with audit trails. The line I would use out loud is that the app installs in an afternoon and the agreement about what a customer is does not. That is not a software problem and Ontos does not pretend it is.',
  bullets: [
    ['Purpose', ['Give the two names from the previous slide real shape, add the two the deck had been leaving out, and establish that these are tiers to combine rather than products to choose between']],
    ['Key nuance', [
      'There is no winner here and do not manufacture one. The source pairs OntoBricks and Ontos explicitly — formal ontology and reasoning on one side, business semantics and governance on the other — and says both can sit alongside a Genie stack over the same assets',
      'The two unsized rows are marked unsized on purpose. dbxmetagen and Ontop are named in the same Labs family but carry no complexity or timeline figure, so quoting one would be inventing it. Say you would size them in scoping',
      'Ontop is the answer to "we are not allowed to copy the data," and it is the virtual counterpart to the materialized triple store — same mappings, opposite storage decision',
      'spark-r2r is worth knowing but not worth a row: R2RML-style transforms inside Spark Declarative Pipelines. Tagsonomy was the original ontology project and has been merged into Ontos, so do not present it as a live option',
      'All four are open source and run in the client workspace. For a client whose objection is vendor lock-in on a semantic layer, that is the strongest thing on this slide',
    ]],
    ['How to demo live', [
      'Read the tier column top to bottom first. The ascent from describing meaning to governing it is the argument; the individual projects are supporting detail',
      'If the room has an ontologist in it, go to OntoBricks and stay there — OWL 2 RL, SWRL and SHACL are the words that establish this is not a metadata catalogue with a new name',
      'If the room is data governance rather than data science, invert it and lead with Ontos',
      'Offer the four-click OntoBricks path as a next step rather than a feature. Standing up a real ontology-backed graph on their own tables in days is a better answer than any slide about whether they need one',
    ]],
    ['Discovery', [
      'When you say ontology, do you mean formal semantics with inference, or an agreed business vocabulary? The answer decides which two rows matter',
      'Is there an existing ontology — OWL, RDF, an industry standard like FIBO or a supplier model — that we would need to import rather than design?',
      'Are you permitted to materialize a copy of this data, or does something in the estate have to be answered in place?',
      'Who owns the definition of your core business terms today, and does that person have the authority to settle a dispute about one?',
      'Has a semantic layer been attempted here before? What stopped it — the modelling or the adoption?',
    ]],
  ],
  transition: 'Transition: "Ontos, dbxmetagen and the managed path all stay on the metadata side of the line we drew two slides ago. OntoBricks is the one that crosses it, and once you are crossing it deliberately you are in the third section — this is where row-level relationships genuinely earn a graph."'
});
