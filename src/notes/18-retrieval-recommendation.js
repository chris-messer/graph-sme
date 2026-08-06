NOTES.push({
  title: 'Knowledge graphs · where we land on retrieval',
  onscreen: 'Three steps left to right — agent traversal, Lakebase-native, partner database — each headed by where it sits in the progression, with a line along the floor saying what earns that step.',
  say: 'Here is the recommendation, and it is three steps rather than a menu. Start on the left: hand the Genie agents the node and edge tables and let the agent do the walk. It queries, reads what came back, follows the next edge, and goes again. Nothing to stand up, nothing new to govern, and I want to be blunt that this step answers more retrieval asks than most teams expect it to, which is why it gets a lane of its own rather than being treated as a stepping stone to something better. Step two is Lakebase-native. Text to SPARQL to SQL, or a Postgres graph extension running over Lakebase — real graph semantics and deterministic answers a reviewer can read, still over the same edges, and still nothing to buy. Step three is a partner graph database, Neo4j or one of its neighbours. Those engines are genuinely good; the cost lands on operations, because you are now running and governing two systems and keeping them in sync. And then the rule along the floor of all three, which is the actual argument of the slide: you do not move up because the next step sounds better, you move up because a benchmark query failed on the step you are standing on — came back wrong, or came back too slowly. If nothing has failed, we would be selling you complexity, and I would rather say that here than after it is built. Whichever step you are on, nothing about the edge contract changes, so climbing later is a change of serving path rather than a rebuild.',
  bullets: [
    ['Purpose', ['Give them a default they can start on today and a checkable reason for every step up, so the graph-database decision stops being a matter of taste']],
    ['Key nuance', [
      'Agent traversal means successive queries, not one clever query. The agent issues a query, looks at the edges that came back, and issues the next one — do not describe it as something the model writes in a single shot, because that is not what it will do',
      'The left step is the recommendation, not the consolation prize. This slide deliberately echoes the ladder from early in the deck, and if they take one operating rule away from the section it should be that a step up needs a failing query behind it',
      'Step two is still inside the platform. If someone hears SPARQL and assumes a triple store, say plainly that it compiles down to SQL over the same edges',
      'Partner engines are not the villain. The honest framing is two governed systems, not bad technology — and Delta stays the system of record either way',
      'Nothing between the three steps changes the edge contract, so a climb later is not a rebuild. That is the argument for standardizing on the edge table early',
      'The supernode point is the one that bites in production. It is not on the slide any more, but it is worth asking whether they know where their hubs are before they commit to a walk, because that is what decides how much comes back',
    ]],
    ['Discovery', [
      'What would you accept as proof that agent traversal had run out — a latency number, a wrong answer, a cost ceiling?',
      'Who signs off on adding a second system to govern, and what does that approval path look like?',
      'Is Lakebase already in play for you, or would the middle step be a new thing to introduce?',
      'If we started with agent traversal, what would you measure at the end of it to decide whether to step up?',
    ]],
  ],
  transition: 'Transition: "That settles retrieval. The other thing clients ask a graph for is not a lookup at all — it is a computation over the whole network."'
});
