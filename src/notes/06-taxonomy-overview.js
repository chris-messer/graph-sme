NOTES.push({
  title: 'Taxonomy overview',
  onscreen: 'Section opener — same oat canvas as the content slides, oversized headline under a full-bleed coral rule. The product hierarchy with each depth band named root, category, subcategory, leaf category, one edge drawn coral, and a closing band showing where taxonomy sits against the other two layers.',
  say: 'A taxonomy is a classification tree. Every node has exactly one parent, and you read it from the root down: category, subcategory, and then the lowest category, the one products actually hang under. This is the product hierarchy — all products, electronics, computers, laptops — and it is the same tree for the rest of this section. Now look at what that drawing actually is. Twelve nodes, eleven edges, one edge type, and the coral one is doing nothing special — it just says that computers is a child of electronics. So yes, a taxonomy is a graph. It is the simplest graph there is. And that matters mainly because of what it does not imply: nothing on this canvas needs a graph database or a traversal engine. A table holds this perfectly well, and every question anyone will ask of it can be answered in SQL. The decision this section is really about is how you encode the tree in that table, because that is what determines whether an agent writes correct SQL over it or quietly writes wrong SQL. There are several encodings, they are not equivalent, and we compare them on the next two slides.',
  bullets: [
    ['Purpose', ['Define taxonomy plainly, kill the assumption that a tree implies a graph engine, and set up encoding as the only decision that matters here']],
    ['Key nuance', [
      'The three layers stay distinct: taxonomy classifies, ontology constrains meaning as metadata, a knowledge graph holds row-level relationships. Point at the strip bottom-right if anyone is blending them',
      'Resist walking the encodings here — the next slide earns them by showing a query that comes back empty',
      'The bands stop at the lowest category. Products are not nodes in this tree — they hang below it and they are where revenue lives, which is the distinction the next slide is built on',
    ]],
    ['Discovery', [
      'How many separate hierarchies are in play — product, org, location, account — and are they all stored the same way?',
      'When your teams say taxonomy, is it one shared tree or does each domain keep its own?',
      'Are there named sets or business rules that cut across the tree rather than sitting under a single parent?',
      'How does a new level or a re-parent get made today, and what breaks downstream when it does?',
    ]],
  ],
  transition: 'Transition: "So here is the client need, and it starts with a question that comes back empty."'
});
