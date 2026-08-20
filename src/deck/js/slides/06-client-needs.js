/* 06 · Client-needs index — every row jumps to the slide that states that need.

   Two rules keep this slide from rotting the next time the deck is renumbered.

   Targets are named by stem in the markup, never by number. A slide's
   data-slide-id is `NN-stem`, so stripping the prefix and matching the stem
   resolves a target through any amount of reordering — the same reason
   src/outline.py is keyed on stems.

   And the jump itself is the rail's, not a second one. The deck moves in
   exactly one place: core.js listens on .rail for a [data-slide] click and
   calls show(). Every slide has a pip in that rail, so a row here resolves its
   target's pip and clicks it. The rail's own state, the progress bar and the
   notes sync then follow for free, and there is nothing here to keep in step
   with core.js later. */
DECK.registerViz('06-client-needs', (slide) => {
  const positions = new Map(
    [...document.querySelectorAll('.slide')].map((el, i) =>
      [(el.dataset.slideId || '').replace(/^\d+-/, ''), i + 1]),
  );

  slide.querySelectorAll('.need-jump').forEach((row) => {
    const stem = row.dataset.need;
    const n = positions.get(stem);
    /* Resolve at boot rather than on click: a target that stopped existing
       should be visible on the slide, not discovered live in front of a room. */
    const target = n
      ? document.querySelector(`.rail .rail-pip[data-slide="${n}"]`)
        || document.querySelector(`.rail [data-slide="${n}"]`)
      : null;

    if (!target) {
      console.error(`06-client-needs: no slide answers to the stem "${stem}"`);
      row.disabled = true;
      return;
    }
    row.addEventListener('click', (ev) => {
      ev.stopPropagation();
      target.click();
    });
  });
});
