NOTES.push({
  title: 'Taxonomy · the recommendation',
  onscreen: 'Two worked queries, each written as a recursive CTE over adjacency and as a join over closure plus segments, with a measured/cost footnote strip.',
  say: 'Our recommendation is two tables: a closure table for anything that walks the tree, and a segment table for the rules that do not. Take the category question first. On the left, an adjacency list needs a recursive CTE — a seed, a union all, a self-join, and only then the sum. That is correct when it is written correctly, and in our benchmark the adjacency room never once wrote it. On the right, the walk already happened at write time, so everything under Electronics is one equality on ancestor_name. Now switch tabs. The segment question is the interesting one, because the left side has nowhere to put the definition — Strategic Assortment is not a node, so the rule has to travel inside the question every single time. On the right it is a join, and the definition is owned once by whoever owns the segment table. Same shape as the rollup. And I want to be straight about the cost: a closure table is more rows and it has to be maintained whenever the hierarchy is restructured. That trade is worth pricing out loud rather than assuming.',
  bullets: [
    ['Purpose', ['Land closure plus segments as the recommendation, with the cost of it stated in the same breath']],
    ['How to demo live', [
      'Start on the category tab and read the left pane top to bottom so the room hears how many clauses have to be right',
      'Then read the right pane — three lines — and note the only thing that changes for Laptops or All Products is the literal',
      'Press "show the rows this join reads" and tie the ancestor and descendant ids back to the numbered diagram they just saw',
      'Switch to the segment tab and ask where the definition of Strategic Assortment lives on the left. It lives in the prompt',
      'Close on the cost column so the recommendation does not sound free',
    ]],
    ['Key nuance', [
      'Frame the numbers as a controlled benchmark on a small retail hierarchy, not a throughput guarantee. The durable finding is the query shape, not the latency',
      'The sharpest measured result: across seven questions the adjacency room produced zero recursive CTEs despite a worked recursive example sitting in its instructions',
      'Inlining a definition into the question does fix it for flattened, path and closure — but only for the person who already knows the definition. Materializing the set is what makes it reusable',
      'Closure is not the only defensible answer. Materialized path scored the same accuracy and reads well; it just rewrites every descendant row on a rename',
    ]],
    ['Discovery', [
      'How often does the hierarchy change, and is it an edit, a reorganisation, or a full rebuild?',
      'Roughly how many nodes and how many leaves, so we can size what a closure table would actually hold?',
      'If we materialised your named business sets, who would own each definition and approve a change?',
      'Which named sets would make the first list, and how many of them cut across branches?',
      'What would have to be true for you to add a table to the Genie-facing model rather than adding instruction text?',
    ]],
  ],
  transition: 'Transition: "That is taxonomy. Ontology is a different question entirely — it is about meaning."'
});
