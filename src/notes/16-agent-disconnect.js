NOTES.push({
  title: 'Knowledge graphs · what the agent cannot do',
  onscreen: 'One indexed corpus of four documents, then two question lanes side by side, both answered wrong, with the retrieved evidence marked in each.',
  say: 'Four documents, all already indexed, and between them they contain every fact needed to answer both questions below correctly. Two questions, two wrong answers. Left lane. Who leads the parent company of Beta Logistics? The retriever returns the Beta press release, because that is the document that looks most like the question, and the press release names Beta\'s own Chief Operating Officer. Nothing in what came back even mentioned that Beta has a parent, so the agent answered the question it could see rather than the one it was asked. Note what did not happen: the 10-K holding the ownership link was never retrieved, because it reads nothing like the question. Right lane, and this is the one people underestimate. Who leads Acme Holdings? The 2018 annual report comes back top, and it says Ray Duval. The 2019 leadership page, which is correct, ranks below it. And here is the part that matters — both of those passages are true statements. Neither one is wrong on its own. The 2018 report was accurate when it was written. What is missing is anywhere in the index that records that the 2019 appointment replaced the 2018 one. So the agent has no basis on which to prefer the newer document, and it asserts a retired executive with total confidence. Now put those two lanes together, because this is the whole argument for the section. In both cases the agent holds every fact it needs and none of the relationships between them — that Beta sits underneath Acme, and that one leadership record supersedes another. Same missing thing, twice. That is why I would not treat these as two separate requirements, and it is why almost every graph conversation I have starts as a search problem and turns out to be a memory problem.',
  bullets: [
    ['Purpose', ['Establish one need rather than three, by showing two different-looking failures that share a single cause: the facts are stored and the relationships between them are not']],
    ['Key nuance', [
      'The right lane is the one that lands hardest with an engineering audience, because both passages are true. There is no bad data to point at and no extraction bug to fix — the index simply cannot express supersession',
      'Do not say "GraphRAG" on this slide. The room should arrive at wanting structure before it hears a product category, and naming one here invites a bake-off conversation two slides early',
      'This slide replaces what used to be three separate need slides — traversal, retrieval, and agent memory. If someone who has seen an older version of this deck asks, that consolidation was deliberate: they are one need with two sub-problems',
      'The left lane is the doc\'s cross-document composition failure and the right lane is the temporal half. The doc also names enumeration ("list everything about X") as a third shape — worth having ready if they push for another example',
    ]],
    ['How to demo live', [
      'Click through all four documents before touching either lane, so the room accepts that every needed fact is genuinely present. The argument collapses if they think this is a data-coverage problem',
      'On document D, read the sentence out loud and then say "that was true" — the pause is what makes the second failure land',
      'End on the line at the bottom. If they nod at "memory problem rather than a search problem," the rest of the section is downhill',
    ]],
    ['Discovery', [
      'When your agent gets something wrong, is it usually missing a fact, or combining two facts it should not have combined?',
      'Has anyone caught it asserting something that used to be true? How did you find out — a user complaint, or an evaluation?',
      'How do corrections reach the agent today? Is there any path other than re-indexing the corpus?',
      'Are there questions your users have stopped asking it because they learned it gets them wrong?',
    ]],
  ],
  transition: 'Transition: "So what would have to be stored for both of those to come out right."'
});
