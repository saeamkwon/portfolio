/* ── Page switching ─────────────────────────────────────────── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.getElementById('navWork').classList.toggle('active', id === 'home' || id.startsWith('case-'));
  document.getElementById('navAbout').classList.toggle('active', id === 'about');
  window.scrollTo({ top: 0, behavior: 'instant' });
  setTimeout(observeReveal, 50);
}

/* ── Password gate ──────────────────────────────────────────── */
const PROTECTED = ['case-telemedicine', 'case-clinical'];
const PW        = 'welcometograil';
const unlocked  = new Set();

const pwOverlay = document.getElementById('pwOverlay');
const pwInput   = document.getElementById('pwInput');
const pwError   = document.getElementById('pwError');
const pwSubmit  = document.getElementById('pwSubmit');
const pwCancel  = document.getElementById('pwCancel');
let   pendingPage = null;

function tryPage(id) {
  if (!PROTECTED.includes(id) || unlocked.has(id)) {
    showPage(id);
    return;
  }
  pendingPage = id;
  pwInput.value = '';
  pwInput.classList.remove('error');
  pwError.classList.remove('show');
  pwOverlay.classList.add('open');
  setTimeout(() => pwInput.focus(), 80);
}

function closePwModal() {
  pwOverlay.classList.remove('open');
  pendingPage = null;
}

function attemptUnlock() {
  if (pwInput.value === PW) {
    const targetPage = pendingPage;
    unlocked.add(targetPage);
    closePwModal();
    showPage(targetPage);
  } else {
    pwInput.classList.add('error');
    pwError.classList.add('show');
    pwInput.value = '';
    setTimeout(() => pwInput.classList.remove('error'), 400);
    setTimeout(() => pwInput.focus(), 80);
  }
}

pwSubmit.addEventListener('click', attemptUnlock);
pwCancel.addEventListener('click', closePwModal);
pwOverlay.addEventListener('click', e => { if (e.target === pwOverlay) closePwModal(); });
pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') attemptUnlock(); });

/* ── Nav scroll ─────────────────────────────────────────────── */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ── Hamburger ──────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

/* ── Scroll reveal ──────────────────────────────────────────── */
let revealObserver;
function observeReveal() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.page.active .reveal').forEach(el => revealObserver.observe(el));
}
observeReveal();

/* ── Lightbox ──────────────────────────────────────────────── */
const lbOverlay = document.getElementById('lightboxOverlay');
const lbContent = document.getElementById('lightboxContent');
const lbClose   = document.getElementById('lightboxClose');

function openLightbox(el) {
  lbContent.innerHTML = '';
  const img = el.querySelector('img');
  const vid = el.querySelector('video');
  if (img) {
    const clone = document.createElement('img');
    clone.src = img.src;
    clone.alt = img.alt || '';
    lbContent.appendChild(clone);
  } else if (vid) {
    const clone = document.createElement('video');
    clone.src = vid.src;
    clone.autoplay = true;
    clone.loop = true;
    clone.muted = true;
    clone.playsInline = true;
    clone.controls = true;
    lbContent.appendChild(clone);
  } else {
    return; // no media yet (placeholder), don't open
  }
  lbOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lbOverlay.classList.remove('open');
  document.body.style.overflow = '';
  const vid = lbContent.querySelector('video');
  if (vid) vid.pause();
  lbContent.innerHTML = '';
}

document.querySelectorAll('.cs-media.clickable').forEach(el => {
  el.addEventListener('click', () => openLightbox(el));
});
lbClose.addEventListener('click', closeLightbox);
lbOverlay.addEventListener('click', e => { if (e.target === lbOverlay) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && lbOverlay.classList.contains('open')) closeLightbox(); });

/* ── Custom cursor ──────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a, button, .cs-media.clickable').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
});