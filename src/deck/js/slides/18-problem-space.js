/* 18 · the problem space — one frontier, two independent controls. The seed
   control decides whether the answer is right; the hop control decides what it
   costs. Both act on the same picture, which is the point of the slide. */
DECK.registerViz('18-problem-space', (slide) => {
  const SEED_GRAPH = (() => {
    const nodes = [];
    const links = [];
    const add = (id, extra) => nodes.push({ id, ...extra });
    const edge = (source, target) => links.push({ source, target });

    add('c1', { cand: true, root: 'c1', label: 'Delta Holdings Ltd' });
    add('c2', { cand: true, root: 'c2', label: '“Delta Hldgs”' });
    add('c3', { cand: true, root: 'c3', label: 'Delta Holding Group' });

    /* the intended company, with a shared-agent supernode three hops out */
    ['a1', 'a2', 'a3'].forEach(id => { add(id, { root: 'c1' }); edge('c1', id); });
    ['a4', 'a5'].forEach(id => { add(id, { root: 'c1' }); edge('a1', id); });
    add('a6', { root: 'c1' }); edge('a2', 'a6');
    add('hub', { root: 'c1', hub: true }); edge('a4', 'hub');
    for (let i = 1; i <= 8; i++) { add(`h${i}`, { root: 'c1' }); edge('hub', `h${i}`); }

    /* the same company written a second way */
    ['b1', 'b2'].forEach(id => { add(id, { root: 'c2' }); edge('c2', id); });
    ['b3', 'b4'].forEach(id => { add(id, { root: 'c2' }); edge('b1', id); });
    add('b5', { root: 'c2' }); edge('b2', 'b5');

    /* a genuinely different company that only a fuzzy matcher returns */
    ['d1', 'd2', 'd3'].forEach(id => { add(id, { root: 'c3' }); edge('c3', id); });
    add('d4', { root: 'c3' }); edge('d1', 'd4');
    ['d5', 'd6'].forEach(id => { add(id, { root: 'c3' }); edge('d2', id); });
    add('d7', { root: 'c3' }); edge('d3', 'd7');

    return { nodes, links };
  })();

  const METHODS = {
    sql: {
      label: 'Deterministic SQL',
      seeds: ['c1', 'c2'], wrong: [],
      note: 'Both written forms of one company, matched on normalized name and edit distance.',
    },
    vector: {
      label: 'Vector similarity',
      seeds: ['c1', 'c2', 'c3'], wrong: ['c3'],
      note: 'A different company came back with them. Everything reached through it is in the answer and none of it belongs there.',
    },
    llm: {
      label: 'LLM-assisted',
      seeds: ['c1', 'c2'], wrong: [],
      note: 'Same seeds the SQL path found, with the third candidate rejected and the reason recorded.',
    },
    human: {
      label: 'User in the loop',
      seeds: ['c1'], wrong: [],
      note: 'The person picked the single entity they meant, so this is the narrowest frontier of the four.',
    },
  };

  /* Each candidate owns a horizontal band and each hop owns a column, so the
     frontier grows column by column and territory reached through the wrong
     entity stays visually separate. */
  const BAND = { c1: [.04, .50], c2: [.56, .71], c3: [.77, .97] };
  let state = { method: 'sql', hops: 1 };
  let view = null;

  function build(host) {
    const { svg, w, h } = newSvg(host);
    const nodes = SEED_GRAPH.nodes.map(n => ({ ...n }));
    const links = SEED_GRAPH.links.map(l => ({ ...l }));
    const byId = new Map(nodes.map(n => [n.id, n]));

    const adj = new Map();
    links.forEach(l => {
      if (!adj.has(l.source)) adj.set(l.source, []);
      if (!adj.has(l.target)) adj.set(l.target, []);
      adj.get(l.source).push(l.target);
      adj.get(l.target).push(l.source);
    });
    Object.keys(BAND).forEach(root => {
      const seen = new Map([[root, 0]]);
      const queue = [root];
      while (queue.length) {
        const cur = queue.shift();
        (adj.get(cur) || []).forEach(next => {
          if (!seen.has(next)) { seen.set(next, seen.get(cur) + 1); queue.push(next); }
        });
      }
      seen.forEach((depth, id) => { byId.get(id).depth = depth; });
    });
    links.forEach(l => { l.source = byId.get(l.source); l.target = byId.get(l.target); });

    const maxDepth = d3.max(nodes, d => d.depth);
    const x0 = w * .21, xEnd = w * .78;
    const xOf = depth => x0 + depth * ((xEnd - x0) / maxDepth);

    Object.entries(BAND).forEach(([root, [lo, hi]]) => {
      const top = h * lo, bottom = h * hi, mid = (top + bottom) / 2;
      d3.groups(nodes.filter(d => d.root === root), d => d.depth).forEach(([, col]) => {
        const spread = Math.min(bottom - top, (col.length - 1) * 22);
        col.forEach((d, i) => {
          d.x = xOf(d.depth);
          d.y = col.length === 1 ? mid : mid - spread / 2 + (i * spread) / (col.length - 1);
        });
      });
    });

    for (let depth = 1; depth <= maxDepth; depth++) {
      svg.append('line').attr('x1', xOf(depth)).attr('x2', xOf(depth))
        .attr('y1', 26).attr('y2', h - 6)
        .attr('stroke', C.line).attr('stroke-width', 1).attr('opacity', .45).attr('stroke-dasharray', '3 5');
      svg.append('text').attr('class', 'axis-label').attr('x', xOf(depth)).attr('y', 18)
        .attr('text-anchor', 'middle').text(depth === 1 ? '1 hop' : `${depth} hops`);
    }

    const link = svg.append('g').selectAll('line').data(links).join('line')
      .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    const node = svg.append('g').selectAll('circle').data(nodes).join('circle')
      .attr('cx', d => d.x).attr('cy', d => d.y)
      .attr('stroke', '#fff').attr('stroke-width', 1.4);
    svg.append('g').selectAll('text').data(nodes.filter(d => d.cand)).join('text')
      .attr('class', 'node-label').attr('text-anchor', 'end')
      .attr('x', d => d.x - 14).attr('y', d => d.y + 4)
      .style('font-size', '10.5px').text(d => d.label);
    const hub = nodes.find(d => d.hub);
    const hubLabel = svg.append('text').attr('class', 'axis-label').attr('text-anchor', 'middle')
      .attr('x', hub.x).attr('y', hub.y - 16)
      .attr('fill', C.amber).text('supernode');

    return { link, node, nodes, links, hubLabel };
  }

  function reachFrom(seeds, hops, links) {
    const out = new Set();
    seeds.forEach(seed => neighborhood(seed, hops, links).forEach((_, id) => out.add(id)));
    return out;
  }

  function paint() {
    slide.querySelectorAll('[data-seed]').forEach(b => {
      const on = b.dataset.seed === state.method;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    slide.querySelectorAll('[data-seedhops]').forEach(b => {
      const on = Number(b.dataset.seedhops) === state.hops;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    if (!view) return;

    const method = METHODS[state.method];
    const right = method.seeds.filter(s => !method.wrong.includes(s));
    const reachedRight = reachFrom(right, state.hops, view.links);
    const reachedWrong = reachFrom(method.wrong, state.hops, view.links);
    const inRight = id => reachedRight.has(id);
    const onlyWrong = id => reachedWrong.has(id) && !reachedRight.has(id);
    const isSeed = id => method.seeds.includes(id);

    view.node.transition().duration(320)
      .attr('r', d => d.cand ? (isSeed(d.id) ? 9.5 : 6) : d.hub ? 9 : 5.5)
      .attr('fill', d => {
        if (d.cand && isSeed(d.id)) return method.wrong.includes(d.id) ? C.danger : C.signal;
        if (d.cand) return C.faint;
        if (onlyWrong(d.id)) return C.danger;
        if (d.hub && inRight(d.id)) return C.amber;
        return inRight(d.id) ? C.green : C.faint;
      })
      .attr('opacity', d => (isSeed(d.id) || inRight(d.id) || onlyWrong(d.id)) ? 1 : .26);
    view.link.transition().duration(320)
      .attr('stroke', d => {
        const s = endId(d.source), t = endId(d.target);
        if (onlyWrong(s) && onlyWrong(t) || (onlyWrong(t) && isSeed(s) && method.wrong.includes(s))) return C.danger;
        return inRight(s) && inRight(t) ? C.signal : C.line;
      })
      .attr('stroke-width', d => {
        const s = endId(d.source), t = endId(d.target);
        return (inRight(s) && inRight(t)) || (onlyWrong(s) || onlyWrong(t)) ? 1.9 : 1;
      })
      .attr('opacity', d => {
        const s = endId(d.source), t = endId(d.target);
        return (inRight(s) && inRight(t)) || (reachedWrong.has(s) && reachedWrong.has(t)) ? .9 : .18;
      });
    view.hubLabel.attr('opacity', reachedRight.has('hub') ? 1 : 0);

    const callout = slide.querySelector('#seed-callout');
    if (callout) {
      const extra = [];
      if (reachedWrong.size) extra.push(`${reachedWrong.size} of them hang off the wrong entity.`);
      if (reachedRight.has('hub')) extra.push('The supernode is inside the frontier now, so everything attached to it arrives too.');
      callout.innerHTML = `<b>${method.label} · ${state.hops} hop${state.hops > 1 ? 's' : ''}</b>`
        + `${reachedRight.size + reachedWrong.size} of ${view.nodes.length} nodes returned. `
        + method.note + (extra.length ? ' ' + extra.join(' ') : '');
    }
  }

  slide.querySelectorAll('.ps-btn[data-seed]').forEach(b => {
    b.addEventListener('click', (ev) => { ev.stopPropagation(); state.method = b.dataset.seed; paint(); });
  });
  slide.querySelectorAll('[data-seedhops]').forEach(b => {
    b.addEventListener('click', (ev) => { ev.stopPropagation(); state.hops = Number(b.dataset.seedhops) || 1; paint(); });
  });

  return {
    enter() {
      const host = slide.querySelector('#viz-seed');
      if (!host) return;
      view = build(host);
      paint();
    },
  };
});
