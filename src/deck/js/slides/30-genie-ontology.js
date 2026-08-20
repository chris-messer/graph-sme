/* 30 · How Genie Ontology works — one full-width stage, two retrieval states
   over the same question and the same eight assets in the same eight positions,
   so the comparison is between retrieval behaviour rather than between examples.

   Without the ontology the agent discovers context at question time, and it does
   it as a loop: find one asset, ask where it is referenced, pull those, repeat.
   The loop is drawn as a cycle around the corner of the network it happens to
   land in, and it resolves into a flat unranked pile that is stuffed into the
   window whole. With the ontology the connected assets were already scored and
   the knowledge already ranked, continuously and before the question, so
   question time is one lookup against that ranked store and only the top of it
   is sent.

   Everything drawn or counted comes off ASSETS, EDGES, ROUNDS and SNIPPETS.
   Node size, rank order, the frontier the crawl never crossed, the never-reached
   dimming and every number in the counter strip are computed from those four —
   so a counter cannot claim something the picture does not draw. Positions are
   authored rather than simulated, which keeps the drawing identical between the
   two states and worth asserting a screenshot against. */
DECK.registerViz('30-genie-ontology', (slide) => {
  const Q = '\u201cWhat was enterprise churn last quarter?\u201d';

  /* The same eight assets either way. `authored` is the modeled layer a human
     writes in Unity Catalog; the rest are assets Genie extracts knowledge from.
     Everything here is inside Databricks — external documents do not feed the
     ontology, so none are drawn. `bx`/`by` are band-local fractions: the crawl's
     corner is deliberately the left of the network and the certified and
     governed assets are the right of it, so the crawl can be seen working the
     wrong end. */
  const ASSETS = [
    { id: 'stg', name: 'stg_account_v2', kind: 'table \u00b7 draft', draft: true, bx: .13, by: .50, place: 'below' },
    { id: 'dash', name: 'Churn QBR', kind: 'dashboard', bx: .36, by: .15, place: 'above' },
    { id: 'sql', name: 'enterprise_cohort.sql', kind: 'query', bx: .34, by: .82, place: 'below' },
    { id: 'nb', name: 'churn_backtest.ipynb', kind: 'notebook', bx: .10, by: .90, place: 'below' },
    { id: 'mv', name: 'mv.churn_rate', kind: 'metric view', certified: true, authored: true, bx: .68, by: .42, place: 'above' },
    { id: 'dim', name: 'dim_account', kind: 'table', certified: true, bx: .62, by: .78, place: 'below' },
    { id: 'page', name: 'Page \u00b7 \u201cEnterprise\u201d', kind: 'glossary', authored: true, bx: .90, by: .16, place: 'above' },
    { id: 'agent', name: 'Finance Genie Agent', kind: 'genie agent', bx: .93, by: .60, place: 'below' },
  ];
  const BY = new Map(ASSETS.map(a => [a.id, a]));

  /* Which asset references which. This is the only place connectivity is
     stated: the crawl's reachable set, the frontier it died on and every
     authority score are read off it. */
  const EDGES = [
    ['dash', 'stg'], ['sql', 'stg'], ['nb', 'stg'],
    ['dash', 'mv'], ['sql', 'dim'],
    ['mv', 'dim'], ['page', 'mv'], ['page', 'dim'], ['agent', 'mv'],
  ];
  const ADJ = new Map(ASSETS.map(a => [a.id, []]));
  EDGES.forEach(([a, b]) => { ADJ.get(a).push(b); ADJ.get(b).push(a); });

  /* The crawl, round by round: a name match, then two of the things that
     reference it, then the last one. Each round is checked against EDGES at
     load, so a round can never contain an asset the crawl had no way to reach. */
  const ROUNDS = [['stg'], ['dash', 'sql'], ['nb']];
  const SEED = ROUNDS[0][0];
  const PULLED = ROUNDS.flat();
  const SEEN = new Set(PULLED);
  ROUNDS.slice(1).forEach((round, i) => {
    const prior = new Set(ROUNDS.slice(0, i + 1).flat());
    round.forEach(id => {
      if (!ADJ.get(id).some(n => prior.has(n))) throw new Error(`crawl round ${i + 2} cannot reach ${id}`);
    });
  });
  const ROUND_OF = new Map();
  ROUNDS.forEach((round, i) => round.forEach(id => ROUND_OF.set(id, i + 1)));

  /* What the last reference lookup surfaced and the budget never let it pull —
     both certified assets, one step past where it stopped. */
  const FRONTIER = EDGES
    .filter(([a, b]) => (SEEN.has(a) && !SEEN.has(b)) || (SEEN.has(b) && !SEEN.has(a)))
    .map(([a, b]) => (SEEN.has(a) ? b : a));
  const FRONTIER_EDGES = EDGES.filter(([a, b]) => (SEEN.has(a) && !SEEN.has(b)) || (SEEN.has(b) && !SEEN.has(a)));
  const CRAWL_EDGES = EDGES.filter(([a, b]) => SEEN.has(a) && SEEN.has(b));
  const MISSED = ASSETS.filter(a => !SEEN.has(a.id));
  /* a pull is a dead end when everything it references was already in hand */
  const DEAD = PULLED.filter(id => id !== SEED && ADJ.get(id).every(n => SEEN.has(n)));
  /* one reference lookup per round — the last one surfaced the frontier and had
     nothing left to spend on it */
  const ASKS = ROUNDS.length;
  const TRIPS = PULLED.length + ASKS;

  /* Authority in the public terms: a definition counts for more when it sits on
     a certified or governed asset, and more again when the assets around it are
     certified or governed themselves. One pass over the neighbours is enough to
     make the ordering fall out of the network rather than be asserted over it. */
  const base = a => 1 + (a.certified ? 1.5 : 0) + (a.authored ? 1.5 : 0) - (a.draft ? .4 : 0);
  const SCORE = new Map(ASSETS.map(a =>
    [a.id, base(a) + .6 * ADJ.get(a.id).reduce((sum, n) => sum + base(BY.get(n)), 0)]));
  const SMAX = Math.max(...SCORE.values());
  const SMIN = Math.min(...SCORE.values());
  /* every ranking mark on the canvas — node radius and bar width both — reads
     off this one number, so size cannot disagree with order */
  const norm = id => (SCORE.get(id) - SMIN) / (SMAX - SMIN);

  /* The knowledge the store holds, ranked by the authority of the asset it came
     from. The kinds are the three the public docs name — metric definitions,
     authoritative sources and business rules — plus the governed Page, which
     wins over anything inferred and gets cited. */
  const SNIPPETS = [
    { from: 'mv', kind: 'metric definition' },
    { from: 'dim', kind: 'authoritative source' },
    { from: 'page', kind: 'governed definition', cited: true },
    { from: 'agent', kind: 'authoritative source' },
    { from: 'sql', kind: 'business rule' },
  ].sort((a, b) => SCORE.get(b.from) - SCORE.get(a.from));
  const SENT = 3;
  const TOP = SNIPPETS.slice(0, SENT);

  const COUNTS = {
    without: [
      [String(TRIPS), 'round trips', 'hot'],
      [String(DEAD.length), DEAD.length === 1 ? 'dead end' : 'dead ends', 'hot'],
      [`${MISSED.length} of ${ASSETS.length}`, 'never reached', 'hot'],
    ],
    with: [
      ['1', 'lookup at question time', 'good'],
      ['0', 'dead ends', 'good'],
      ['0', 'never reached', 'good'],
    ],
  };

  /* Fractions of the stage. The banner, the network band, the list band, the
     window and the agent are addressed identically in both states, so switching
     cannot move any of them. */
  const BAN = { x0: .012, x1: .988, y0: .015, y1: .125 };
  const NET = { x0: .034, x1: .400, y0: .240, y1: .930 };
  const LIST = { x0: .452, x1: .662 };
  const WIN = { x0: .742, x1: .988, y0: .225, y1: .740 };
  const BAND = { x0: .020, x1: .690, y0: .160, y1: .975 };
  const HEAD_Y = .205;
  const AGENT = { x: .865, y: .885 };
  const DIV_X = .706;
  const MID_Y = .500;

  const PLACE = {
    below: r => ({ dx: 0, dy: r + 14, anchor: 'middle' }),
    above: r => ({ dx: 0, dy: -(r + 9), anchor: 'middle' }),
  };

  let mode = 'without';

  function draw() {
    const host = slide.querySelector('#viz-genie-ontology');
    if (!host) return;
    const { svg, w, h } = newSvg(host);
    const on = mode === 'with';
    const small = w < 900;
    const X = f => f * w;
    const Y = f => f * h;
    const fz = (big, sm) => (small ? sm : big);

    const defs = svg.append('defs');
    const marker = (id, color, size) => {
      defs.append('marker').attr('id', id)
        .attr('viewBox', '0 -4 8 8').attr('refX', 7).attr('refY', 0)
        .attr('markerWidth', size).attr('markerHeight', size).attr('orient', 'auto')
        .append('path').attr('d', 'M0,-4L8,0L0,4').attr('fill', color);
    };
    marker('go-sig', C.signal, 5.5);
    marker('go-amber', C.amber, 5.5);
    marker('go-green', C.green, 5.5);
    marker('go-faint', C.faint, 5);

    const tag = (x, y, text, o = {}) => svg.append('text').attr('class', 'axis-label')
      .attr('x', x).attr('y', y)
      .attr('text-anchor', o.anchor || 'start')
      .attr('fill', o.fill || C.dim)
      .style('font-size', o.size || fz('9px', '7.5px'))
      .attr('stroke', C.panel).attr('stroke-width', o.halo ?? 3).attr('paint-order', 'stroke')
      .text(text);
    const strong = (x, y, text, o = {}) => svg.append('text')
      .attr('x', x).attr('y', y).attr('text-anchor', o.anchor || 'start')
      .attr('font-family', 'var(--display)').attr('font-weight', o.weight || 700)
      .attr('font-size', o.size || fz('11px', '9px')).attr('fill', o.fill || C.ink)
      .attr('stroke', C.panel).attr('stroke-width', 3.5).attr('paint-order', 'stroke')
      .text(text);

    /* ── when the work happened · the band behind the two working beats ── */
    svg.append('rect')
      .attr('x', X(BAND.x0)).attr('y', Y(BAND.y0))
      .attr('width', X(BAND.x1) - X(BAND.x0)).attr('height', Y(BAND.y1) - Y(BAND.y0))
      .attr('rx', 12)
      .attr('fill', on ? 'rgba(34,114,180,.05)' : 'rgba(176,96,0,.05)')
      .attr('stroke', on ? 'rgba(34,114,180,.35)' : 'rgba(176,96,0,.32)')
      .attr('stroke-dasharray', on ? '7 5' : null);
    strong(X(BAND.x1) - 12, Y(BAND.y1) - 11,
      on ? 'built before the question \u00b7 continuously, offline' : 'all of it at question time',
      { anchor: 'end', fill: on ? C.blue : C.amber, size: fz('11.5px', '9px') });

    /* ── the question, identical in both states ───────────────────────── */
    const banX = X(BAN.x0);
    const banW = X(BAN.x1) - X(BAN.x0);
    const banY = Y(BAN.y0);
    const banH = Y(BAN.y1) - Y(BAN.y0);
    svg.append('rect').attr('x', banX).attr('y', banY).attr('width', banW).attr('height', banH)
      .attr('rx', 8).attr('fill', 'rgba(34,114,180,.06)');
    svg.append('rect').attr('x', banX).attr('y', banY).attr('width', 3).attr('height', banH)
      .attr('rx', 1.5).attr('fill', C.blue);
    tag(banX + 14, banY + banH * .38, 'one question, asked twice', { fill: C.blue, halo: 0 });
    svg.append('text').attr('x', banX + 14).attr('y', banY + banH * .84)
      .attr('font-family', 'var(--display)').attr('font-weight', 600)
      .attr('font-size', fz('16px', '12px')).attr('fill', C.ink).text(Q);
    tag(banX + banW - 14, banY + banH * .62, 'same eight assets either way', { anchor: 'end', halo: 0 });

    /* ── the network of connected assets, same positions in both states ── */
    const P = a => ({
      x: X(NET.x0) + a.bx * (X(NET.x1) - X(NET.x0)),
      y: Y(NET.y0) + a.by * (Y(NET.y1) - Y(NET.y0)),
    });
    /* radius carries authority on the ranked side and is uniform on the crawl
       side, where nothing has been scored yet */
    const R = a => (on ? fz(7, 5.5) + norm(a.id) * fz(9, 7) : fz(8, 6.5));
    const inkOf = a => (a.authored ? C.blue : a.certified ? C.green : a.draft ? C.amber : C.muted);

    const geom = ([sa, ta], shrink = 0) => {
      const s = P(BY.get(sa));
      const t = P(BY.get(ta));
      const dx = t.x - s.x, dy = t.y - s.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      const rs = R(BY.get(sa)) + 4;
      const rt = R(BY.get(ta)) + 5 + shrink;
      return { x1: s.x + ux * rs, y1: s.y + uy * rs, x2: t.x - ux * rt, y2: t.y - uy * rt };
    };

    tag(X(NET.x0), Y(HEAD_Y), on ? 'connected assets, already scored' : 'the agent starts cold', { fill: on ? C.blue : C.amber });

    /* every edge, quietly, in both states — on the ranked side it carries no
       arrowheads, because nothing walks it */
    svg.append('g').selectAll('line').data(EDGES).join('line')
      .attr('x1', d => geom(d).x1).attr('y1', d => geom(d).y1)
      .attr('x2', d => geom(d).x2).attr('y2', d => geom(d).y2)
      .attr('stroke', C.line).attr('stroke-width', 1.2)
      .attr('opacity', d => (on ? .95 : (SEEN.has(d[0]) && SEEN.has(d[1]) ? 0 : .4)));

    if (!on) {
      /* ── the discovery loop ─────────────────────────────────────────── */
      /* the traversals it actually made, pointing away from the seed */
      svg.append('g').selectAll('line').data(CRAWL_EDGES).join('line')
        .attr('x1', d => geom(d[1] === SEED ? [d[1], d[0]] : d).x1)
        .attr('y1', d => geom(d[1] === SEED ? [d[1], d[0]] : d).y1)
        .attr('x2', d => geom(d[1] === SEED ? [d[1], d[0]] : d).x2)
        .attr('y2', d => geom(d[1] === SEED ? [d[1], d[0]] : d).y2)
        .attr('stroke', C.signal).attr('stroke-width', 2.2).attr('opacity', .92)
        .attr('marker-end', 'url(#go-sig)');

      /* what the last lookup surfaced and the budget never let it pull */
      FRONTIER_EDGES.forEach(pair => {
        const d = SEEN.has(pair[0]) ? pair : [pair[1], pair[0]];
        const g = geom(d, 16);
        svg.append('line')
          .attr('x1', g.x1).attr('y1', g.y1).attr('x2', g.x2).attr('y2', g.y2)
          .attr('stroke', C.danger).attr('stroke-width', 1.6)
          .attr('stroke-dasharray', '4 4').attr('opacity', .6);
        svg.append('g').attr('transform', `translate(${g.x2},${g.y2})`)
          .call(sel => {
            sel.append('line').attr('x1', -4).attr('y1', -4).attr('x2', 4).attr('y2', 4)
              .attr('stroke', C.danger).attr('stroke-width', 1.8);
            sel.append('line').attr('x1', 4).attr('y1', -4).attr('x2', -4).attr('y2', 4)
              .attr('stroke', C.danger).attr('stroke-width', 1.8);
          });
      });

      /* the cycle itself, drawn around the corner the crawl is stuck in, with
         one reference lookup on it per round */
      const crawlPts = PULLED.map(id => P(BY.get(id)));
      const cx = (Math.min(...crawlPts.map(p => p.x)) + Math.max(...crawlPts.map(p => p.x))) / 2;
      const cy = (Math.min(...crawlPts.map(p => p.y)) + Math.max(...crawlPts.map(p => p.y))) / 2;
      const rx = (Math.max(...crawlPts.map(p => p.x)) - Math.min(...crawlPts.map(p => p.x))) / 2 + fz(46, 34);
      const ry = (Math.max(...crawlPts.map(p => p.y)) - Math.min(...crawlPts.map(p => p.y))) / 2 + fz(40, 30);
      const at = deg => {
        const t = (deg * Math.PI) / 180;
        return { x: cx + rx * Math.cos(t), y: cy + ry * Math.sin(t) };
      };
      const a0 = at(-72);
      const a1 = at(-108);
      svg.append('path')
        .attr('d', `M${a0.x},${a0.y} A${rx},${ry} 0 1 1 ${a1.x},${a1.y}`)
        .attr('fill', 'none').attr('stroke', C.amber).attr('stroke-width', 1.6)
        .attr('stroke-dasharray', '6 5').attr('opacity', .85)
        .attr('marker-end', 'url(#go-amber)');

      /* one lookup station per round, spread around the cycle */
      [200, 300, 30].slice(0, ASKS).forEach(deg => {
        const p = at(deg);
        svg.append('rect')
          .attr('x', p.x - 5).attr('y', p.y - 5).attr('width', 10).attr('height', 10)
          .attr('transform', `rotate(45 ${p.x} ${p.y})`)
          .attr('fill', C.panel).attr('stroke', C.amber).attr('stroke-width', 1.8);
      });
      strong(cx, cy - ry - 10, 'where is this referenced?',
        { anchor: 'middle', fill: C.amber, size: fz('11.5px', '9px') });
      tag(at(-90).x, cy + ry + 17, 'repeat', { anchor: 'middle', fill: C.amber });
    }

    /* ── the assets themselves, over the links ────────────────────────── */
    const node = svg.append('g').selectAll('g').data(ASSETS).join('g')
      .attr('transform', d => `translate(${P(d).x},${P(d).y})`)
      .attr('opacity', d => (on || SEEN.has(d.id) ? 1 : .42));
    /* the frontier keeps a ring on the crawl side: surfaced, never pulled */
    node.filter(d => !on && FRONTIER.includes(d.id)).append('circle')
      .attr('r', d => R(d) + 6).attr('fill', 'none')
      .attr('stroke', C.danger).attr('stroke-width', 1.4).attr('stroke-dasharray', '3 3');
    node.append('circle')
      .attr('r', R)
      .attr('fill', d => (on || SEEN.has(d.id) ? inkOf(d) : C.panel))
      .attr('stroke', d => (on || SEEN.has(d.id) ? C.panel : inkOf(d)))
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', d => (d.draft ? '3 2' : null));
    node.append('text').attr('class', 'node-label')
      .attr('text-anchor', d => PLACE[d.place](R(d)).anchor)
      .attr('dx', d => PLACE[d.place](R(d)).dx)
      .attr('dy', d => PLACE[d.place](R(d)).dy)
      .style('font-size', fz('10.5px', '8.5px'))
      .style('fill', d => (on || SEEN.has(d.id) ? C.ink : C.dim))
      .attr('stroke', C.panel).attr('stroke-width', 3.5).attr('paint-order', 'stroke')
      .text(d => d.name);
    /* round badges on the crawl side, rank chips on the ranked side — the same
       slot either way, so the two readings of one network line up */
    if (!on) {
      node.filter(d => SEEN.has(d.id)).append('g')
        .attr('transform', d => `translate(${-R(d) - 8},${-R(d) - 6})`)
        .call(sel => {
          sel.append('circle').attr('r', fz(8, 6.5))
            .attr('fill', C.signal).attr('stroke', C.panel).attr('stroke-width', 1.6);
          sel.append('text').attr('text-anchor', 'middle').attr('dy', '.34em')
            .attr('font-family', 'var(--display)').attr('font-weight', 700)
            .attr('font-size', fz('9px', '7.5px')).attr('fill', C.panel)
            .text(d => ROUND_OF.get(d.id));
        });
      DEAD.forEach(id => {
        const p = P(BY.get(id));
        tag(p.x + R(BY.get(id)) + 9, p.y + 3, 'dead end', { fill: C.danger });
      });
    }

    /* ── the middle beat: what came back ─────────────────────────────── */
    const lx = X(LIST.x0);
    const lw = X(LIST.x1) - X(LIST.x0);
    const rows = on ? SNIPPETS : PULLED;
    const listTop = Y(.265);
    const listBot = Y(.900);
    const pitch = (listBot - listTop) / rows.length;
    const rowH = Math.min(fz(40, 30), pitch * .80);
    const rowY = i => listTop + (i + .5) * pitch;

    tag(lx, Y(HEAD_Y), on ? 'ranked knowledge' : 'returned \u00b7 unranked',
      { fill: on ? C.blue : C.amber });

    if (on) {
      /* the collapse: each ranked row drawn back to the asset it came from, so
         position in the network is visibly what put it where it is */
      SNIPPETS.forEach((s, i) => {
        const p = P(BY.get(s.from));
        const x0 = p.x + R(BY.get(s.from)) + 3;
        const y1 = rowY(i);
        const mx = (x0 + lx) / 2;
        svg.append('path')
          .attr('d', `M${x0},${p.y} C${mx},${p.y} ${mx},${y1} ${lx - 2},${y1}`)
          .attr('fill', 'none').attr('stroke', C.blue)
          .attr('stroke-width', 1).attr('opacity', .34);
      });
    } else {
      /* the pile: one blunt bracket off the whole crawl, no order to it */
      const bx = X(NET.x1) + 12;
      svg.append('path')
        .attr('d', `M${bx},${listTop} L${bx + 10},${Y(MID_Y)} L${bx},${listBot}`)
        .attr('fill', 'none').attr('stroke', C.amber).attr('stroke-width', 1.4).attr('opacity', .5);
      svg.append('line')
        .attr('x1', bx + 10).attr('y1', Y(MID_Y)).attr('x2', lx - 6).attr('y2', Y(MID_Y))
        .attr('stroke', C.amber).attr('stroke-width', 1.6).attr('marker-end', 'url(#go-amber)');
    }

    rows.forEach((row, i) => {
      const y = rowY(i);
      const s = on ? row : null;
      const asset = BY.get(on ? row.from : row);
      const sent = on && i < SENT;
      const hue = on ? (sent ? C.green : C.dim) : C.amber;
      const g = svg.append('g').attr('transform', `translate(${lx},${y})`)
        .attr('opacity', on && !sent ? .5 : 1);
      g.append('rect')
        .attr('x', 0).attr('y', -rowH / 2).attr('width', lw).attr('height', rowH).attr('rx', 6)
        .attr('fill', on
          ? (sent ? 'rgba(0,169,114,.09)' : 'rgba(255,255,255,.6)')
          : 'rgba(176,96,0,.08)')
        .attr('stroke', on ? (sent ? 'rgba(0,169,114,.45)' : C.line) : 'rgba(176,96,0,.32)');
      /* a rank where there is one, and a plain dash where there is not */
      g.append('text').attr('x', 15).attr('dy', '.34em').attr('text-anchor', 'middle')
        .attr('font-family', 'var(--display)').attr('font-weight', 700)
        .attr('font-size', fz('12px', '10px')).attr('fill', hue)
        .text(on ? String(i + 1) : '\u2014');
      g.append('text').attr('x', 30).attr('y', on ? -4 : 0).attr('dy', on ? 0 : '.34em')
        .attr('font-family', 'var(--display)').attr('font-weight', 600)
        .attr('font-size', fz('11px', '9px')).attr('fill', C.ink)
        .text(on ? s.kind : asset.name);
      if (on) {
        g.append('rect').attr('x', 30).attr('y', 4).attr('height', 3.5).attr('rx', 1.75)
          .attr('width', Math.max(8, (lw - 46) * (.42 + .58 * norm(s.from))))
          .attr('fill', sent ? 'rgba(0,169,114,.55)' : 'rgba(117,134,139,.4)');
        if (s.cited) tag(lw - 9, 1, 'cited', { anchor: 'end', fill: C.green, halo: 0 });
      } else {
        tag(lw - 9, 1, asset.kind, { anchor: 'end', halo: 0 });
      }
    });

    /* ── the right beat: the window and the agent, pinned ─────────────── */
    const wx = X(WIN.x0);
    const ww = X(WIN.x1) - X(WIN.x0);
    const wy = Y(WIN.y0);
    const wh = Y(WIN.y1) - Y(WIN.y0);
    const floor = wy + wh - 9;
    tag(wx, Y(HEAD_Y), 'context window');
    svg.append('rect').attr('x', wx).attr('y', wy).attr('width', ww).attr('height', wh)
      .attr('rx', 10).attr('fill', 'rgba(255,255,255,.6)').attr('stroke', C.line);
    const budgetY = wy + wh * .16;

    if (on) {
      /* the divider: everything left of it was already done */
      const dx = X(DIV_X);
      svg.append('line')
        .attr('x1', dx).attr('y1', Y(.175)).attr('x2', dx).attr('y2', Y(.955))
        .attr('stroke', C.blue).attr('stroke-width', 1).attr('stroke-dasharray', '3 5').attr('opacity', .5);
      tag(dx + 7, Y(.955), 'at question time', { fill: C.signal });

      /* one lookup, against a store that already exists */
      const qx = X(LIST.x1) - lw * .34;
      svg.append('line')
        .attr('x1', qx).attr('y1', Y(BAN.y1) + 4).attr('x2', qx).attr('y2', listTop - rowH / 2 - 5)
        .attr('stroke', C.signal).attr('stroke-width', 2.4).attr('marker-end', 'url(#go-sig)');
      strong(qx + 9, Y(HEAD_Y), 'one lookup', { fill: C.signal, size: fz('11.5px', '9px') });

      /* only the top of the ranking is sent */
      const topMid = (rowY(0) + rowY(SENT - 1)) / 2;
      svg.append('line')
        .attr('x1', X(LIST.x1) + 6).attr('y1', topMid).attr('x2', wx - 8).attr('y2', topMid)
        .attr('stroke', C.green).attr('stroke-width', 2).attr('marker-end', 'url(#go-green)');
      strong((X(LIST.x1) + wx) / 2, topMid - 9, 'top-ranked only',
        { anchor: 'middle', fill: C.green, size: fz('11px', '9px') });
      tag((X(LIST.x1) + wx) / 2, topMid + 15, 'permission-filtered', { anchor: 'middle', fill: C.green });
      tag(X(LIST.x1) + 6, rowY(SNIPPETS.length - 1) + 3, 'not sent');

      /* what arrives: one block per sent row, nowhere near the budget */
      const bh = fz(21, 16);
      TOP.forEach((s, i) => {
        const top = floor - (i + 1) * bh - i * 4;
        svg.append('rect')
          .attr('x', wx + 11).attr('y', top).attr('width', ww - 22).attr('height', bh).attr('rx', 4)
          .attr('fill', 'rgba(0,169,114,.13)').attr('stroke', 'rgba(0,169,114,.42)');
        tag(wx + 19, top + bh / 2 + 3, s.kind, { fill: C.green, halo: 0 });
      });
    } else {
      /* the dump: everything it touched, in one undifferentiated mass that runs
         past the budget line */
      strong((X(LIST.x1) + wx) / 2, Y(MID_Y) - 10, 'prompt-stuffed',
        { anchor: 'middle', fill: C.amber, size: fz('12px', '9.5px') });
      svg.append('line')
        .attr('x1', X(LIST.x1) + 6).attr('y1', Y(MID_Y)).attr('x2', wx - 8).attr('y2', Y(MID_Y))
        .attr('stroke', C.amber).attr('stroke-width', 7).attr('opacity', .85)
        .attr('marker-end', 'url(#go-amber)');

      const mass = wh * .74;
      svg.append('rect')
        .attr('x', wx + 11).attr('y', floor - mass).attr('width', ww - 22).attr('height', mass).attr('rx', 5)
        .attr('fill', 'rgba(176,96,0,.16)').attr('stroke', 'rgba(176,96,0,.45)');
      PULLED.forEach((id, i) => {
        const y = floor - mass + 15 + i * ((mass - 22) / PULLED.length);
        svg.append('line')
          .attr('x1', wx + 19).attr('y1', y + 4).attr('x2', wx + ww - 19).attr('y2', y + 4)
          .attr('stroke', 'rgba(176,96,0,.3)');
        tag(wx + 19, y, BY.get(id).name, { fill: C.amber, halo: 0 });
      });
      strong(wx + 19, floor - mass - 9, 'everything it touched',
        { fill: C.danger, size: fz('11px', '9px') });
    }

    /* the budget line last, so the mass reads as running through it */
    svg.append('line')
      .attr('x1', wx + 6).attr('y1', budgetY).attr('x2', wx + ww - 6).attr('y2', budgetY)
      .attr('stroke', on ? C.dim : C.danger).attr('stroke-width', on ? 1 : 1.6)
      .attr('stroke-dasharray', '4 4');
    tag(wx + ww - 7, budgetY - 6, 'budget', { anchor: 'end', fill: on ? C.dim : C.danger, halo: 0 });

    /* ── the agent, same place in both states ─────────────────────────── */
    const apX = X(AGENT.x);
    const apY = Y(AGENT.y);
    const apW = fz(126, 100);
    const apH = fz(27, 22);
    svg.append('line')
      .attr('x1', apX).attr('y1', wy + wh + 4).attr('x2', apX).attr('y2', apY - apH / 2 - 4)
      .attr('stroke', on ? C.green : C.amber).attr('stroke-width', 1.6)
      .attr('marker-end', `url(#go-${on ? 'green' : 'amber'})`);
    svg.append('rect')
      .attr('x', apX - apW / 2).attr('y', apY - apH / 2)
      .attr('width', apW).attr('height', apH).attr('rx', apH / 2)
      .attr('fill', on ? 'rgba(0,169,114,.08)' : 'rgba(176,96,0,.08)')
      .attr('stroke', on ? C.green : C.amber).attr('stroke-width', 1.3);
    svg.append('text')
      .attr('x', apX).attr('y', apY).attr('dy', '.34em').attr('text-anchor', 'middle')
      .attr('font-family', 'var(--display)').attr('font-weight', 700)
      .attr('font-size', fz('11px', '9px')).attr('letter-spacing', '.09em')
      .attr('fill', on ? C.green : C.amber)
      .text('AGENT LOOP');

    /* ── the never-reached tally, stated where the misses are drawn ───── */
    if (!on) {
      tag(X(NET.x0), Y(.965), `${MISSED.length} of ${ASSETS.length} never reached`, { fill: C.danger });
    }
  }

  function paint() {
    slide.querySelectorAll('[data-go]').forEach(btn => {
      const active = btn.dataset.go === mode;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    const counts = slide.querySelector('#go-counts');
    if (counts) {
      counts.innerHTML = COUNTS[mode].map(([value, label, cls]) =>
        `<div class="go-count ${cls}"><b>${value}</b><span>${label}</span></div>`).join('');
    }
    draw();
  }

  slide.querySelectorAll('[data-go]').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (mode === btn.dataset.go) return;
      mode = btn.dataset.go;
      paint();
    });
  });

  return { enter: paint };
});
