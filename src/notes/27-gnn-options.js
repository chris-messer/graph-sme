NOTES.push({
  title: 'Knowledge graphs · getting structure into a model',
  onscreen: 'Three bands ascending by cost with an effort meter on each — the extension band first, then fine-tuning, then a purpose-built heterogeneous GNN.',
  say: 'The previous slide argued that structure is real signal. This one is about how much you should be willing to spend to use it, and the order is deliberate because both of the options the source actually offers are high complexity. Start at the top band, and note the dashed border, because this one is ours rather than theirs. You already compute centrality and community and embeddings in a batch job. Write them to Delta, add them as columns to the model you already have in production, and see whether the metric moves. No new training stack, no new serving path, and if the answer is that structure adds nothing here, you have found that out for the cost of a batch job instead of two months. The honest limit is real though: one number per node is a summary of a neighborhood, and if the decision genuinely turns on the shape of that neighborhood, you have thrown away the thing a GNN would have used. Middle band is the source\'s first real move: fine-tune a pretrained graph foundation model rather than training one from scratch. On atomistic and scientific work this is very strong, because the physics is shared — somebody already trained on millions of structures and you are adapting it to yours, and coreset training narrows that further by picking the one to ten percent of the data that actually carries the variance. Four to eight weeks. The catch is domain: if your graph is a customer network, there is no pretrained interatomic potential to inherit and this row does not apply to you. Bottom band, and I want to be careful here because it is the longest build in the deck. A purpose-made heterogeneous GNN is worth it where the graph is the decision itself. Our own worked example is partition-skew optimization — schema, runtime telemetry, query history and key distribution across seven node types, feeding a model that tells you the physical layout and which hot keys to salt. That is not a model that helps someone decide; it is the decision. Eight weeks and up, and someone owns that model for years afterwards.',
  bullets: [
    ['Purpose', ['Put the cost order in front of the ambition, so a client who is excited by the previous slide leaves with the cheapest test rather than the biggest project']],
    ['Key nuance', [
      'The top band is flagged as an extension because the source does not offer a rung below fine-tuning. Do not present it as field-proven at the same level as the other two — present it as the obvious first experiment',
      'Both source solutions are complexity High. That is unusual in this deck and it is the reason this slide is ordered by cost rather than by capability',
      'The fine-tuning row is domain-bound, not universally applicable. Pretrained graph foundation models exist for atomistic chemistry; they do not exist for a bank\'s counterparty network. Saying that plainly protects credibility',
      'Coreset selection — embedding then k-means, train on 1 to 10 percent — is worth naming separately. For a client with a data volume problem rather than a modelling problem, that is the interesting half',
      'The partition-skew example is a Databricks-internal use of the technique. It works as proof the pattern is real, and it is a good answer to "has anyone actually done this"',
    ]],
    ['How to demo live', [
      'Point at the three effort meters before reading any band. The visual gradient does the argument for you',
      'If the room is enthusiastic, slow down on the top band deliberately — enthusiasm at this rung is how eight-week builds get committed to in a first meeting',
      'If they are a scientific or materials organization, go straight to the middle band and stay there; if they are a commercial data team, the middle band probably does not apply and you should say so',
    ]],
    ['Discovery', [
      'Is there a model in production today that this structure would feed, or would this be a new model?',
      'Does the decision depend on the shape of the neighborhood, or would a score per entity be enough? This is the question that separates the top band from the bottom two',
      'For a scientific workload: is there a pretrained model in your field you would expect to start from, and does anyone here have experience fine-tuning one?',
      'How often is this decision made, and what does getting it wrong cost? A trained model needs the frequency to be worth it',
      'Who would own this model after it ships, and does that team exist yet?',
    ]],
  ],
  transition: 'Transition: "That is the full range, from a metric view to a trained model. One rule runs underneath all of it."'
});
