NOTES.push({
  title: 'Knowledge graphs · two problems, not one',
  onscreen: 'One line naming GraphRAG, then a single frontier canvas driven by two independent control groups — a seed resolver on the left and a walk depth on the right — with a live readout of how much comes back, and the failure mode of each named underneath.',
  say: 'First, the name, because half the room has already heard it and is waiting for us to say it. This is GraphRAG. That is all the word means — using a graph to serve retrieval — and there is no single product or architecture behind it. There are several ways to build one, and what separates them is how they answer the two decisions on this slide. Now the picture. A user asks for everything connected to Delta Holdings. Three entities in the graph match that string, and whatever the walk reaches comes back in full. Those are two decisions, they are independent of each other, and the graph projects I have seen in trouble were treating them as one. Problem one, on the left: which node do we start from. Watch the picture as I move it. Deterministic SQL picks up both written forms of the company we meant — one entity, two surface strings. Switch to vector similarity and a third company arrives, and it is a genuinely different business whose name just sits close in embedding space. Everything hanging off it is now in the answer and none of it belongs there. That is problem one failing. Problem two, on the right, and I want to be precise about what it is, because it is usually described wrongly. The question is not how far we walk. The question is how much comes back and whether the agent can do anything with it. Depth is just the dial. Leave the seed alone and step it. One hop, two hops, and look at the readout in the corner — small, readable, the agent can hold all of it. Three hops and the amber node lights up. That is a shared registered-agent address, an office that thousands of companies use as their registered address. It is a legitimate node, legitimately connected. Take one more hop and everything attached to it comes back with it, and now read the meter: the agent is being handed most of the graph. Every single row of that is true. It is just far more than the question needed, and the model now has to rank it, hold it in context, and reason over it. That is where the answer degrades — not because retrieval was wrong, but because the volume made it unreadable. So read the two failures underneath, because they are not the same kind of problem at all. Get problem one wrong and the answer is silently wrong and nothing in the output looks broken. Get problem two wrong and the answer is completely correct and completely unusable.',
  bullets: [
    ['Purpose', ['Name GraphRAG plainly, then separate the seed axis from the volume axis by putting two independent controls on one picture — this is the frame the rest of the section hangs on']],
    ['Key nuance', [
      'The GraphRAG line is deliberately one sentence and deliberately deflationary. If someone wants to compare named GraphRAG implementations, the next slide is the place for it — do not turn this into a definitions discussion',
      'Problem two is a context problem, not a distance problem. A three-hop walk that returns forty rows is fine; a two-hop walk into a hub that returns forty thousand is not. If you describe it as "how deep do we go" you will get a depth-tuning conversation instead of a retrieval-budget one',
      'The supernode is the concrete version of that. A shared registered-agent address is a real example from the Orbis build, not a hypothetical, and it is why damping supernodes shows up later as a design parameter',
      'The asymmetry between the two failures is the takeaway, not the controls. Wrong seed is a correctness failure that hides; too much volume is a comprehension failure that looks like the model getting worse',
      'If a client has already tried a graph and been disappointed, ask which of these two they were tuning. Very often they were tuning the traversal while the seed resolver was the thing that was wrong',
      'This slide is deliberately not an options slide. Do not start comparing resolvers here — the next slide covers both decisions per option and it is better real estate for it',
    ]],
    ['How to demo live', [
      'Change one control at a time and say which problem you are changing. If you move both at once the independence is lost and the slide does not work',
      'Do the vector-similarity click slowly and let the wrong-company territory light up before you say anything',
      'Step the depth from one to four and read the meter out loud at each stop. The jump between three and four is the argument — that is the supernode emptying itself into the answer',
      'Ask the room which of the two problems they think they have. It is a good qualifying question and the answer routes the next ten minutes',
    ]],
    ['Discovery', [
      'When your users refer to an entity, do they use one canonical identifier, or free text with aliases and abbreviations?',
      'How much context does your agent have left for retrieved data once the system prompt and tools are in, and what happens today when a tool returns more than that?',
      'Do you have hub nodes — shared addresses, shared agents, generic categories — that connect a very large number of records?',
      'If the system resolved to the wrong entity, would anyone notice, and how?',
    ]],
  ],
  transition: 'Transition: "So those are the two decisions. Here are the ways to build the retrieval, and what each one does about both."'
});
