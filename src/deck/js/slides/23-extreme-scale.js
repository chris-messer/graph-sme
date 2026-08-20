/* 23 · Extreme scale — stepping the rail shrinks what is still allowed to run
   at query time until nothing global does. */
DECK.registerViz('23-extreme-scale', (slide) => {
  const SCALE = {
    1: {
      queryShare: 100,
      approach: 'NetworkX in a serverless notebook. Load the edges, run the algorithm, write the results back to Delta.',
      breaks: 'Nothing yet. Most first engagements live here, and it is a legitimate destination rather than a stepping stone.',
    },
    2: {
      queryShare: 45,
      approach: 'Distributed Spark, or SparkGraph choosing driver, coarsen-then-solve, or fully distributed execution for you.',
      breaks: 'Interactive recompute. Once an algorithm takes minutes it cannot sit inside a request.',
    },
    3: {
      queryShare: 9,
      approach: 'A batch graph factory writes typed hub-damped edges and analytics tables; a light traversal engine serves lookups from an endpoint.',
      breaks: 'Embedding the whole graph for vector search, and naive connected components over unfiltered edges.',
    },
    4: {
      queryShare: 3,
      approach: 'Scope the graph to the region or bloc the questions actually live in, and make that cut a parameter rather than a rewrite.',
      breaks: 'Any assumption that the whole estate must load before the first question can be answered.',
    },
  };

  function setScale(n) {
    const tier = SCALE[n];
    if (!tier) return;
    slide.querySelectorAll('.mag-tick').forEach(t => {
      const on = Number(t.dataset.scale) === n;
      t.classList.toggle('active', on);
      t.setAttribute('aria-pressed', String(on));
    });
    const query = slide.querySelector('#qt-query');
    const batch = slide.querySelector('#qt-batch');
    if (query && batch) {
      query.style.width = `${tier.queryShare}%`;
      batch.style.width = `${100 - tier.queryShare}%`;
    }
    const detail = slide.querySelector('#scale-detail');
    if (detail) {
      detail.innerHTML = `
      <div><b>Approach</b><span>${tier.approach}</span></div>
      <div><b>What breaks first</b><span>${tier.breaks}</span></div>`;
    }
  }

  slide.querySelectorAll('.mag-tick').forEach(t => {
    t.addEventListener('click', (ev) => { ev.stopPropagation(); setScale(Number(t.dataset.scale)); });
  });
  setScale(1);
});
