NOTES.push({
  title: 'Knowledge graphs · two problems, not one',
  onscreen: 'A single frontier canvas driven by two independent control groups — a seed resolver on the left and a hop depth on the right — with the failure mode of each named underneath.',
  say: 'This is the slide I would keep if I could only keep one from this section. A user asks for everything connected to Delta Holdings. Three entities in the graph match that string, and the answer is however far out you decide to walk. Those are two decisions, they are independent of each other, and almost every graph project I have seen in trouble was treating them as one. Problem one, on the left: which node do we start from. Watch the picture as I move it. Deterministic SQL picks up both written forms of the company we meant — one entity, two surface strings. Switch to vector similarity and a third company arrives, and it is a genuinely different business whose name just sits close in embedding space. Everything hanging off it is now in the answer and none of it belongs there. That is problem one failing. Problem two, on the right: how far out do we walk. Leave the seed alone and step the depth. One hop, two hops, still fine. Three hops and the amber node lights up — that is a shared registered-agent address, an office that thousands of companies use as their registered address. It is a legitimate node and it is legitimately connected, and the moment it enters the frontier everything attached to it arrives too. Now read the two failure modes underneath, because they are not the same kind of problem at all. Get problem one wrong and the answer is wrong at every depth, silently, and nothing in the output looks broken. Get problem two wrong and the answer is completely correct and completely unaffordable. Different failures, different fixes, different option sets. That is why the next two slides are separate.',
  bullets: [
    ['Purpose', ['Separate the seed axis from the hop axis, and make it physical by putting two independent controls on one picture — this is the frame the rest of the section hangs on']],
    ['Key nuance', [
      'The supernode is the concrete version of the depth argument. A shared registered-agent address is a real example from the Orbis build, not a hypothetical, and it is why damping supernodes shows up later as a design parameter',
      'The asymmetry between the two failures is the takeaway, not the controls. Wrong seed is a correctness failure that hides; too much depth is a cost failure that announces itself in the bill',
      'If a client has already tried a graph and been disappointed, ask which of these two they were tuning. Very often they were tuning the traversal while the seed resolver was the thing that was wrong',
      'This slide is deliberately not an options slide. Do not start comparing resolvers here — the matrix is next and it is better real estate for it',
    ]],
    ['How to demo live', [
      'Change one control at a time and say which problem you are changing. If you move both at once the independence is lost and the slide does not work',
      'Do the vector-similarity click slowly and let the wrong-company territory light up before you say anything',
      'Step the depth to 3 and stop on the supernode. The callout counts the nodes returned, so read the number out loud — the jump is the argument',
      'Ask the room which of the two problems they think they have. It is a good qualifying question and the answer routes the next ten minutes',
    ]],
    ['Discovery', [
      'When your users refer to an entity, do they use one canonical identifier, or free text with aliases and abbreviations?',
      'How many hops do your actual benchmark questions need, and how do you know that number?',
      'Do you have hub nodes — shared addresses, shared agents, generic categories — that connect a very large number of records?',
      'If the system resolved to the wrong entity, would anyone notice, and how?',
    ]],
  ],
  transition: 'Transition: "Problem one first, because if this one is wrong nothing after it can be right."'
});
