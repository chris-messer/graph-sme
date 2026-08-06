const CHANNEL = 'graph-sme-deck';
const STORAGE_KEY = 'graph-sme-slide';
const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL) : null;
let index = 0;
let applyingRemote = false;
let lastNavAt = 0;

const NOTES = [];
__NOTES_ENTRIES__

/* Section › Subsection per slide, generated from src/outline.py — the same map
   the deck rail is built from. */
const CRUMBS = __OUTLINE_CRUMBS__;

const els = {
  title: document.getElementById('title'),
  section: document.getElementById('section'),
  counter: document.getElementById('counter'),
  onscreen: document.getElementById('onscreen'),
  say: document.getElementById('say'),
  bullets: document.getElementById('bullets'),
  transition: document.getElementById('transition'),
};

function broadcastSlide(i) {
  try { localStorage.setItem(STORAGE_KEY, String(i)); } catch (_) {}
  if (bc) bc.postMessage({ slideIndex: i, source: 'notes' });
}

function render() {
  const note = NOTES[index];
  const n = String(index + 1).padStart(2, '0');
  const total = String(NOTES.length).padStart(2, '0');
  els.title.textContent = note.title;
  els.counter.textContent = `${n} / ${total}`;
  const [section, sub] = CRUMBS[index] || [];
  els.section.innerHTML = section
    ? `<span class="section-tag">${section}<i>›</i>${sub}</span>`
    : '';
  els.onscreen.textContent = note.onscreen;
  els.say.textContent = note.say;
  els.transition.textContent = note.transition;
  els.bullets.innerHTML = (note.bullets || []).map(([heading, items]) => `
    <div class="block">
      <h2>${heading}</h2>
      <ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>
    </div>
  `).join('');
  document.title = `Notes ${n} — ${note.title}`;
}

function show(next, opts = {}) {
  index = Math.max(0, Math.min(NOTES.length - 1, next));
  render();
  history.replaceState(null, '', `#${index + 1}`);
  if (!opts.silent && !applyingRemote) broadcastSlide(index);
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

document.getElementById('prev').addEventListener('click', () => show(index - 1));
document.getElementById('next').addEventListener('click', () => show(index + 1));

document.addEventListener('keydown', (event) => {
  if (['ArrowRight', 'PageDown', ' ', 'ArrowLeft', 'PageUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault();
  }
});
document.addEventListener('keyup', (event) => {
  const isStepKey = ['ArrowRight', 'PageDown', ' ', 'ArrowLeft', 'PageUp'].includes(event.key);
  const now = Date.now();
  if (isStepKey && (event.repeat || now - lastNavAt < 180)) return;
  if (isStepKey) lastNavAt = now;
  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) show(index + 1);
  else if (['ArrowLeft', 'PageUp'].includes(event.key)) show(index - 1);
  else if (event.key === 'Home') show(0);
  else if (event.key === 'End') show(NOTES.length - 1);
});

let start = Number(location.hash.slice(1)) - 1;
if (!Number.isFinite(start) || start < 0) {
  try { start = Number(localStorage.getItem(STORAGE_KEY)); } catch (_) { start = 0; }
}
show(Number.isFinite(start) && start >= 0 ? start : 0, { silent: true });
broadcastSlide(index);
