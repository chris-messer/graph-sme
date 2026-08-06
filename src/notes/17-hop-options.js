NOTES.push({
  title: 'GraphRAG · the ways to build it',
  onscreen: 'The options stacked down the left, simplest first, under two band labels — the ones that are SQL over Delta, and the two that need an engine. Selecting one draws its mechanism on the right, all five answering the same two-hop question, with that option\'s detail rows underneath. Agent traversal is the first card and carries a callback panel to the taxonomy section.',
  say: 'So here are the ways to do it, cheapest at the top. These are not the only ways to build GraphRAG, but they are the ones the field has actually run, and the two band labels down the left are the whole argument: the first three are SQL over the same Delta table you already have, and only the last two are an engine you stand up and operate. Every one of them is drawn against the same question — who supplies the subsidiaries of Delta Holdings, two hops — so what changes on the right is the mechanism and nothing else. Start at the top. Agent traversal. Hand the agent the node and edge tables and it walks them the way a person would — a query, look at what came back, a query for the next hop, following the edges out. I want to be precise, because this is usually described wrongly: the agent issues successive queries rather than authoring one clever query up front, and planning around the other picture is where these builds get mis-scoped. We have already worked this exact ground in the taxonomy section — how the hierarchy was encoded is what decided whether a rollup was one join or a walk, and the room that only had an adjacency list never got there. The same lever applies to these edges. And so does the same ceiling. This raises what an agent can pull out of a graph that lives in a normal database, and it stops well short of a real graph problem: branching walks and cycles turn into round trip after round trip, and one hop into a supernode floods the context with far more than the question needed. Where it does work is a DAG or a tree-shaped taxonomy, which is a real and common shape, just not the one people mean when they say graph. Second, pre-materializing the hops. Generate the five, ten, and fifteen hop tables ahead of time and hand them to Genie with the edge table, so multi-hop becomes a join and the volume is bounded by a table you built on purpose. It goes wrong when depth is genuinely open-ended or the hierarchy keeps being restructured underneath you. Third, text to SPARQL to SQL. Structured graph questions compile deterministically down to SQL, and a reviewer can read the query. Notice we are three options in and no engine has appeared yet. Then the two that need one. Graph in Lakebase Postgres — and the name is literal, because Lakebase is managed Postgres: nodes, edges and embeddings in three tables, pgvector for the seed and a bounded recursive walk for the expansion. There is no Cypher and no property-graph engine under it. And a partner database, where the engines are genuinely good and the cost lands on operations rather than on the traversal — two systems to govern and keep in sync.',
  bullets: [
    ['Purpose', ['Lay out the options that have actually been run and make it obvious that most of them never leave SQL and none of them require a graph database by default']],
    ['Key nuance', [
      'The rail gets harder to build top to bottom deliberately. Agent traversal is first because it is the cheapest thing that works, not because it is the recommendation — the recommendation is the next slide',
      'Do not let this become a claim that there are exactly this many ways to build GraphRAG. These are the patterns with mileage behind them, and someone in the room may well have a sixth',
      'Say agent traversal, not recursive SQL. An agent handed the node and edge tables issues successive queries and follows the edges hop by hop — it will not sit down and write a single recursive query, and describing it that way sets an expectation the build will not meet',
      'Plenty of "we need a graph database" asks were true two years ago and are not now. An agent walking the edge table answers more of them than most teams expect it to',
      'Agent traversal is the option most likely to be oversold, including by us. It is a genuine lift on a tree or a DAG and a genuine dead end on a real graph, and the card says both',
      'The taxonomy callback is on the first card because those slides are a long way back by this point. If they joined late, walk back and show the closure table',
      'Partner engines are not the villain. The honest framing is two governed systems, not bad technology — and Delta stays the system of record either way',
      'The virtualized alternative to the Lakebase option sits in the ontology section, so if they push on "we do not want to materialize anything," that is where to take it',
      'Do not sell the Lakebase option as a graph database. The published pattern is relational plus vector primitives in managed Postgres, and it suits bounded k-hop retrieval next to operational data rather than analytics over the whole network. The diagram says so on purpose',
    ]],
    ['How to demo live', [
      'Read the two band labels down the rail before selecting anything — the SQL-versus-engine split is the takeaway even if they remember nothing else',
      'Read the question once, at the first card, and then stop reading it. It does not change, and the point is that only the mechanism beside it does',
      'While the first card is open, say out loud that the agent walks the tables hop by hop rather than writing one query. The recursive SQL on screen is what it attempts, and the amber markers are what the attempt never bounds',
      'On that card, read the fails-when row before the fits-when row. The point of that option is knowing where it stops',
      'Land on the partner card last, so the Neo4j conversation happens with the other four already on the table',
    ]],
    ['Discovery', [
      'How much retrieved data can your agent actually hold, and what does a traversal returning ten thousand rows do to it today?',
      'Who would own the refresh job for hop tables, and how often does your hierarchy get restructured?',
      'If a graph database is already in the plan, what specifically did the SQL path fail to answer?',
      'Are the traversals you care about tree or DAG shaped, or do they loop back on themselves? That answer decides whether agent traversal is a real option here',
    ]],
  ],
  transition: 'Transition: "So here is where we would actually start."'
});
