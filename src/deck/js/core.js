/* Deck core: navigation, deck↔notes sync, progress, and the per-slide registry.

   Slide modules never edit this file. They call:

     DECK.registerViz('NN-slug', (slide) => {
       // one-time setup, runs at boot in slide order
       return {
         enter() {},     // optional · slide became active (also on resize)
         teardown() {},  // optional · slide stopped being active
       };
     });

   Returning a bare function is shorthand for { enter }. */

const CHANNEL = 'graph-sme-deck';
const STORAGE_KEY = 'graph-sme-slide';
const NOTES_FILE = 'graph-sme-speaker-notes.html';
const NOTES_WINDOW = 'graph-sme-notes';

const slides = [...document.querySelectorAll('.slide')];
const progress = document.querySelector('.progress');
const rail = document.querySelector('.rail');
const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL) : null;
let index = 0;
let touchStartX = null;
let lastNavAt = 0;
let applyingRemote = false;

/* ── per-slide registry ──────────────────────────────────── */
const registered = new Map();
const handles = new Map();
let activeId = null;

const DECK = (window.DECK = {
  registerViz(id, setup) {
    if (registered.has(id)) throw new Error(`DECK.registerViz: duplicate slide id "${id}"`);
    registered.set(id, setup);
  },
  boot,
});

const slideId = slide => slide?.dataset?.slideId || null;
const slideById = id => slides.find(s => slideId(s) === id) || null;

function setupModules() {
  for (const [id, setup] of registered) {
    const slide = slideById(id);
    if (!slide) {
      console.error(`DECK: registered module "${id}" has no matching slide in the deck.`);
      continue;
    }
    const handle = setup(slide) || {};
    handles.set(id, typeof handle === 'function' ? { enter: handle } : handle);
  }
}

function leaveSlide() {
  if (activeId === null) return;
  const id = activeId;
  activeId = null;
  handles.get(id)?.teardown?.(slideById(id));
}

function enterSlide(slide) {
  const id = slideId(slide);
  const handle = id ? handles.get(id) : null;
  if (!handle) return;
  activeId = id;
  if (!handle.enter) return;
  requestAnimationFrame(() => { if (activeId === id) handle.enter(slide); });
}

/* ── position rail ───────────────────────────────────────── */
/* Structure and ranges come from src/outline.py via build.py; this only decides
   which parts are open, past or current for the slide now showing. */
function paintRail(slide) {
  if (!rail) return;
  /* The title and close slides carry no eyebrow and are deliberately bare, so
     the rail follows the eyebrow rather than being listed slide by slide. This
     is the only thing about the active slide the rail reacts to — its position
     is pinned in CSS and must never be derived from the slide. */
  rail.classList.toggle('is-hidden', !slide?.querySelector('.eyebrow'));

  const pos = index + 1;
  const mark = (el) => {
    const from = Number(el.dataset.from);
    const to = Number(el.dataset.to);
    const open = pos >= from && pos <= to;
    el.classList.toggle('is-open', open);
    el.classList.toggle('is-past', pos > to);
    return { from, to, open };
  };

  rail.querySelectorAll('.rail-sec').forEach(sec => {
    const { from, to, open } = mark(sec);
    const fill = sec.querySelector('.rail-fill');
    if (fill) {
      const done = open ? (pos - from + 1) / (to - from + 1) : pos > to ? 1 : 0;
      fill.style.width = `${done * 100}%`;
    }
    sec.querySelector('.rail-sname')?.setAttribute('aria-current', open ? 'step' : 'false');
  });
  rail.querySelectorAll('.rail-sub').forEach(sub => {
    const { open } = mark(sub);
    sub.querySelector('.rail-uname')?.setAttribute('aria-current', open ? 'step' : 'false');
  });
  rail.querySelectorAll('.rail-pip').forEach(pip => {
    const n = Number(pip.dataset.slide);
    pip.classList.toggle('is-here', n === pos);
    pip.classList.toggle('is-past', n < pos);
    pip.setAttribute('aria-current', n === pos ? 'true' : 'false');
  });
}

/* ── navigation + sync ───────────────────────────────────── */
function broadcastSlide(i) {
  try { localStorage.setItem(STORAGE_KEY, String(i)); } catch (_) {}
  if (bc) bc.postMessage({ slideIndex: i, source: 'deck' });
}

function show(next, opts = {}) {
  leaveSlide();
  index = Math.max(0, Math.min(slides.length - 1, next));
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    slide.classList.toggle('past', i < index);
    slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
  });
  progress.style.width = `${((index + 1) / slides.length) * 100}%`;
  paintRail(slides[index]);
  paintBackToIndex(slides[index]);
  history.replaceState(null, '', `#${index + 1}`);
  if (!opts.silent && !applyingRemote) broadcastSlide(index);
  enterSlide(slides[index]);
}

function applyRemote(i) {
  if (!Number.isFinite(i) || i === index) return;
  applyingRemote = true;
  show(i, { silent: true });
  applyingRemote = false;
}

if (bc) {
  bc.onmessage = (event) => {
    const i = event?.data?.slideIndex;
    if (typeof i === 'number') applyRemote(i);
  };
}
window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEY || event.newValue == null) return;
  applyRemote(Number(event.newValue));
});

document.querySelector('#open-notes')?.addEventListener('click', () => {
  const url = new URL(NOTES_FILE, window.location.href);
  url.hash = String(index + 1);
  const win = window.open(url.toString(), NOTES_WINDOW, 'width=520,height=900,menubar=no,toolbar=no,location=no,status=no');
  win?.focus();
  broadcastSlide(index);
});

/* ── back to the client-needs index ──────────────────────── */
/* One control in the footer chrome rather than an affordance per slide, so the
   whole deck gets the same back door and no slide has to know it exists.

   chrome.html names the target by stem, and it is resolved here rather than
   written down as a number: a slug is `NN-stem` and the NN moves on every
   renumber, so a number in this file would rot the way the rail's would. The
   jump itself goes through show(), which is the one thing in the deck that
   moves a slide — the rail's click handler below is the same call. */
const backToIndex = document.querySelector('#back-to-index');
const stemOf = slide => (slideId(slide) || '').replace(/^\d+-/, '');
const indexAt = backToIndex
  ? slides.findIndex(slide => stemOf(slide) === backToIndex.dataset.stem)
  : -1;

if (backToIndex && indexAt < 0) {
  /* Same reasoning as the index slide's own resolver: a target that stopped
     existing should be gone from the chrome, not discovered live in a room. */
  console.error(`DECK: no slide answers to the stem "${backToIndex.dataset.stem}"`);
  backToIndex.remove();
} else if (backToIndex) {
  backToIndex.addEventListener('click', () => show(indexAt));
}

/* Shown only where it means something. Past the index, because before it there
   is nothing to go back to; never on the index itself, where it would be a
   control that does nothing; and never on a slide with no eyebrow, which is the
   rule the rail already follows and is what keeps it off the title and close. */
function paintBackToIndex(slide) {
  if (!backToIndex || indexAt < 0) return;
  backToIndex.hidden = !(index > indexAt && slide?.querySelector('.eyebrow'));
}

/* Arrow keys must keep working after a control is clicked, but Space still
   belongs to a focused button so it can activate it. */
const swallowsKey = (target, key) =>
  target.closest('input, textarea, select') || (key === ' ' && target.closest('button'));

/* Capture phase: in-slide handlers stop propagation, so a bubbling
   listener would never see the click. Rail buttons are blurred for the same
   reason as in-slide ones — a button holding focus would swallow the next
   Space, which is one of the deck's step keys. */
document.addEventListener('click', (event) => {
  const btn = event.target.closest('.deck button, .rail button');
  if (btn) setTimeout(() => btn.blur(), 0);
}, true);

/* Jumping from the rail. Nothing in the deck advances on click, so this is the
   only handler that moves the slide and there is no double-step to guard. */
rail?.addEventListener('click', (event) => {
  const target = event.target.closest('[data-slide]');
  if (!target) return;
  const to = Number(target.dataset.slide) - 1;
  if (Number.isFinite(to)) show(to);
});

document.addEventListener('keydown', (event) => {
  if (swallowsKey(event.target, event.key)) return;
  if (['ArrowRight', 'PageDown', ' ', 'ArrowLeft', 'PageUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault();
  }
});
document.addEventListener('keyup', (event) => {
  if (swallowsKey(event.target, event.key)) return;
  const isStepKey = ['ArrowRight', 'PageDown', ' ', 'ArrowLeft', 'PageUp'].includes(event.key);
  const now = Date.now();
  if (isStepKey && (event.repeat || now - lastNavAt < 180)) return;
  if (isStepKey) lastNavAt = now;
  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) show(index + 1);
  else if (['ArrowLeft', 'PageUp'].includes(event.key)) show(index - 1);
  else if (event.key === 'Home') show(0);
  else if (event.key === 'End') show(slides.length - 1);
});

document.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  if (touchStartX === null) return;
  const delta = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 55) show(index + (delta < 0 ? 1 : -1));
  touchStartX = null;
}, { passive: true });

let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => enterSlide(slides[index]), 220);
});

function boot() {
  setupModules();
  let start = Number(location.hash.slice(1)) - 1;
  if (!Number.isFinite(start) || start < 0) {
    try { start = Number(localStorage.getItem(STORAGE_KEY)); } catch (_) { start = 0; }
  }
  show(Number.isFinite(start) && start >= 0 ? start : 0);
}
