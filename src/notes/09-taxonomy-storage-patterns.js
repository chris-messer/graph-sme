NOTES.push({
  title: 'Taxonomy · the options',
  onscreen: 'Six clickable storage patterns over a paired view: the numbered product tree on the left, the rows that pattern actually writes on the right.',
  say: 'A hierarchy is a graph — it is nodes and edges, and you can draw it. That does not mean an agent needs graph traversal to use it. What decides whether the agent gets the right number is how the hierarchy is stored, and there are six realistic answers. The tree on the left is the same every time. Numbers on the circles are node ids and products are lettered SKUs, so anything you see in a table you can point at in the picture without wondering which is which. Flattened copies every ancestor name onto every product row and has no ids at all. Adjacency keeps one row per node holding only its parent. Materialized path carries the ancestors inline as a string. Nested set numbers a depth-first walk. Closure stores every ancestor pair once, with its hop depth. And the last one adds a named set beside the tree for the rules that ignore the tree. A semantic segment is just that: a named set defined as the union of one or more subtrees. Strategic Assortment is everything under Computers plus everything under Living Room — two subtrees, one name — and that is why no single ancestor can define it and why it needs its own table. Core Home Furniture in the same table is the contrast: one subtree, so an ancestor could have named that one. None of these changes the information. What changes is what it costs to query and how much SQL the agent has to get right.',
  bullets: [
    ['Purpose', ['Lay out the real option space so the recommendation lands as a choice rather than a preference']],
    ['How to demo live', [
      'Click through all six and keep pointing at the storage table — the diagram is the same tree every time, the rows are not',
      'On Flattened, put a finger on the repeated Electronics and Computers cells, then note there is no id column anywhere',
      'On Adjacency, read node 4 to node 3 to node 2 to node 1 out loud so the recursion is physical',
      'On Closure, read one row at a time and touch the matching connector — six rows, six lines, and the depth column is written on the arcs',
      'Finish on Closure plus segments: the segment sits below the tree on purpose, reaching up to nodes 4, 5 and 11 across two branches. Read the from_subtree column down — Computers, Computers, Computers, Living Room — then ask what single ancestor could name that set, and let the silence answer',
    ]],
    ['Key nuance', [
      'The node ids are the ids from our own hierarchy benchmark, so the tables are the real encodings a customer would actually see',
      'Products are lettered SKUs on this slide and the two either side of it. A number always means a node, which keeps the segment example from reading as a contradiction',
      'A segment is a union of subtrees, not a filter and not a new level in the tree. If someone asks whether they could just add a category for it, the answer is only when the set is one subtree — which is the Core Home Furniture row',
      'The segment is deliberately drawn off the tree. It is not a category, and treating it like one is exactly the failure on the previous slide',
      'This slide is the shape of each option. The measured comparison and the recommendation are next — do not spend the benchmark story here',
    ]],
    ['Discovery', [
      'Which of these six tables looks most like what is in your warehouse right now?',
      'If you have more than one hierarchy, are they all stored the same way?',
      'Which of your business rules do not follow the tree — sets that span branches, or that exclude a subtree?',
      'Do those rules live in a table, in BI logic, or only in instruction text?',
      'How often does the hierarchy itself get restructured, and what triggers it?',
    ]],
  ],
  transition: 'Transition: "Here is where we would land, and what the two questions look like once you do."'
});
