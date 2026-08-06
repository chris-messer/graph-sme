NOTES.push({
  title: 'Knowledge graphs · what the agent cannot do',
  onscreen: 'The indexed corpus as a list of four documents, the selected one opened as a page of paper beside it, and to the right two questions stacked — each with the evidence that came back and the wrong answer the agent gave.',
  say: 'Four documents, all already indexed. Let me open them, because the argument collapses if you think this is a coverage problem. The 10-K says Acme acquired Beta Logistics and holds it as a subsidiary. The Beta press release names Beta\'s own Chief Operating Officer. The 2019 leadership page says Maya Okonjo is Chief Executive of Acme. And the 2018 annual report says Ray Duval was. Every fact both questions need is on this slide. Question one. Who leads the parent company of Beta Logistics? The retriever returns the Beta press release, because that is the document that looks most like the question, and the press release names Beta\'s own COO. Nothing that came back even mentions that Beta has a parent, so the agent answered the question it could see rather than the one it was asked — and notice the 10-K holding the ownership link was never retrieved, because it reads nothing like the question. Question two, and this is the one people underestimate. Who leads Acme Holdings? The 2018 report comes back top and says Ray Duval. The 2019 page, which is correct, ranks below it. Both of those passages are true. Neither is wrong on its own. The 2018 report was accurate when it was written. What is missing is anywhere in the index recording that the 2019 appointment replaced the 2018 one, so the agent has no basis to prefer the newer document and asserts a retired executive with total confidence. Now put the two together, because this is the whole argument for the section. In both cases the agent holds every fact it needs and none of the relationships between them — that Beta sits underneath Acme, and that one leadership record supersedes another. Same missing thing, twice.',
  bullets: [
    ['Purpose', ['Establish one need rather than three, by showing two different-looking failures that share a single cause: the facts are stored and the relationships between them are not']],
    ['Key nuance', [
      'The second question is the one that lands hardest with an engineering audience, because both passages are true. There is no bad data to point at and no extraction bug to fix — the index simply cannot express supersession',
      'Do not say "GraphRAG" yet, and do not draw the edges. The room should arrive at wanting structure before it is named, and the next slide is built to do exactly that',
      'This slide replaces what used to be several separate need slides — traversal, retrieval, and agent memory. If someone who has seen an older version asks, that consolidation was deliberate: they are one need with two sub-problems',
      'The first question is the cross-document composition failure and the second is the temporal half. Enumeration — "list everything about X" — is a third shape worth having ready if they push for another example',
    ]],
    ['How to demo live', [
      'Click through all four documents before touching either question, so the room accepts that every needed fact is genuinely present',
      'On doc D, read the highlighted sentence out loud and then say "that was true" — the pause is what makes the second failure land',
      'End on the line at the bottom and stop there. Do not answer it; the next slide is the answer',
    ]],
    ['Discovery', [
      'When your agent gets something wrong, is it usually missing a fact, or combining two facts it should not have combined?',
      'Has anyone caught it asserting something that used to be true? How did you find out — a user complaint, or an evaluation?',
      'How do corrections reach the agent today? Is there any path other than re-indexing the corpus?',
      'Are there questions your users have stopped asking it because they learned it gets them wrong?',
    ]],
  ],
  transition: 'Transition: "Every fact is there and none of the relationships are. So store the relationships."'
});
