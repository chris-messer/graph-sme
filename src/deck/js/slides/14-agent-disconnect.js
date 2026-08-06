/* 14 · the consolidated need — one indexed corpus, two questions, both answered
   wrong. Picking a document opens it as a page and marks which lane retrieved it. */
DECK.registerViz('14-agent-disconnect', (slide) => {
  const DOCS = {
    a: {
      kind: 'Form 10-K',
      title: 'Acme Holdings',
      meta: 'SEC filing · doc A · 2021',
      passage: 'Acme Holdings acquired <mark>Beta Logistics</mark> in 2021, which now operates as a wholly owned subsidiary.',
      note: 'Holds the ownership link — and reads like neither question.',
    },
    b: {
      kind: 'Press release',
      title: 'Beta Logistics',
      meta: 'Austin, TX · doc B · 2023',
      passage: 'Beta Logistics is led by Chief Operating Officer <mark>Priya Raman</mark>.',
      note: 'Closest match to the first question. Wrong company.',
    },
    c: {
      kind: 'Leadership page',
      title: 'Acme Holdings',
      meta: 'acme.com/leadership · doc C · 2019',
      passage: '<mark>Maya Okonjo</mark> has been Chief Executive of Acme Holdings since 2019.',
      note: 'Answers both questions. Wins neither retrieval.',
    },
    d: {
      kind: 'Annual report',
      title: 'Acme Holdings',
      meta: 'FY2018 · doc D · 2018',
      passage: 'Under Chief Executive <mark>Ray Duval</mark>, Acme Holdings expanded into three new markets.',
      note: 'True when it was written. Nothing says it was replaced.',
    },
  };

  function setDoc(key) {
    const doc = DOCS[key];
    if (!doc) return;
    slide.querySelectorAll('.gr-src').forEach(b => {
      const on = b.dataset.doc === key;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    slide.querySelectorAll('.ad-ev[data-doc]').forEach(ev => {
      ev.classList.toggle('sel', ev.dataset.doc === key);
    });
    const set = (id, html) => { const el = slide.querySelector(`#${id}`); if (el) el.innerHTML = html; };
    set('ad-kind', doc.kind);
    set('ad-title', doc.title);
    set('ad-meta', doc.meta);
    set('ad-passage', doc.passage);
    set('ad-note', doc.note);
  }

  slide.querySelectorAll('.gr-src').forEach(b => {
    b.addEventListener('click', (ev) => { ev.stopPropagation(); setDoc(b.dataset.doc); });
  });

  return {
    enter() {
      setDoc(slide.querySelector('.gr-src.active')?.dataset.doc || 'a');
    },
  };
});
