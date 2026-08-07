NOTES.push({
  title: 'Knowledge graphs · GNNs',
  onscreen: 'Two accounts with near-identical feature rows, one dense and one bridging, with layer-one and layer-two aggregation drawn on the graph.',
  say: 'Two accounts. Tenure four years, eighteen thousand in volume over ninety days, same region, three products, no disputes. For any practical purpose the rows are identical, and a model reading only those columns scores them the same — not because it is a bad model, but because there is nothing in front of it to separate them. Now look at where they sit. Account A is inside one dense group where everything it touches already touches everything else. Account B is the only path between two groups that otherwise never meet. Remove A and nothing changes about who can reach whom. Remove B and those two groups have no route to each other at all. A model that aggregates over neighbors separates them cleanly, and the only new information it received is structural. That is the test for whether you reach for a graph neural network: not whether you have a graph, but whether the thing that distinguishes your records is their position in it. The aggregation is what the arrows show — layer one pulls from direct neighbors, layer two from neighbors of neighbors, so after two layers a node encodes the shape of its neighborhood rather than just its own values. So the test for reaching for a graph neural network is not whether you have a graph. It is whether the thing distinguishing your records is their position in it. Hold the cost question for one more slide — this is the most expensive capability in the deck and there are three quite different ways to buy it.',
  bullets: [
    ['Purpose', ['Give them a concrete test for when structure is worth modelling at all, before the next slide prices the three ways to do it']],
    ['Key nuance', [
      'The scores on this slide are illustrative. They show the shape of the result, not a benchmark',
      'Do not price anything here. Every option on the next slide is high complexity except the one we flag as an extension, and leading with cost on this slide undercuts the evidence before it lands',
      'If a client wants a GNN before they have an edge contract or labeled outcomes, sequencing is the conversation to have rather than architecture. This slide is the argument that structure is signal; it is not permission to start',
    ]],
    ['How to demo live', [
      'Read the feature table across and say "identical" before you touch the graph',
      'Toggle Account A and Account B and let the two-hop count in the callout land — the number changes and the story changes with it',
      'Trace one arrow chain inward to name message passing, then stop. If someone asks what it costs, that is the cue to advance',
    ]],
    ['Discovery', [
      'Is there a prediction where you believe the network structure carries signal your feature columns miss?',
      'Do you have labeled outcomes to train against, and roughly how many?',
      'Would graph features fed into the model you already run be enough before a full GNN?',
      'Do you have ML engineering capacity for this, or is it exploratory at this stage?',
    ]],
  ],
  transition: 'Transition: "Three ways to get that, and they are not close to each other in cost."'
});
