NOTES.push({
  title: 'Problem 2 · retrieving the hops',
  onscreen: 'Five retrieval options, banded into the three that are SQL over Delta and the two that need an engine, over a synced detail panel. The agent generated SQL option carries a callback panel to the taxonomy section.',
  say: 'Problem one is settled, so something has to walk outward from that seed — and this is the part that gets skipped, because everyone assumes the answer is a graph database. Five options, and the band across the top is the whole argument: the first three are SQL over the same Delta table you already have, and only the last two are an engine you stand up and operate. Start on the left. Pre-materializing the hops means generating the five, ten, and fifteen hop tables ahead of time and handing them to Genie with the edge table, so multi-hop becomes a join. Days of work, predictable cost, and it goes wrong when depth is genuinely open-ended or the hierarchy keeps being restructured underneath you. Second option is agent generated SQL, and the mechanism is newer than most people realize: recursive CTEs are native in Databricks SQL and Spark now, so the agent writes the walk itself against the edge table. Pre-generation becomes an optimization for cost predictability rather than a requirement. We have already worked this exact ground in the taxonomy section — how the hierarchy was encoded is what decided whether the model wrote a correct recursive rollup, and the room that only had an adjacency list never wrote one. The same lever applies to these edges. And so does the same ceiling. This raises what an agent can pull out of a graph that lives in a normal database, and it stops well short of a real graph problem: long or branching walks, supernodes and cycles are past what generated SQL gets right, and cost per query is unbounded. Where it does work is a DAG or a tree-shaped taxonomy, which is a real and common shape, just not the one people mean when they say graph. Third, text to SPARQL to SQL. Structured graph questions compile deterministically down to SQL, about a second, and a reviewer can read the query — open-ended questions route to the agentic path instead at thirty to forty-five seconds. Notice we are three options in and no engine has appeared yet. Then the two that need one. A graph engine inside Databricks, where the catch is that model serving has no Spark, so the engine has to carry its own in-memory path. And a partner database, where the engines are genuinely good and the cost lands on operations rather than on the traversal — two systems to govern and keep in sync. One thing I want to be explicit about: the dashed blue box is us extending the pattern, not us reporting one. Maintaining those hop tables in a declarative Lakeflow pipeline is a reasonable idea with a supporting artifact behind it, and it does not have the mileage the other five rows do.',
  bullets: [
    ['Purpose', ['Answer problem two on its own terms, and make it obvious that three of the five options never leave SQL']],
    ['Key nuance', [
      'Recursive CTEs being native is the most out-of-date assumption in these conversations — plenty of "we need a graph database" asks were true two years ago and are not now',
      'Agent generated SQL is the option most likely to be oversold, including by us. It is a genuine lift on a tree or a DAG and a genuine dead end on a real graph, and the card says both. Do not let it become the recommendation by default just because it is cheap',
      'The taxonomy callback is on the card because slides 07 to 10 are a long way back by this point. If the room was in that section, one sentence is enough; if they joined late, walk back to slide 09 and show the closure table',
      'The Lakeflow pipeline framing is our extension and is flagged as such on the slide. spark-r2r is the supporting artifact: R2RML-style transforms inside Spark Declarative Pipelines. Do not present it as field-proven at the same level as the other five',
      'Partner engines are not the villain. The honest framing is two governed systems, not bad technology — and Delta stays the system of record either way',
      'The virtualized alternative to the in-Databricks engine sits in the ontology section, so if they push on "we do not want to materialize anything," that is where to take it',
    ]],
    ['How to demo live', [
      'Read the band across the top before touching any option — the three-versus-two split is the takeaway even if they remember nothing else',
      'Click Agent Generated SQL and say out loud that recursive CTEs are native now, then see who in the room did not know',
      'On the same card, read the fails-when row before the fits-when row. The point of that option is knowing where it stops',
      'Land on the partner column last, so the Neo4j conversation happens with the other four already on the table',
    ]],
    ['Discovery', [
      'What depth do your benchmark traversal questions actually need, and how do you know that number?',
      'Who would own the refresh job for hop tables, and how often does your hierarchy get restructured?',
      'Is there a concurrency or latency figure attached to the traversal requirement, or is that still to be defined?',
      'If a graph database is already in the plan, what specifically did the SQL path fail to answer?',
      'Are the traversals you care about tree or DAG shaped, or do they loop back on themselves? That answer decides whether agent generated SQL is a real option here',
    ]],
  ],
  transition: 'Transition: "So here is where we would actually start."'
});
