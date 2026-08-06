NOTES.push({
  title: 'Knowledge graphs · running the algorithms',
  onscreen: 'A shared log-scale edge-count axis with the three engine bands, over three columns giving what runs, when it fits, when it fails, and the tradeoff.',
  say: 'The four families were engine-agnostic on purpose, and this is where the engine gets picked. Look at the axis first, because it is the decision: ten thousand edges on the left, a billion on the right, and three bands. NetworkX covers the left third. That is a serverless notebook, no cluster libraries, no GPU — load the edges, run PageRank or Louvain, write the answer back to Delta, and you are done in days. It stops hard, though. Past a few million edges you are out of one machine and there is no distributed path to grow into, so outgrowing NetworkX means rewriting. SparkGraph is the band that spans almost everything, and the reason is that it tiers its own execution: if the graph fits in driver memory it takes a pure-Python fast path, mid-size gets coarsen-then-solve, and past that it goes fully distributed. Same API throughout. So if nobody in the room can tell you how big this graph ends up, that is the one to reach for. And then cuGraph on the right, which is where you go for very large graphs or when a batch job has a real latency target — Louvain over tens of millions of edges, shortest path across a power network. We have run that one. The cost is honest: GPU cluster time and a second runtime somebody maintains. Now the property at the bottom, which matters more than any of the three bands. Because SparkGraph is pure Python on the driver path, the identical package runs inside a model serving endpoint — and Spark does not exist inside a serving endpoint. Which means an agent can compute PageRank in the middle of a conversation instead of looking up a number that was precomputed last night. That is the difference between graph analytics as a report and graph analytics as something an agent reasons with.',
  bullets: [
    ['Purpose', ['Turn the engine question into a size question, and land the one non-obvious property: SparkGraph is the only option that also runs where Spark does not']],
    ['Key nuance', [
      'No engine wins outright and the overlapping bands say so. If asked to pick, the answer is a question back: how many edges, and does anything need it at query time?',
      'The provenance on the SparkGraph serving-endpoint claim is the SMB fraud-ring sub-agent pattern — a "SparkGraph Analyst" agent computing graph metrics mid-conversation. Field-proven, so it can be said plainly',
      'cuGraph is the optional GPU tier of the Lakehouse KG Starter kit, not a separate build. The kit runs on CPU without it, so the GPU decision can be deferred rather than made up front',
      'The durable pattern survives all three: precompute heavy work to Delta, serve cheap lookups. If a client only remembers one line from this section, that is the one worth having',
      'None of these is a graph database, and it is worth saying out loud here — a room that came in believing graph algorithms require Neo4j has now seen three engines that do not',
    ]],
    ['How to demo live', [
      'Trace the axis left to right with a finger before reading any column. The three bands and their overlaps are the argument',
      'Ask for their edge count before you present a recommendation. If they do not know it, that is the finding, and SparkGraph is the answer to not knowing',
      'Save the serving-endpoint point for last and let it land. It usually reframes what they thought graph analytics could be part of',
    ]],
    ['Discovery', [
      'Roughly how many edges does the graph have today, and what does that look like in a year?',
      'Do the algorithm results need to be fresh at query time, or is a nightly precompute acceptable? This decides more than the engine does',
      'Is there any GPU capacity in the environment now, and who would approve it if not?',
      'Are you already running graph algorithms somewhere — a Python script, a notebook, a partner tool — and what does that cost you to keep alive?',
    ]],
  ],
  transition: 'Transition: "Everything so far assumed the graph fits. The next need is what changes when it does not."'
});
