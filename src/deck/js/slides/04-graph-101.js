/* 04 · Vocabulary — force network linked to the edge table */
DECK.registerViz('04-graph-101', (slide) => {
  const B_NODES = ['Ann', 'Ben', 'Cara', 'Acme', 'Beta', 'Acct-441', 'Plant-7', 'Dana'].map(id => ({ id }));
  const B_EDGES = [
    { id: 'b1', source: 'Ann', target: 'Ben', label: 'CALLED' },
    { id: 'b2', source: 'Ben', target: 'Cara', label: 'CALLED' },
    { id: 'b3', source: 'Ann', target: 'Acme', label: 'WORKS_AT' },
    { id: 'b4', source: 'Acme', target: 'Beta', label: 'OWNS' },
    { id: 'b5', source: 'Cara', target: 'Acct-441', label: 'CONTROLS' },
    { id: 'b6', source: 'Beta', target: 'Plant-7', label: 'SUPPLIES' },
    { id: 'b7', source: 'Dana', target: 'Acme', label: 'ADVISES' },
    { id: 'b8', source: 'Plant-7', target: 'Acct-441', label: 'BILLS' },
  ];
  const basics = { seed: 'Ann', hops: 2, selected: null, link: null, node: null, label: null };

  function renderEdgeRows(reached) {
    const tbody = document.getElementById('edge-tbody');
    if (!tbody) return;
    tbody.innerHTML = B_EDGES.map(e => {
      const s = endId(e.source), t = endId(e.target);
      const ds = reached.has(s) ? reached.get(s) : null;
      const dt = reached.has(t) ? reached.get(t) : null;
      const inN = ds !== null && dt !== null;
      const hop = inN ? Math.max(ds, dt) : '—';
      const cls = [inN ? '' : 'dim', basics.selected === e.id ? 'selected' : ''].filter(Boolean).join(' ');
      return `<tr data-edge="${e.id}" class="${cls}">
        <td>${s}</td><td class="pred">${e.label}</td><td>${t}</td><td class="hopcell">${hop}</td></tr>`;
    }).join('');
    tbody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('click', (ev) => {
        ev.stopPropagation();
        basics.selected = basics.selected === row.dataset.edge ? null : row.dataset.edge;
        paintBasics();
      });
    });
  }

  function paintBasics() {
    const reached = neighborhood(basics.seed, basics.hops, B_EDGES);
    renderEdgeRows(reached);
    const callout = document.getElementById('basics-callout');
    if (callout) {
      callout.innerHTML = `<b>Seed → ${basics.hops} hop${basics.hops > 1 ? 's' : ''}</b>`
        + `${reached.size} of ${B_NODES.length} entities reachable from ${basics.seed}.`;
    }
    slide.querySelectorAll('.hop-btn').forEach(btn => {
      const on = Number(btn.dataset.hops) === basics.hops;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
    if (!basics.link || !basics.node) return;
    const sel = basics.selected;
    const inN = id => reached.has(id);
    const onPath = d => {
      const s = endId(d.source), t = endId(d.target);
      return inN(s) && inN(t) && Math.abs(reached.get(s) - reached.get(t)) === 1;
    };
    const ends = new Set();
    if (sel) {
      const e = B_EDGES.find(x => x.id === sel);
      if (e) { ends.add(endId(e.source)); ends.add(endId(e.target)); }
    }
    basics.link
      .attr('stroke', d => sel ? (d.id === sel ? C.signal : C.line) : (onPath(d) ? C.signal : C.line))
      .attr('stroke-width', d => (sel ? d.id === sel : onPath(d)) ? 3 : 1.3)
      .attr('opacity', d => (sel ? d.id === sel : onPath(d)) ? .95 : .3);
    if (basics.label) {
      basics.label
        .attr('fill', d => (sel && d.id === sel) ? C.signal : C.blue)
        .attr('opacity', d => sel ? (d.id === sel ? 1 : .25) : (onPath(d) ? 1 : .45));
    }
    basics.node.select('circle')
      .attr('r', d => d.id === basics.seed ? 15 : 11)
      .attr('fill', d => d.id === basics.seed ? C.signal : inN(d.id) ? C.green : C.blue)
      .attr('stroke', d => ends.has(d.id) ? C.signal : '#fff')
      .attr('stroke-width', d => ends.has(d.id) ? 3 : 2)
      .attr('opacity', d => sel ? (ends.has(d.id) ? 1 : .3) : (inN(d.id) ? 1 : .35));
  }

  function initBasics(host) {
    if (!host) return;
    const { svg, w, h } = newSvg(host);
    const nodes = B_NODES.map(n => ({ ...n }));
    const links = B_EDGES.map(e => ({ ...e }));
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(88).strength(.9))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(w / 2, h / 2 + 8))
      .force('collide', d3.forceCollide(30));

    const link = svg.append('g').selectAll('line').data(links).join('line')
      .attr('stroke', C.line).attr('stroke-width', 1.3).style('cursor', 'pointer')
      .on('click', (ev, d) => { ev.stopPropagation(); basics.selected = basics.selected === d.id ? null : d.id; paintBasics(); });
    const label = svg.append('g').selectAll('text').data(links).join('text')
      .attr('class', 'link-label').attr('text-anchor', 'middle').text(d => d.label)
      .style('cursor', 'pointer')
      .on('click', (ev, d) => { ev.stopPropagation(); basics.selected = basics.selected === d.id ? null : d.id; paintBasics(); });

    let moved = false;
    const node = svg.append('g').selectAll('g').data(nodes).join('g')
      .attr('class', 'node-hit')
      .call(d3.drag()
        .on('start', (ev, d) => { moved = false; if (!ev.active) sim.alphaTarget(.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (ev, d) => { moved = true; d.fx = ev.x; d.fy = ev.y; })
        .on('end', (ev, d) => {
          if (!ev.active) sim.alphaTarget(0);
          d.fx = null; d.fy = null;
          if (!moved) { basics.seed = d.id; basics.selected = null; paintBasics(); }
        }));
    node.append('circle').attr('r', 11).attr('fill', C.blue).attr('stroke', '#fff').attr('stroke-width', 2);
    node.append('text').attr('class', 'node-label').attr('dy', 26).attr('text-anchor', 'middle').text(d => d.id);

    sim.on('tick', () => {
      link.attr('x1', d => d.source.x).attr('y1', d => d.source.y).attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      label.attr('x', d => (d.source.x + d.target.x) / 2).attr('y', d => (d.source.y + d.target.y) / 2 - 6);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    basics.link = link; basics.node = node; basics.label = label;
    paintBasics();
  }

  slide.querySelectorAll('.hop-btn').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      basics.hops = Number(btn.dataset.hops) || 2;
      paintBasics();
    });
  });
  slide.querySelectorAll('[data-dual]').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const view = btn.dataset.dual;
      document.getElementById('dual-view')?.setAttribute('data-view', view);
      slide.querySelectorAll('[data-dual]').forEach(b => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      if (view !== 'table') {
        requestAnimationFrame(() => initBasics(document.getElementById('viz-basics')));
      }
    });
  });

  return {
    enter: () => initBasics(document.getElementById('viz-basics')),
  };
});
