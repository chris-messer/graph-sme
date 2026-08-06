NOTES.push({
  title: 'Knowledge graphs · governed agent memory',
  onscreen: 'Four rungs ascending from framework session memory to governed graph memory, each with what runs, when it fits, and where it fails. The top rung is dashed and marked as an extension.',
  say: 'We have fixed finding things. This is the other half of the need we opened with — what the agent is allowed to say — and it deserves a real set of options rather than being waved at. Four rungs, and I want to start at the bottom of the credibility ladder rather than the top. Framework session memory is dashed because it is not from our source material, and I include it because a surprising number of agents are actually running on it: the framework keeps a scratchpad or a rolling summary, whatever was said earlier is in context, and nothing is written down anywhere. Fine for a prototype. Nothing survives the session, nothing is governed, and supersession is not even expressible, because there is no store in which one fact could replace another. Second rung is where most clients genuinely are: plain vector RAG, no graph. Embed the corpus, retrieve the nearest chunks, answer. And I want to be precise rather than dismissive here, because this rung is a real option and it is cheap and it already exists. Two honest numbers. On multi-hop ownership questions over a corporate-ownership benchmark, this scored 0.13 mean judged against 0.51 for a typed graph — roughly a fourfold gap. And structurally, a vector index has no way to state that one fact supersedes another. The 2018 and the 2019 record are just two similar passages, so whichever one matches the wording better wins. That is not a tuning problem. There is no chunk size that fixes it. Third rung fixes the first failure. Structure-enriched retrieval extracts a typed graph from the corpus, then embeds retrieval units that carry the verbatim text and its relationship skeleton together — one vector lookup, no traversal at query time, no graph database, and the latency of plain vector search. Two to four weeks. What it does not do is control what may be said: a retired fact that is well connected gets retrieved just as happily as a current one. Which is the fourth rung, and it is the machinery we looked at earlier — the typed graph and compiler layer running those four checks, with supersedes edges so memory updates rather than only appends. Four weeks and up, medium to high, and the evidence is one composed benchmark rather than a track record. Say that plainly. The last thing, at the bottom: three and four are layers, not alternatives. Rung three to fix what is found, rung four when what the agent is permitted to say starts to carry consequences.',
  bullets: [
    ['Purpose', ['Give agent memory a real option set with an honest floor, so the client can see what the cheap option does and does not buy them rather than being told graphs are the answer']],
    ['Key nuance', [
      'The 0.13 versus 0.51 figure is from a corporate-ownership benchmark on multi-hop ownership and coordination questions, and the typed graph achieved it with zero embedding dependency. Quote it as one benchmark, not as a general claim',
      'The structural argument against rung two is stronger than the benchmark and harder to argue with: a vector index cannot express supersession at all. No amount of tuning or re-chunking changes that',
      'Rung one is marked as an extension because the source does not cover it. Do not present it at the same evidentiary level as rungs three and four — it is there to name where the client probably is',
      'Rungs three and four compose as layers and were benchmarked together as a combined stack. Presenting them as a choice would misrepresent the source, and it also loses the sequencing advice, which is the useful part',
      'If a client wants rung four first, the sequencing conversation is the valuable one. Governing what may be said before fixing what is found answers the wrong question first and is a slower path to a visible win',
    ]],
    ['How to demo live', [
      'Ask which rung they think they are on before you walk any of them. Most say two, and then the slide is about them rather than about us',
      'Give rung two a genuinely fair hearing. Landing the two failure modes as structural rather than as a bad implementation is what makes the climb credible',
      'Name the four-weeks-plus on rung four out loud rather than letting them read it. Volunteering the cost is what makes the recommendation trustworthy',
    ]],
    ['Discovery', [
      'What does your agent memory look like today — framework session state, a vector index, or something you have built?',
      'Do you have an evaluation set for the questions it gets wrong? Without one, none of these rungs can be shown to have worked',
      'When the agent asserts something, does anyone need to be able to see why it believed that?',
      'Is there a compliance or audit requirement attached to what the agent says, or is this currently an internal quality concern?',
      'Would fixing what it finds be enough for now, or is what it is permitted to say already the pressing problem?',
    ]],
  ],
  transition: 'Transition: "That closes the retrieval arc. The next needs are about computing over the graph rather than reading from it."'
});
