NOTES.push({
  title: 'Knowledge graphs · the same corpus, as a graph',
  onscreen: 'Everything the four documents on the last slide contain, drawn once as nodes and typed edges — the source strip on the left feeding the picture, the two failing questions redrawn as walks in the cards on the right, and Ray Duval still on the canvas, retired rather than removed.',
  say: 'Same four documents. Nothing new was written, nothing was re-indexed, and no retriever got better. All that happened is that the relationships inside those documents were extracted and stored beside them — that is the strip on the left, and the phrase to land is "extracted once, at write time". Now take the two questions again. Question one. Start at Beta Logistics, follow the parent edge to Acme Holdings, follow the led-by edge to Maya Okonjo. Two hops, and notice what never happened: doc A and doc C were never matched against each other. Nothing had to rank next to anything. The join between those two documents was done once, at write time, by whoever built the graph, not at question time by a similarity score. Question two, and this is the one a vector index structurally cannot do. Ray Duval is still there. The 2018 record was not deleted and it was not overwritten. There is an edge from it saying superseded by Maya Okonjo, so the agent does not have to decide which of two true passages it likes better — the graph tells it one of them is retired. And because the old record is still on the canvas, if somebody asks who ran Acme in 2018, that is still answerable and still auditable. That is the whole argument for the section. Both failures came from the same missing thing, and both of them are closed by structure rather than by a better search.',
  bullets: [
    ['Purpose', ['Pay off the previous slide in one picture: the same corpus with its relationships stored, so both failures resolve by traversal — and name GraphRAG as the thing that closes the gap, before the next slide breaks it into its two decisions']],
    ['Key nuance', [
      '"Extracted once, at write time" is the sentence that matters. The cost of a graph moves to ingestion, and in exchange query time stops depending on two documents happening to rank next to each other',
      'The supersession edge is not the same as recency ranking. A newer document winning on a date filter is a heuristic; an edge saying this record replaced that one is a fact the graph can be asked about',
      'Retired, not deleted. Governance-minded rooms will ask what happens to the old value — point at Ray Duval still sitting on the canvas and say a question about 2018 still has an answer',
      'The other edges — Priya Raman as Beta\'s COO, the Austin headquarters — are on the slide deliberately. They show the extraction is of the whole corpus, not a hand-built two-hop path assembled to make the demo work',
      'Do not go into how the edges get extracted here. That is an ingestion conversation and it will swallow the section; the retrieval decisions on the next slide are the more valuable ten minutes',
    ]],
    ['How to demo live', [
      'Open on Both so the room sees the whole extracted graph first, then trace question one and let the two hop badges do the talking',
      'On question two, put a finger on Ray Duval before you click. The point lands when they see the node stay on screen and go grey rather than disappear',
      'Say "no better retriever" out loud at least once. Half the room arrived assuming the answer to both failures was a better embedding model',
    ]],
    ['Discovery', [
      'If you extracted relationships at ingestion, where would that run today — the same pipeline that chunks and embeds, or somewhere new?',
      'When a fact changes, does anything in your system record that it replaced an older one, or does the old version just stop being retrieved?',
      'Who would own the edge types? Deciding that a leadership change is a supersession rather than a second fact is a modelling decision, not an engineering one',
    ]],
  ],
  transition: 'Transition: "So edges are the fix. Building them into a retrieval path is two separate decisions, and conflating them is where these projects go wrong."'
});
