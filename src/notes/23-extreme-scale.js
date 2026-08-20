NOTES.push({
  title: 'Knowledge graphs · extreme scale',
  onscreen: 'A log-scaled rail from one million to 1.45 billion edges, with the query-time share of the work shrinking as you step right.',
  say: 'Step across this rail and watch the bar underneath, because that bar is the whole slide. The algorithms do not change as you move right. What changes is how much is still allowed to run when the question arrives. At notebook scale everything can — load the edges, run the algorithm, write the results back. By the third tick almost nothing does: a batch factory writes typed, hub-damped edges and the analytics tables, and serving does cheap instant lookups. Notice the rail is log-scaled, so the distance between sixty-two million and one and a half billion is honest rather than flattened. This was built on a corporate-ownership source of six hundred thirty-five million companies and one and a half billion ownership and linkage edges, scoped down to about nineteen million nodes and sixty-two million edges. Then two lessons that cost real time to learn. Connectivity is not coordination — naive connected components percolates, so require corroboration, split the residual chains with community detection, and rank clusters by cohesion. And the second one is the most transferable decision in the whole build: the scoping cut is a parameter, so widening it later is a configuration change rather than a rewrite. That is also where the constraint from the traversal slide comes back — at this size the vector index is the part that does not fit. The typed-graph engine itself scaled fine.',
  bullets: [
    ['Purpose', ['Show that extreme scale is an architecture inversion rather than a bigger cluster, and that the scoping cut is the decision worth stealing']],
    ['Key nuance', [
      'Model serving endpoints have no Spark, so anything served that way needs a pure-Python execution path. That constraint, more than graph size, usually decides the serving design',
      'The proportion bar is a schematic of what runs when, not a measured split. Do not let it get read as a benchmark',
    ]],
    ['How to demo live', [
      'Click all four ticks and let the proportion bar do the talking before you read the panel',
      'Read "what breaks first" at each tick — that is the useful column in a discovery conversation',
      'Point at the gap between the third and fourth ticks and note the rail is log-scaled',
    ]],
    ['Discovery', [
      'What is the honest size of the entity and edge estate, and how much of it do your questions actually touch?',
      'Are there natural scoping boundaries — region, business unit, legal entity?',
      'What traversal latency and what concurrency does production need, and is a dashboard, an app, or an agent asking?',
      'How much of the edge set changes daily, and does the analytics refresh have to keep pace with it?',
    ]],
  ],
  transition: 'Transition: "Last need on the list, and the heaviest."'
});
