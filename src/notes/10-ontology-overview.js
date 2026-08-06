NOTES.push({
  title: 'Ontology overview',
  onscreen: 'Section opener — same oat canvas as the content slides, oversized headline under a full-bleed coral rule. Two-plane diagram that lights up when you switch the agent from tables-only to tables-plus-ontology, beside the answer each version produces.',
  say: 'The most useful thing to understand about an ontology is that it is metadata. Look at the dashed line. Above it: entity types, relationship types, certified definitions. Below it: your rows, which never move — the meaning layer only describes them. Right now the agent is on tables only, so the top plane is barely there, and you can see what that costs on the right. Four candidate churn tables and it picks one. A status column it has to guess the meaning of. The word enterprise with no definition to apply. Watch what happens when I switch it on. Same rows, same warehouse, nothing migrated — but now there is a certified metric for churn, a scored authoritative source, and a governed definition of enterprise. The agent resolves meaning first and writes SQL second. That difference is the entire value of an ontology, and none of it required building a graph.',
  bullets: [
    ['Purpose', ['Land ontology as metadata, and make the payoff visible as a difference in answer quality rather than a definition on a slide']],
    ['How to demo live', [
      'Start on Tables only and let the greyed-out top plane sit there for a beat before saying anything',
      'Read the three amber guesses out loud — they are the failure modes the customer already recognises',
      'Switch to Tables + ontology and trace the coral path with the cursor: metric to entity to authoritative table',
      'Point out that the bottom row of tables is identical in both states — nothing moved',
    ]],
    ['Key nuance', ['If someone asks whether this is just a semantic layer by another name: yes, largely, with the difference that an ontology also carries relationship types and provenance, and it is built for an agent to read rather than a BI tool']],
    ['Discovery', [
      'How many places does a definition like active customer or enterprise account live today?',
      'When two dashboards disagree on a number, who resolves it and how long does that take?',
      'Which entities matter most to you — the three or four nouns that show up in almost every question?',
      'Which certified metrics already exist over those entities, and who signed off on them?',
      'When you say ontology, are you asking for reasoning over what your assets mean, or for relationships between individual records?',
    ]],
  ],
  transition: 'Transition: "So that is the idea. Now the two asks clients actually bring us, starting with the one we hear most."'
});
