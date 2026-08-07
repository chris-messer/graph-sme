NOTES.push({
  title: 'Knowledge graphs · algorithms',
  onscreen: 'One network on the left and the four algorithm families stacked on the right, selectable. Picking one rearranges and recolours the same graph into what that algorithm computes, and the panel under the cards swaps to what the family is for and the questions it answers.',
  say: 'One network, read four ways, and almost every algorithm request a client brings is one of these four. Who matters — centrality, and watch the graph: the influential nodes pull into the middle and grow, because influence here is a property of position rather than of any column on the row. Who clusters together — community detection, and the same nodes fall apart into three groups the edges make, with the bridges between them the long dark links. How does one entity reach another — pathfinding, where the network straightens into a five-hop route and the route is the entire answer. And who looks alike — similarity, where those two candidates come together around the neighbours they share, and they resemble each other despite never touching. Naming the family is most of the qualification, because the family plus the size is the whole scoping conversation. And I want to be precise about what is not on this slide: none of these four depends on how the computation is run, and none of them requires a graph database. They are all reading an edge table. Which engine executes them is a scale decision rather than an architecture decision, and it is the next slide.',
  bullets: [
    ['Purpose', ['Separate an algorithm requirement from a graph-database requirement, and put the compute choice on a scale axis instead of an architecture debate']],
    ['Key nuance', [
      'It is the same graph in all four states — same nodes, same edges, nothing added between clicks. Say so out loud, because the rearrangement is dramatic enough that people assume they are looking at four different networks',
      'Naive connected components percolates on real data — a third of the graph can collapse into one component. Corroboration first, then a community-detection split, is what makes clustering usable at scale',
      'Resist naming an engine on this slide even if asked directly. The engines are the next slide and they have their own tradeoffs; answering early collapses two conversations into one',
    ]],
    ['How to demo live', [
      'Click all four in order and pause on each while the graph settles — the movement is the argument, so do not talk over it',
      'On centrality, point at the middle: distance from centre is the ranking. On community, point at the two long links between the groups, which is where the bridges live',
      'Pathfinding and similarity are where the picture does the most work. Hold on pathfinding long enough to count the hop badges, and on similarity long enough for someone to notice the two candidates have no edge between them',
      'Read a question out of the panel rather than the use case if the room is quiet — a question they recognise is what gets them talking',
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
