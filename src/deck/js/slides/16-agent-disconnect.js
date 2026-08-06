/* 16 · the consolidated need — one indexed corpus, two questions, both answered
   wrong. Selecting a document shows its sentence and marks which lane got it. */
DECK.registerViz('16-agent-disconnect', (slide) => {
  const DOCS = {
    a: {
      name: 'Acme Holdings 10-K',
      quote: 'Acme Holdings acquired Beta Logistics in 2021, which now operates as a wholly owned subsidiary.',
      why: 'holds the ownership link, and looks nothing like either question',
    },
    b: {
      name: 'Beta Logistics press release',
      quote: 'Beta Logistics, headquartered in Austin, is led by Chief Operating Officer Priya Raman.',
      why: 'the closest match to the first question, and the reason that lane goes wrong',
    },
    c: {
      name: 'Acme leadership page, 2019',
      quote: 'Maya Okonjo has been Chief Executive of Acme Holdings since 2019.',
      why: 'holds the answer to both questions, and wins neither retrieval',
    },
    d: {
      name: 'Acme annual report, 2018',
      quote: 'Under Chief Executive Ray Duval, Acme Holdings expanded into three new markets.',
      why: 'true when it was written, and nothing in the index says it has since been replaced',
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
    slide.querySelectorAll('.ev[data-doc]').forEach(ev => {
      ev.classList.toggle('sel', ev.dataset.doc === key);
    });
    const quote = slide.querySelector('#gr-quote');
    if (quote) quote.innerHTML = `<b>${doc.name}:</b> “${doc.quote}” — ${doc.why}.`;
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
