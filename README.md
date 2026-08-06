# Roadmap to Graph

Databricks customer walkthrough deck — match graph needs to the lowest rung that answers your queries, then climb only with proof.

## Authors

- Christopher Messer
- William Jeffery

## View the deck

- **Live (GitHub Pages):** https://chris-messer.github.io/graph-sme/
- **Local:** open [`index.html`](index.html) in a browser
- **Speaker notes:** from the deck, use **Open speaker notes**, or open [`graph-sme-speaker-notes.html`](graph-sme-speaker-notes.html) (syncs via the `graph-sme-deck` BroadcastChannel)

## Build

The four HTML files in the repo are **generated**. Edit `src/`, then run:

```bash
python3 build.py
```

That regenerates all four outputs from `src/`. No dependencies, no bundler,
no runtime build step — the outputs stay self-contained single-file HTML with
D3 as the only external reference.

| Generated file | Purpose |
|---|---|
| `presentations/graph-sme-walkthrough.html` | Main walkthrough deck |
| `presentations/graph-sme-speaker-notes.html` | Presenter notes paired with the deck |
| `index.html` | Root copy of the deck — what GitHub Pages serves |
| `graph-sme-speaker-notes.html` | Root copy of the notes (its "Open main deck" link points at `index.html`) |

Never hand-edit those four. Each carries a `GENERATED FILE` banner, and the
next build overwrites whatever you put there.

## Repo layout

```
build.py                        single build command
src/
  outline.py                    section / subsection map — the position rail's only source
  deck/
    head.html                   doctype, meta, title, D3 script tag
    chrome.html                 progress bar + position rail + nav hint + "Open speaker notes"
    styles/
      base.css                  tokens, slide shell, typography, footer
      components.css            shared components (viz shell, toolbars, tables, legends)
      rail.css                  the position rail at the top of every slide
      slides/NN-slug.css        per-slide styles, only when a slide needs its own
      responsive.css            the narrow-viewport media query — emitted last
    slides/NN-slug.html         one file per slide: the whole <section class="slide">…</section>
    js/
      core.js                   navigation, sync, progress, per-slide registry
      shared.js                 helpers used by two or more slides
      slides/NN-slug.js         per-slide viz + interaction, self-registering
  notes/
    NN-slug.js                  one speaker-notes entry per slide, same slugs as the slides
    _shell/                     notes head, body markup, styles, runtime
```

### Slide numbering

Slide order comes from the numeric filename prefix, sorted ascending. The
build regenerates the footer counter (`NN / TOTAL`), the eyebrow number, and
the `data-slide-id` from a slide's **position in that order**, so no counter
is ever hand-maintained.

**Gaps in the prefixes are allowed.** Deleting slide `13-…` leaves `12` and
`14` adjacent, and the build simply renumbers the displayed counters — you do
not have to rename the files after it, and you must not renumber slides
outside the range you own. The build prints a note when a prefix no longer
matches its displayed position. Duplicate prefixes are an error.

To insert a slide, pick any unused prefix that sorts into the right place
(e.g. `07a-…` is not valid — use a free number, or renumber only within your
own range).

The build fails loudly when the slide count and notes count disagree, a slide
has no matching notes file, a per-slide JS module registers a slide id that
does not exist, two slides share a numeric prefix, or a filename is not
`NN-slug`.

## Position rail

Every slide carries a rail at the top right showing three levels — which of the
five sections you are in, which subsection within it, and which slide within
that. The active section expands to its subsections and the active subsection
expands to a pip per slide; everything else stays collapsed to its label. All
three levels are clickable and jump to that slide. The rail appears wherever the
eyebrow does, so it is absent on the title and close slides.

`src/outline.py` is the only place the hierarchy is written down. Slides are
named there by **stem** — the slug without its `NN-` prefix — because prefixes
get renumbered and a map keyed on them would rot. Adding a slide therefore means
adding it to a subsection, and the build fails until you do:

- a slide missing from the map, so the rail could not place it
- a stem in the map with no matching slide
- a stem listed twice
- the map's order disagreeing with deck order, which would mean a subsection is
  not a contiguous run of slides

The speaker notes render their `Section › Subsection` breadcrumb from the same
map, so the presenter view can never disagree with the audience view. Neither
carries a hand-maintained section label.

## Per-slide JS contract

`core.js` owns navigation and dispatch. A slide's JS never touches it — it
registers itself against its own slug, and the core calls it back when that
slide becomes active.

```js
/* src/deck/js/slides/07-taxonomy-storage-patterns.js */
DECK.registerViz('07-taxonomy-storage-patterns', (slide) => {
  // Runs once at boot, in slide order. `slide` is this slide's <section>.
  // Attach listeners and set initial state here. Scope DOM queries to
  // `slide` so two slides can never collide.
  slide.querySelectorAll('.enc-chip').forEach(chip => {
    chip.addEventListener('click', (ev) => {
      ev.stopPropagation();
      setEncoding(chip.dataset.enc);
    });
  });

  return {
    // Optional. Runs every time the slide becomes active, and again after a
    // debounced window resize. This is where D3 renders, because widths are
    // only meaningful once the slide is on screen.
    enter() { setEncoding(slide.querySelector('.enc-chip.active')?.dataset.enc || 'flattened'); },

    // Optional. Runs when the slide stops being active.
    teardown() {},
  };
});
```

Rules:

- The registered id **must** equal the filename slug, and a
  `src/deck/slides/<slug>.html` must exist. The build enforces both.
- Returning a bare function is shorthand for `{ enter }`. Returning nothing is
  fine for slides whose behavior is all set up once (see `05-ladder.js`).
- `DECK` is also on `window.DECK` if you need it from a console.
- Symbols declared in `shared.js` — `C` (colors), `newSvg`, `clearHost`,
  `sizeOf`, `arrowDef`, `endId`, `neighborhood`, and the product-hierarchy
  model and `drawEncoding` — are in scope for every module. Put something
  there only when two or more slides need it.

## Which files to touch

To change slide *N*, edit only these — nothing else in the repo, so several
agents can work on different slides at the same time:

| What you are changing | File |
|---|---|
| Slide markup and copy | `src/deck/slides/NN-slug.html` |
| Slide-only styles | `src/deck/styles/slides/NN-slug.css` (create if absent) |
| Slide visuals and interactions | `src/deck/js/slides/NN-slug.js` (create if absent) |
| Speaker notes for that slide | `src/notes/NN-slug.js` |

Then run `python3 build.py`.

Shared files — `core.js`, `shared.js`, `base.css`, `components.css`,
`responsive.css`, `head.html`, `chrome.html`, `src/notes/_shell/` — affect
every slide. Coordinate before editing them.
