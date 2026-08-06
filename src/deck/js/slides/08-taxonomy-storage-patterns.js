/* 08 · Taxonomy storage patterns — chip selector drives diagram + table.
   Node ids in these tables are the ids drawn in the diagram, so a row can be
   read straight off the picture. Products are lettered SKUs on purpose: a
   number on this slide always means a node, never a product. */
DECK.registerViz('08-taxonomy-storage-patterns', (slide) => {
  const ENC_COPY = {
    flattened: { t: 'Flattened columns', d: 'A fixed-depth filter is cheap, and the model still has to guess which level column holds a name.' },
    adjacency: { t: 'Adjacency list', d: 'Cheapest to maintain, and every rollup becomes a recursive CTE the model has to write correctly.' },
    path: { t: 'Materialized path', d: 'Reads the way people describe hierarchies, and a rename rewrites every row beneath it.' },
    nested: { t: 'Nested set', d: 'Efficient for the engine, opaque as a mental model, and costly to keep current.' },
    closure: { t: 'Closure table', d: 'Every ancestor–descendant pair is written once, so the whole Electronics subtree is <span class="q">ancestor_id = 2</span> — one equality instead of a walk, and the four leaf categories under it come back with it.' },
    segments: { t: 'Closure + semantic segments', d: 'A named set built as the union of two subtrees, stored beside the tree because no single ancestor contains it.' },
  };

  /* Storage tables — the same product tree as the diagram, encoded as it is
     created in the hierarchy benchmark. Column names are the real ones. */
  const ENC_TABLES = {
    flattened: {
      name: 'hier_flattened',
      cols: ['sku', 'level_1', 'level_2', 'level_3'],
      rows: [
        ['SKU-A', ['Electronics', 'hot'], ['Computers', 'hot'], 'Laptops'],
        ['SKU-C', ['Electronics', 'hot'], ['Computers', 'hot'], 'Desktops'],
        ['SKU-D', ['Electronics', 'hot'], 'Phones', 'Smartphones'],
        ['SKU-F', ['Electronics', 'hot'], 'Phones', 'Feature Phones'],
        ['SKU-G', 'Home', 'Furniture', 'Living Room'],
      ],
      gloss: 'nothing here carries a node id — the numbers in the diagram have no column to live in',
      hint: 'One row per product. Every ancestor name is copied onto every row beneath it, and the depth is fixed by the column list.',
    },
    adjacency: {
      name: 'genie_hier_adjacency',
      cols: ['node_id', 'node_name', 'parent_id', 'depth'],
      rows: [
        ['1', 'All Products', ['NULL', 'gloss'], '0'],
        ['2', 'Electronics', '1', '1'],
        ['3', 'Computers', ['2', 'hot'], '2'],
        ['4', 'Laptops', ['3', 'hot'], '3'],
        ['6', 'Phones', ['2', 'hot'], '2'],
      ],
      hint: 'One row per node, holding only its immediate parent. Every further ancestor is another hop, and each hop is another line of SQL.',
    },
    path: {
      name: 'genie_hier_path',
      cols: ['node_id', 'node_name', 'full_path'],
      rows: [
        ['2', 'Electronics', '/All Products/Electronics'],
        ['3', 'Computers', '/All Products/Electronics/Computers'],
        ['4', 'Laptops', ['/All Products/Electronics/Computers/Laptops', 'hot']],
        ['11', 'Living Room', '/All Products/Home/Furniture/Living Room'],
      ],
      gloss: 'the highlighted branch in the diagram is the highlighted string here',
      hint: 'One row per node, carrying its ancestors inline as a single string. Every descendant of a node shares its prefix.',
    },
    nested: {
      name: 'genie_hier_nested_set',
      cols: ['node_id', 'node_name', 'lft', 'rgt', 'depth'],
      rows: [
        ['2', 'Electronics', '2', '15', '1'],
        ['3', 'Computers', ['3', 'hot'], ['8', 'hot'], '2'],
        ['4', 'Laptops', '4', '5', '3'],
        ['5', 'Desktops', '6', '7', '3'],
        ['9', 'Home', '16', '23', '1'],
      ],
      gloss: 'node 4 sits inside node 3 because 4·5 falls inside 3·8',
      hint: 'One row per node, numbered by a depth-first walk. Containment is an interval comparison, and any insert renumbers the walk.',
    },
    /* Filtered to ancestor_id = 2 on purpose: this is the payoff view, so the
       table shows exactly what the one equality returns. The four leaf
       categories are the green rows — descendant ids 4, 5, 7 and 8, which are
       the leaves under Electronics in H_NODES. */
    closure: {
      name: 'hier_closure · where ancestor_id = 2',
      cols: ['ancestor_id', 'descendant_id', 'depth'],
      /* ancestor_id is the same value on every row — it is the predicate, and the
         label already says so — so it stays quiet and the green carries the read */
      rows: [
        { cls: 'quiet', cells: [['2', 'gloss'], '2', ['0', 'gloss']] },
        { cls: 'quiet', cells: [['2', 'gloss'], '3', '1'] },
        { cls: 'hit', cells: [['2', 'gloss'], ['4', 'good'], ['2', 'good']] },
        { cls: 'hit', cells: [['2', 'gloss'], ['5', 'good'], ['2', 'good']] },
        { cls: 'quiet', cells: [['2', 'gloss'], '6', '1'] },
        { cls: 'hit', cells: [['2', 'gloss'], ['7', 'good'], ['2', 'good']] },
        { cls: 'hit', cells: [['2', 'gloss'], ['8', 'good'], ['2', 'good']] },
      ],
      gloss: '<b>One equality — ancestor_id = 2 — returns everything under Electronics at every depth.</b> The green rows are its four leaf categories: 4 Laptops, 5 Desktops, 7 Smartphones, 8 Feature Phones. Nodes 3 and 6 are the intermediate categories that come back with them, and the depth-0 self row is why a rollup counts Electronics itself.',
      hint: 'One row per ancestor–descendant pair, self-rows at depth 0 included. The recursion is paid once, at write time — so selecting an entire subtree is a filter, not a traversal.',
    },
    segments: {
      name: 'semantic_segments',
      cols: ['segment_name', 'sku', 'from_subtree'],
      rows: [
        [['Strategic Assortment', 'hot'], 'SKU-A', 'Computers'],
        [['Strategic Assortment', 'hot'], 'SKU-B', 'Computers'],
        [['Strategic Assortment', 'hot'], 'SKU-C', 'Computers'],
        [['Strategic Assortment', 'hot'], 'SKU-G', 'Living Room'],
        ['Core Home Furniture', 'SKU-H', 'Furniture'],
      ],
      gloss: '<b>Strategic Assortment = everything under Computers, plus everything under Living Room.</b> SKU-A and SKU-B hang off node 4 Laptops, SKU-C off node 5 Desktops, SKU-G off node 11 Living Room — so the set reaches under node 3 and under node 11 at once.',
      hint: 'A semantic segment is a named set defined as the union of one or more subtrees. Core Home Furniture takes one subtree, so an ancestor could have named it. Strategic Assortment takes two, and no node in this tree has exactly those items beneath it — which is why it is stored beside the hierarchy, one row per member, rather than inside it.',
    },
  };

  function renderEncTable(kind) {
    const host = document.getElementById('enc-table');
    const t = ENC_TABLES[kind];
    if (!host || !t) return;
    const cell = c => Array.isArray(c) ? `<td class="${c[1]}">${c[0]}</td>` : `<td>${c}</td>`;
    /* a row is either a bare cell list or { cls, cells } when it needs to read
       as returned-by-the-query or as riding along with it */
    const row = (r) => {
      const cells = Array.isArray(r) ? r : r.cells;
      const cls = Array.isArray(r) ? '' : ` class="${r.cls}"`;
      return `<tr${cls}>${cells.map(cell).join('')}</tr>`;
    };
    host.innerHTML = `
      <div class="label">${t.name}</div>
      <table>
        <thead><tr>${t.cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
        <tbody>${t.rows.map(row).join('')}</tbody>
      </table>
      ${t.gloss ? `<p class="edge-hint gloss" style="margin-top:10px;padding-top:0;">${t.gloss}</p>` : ''}
      <p class="edge-hint">${t.hint}</p>`;
  }

  function setEncoding(kind) {
    slide.querySelectorAll('.enc-chip').forEach(c => {
      const on = c.dataset.enc === kind;
      c.classList.toggle('active', on);
      c.setAttribute('aria-pressed', String(on));
    });
    drawEncoding(document.getElementById('viz-hier'), kind);
    const callout = document.getElementById('hier-callout');
    if (callout) callout.innerHTML = `<b>${ENC_COPY[kind].t}</b>${ENC_COPY[kind].d}`;
    renderEncTable(kind);
  }
  slide.querySelectorAll('.enc-chip').forEach(chip => {
    chip.addEventListener('click', (ev) => { ev.stopPropagation(); setEncoding(chip.dataset.enc); });
  });

  return {
    enter: () => setEncoding(
      slide.querySelector('.enc-chip.active')?.dataset.enc || 'flattened',
    ),
  };
});
