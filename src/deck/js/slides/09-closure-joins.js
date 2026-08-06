/* 09 · Closure + segments recommendation — worked-query tabs drive both panes,
   and the recommended pane can expose the rows its join actually reads. */
DECK.registerViz('09-closure-joins', (slide) => {
  const kw = s => `<span class="kw">${s}</span>`;
  const cm = s => `<span class="cm">${s}</span>`;
  const lit = s => `<span class="lit">${s}</span>`;

  const QUERIES = {
    category: {
      aTitle: 'Six lines of recursion before the first number',
      aSql: [
        cm('-- unbounded depth needs a recursive walk'),
        `${kw('WITH RECURSIVE')} sub ${kw('AS')} (`,
        `  ${kw('SELECT')} node_id ${kw('FROM')} nodes ${kw('WHERE')} node_name = ${lit("'Electronics'")}`,
        `  ${kw('UNION ALL')}`,
        `  ${kw('SELECT')} n.node_id ${kw('FROM')} nodes n ${kw('JOIN')} sub ${kw('ON')} n.parent_id = sub.node_id)`,
        `${kw('SELECT')} sum(f.revenue) ${kw('FROM')} fact_sales f`,
        `${kw('JOIN')} leaf_products l ${kw('ON')} l.sku = f.sku`,
        `${kw('WHERE')} l.node_id ${kw('IN')} (${kw('SELECT')} node_id ${kw('FROM')} sub);`,
      ].join('\n'),
      aOut: 'Right when it is written right. In the benchmark this room wrote zero recursive CTEs across seven questions — it substituted a single hop below Electronics and returned no rows at all.',
      bTitle: 'One equality, every depth at once',
      bSql: [
        cm('-- the walk was already done at write time'),
        `${kw('SELECT')} sum(f.revenue)`,
        `${kw('FROM')} hier_closure c`,
        `${kw('JOIN')} fact_sales f ${kw('ON')} f.sku = c.sku`,
        `${kw('WHERE')} c.ancestor_name = ${lit("'Electronics'")};`,
      ].join('\n'),
      bOut: '$19,150, correct. The same three lines answer Laptops, Computers or All Products — only the literal changes, so depth never enters the query.',
      rows: [
        'ancestor 2 (Electronics)',
        '  → descendants 3, 4, 5, 6, 7, 8',
        '  → SKU-A SKU-B SKU-C SKU-D SKU-E SKU-F',
        '6 closure rows · one equality predicate',
      ].join('\n'),
    },
    segment: {
      aTitle: 'The rule has to travel with every question',
      aSql: [
        cm('-- Strategic Assortment is not a node, so the asker supplies it'),
        `${kw('WITH RECURSIVE')} sub ${kw('AS')} (`,
        `  ${kw('SELECT')} node_id ${kw('FROM')} nodes`,
        `  ${kw('WHERE')} node_name ${kw('IN')} (${lit("'Computers'")}, ${lit("'Living Room'")})`,
        `  ${kw('UNION ALL')}`,
        `  ${kw('SELECT')} n.node_id ${kw('FROM')} nodes n ${kw('JOIN')} sub ${kw('ON')} n.parent_id = sub.node_id)`,
        `${kw('SELECT')} sum(f.revenue) ${kw('FROM')} fact_sales f`,
        `${kw('JOIN')} leaf_products l ${kw('ON')} l.sku = f.sku`,
        `${kw('WHERE')} l.node_id ${kw('IN')} (${kw('SELECT')} node_id ${kw('FROM')} sub);`,
      ].join('\n'),
      aOut: 'Every encoding in the benchmark went looking for a category named Strategic Assortment and returned no rows. Inlining the definition does work — but only while whoever is asking already knows it.',
      bTitle: 'The named set is a row, so it is a join',
      bSql: [
        cm('-- one named row per member, owned in the warehouse'),
        `${kw('SELECT')} sum(f.revenue)`,
        `${kw('FROM')} semantic_segments s`,
        `${kw('JOIN')} fact_sales f ${kw('ON')} f.sku = s.sku`,
        `${kw('WHERE')} s.segment_name = ${lit("'Strategic Assortment'")};`,
      ].join('\n'),
      bOut: '$13,850, correct, and the same shape as the rollup on the other tab. The definition is owned once in the segment table rather than retyped into every question.',
      rows: [
        'segment Strategic Assortment',
        '  → SKU-A, SKU-B under node 4 (Laptops)',
        '  → SKU-C under node 5 · SKU-G under node 11',
        '4 segment rows · two branches · one join',
      ].join('\n'),
    },
  };

  const rowsBtn = slide.querySelector('#rec-rows-btn');
  const rowsBox = slide.querySelector('#rec-rows');
  const outText = slide.querySelector('#rec-b-out');
  let rowsOpen = false;

  function paintRows() {
    if (!rowsBtn || !rowsBox || !outText) return;
    rowsBox.hidden = !rowsOpen;
    outText.hidden = rowsOpen;
    rowsBtn.textContent = rowsOpen ? 'Back to the result' : 'Show the rows this join reads';
    rowsBtn.setAttribute('aria-expanded', String(rowsOpen));
  }

  function setQuery(key) {
    const q = QUERIES[key];
    if (!q) return;
    slide.querySelectorAll('[data-q]').forEach(b => {
      const on = b.dataset.q === key;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const set = (id, html) => { const el = slide.querySelector(`#${id}`); if (el) el.innerHTML = html; };
    set('rec-a-title', q.aTitle);
    set('rec-a-sql', q.aSql);
    set('rec-a-out', q.aOut);
    set('rec-b-title', q.bTitle);
    set('rec-b-sql', q.bSql);
    set('rec-b-out', q.bOut);
    set('rec-rows', q.rows);
    paintRows();
  }

  slide.querySelectorAll('[data-q]').forEach(b => {
    b.addEventListener('click', (ev) => { ev.stopPropagation(); setQuery(b.dataset.q); });
  });
  rowsBtn?.addEventListener('click', (ev) => {
    ev.stopPropagation();
    rowsOpen = !rowsOpen;
    paintRows();
  });

  setQuery('category');
});
