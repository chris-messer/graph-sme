/* 17 · why graphs — the same three records read at two points in time, which is
   what a supersedes edge buys that a vector index cannot express. */
DECK.registerViz('17-graph-answer', (slide) => {
  const RECORDS = [
    {
      fact: 'Acme Holdings —LED_BY→ Ray Duval',
      note: 'Recorded 2018 from the annual report.',
      2018: { state: 'live', tag: 'Current' },
      now: { state: 'gone', tag: 'Superseded by the 2019 record' },
    },
    {
      fact: 'Acme Holdings —LED_BY→ Maya Okonjo',
      note: 'Recorded 2019 from the leadership page.',
      2018: { state: 'future', tag: 'Not yet recorded' },
      now: { state: 'live', tag: 'Current' },
    },
    {
      fact: 'Acme Holdings —LED_BY→ vacant, from Q4',
      note: 'Picked up from an unapproved forum thread.',
      2018: { state: 'blocked', tag: 'Blocked · no citable source' },
      now: { state: 'blocked', tag: 'Blocked · no citable source' },
    },
  ];

  const ANSWERS = {
    2018: '“Acme Holdings is led by Chief Executive Ray Duval.” Correct in 2018, and the record that has to stop being said later.',
    now: '“Acme Holdings is led by Chief Executive Maya Okonjo.” The 2018 fact is not deleted and not repeated — it is retired, and still auditable.',
  };

  const host = slide.querySelector('#mem-rows');
  const answer = slide.querySelector('#mem-answer');
  const buttons = [...slide.querySelectorAll('[data-asof]')];
  let asof = 'now';

  function render() {
    host.innerHTML = RECORDS.map(r => {
      const s = r[asof];
      return `<div class="mem-row ${s.state}">` +
        `<span class="mr-fact">${r.fact}</span>` +
        `<span class="mr-tag">${s.tag}</span>` +
        `<span class="mr-note">${r.note}</span>` +
        '</div>';
    }).join('');
    answer.textContent = ANSWERS[asof];
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      asof = btn.dataset.asof;
      buttons.forEach(b => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      render();
    });
  });

  return { enter: render };
});
