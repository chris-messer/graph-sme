NOTES.push({
  title: 'Knowledge graphs · two halves, one graph',
  onscreen: 'Two demarcated stages either side of the graph itself — sources and construction on the left running once at write time, retrieval and answer on the right running on every question, with the graph drawn as the hinge both halves share. Each half says what it decides and which slides cover it.',
  say: 'Hold on the last slide for a second, because I skipped something. I showed you a graph and I never said where it came from. Four documents went in and a set of typed edges came out, and the entire middle of that is a problem in its own right. So here is the shape of it, and it is the frame for the rest of this section. A graph problem is two problems. On the left, building the graph: reading your sources — the documents, and the tables sitting next to them — and getting entities and edges out of them. That runs once, at write time, and it decides what counts as a node, what counts as an edge, and where each one came from. On the right, retrieving from it: at question time, resolving the question to a starting node, walking out, and handing back what the walk reached. In the middle is the graph, and it is the only thing the two halves share. One writes it, the other reads it. The reason to separate them out loud is that almost every conversation about graphs collapses them into one. Somebody says we need a graph database, and what they actually have is a construction problem — nothing has extracted the relationships yet, so there is nothing for any engine to walk. Or the reverse: the edges exist in a warehouse already and the whole ask is retrieval. Which half you are in changes what we build and what it costs. The next slide is the left half, and it is the one this deck has said the least about. Everything after that is the right half.',
  bullets: [
    ['Purpose', ['Name the two halves of a graph problem before pricing either, so the rest of the section reads as construction first and retrieval second rather than as an undifferentiated pile of options']],
    ['Key nuance', [
      'The graph is drawn in the middle on purpose. It is not inside either half — it is the artefact one half produces and the other consumes, and that is why the halves can be built by different teams on different timelines',
      'Construction is a write-time cost and retrieval is a question-time cost. That is the sentence that lets a client reason about which one they can afford',
      'Clients arrive having conflated the two more often than not. "We need a graph database" is a retrieval sentence, and a lot of the time the actual gap is that nothing has extracted the edges yet',
      'The warehouse-tables chip in the sources box is there deliberately. The next slide opens on the case where construction is nearly free because the relationships are already keys',
      'Do not price anything here. This slide is a map, and the two option slides that follow it are where the tradeoffs live',
    ]],
    ['How to demo live', [
      'Point at the graph in the middle before either half and say "this is the thing we drew a minute ago" — the continuity from the last slide is what makes the gap visible',
      'Say "runs once" and "runs on every question" out loud. Those two phrases do more work than either diagram',
      'Ask which half they think they are in before advancing. If they say retrieval and cannot say where the edges come from, they are in the left half and do not know it',
    ]],
    ['Discovery', [
      'Do the relationships you need already exist as keys somewhere, or do they only exist inside documents?',
      'If we built these edges, what would refresh them, and how often would they be wrong before it ran?',
      'Who would own the edge types — the modelling decision about what counts as a relationship at all?',
    ]],
  ],
  transition: 'Transition: "Start on the left, because it is the half nobody has costed. Here are the three ways to get a graph in the first place."'
});
