NOTES.push({
  title: 'Problem 1 · resolving the seed',
  onscreen: 'Four resolvers across the top with the deterministic one marked as the default, and four criteria as rows: what it resolves to, cost and latency, precision, and where it fails.',
  say: 'Four ways to turn a typed string into a node, and the honest answer is that the boring one wins most of the time. Deterministic SQL first, and I mean genuinely just SQL — normalize the name, allow an edit distance, match against an indexed column. Milliseconds, nothing to build, nothing to refresh, and every match is explainable to a reviewer who asks why those two strings were treated as the same company. It fails on a real alias that shares no characters with the registered name, and the important word there is silently: you get a smaller answer and no error. Vector similarity is the one clients expect us to recommend and it is the one I would push back on hardest as a default. The query is fast; the index is the cost. Embedding tens of millions of company names is a multi-day build and then a standing refresh job forever, and what you buy is better recall on aliases at the price of precision, because close in embedding space is not the same legal entity. That is the failure we watched on the previous slide. LLM-assisted is genuinely strong on the ambiguous tail, because it can read the surrounding context and it can record why it rejected a candidate. The cost is a model call per question and non-determinism — the same question can resolve differently across runs, which makes answers hard to reproduce or cache, and that matters more than people expect once there is an evaluation harness. And user in the loop is the highest precision available, because the person asking knows what they meant, but it is unavailable to exactly the things we are usually building: scheduled jobs and autonomous agents cannot answer a disambiguation prompt. Where that leaves us is the line at the bottom. The embedding step, not the graph, is the bottleneck at scale — so deterministic SQL is the default and the other three are instruments for the ambiguous margin rather than the whole corpus.',
  bullets: [
    ['Purpose', ['Settle problem one with a defensible default, and pre-empt the assumption that entity resolution requires embeddings']],
    ['Key nuance', [
      'The default is marked on the slide because the source is unambiguous about it — the embedding index, not the traversal, is what fails to scale. This is one of the few places in the deck with a clear winner',
      'These are not mutually exclusive. The strongest production pattern is deterministic SQL as the resolver with vector similarity demoted to an optional edge builder on the fuzzy tail',
      'Non-determinism in the LLM row is the underrated objection. If they have an evaluation harness or any caching, raise it before they do',
      'The user-in-the-loop column is worth keeping even though it looks weak, because it is the right answer for a human-facing exploratory tool — and it is the column that exposes whether the real use case has a human in it at all',
    ]],
    ['How to demo live', [
      'Read down the deterministic column first, then jump to its Fails row. Leading with the limitation buys credibility for the recommendation',
      'On the vector column, separate query cost from index cost explicitly — clients conflate them and that conflation is why they think this is cheap',
      'If they are already committed to embeddings, do not fight it. Ask what the refresh job looks like and let the answer make the point',
    ]],
    ['Discovery', [
      'Do you have a canonical entity table with the alias forms in it, or is resolution happening ad hoc in each application?',
      'Is there an existing entity-resolution or master-data process we would be feeding off rather than replacing?',
      'Does an incorrect resolution have a compliance consequence, or is it a quality-of-life issue?',
      'Do the questions arrive from people, from scheduled jobs, or from agents? That decides whether the fourth column is even available to you',
    ]],
  ],
  transition: 'Transition: "Seed resolved. Now problem two — walking outward from it."'
});
