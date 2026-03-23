/* ── Active nav state ──────────────────────────────────────── */
(function setActiveNav() {
  var path = window.location.pathname;
  var navWork = document.getElementById('navWork');
  var navAbout = document.getElementById('navAbout');
  if (navWork) navWork.classList.toggle('active', path === '/' || path === '/index.html' || path.indexOf('/grail-') === 0 || path.indexOf('/axlehire-') === 0);
  if (navAbout) navAbout.classList.toggle('active', path.indexOf('/about') === 0);
})();

/* ── Password gate (for protected pages) ──────────────────── */
(function initPasswordGate() {
  var pwOverlay = document.getElementById('pwOverlay');
  var pwInput   = document.getElementById('pwInput');
  var pwError   = document.getElementById('pwError');
  var pwSubmit  = document.getElementById('pwSubmit');
  var pwCancel  = document.getElementById('pwCancel');
  var content   = document.getElementById('protectedContent');

  if (!pwOverlay || !content) return;

  var PW = 'welcometograil';

  function unlock() {
    if (pwInput.value === PW) {
      pwOverlay.classList.remove('open');
      content.style.display = '';
      setTimeout(observeReveal, 50);
      // Re-init lightbox for newly visible content
      initLightbox();
    } else {
      pwInput.classList.add('error');
      pwError.classList.add('show');
      pwInput.value = '';
      setTimeout(function() { pwInput.classList.remove('error'); }, 400);
      setTimeout(function() { pwInput.focus(); }, 80);
    }
  }

  pwSubmit.addEventListener('click', unlock);
  pwInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') unlock(); });
  setTimeout(function() { pwInput.focus(); }, 80);
})();

/* ── Nav scroll ─────────────────────────────────────────────── */
var mainNav = document.getElementById('mainNav');
if (mainNav) {
  window.addEventListener('scroll', function() {
    mainNav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* ── Hamburger ──────────────────────────────────────────────── */
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

/* ── Scroll reveal ──────────────────────────────────────────── */
var revealObserver;
function observeReveal() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.05, rootMargin: '0px 0px 80px 0px' });
  document.querySelectorAll('.reveal').forEach(function(el) { revealObserver.observe(el); });
}
observeReveal();

/* ── Lightbox ──────────────────────────────────────────────── */
var lbOverlay = document.getElementById('lightboxOverlay');
var lbContent = document.getElementById('lightboxContent');
var lbClose   = document.getElementById('lightboxClose');

function openLightbox(el) {
  lbContent.innerHTML = '';
  var img = el.querySelector('img');
  var vid = el.querySelector('video');
  if (img) {
    var clone = document.createElement('img');
    clone.src = img.src;
    clone.alt = img.alt || '';
    lbContent.appendChild(clone);
  } else if (vid) {
    var clone = document.createElement('video');
    clone.src = vid.src;
    clone.autoplay = true;
    clone.loop = true;
    clone.muted = true;
    clone.playsInline = true;
    clone.controls = true;
    lbContent.appendChild(clone);
  } else {
    return;
  }
  lbOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lbOverlay.classList.remove('open');
  document.body.style.overflow = '';
  var vid = lbContent.querySelector('video');
  if (vid) vid.pause();
  lbContent.innerHTML = '';
}

function initLightbox() {
  document.querySelectorAll('.cs-media.clickable').forEach(function(el) {
    el.addEventListener('click', function() { openLightbox(el); });
  });
}
initLightbox();

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lbOverlay) lbOverlay.addEventListener('click', function(e) { if (e.target === lbOverlay) closeLightbox(); });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && lbOverlay && lbOverlay.classList.contains('open')) closeLightbox(); });

/* ── Custom cursor ──────────────────────────────────────────── */
var cursor = document.getElementById('cursor');
if (cursor) {
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .cs-media.clickable').forEach(function(el) {
    el.addEventListener('mouseenter', function() { cursor.classList.add('expanded'); });
    el.addEventListener('mouseleave', function() { cursor.classList.remove('expanded'); });
  });
}
