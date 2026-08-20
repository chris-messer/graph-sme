NOTES.push({
  title: 'Taxonomy · the options',
  onscreen: 'Six clickable storage patterns over a paired view: the numbered product tree on the left, the rows that pattern actually writes on the right. The last two chips carry a green edge and a legend marking them as the recommendation.',
  say: 'A hierarchy is a graph — it is nodes and edges, and you can draw it. That does not mean an agent needs graph traversal to use it. What decides whether the agent gets the right number is how the hierarchy is stored, and there are six realistic answers. The tree on the left is the same every time. Numbers on the circles are node ids and products are lettered SKUs, so anything you see in a table you can point at in the picture without wondering which is which. Flattened copies every ancestor name onto every product row and has no ids at all. Adjacency keeps one row per node holding only its parent. Materialized path carries the ancestors inline as a string. Nested set numbers a depth-first walk. The two in green are where we land, and the fifth one is where you can see why. Closure stores every ancestor–descendant pair once, with its hop depth. So if I want everything under Electronics — node 2 — I do not walk anything. I filter: ancestor_id equals 2. That one equality hands back the whole subtree, and the four leaf categories where products actually live, 4 Laptops, 5 Desktops, 7 Smartphones and 8 Feature Phones, come back with it. Same single predicate whether the subtree is two deep or nine deep, which is the part that matters for an agent, because depth never enters the query it has to write. The sixth chip adds a named set beside the tree for the rules that ignore the tree. A semantic segment is just that: a named set defined as the union of one or more subtrees. Strategic Assortment is everything under Computers plus everything under Living Room — two subtrees, one name — and that is why no single ancestor can define it and why it needs its own table. Core Home Furniture in the same table is the contrast: one subtree, so an ancestor could have named that one. None of these changes the information. What changes is what it costs to query and how much SQL the agent has to get right.',
  bullets: [
    ['Purpose', ['Lay out the real option space so the recommendation lands as a choice rather than a preference']],
    ['How to demo live', [
      'Click through all six and keep pointing at the storage table — the diagram is the same tree every time, the rows are not',
      'On Flattened, put a finger on the repeated Electronics and Computers cells, then note there is no id column anywhere',
      'On Adjacency, read node 4 to node 3 to node 2 to node 1 out loud so the recursion is physical',
      'On Closure, cover the table with a hand first and ask how they would get every leaf category under Electronics today. Let someone describe the walk, then uncover it: one filter on ancestor_id, four green rows, done',
      'On Closure, read the descendant column down — 2, 3, 4, 5, 6, 7, 8 — then point at the green rows and say these four are where SKUs hang. The arcs in the diagram are those same rows, and the number on each arc is the depth column',
      'Finish on Closure plus segments: the segment sits below the tree on purpose, reaching up to nodes 4, 5 and 11 across two branches. Read the from_subtree column down — Computers, Computers, Computers, Living Room — then ask what single ancestor could name that set, and let the silence answer',
    ]],
    ['Key nuance', [
      'The green edge on the last two chips and the legend above the split say the recommendation before you do. If someone asks why only two are green, the answer is on the next slide — those are the two whose read cost does not change with depth',
      'The closure view is filtered to ancestor_id = 2, so it is a query result rather than the whole table. Say that out loud if anyone is counting rows — the real table also holds the Home branch and every other ancestor',
      'Rows 3 and 6 come back from that equality too. They are intermediate categories, not leaves, and they are greyed rather than hidden because a rollup that sums the whole subtree needs them counted once, not twice. If someone asks for leaves only, it is one more predicate: depth = 2',
      'The node ids are the ids from our own hierarchy benchmark, so the tables are the real encodings a customer would actually see',
      'Depth band 3 is leaf category, not product. Nodes 4, 5, 7 and 8 are categories; the SKUs beneath them are lettered. Do not let the four green rows get described as four products',
      'Products are lettered SKUs on this slide and the two either side of it. A number always means a node, which keeps the segment example from reading as a contradiction',
      'A segment is a union of subtrees, not a filter and not a new level in the tree. If someone asks whether they could just add a category for it, the answer is only when the set is one subtree — which is the Core Home Furniture row',
      'The segment is deliberately drawn off the tree. It is not a category, and treating it like one is exactly the failure on the previous slide',
      'This slide is the shape of each option. The measured comparison and the recommendation are next — do not spend the benchmark story here',
    ]],
    ['Discovery', [
      'Which of these six tables looks most like what is in your warehouse right now?',
      'When someone asks for all revenue under a category today, who writes that query and how long does it take them?',
      'How deep does your deepest hierarchy go, and does anyone know the number without looking?',
      'If you have more than one hierarchy, are they all stored the same way?',
      'Which of your business rules do not follow the tree — sets that span branches, or that exclude a subtree?',
      'Do those rules live in a table, in BI logic, or only in instruction text?',
      'How often does the hierarchy itself get restructured, and what triggers it?',
    ]],
  ],
  transition: 'Transition: "Here is where we would land, and what the two questions look like once you do."'
});
