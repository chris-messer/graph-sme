NOTES.push({
  title: 'Knowledge graphs · where we land on both problems',
  onscreen: 'Three lanes — start here, climb when, only past this line — over two design parameters that hold in every lane.',
  say: 'Start with hop tables and recursive CTEs over one edge table, served through Genie. Days to two weeks, and I want to be blunt that this lane answers more traversal asks than most teams expect it to, which is why we spend a slide on it rather than treating it as a stepping stone to something better. You climb to the middle lane when your own benchmark questions are structured and graph-shaped and somebody needs the answer to be deterministic and auditable. That is text to SPARQL to SQL, and it is still not an engine — the SPARQL compiles down to SQL against the same edges. Then the line on the right. A graph engine or a partner database is justified by a benchmark query that has actually failed, plus one of three conditions: graph applications already in production, real Cypher or SPARQL depth on staff, or a genuine sub-second traversal requirement at high concurrency. If none of those three is true and no benchmark has failed, we would be selling you complexity, and I would rather say that here than six weeks in. Two parameters hold in every lane. Model serving endpoints have no Spark, so anything served that way needs its own in-memory execution path and the heavy work is precomputed to Delta and served as a lookup. And the second one is the frame we have been using for the last three slides: the seed and the depth are separate budgets. Problem one decides whether the answer is right, problem two decides what it costs, and if you do not damp the supernodes then one shared registered-agent address ends up pricing every traversal on the platform.',
  bullets: [
    ['Purpose', ['Give them a defensible default and a named, checkable condition for every climb, so the graph-database decision stops being a matter of taste']],
    ['Key nuance', [
      'The three conditions on the right-hand lane are not ours — existing graph applications, staff expertise, or sub-second at concurrency. If a customer honestly meets one, the partner path is the right recommendation and we should say so plainly',
      'This slide deliberately echoes the ladder from early in the deck. If they take one operating rule away from the section, it should be that a climb needs a failing query behind it',
      'The supernode point is the one that bites in production. Worth asking whether they know where their hubs are before they commit to a depth',
      'Nothing in the middle or right lane changes the edge contract, so a climb later is not a rebuild — that is the argument for standardizing on the edge table early',
    ]],
    ['Discovery', [
      'What would you accept as proof that the simpler path had run out — a latency number, a wrong answer, a cost ceiling?',
      'Who signs off on adding a second system to govern, and what does that approval path look like?',
      'Which of the three engine conditions applies to you today, if any?',
      'If we started on hop tables in Genie next month, what would you measure at the end of it to decide whether to climb?',
    ]],
  ],
  transition: 'Transition: "That is what is found and what it costs. The other half of the need was what the agent is allowed to say."'
});
