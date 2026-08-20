NOTES.push({
  title: 'Where you land · three rungs',
  onscreen: 'An ascending three-step rail read from the bottom, with the climb gate written between each pair of steps, driving one detail column that redraws on selection.',
  say: 'Everything we have just walked through fits on three rungs, and the reason we are ending here is so you can leave with one of them picked. Start at the bottom. Rung one is not a build — Genie Ontology generates the semantic map, the Glossary is how you correct it, metric views make a number mean one thing, and relationships get declared as a governed asset. Days, because nothing is being built, and the ongoing work is curation. More of the needs we opened with are answered right there than most teams expect. You leave rung one when a question is about how two records connect rather than what an asset means, and that is the line we drew in the ontology section. Rung two is where most of this deck actually lives. Closure tables and named segments for the hierarchy, the agent writing recursive SQL over one edge table, hop tables materialized once the same traversals start repeating, graph RAG served off Lakebase, and the lakehouse-native graph libraries for the algorithms. Every one of those had its own options slide. What they share is that they take real engineering, and none of them puts a third party in your estate. Two to six weeks, one edge contract underneath all of it, so choosing differently later is a change of surface rather than a rebuild. Rung three is the one you bring people in for. An enterprise knowledge graph across resources that were never in Databricks, a billion nodes instead of a scoped cut, and structure as the model input with a GNN or a graph foundation model. Now read the gates between the rungs rather than the rungs themselves, because that is the argument. A climb needs a question of yours that failed on the rung below for a reason you can point at. And rung three is not a failure state — if you already run a graph estate, or somebody has handed you an enterprise-wide semantic mandate, starting there is the right answer and I would say so.',
  bullets: [
    ['Purpose', ['Collapse the whole deck into one climb they can act on, and leave the room able to name the rung they are on today and the rung their questions actually require']],
    ['How to demo live', [
      'Land on rung one and let the detail column establish that this is the same managed stack from the ontology section, not a new idea',
      'Read the gate above it before clicking rung two — the gate is the argument, the rung is only the consequence',
      'On rung two, name the slides each component came from as you go. The point is recognition, not novelty: they have already agreed to every one of these',
      'Then rung three, and say plainly that this is where a partner or SME capacity joins',
      'Close by asking for two answers — the rung they are on and the rung they need. The gap between them is the scope of the next conversation',
    ]],
    ['Key nuance', [
      'Rung two is deliberately the widest rung. If someone asks why it holds six things, the answer is that all six share one edge contract, so they are surfaces over the same asset rather than competing architectures',
      'Agent-generated recursive SQL is the cheapest entry on rung two, and it is worth naming as the thing to try first — it has a real ceiling on genuinely graph-shaped questions, but it costs almost nothing to find that out',
      'Rung one is the only band measured in days because nothing is built. Every other band assumes the edge data still has to be produced and resolved',
      'Entity resolution is reliably the longest pole. When someone pushes back on the two-to-six-week band, that is almost always the variable being underestimated',
      'These are planning ranges for scoping, not quotes or commitments. Keep them framed that way, especially the rung-three band',
      'On rung three the software is rarely the hard part. An enterprise knowledge graph is an organisational adoption program, and a customer who hears otherwise is disappointed by month three',
      'If a client wants a GNN before they have an edge contract or labeled outcomes, sequencing is the conversation to have rather than architecture',
    ]],
    ['Discovery', [
      'Having seen all three, which rung do you believe you are on today, and which one do the questions you care about actually require?',
      'Which specific question would you put forward as the benchmark — the one we would run to prove rung one is or is not enough?',
      'What state is entity resolution in for the entities you would build edges from: solved, partial, or untouched?',
      'Is anything already in flight that puts you on rung three from day one — a graph estate in production, or an enterprise-wide semantic mandate someone owns?',
      'If we scoped a rung-two pilot, who owns the edge contract, who owns the budget, and what would you measure at the end of it?',
      'What would you accept as proof that a rung had run out — a wrong answer, a latency number, or a cost ceiling?',
    ]],
  ],
  transition: 'Transition: "Which rung you are on today and which one your questions need are the two answers to leave with. One rule decides every climb between them, and it is short."'
});
