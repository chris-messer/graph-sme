NOTES.push({
  title: 'Vocabulary · network and table',
  onscreen: 'Linked dual view: force network beside the edge table, hop controls, clickable rows and nodes.',
  say: 'A graph is two sets — entities and relationships. Degree is how busy a node is. A hop is one edge, and traversal is walking a path. Now the part that carries this entire briefing: the same information is sitting in the table on the right. Subject, predicate, object. Nothing about that requires a new database. When you hear "we need a graph database," what is usually being described is a multi-hop query, and a multi-hop query is a join you have not written yet.',
  bullets: [
    ['Purpose', ['Demystify the vocabulary and plant the edge-table idea before the ladder']],
    ['How to demo live', [
      'Start on Both. Step hops 1, 2, 3 and watch the hop column in the table change with the network',
      'Click a table row — the matching edge lights up in the network',
      'Click a node to reseed, then drag it to show the layout is cosmetic and the data is not',
      'Switch to Table only and say: this is what actually ships',
    ]],
    ['Discovery', [
      'Which business questions are two hops or deeper today, and where do they break?',
      'Are those answered in BI, in ad-hoc SQL, or genuinely not at all?',
    ]],
  ],
  transition: 'Transition: "So where does every engagement actually start?"'
});
