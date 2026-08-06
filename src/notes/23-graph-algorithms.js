NOTES.push({
  title: 'Knowledge graphs · algorithms',
  onscreen: 'The same network rendered four ways as small multiples, with a detail line that swaps as each family is selected.',
  say: 'One network, read four ways, and almost every algorithm request a client brings is one of these four. Who matters — centrality, and node size here is influence, which is a property of position rather than of any column on the row. Who clusters together — community detection. How does one entity reach another — pathfinding, where the highlighted route is the entire answer. And who looks alike — similarity, where those two candidates resemble each other because they share neighbors, not because their columns match. Naming the family is most of the qualification, because the family plus the size is the whole scoping conversation. And I want to be precise about what is not on this slide: none of these four depends on how the computation is run, and none of them requires a graph database. They are all reading an edge table. Which engine executes them is a scale decision rather than an architecture decision, and it is the next slide.',
  bullets: [
    ['Purpose', ['Separate an algorithm requirement from a graph-database requirement, and put the compute choice on a scale axis instead of an architecture debate']],
    ['Key nuance', [
      'Naive connected components percolates on real data — a third of the graph can collapse into one component. Corroboration first, then a community-detection split, is what makes clustering usable at scale',
      'Resist naming an engine on this slide even if asked directly. The engines are the next slide and they have their own tradeoffs; answering early collapses two conversations into one',
    ]],
    ['How to demo live', [
      'All four panels render at once, so point rather than click — the four families should land as one picture',
      'Click each cell to pull its detail line up, and hold on Pathfinding and Similarity where the highlight does the work',
      'Ask which of the four they came in for. If the answer is more than two, the real requirement is probably exploration rather than a specific algorithm',
    ]],
    ['Discovery', [
      'Which of these four families appears in your benchmark queries, or is the real ask exploration and agent context rather than an algorithm?',
      'Roughly how many nodes and how many edges, and how many of those edges change on a given day?',
      'Do algorithm results need to refresh hourly, daily, or weekly?',
      'Does an agent need to compute a graph metric during a conversation, or is a precomputed table enough?',
    ]],
  ],
  transition: 'Transition: "So what actually runs them, and how big does the graph have to get before the answer changes."'
});
