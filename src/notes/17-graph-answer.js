NOTES.push({
  title: 'Knowledge graphs · what the structure adds',
  onscreen: 'A three-record ledger with an as-of toggle and the four governance checks, over both of the previous slide\'s questions answered correctly.',
  say: 'A graph adds exactly two things here, and neither of them is a database. The first is a typed edge that says which fact relates to which — Beta Logistics, parent, Acme Holdings. That is what fixes the left lane, and look at the bottom left: the two documents never had to be matched against each other at all. The edge between them was extracted once, at write time, so at question time there is nothing to figure out. The second thing is a supersedes edge, and this is the toggle. Same three records, read at two points in time. As of today, the 2018 record is struck through and retired, the 2019 record is live, and the agent answers Maya Okonjo. Now move the clock back to 2018. The same store now says Ray Duval is current and the 2019 record has not been recorded yet — so an auditor asking what was true in 2018 gets Ray Duval, correctly. That is the distinction worth holding onto: the old fact is not deleted and it is not repeated. It is retired, and it is still there. Third row on both settings is blocked, and it is blocked for a different reason entirely — it came off an unapproved forum thread and no citable source states it, so it never reaches the agent at either point in time. Which brings in the right-hand column. Four checks run before anything is exposed. Lifecycle is the one we just watched. Scope asks whether this was recorded for the context being asked about or borrowed from another client or region. Authorization reads the same Unity Catalog permissions as every other asset, so this is not a parallel permission system. And source grounding is the one I would emphasize with a security-minded room: vector search is a candidate generator here, never the authority.',
  bullets: [
    ['Purpose', ['Show the mechanism — a typed edge and a supersedes edge — and prove it by answering both of the previous slide\'s failures without introducing a graph database']],
    ['Key nuance', [
      'The as-of toggle is the most valuable interaction in the section. Retiring rather than deleting is what makes this auditable, and it is the thing a vector index structurally cannot do',
      'Authorization reading Unity Catalog is worth stating plainly. Clients assume agent memory means a new permission model to review, and it does not',
      'This slide is the mechanism, not the plan. Resist being pulled into what it costs — the option set and the sizing are four slides away, and rung four on that slide is the honest four-weeks-plus',
      'The blocked row demonstrates source grounding independently of time. It stays blocked at both settings, which is the tell that it is a different gate doing the work',
    ]],
    ['How to demo live', [
      'Toggle to 2018 and back at least twice. The strike-through moving is what makes supersession concrete, and one pass is not enough for it to register',
      'Point at the blocked row and ask what they would want an agent to do with a fact from an unapproved source. It usually opens the governance conversation for you',
      'Read the two paths at the bottom last, and say the phrase "extracted once, at write time" — it is the seed of the recommendation later in the section',
    ]],
    ['Discovery', [
      'When a fact changes in your business, what is the system of record for that change, and does anything downstream get told?',
      'Would you need to answer questions as of a past date — for an audit, a dispute, or a regulator?',
      'Are there sources your agent can read today that you would not want it to assert from?',
      'Who decides what your agent is allowed to state as fact, and is that written down anywhere?',
    ]],
  ],
  transition: 'Transition: "That is the mechanism. Building it is two separate problems, and conflating them is where these projects go wrong."'
});
