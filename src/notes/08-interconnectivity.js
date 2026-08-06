NOTES.push({
  title: 'Taxonomy · the client need',
  onscreen: 'One matrix: the four totals the need calls for, against the same stored hierarchy, ordered by how far each total sits above the products, with what came back beside what the right answer was. A small banded reference tree sits under it, showing where each named node lives and how far it is from the product row.',
  say: 'The need here is simple to state. A user should be able to ask for a total at any level of the hierarchy and get it — product, category, department — and they should be able to ask for the named sets the business actually runs on, even when those cut across branches. Four asks, and the only thing that changes down the rows is how far above the products the total sits. Before the rows, look at the small tree underneath. Those are the same bands from the previous slide, and I have added the row the tree does not have nodes for: the products. Revenue lives on that bottom row and nowhere else, so levels to roll up just counts bands from the node in the question down to it. Now the first row is the need already being met. Laptops is one band above the products, the things underneath it are SKU-A and SKU-B, products carry revenue, and the number comes back correct. Climb one rung. Computers is two bands up, and what sits directly underneath it is not products, it is two more categories — and categories have no revenue of their own. No rows. Climb again to Electronics and it is the same story one band deeper. And the last row is the part of the need that is furthest from being met: Strategic Assortment is a business rule, everything under Computers plus everything under Living Room, and no parent_id in this table names that set at all. So the assistant is not bad at arithmetic. It can total anything stored at the level it can see. Every one of these rollups needs a walk up the tree, and the walk is not in the row it is reading. Look at the right-hand column while I say this: the money exists in all four cases. Only one of the four answers does.',
  bullets: [
    ['Purpose', ['State the need as totals at every level plus cross-branch segments, and use the matrix as evidence that today\'s encoding cannot deliver it — before anyone proposes a graph database']],
    ['How to demo live', [
      'Start on the reference tree for ten seconds — point at the product band, then count bands up to Laptops, Computers, Electronics. After that the first column reads itself',
      'Then read the left column down — one, two, three, cross-branch. That is the only variable on the slide',
      'Then read the two right-hand columns as a pair: one real number returned against four real numbers the business needs',
      'The middle column is why the need goes unmet — products carry revenue, categories do not, and this encoding only ever shows one hop',
      'Numbers on the circles are node ids and products are lettered SKUs, so nothing on the tree is ambiguous when you point at it',
      'The line to land: all four queries succeeded. Nothing in the response tells the user the rollup never reached a product',
    ]],
    ['Key nuance', [
      'This came out of a real customer situation: a hierarchy stored one hop at a time plus semantic rules that did not follow the tree, which forced them to bend Genie instructions until the deeper questions became unanswerable',
      'Across the hierarchy benchmark the model never once wrote a recursive CTE for the rollup, even with a worked example in its instructions',
      'Silent empties are the expensive gap. A wrong number gets challenged in a meeting; a null gets read as "no revenue there"',
      'Strategic Assortment reaches under node 3 Computers and node 11 Living Room. Two subtrees, one set, and that is the shape the segment table on the next slide exists for',
      'Keep this on what they need, not on what is broken — and resist jumping to the fix. The options are the next slide, and SAs who solve it here lose the discovery',
    ]],
    ['Discovery', [
      'What is the assistant getting wrong today, and how did someone notice?',
      'How deep do your hierarchies actually go, and is the depth the same across every branch?',
      'Where is a rollup defined today — in the warehouse, in the BI tool, or in someone\'s head?',
      'Which business terms do your users ask for that are not category names in the tree?',
      'Who owns the hierarchy, and who finds out when it changes?',
    ]],
  ],
  transition: 'Transition: "So the question is how you store it. There are six answers, and they are not equally good for an agent."'
});
