// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  menuBtn.setAttribute('aria-expanded', String(!isOpen));
});

// Reveal on scroll
const revealEls = Array.from(document.querySelectorAll('.reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Animated counters (run once when any .stat first appears)
let countersRan = false;
function animateNumber(el, to, suffix = '') {
  const duration = 1100;
  const start = performance.now();
  const from = 0;

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - t, 3);
    const val = Math.round(from + (to - from) * eased);
    el.textContent = val.toLocaleString() + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  if (countersRan) return;
  const hit = entries.some(e => e.isIntersecting);
  if (!hit) return;

  countersRan = true;
  document.querySelectorAll('[data-count]').forEach(node => {
    const to = Number(node.getAttribute('data-count') || '0');
    const suffix = node.getAttribute('data-suffix') || '';
    animateNumber(node, to, suffix);
  });
}, { threshold: 0.25 });

document.querySelectorAll('.stat').forEach(el => statObserver.observe(el));

// Simple "sparkline" animation for the market card bars
function animateBars() {
  document.querySelectorAll('[data-bar]').forEach((bar, i) => {
    const pct = Number(bar.getAttribute('data-bar') || '0');
    bar.style.height = '0%';
    setTimeout(() => {
      bar.style.height = pct + '%';
      bar.style.transition = 'height 900ms ease';
    }, 150 + i * 120);
  });
}
const barObserver = new IntersectionObserver((entries) => {
  const hit = entries.some(e => e.isIntersecting);
  if (hit) {
    animateBars();
    barObserver.disconnect();
  }
}, { threshold: 0.25 });

const barsCard = document.getElementById('barsCard');
if (barsCard) barObserver.observe(barsCard);

// Smooth-scroll for internal nav
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Close mobile menu after click
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      menuBtn?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Demo form stub (no backend)
const demoForm = document.getElementById('demoForm');
demoForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const ok = document.getElementById('formOk');
  ok?.classList.remove('hidden');
  setTimeout(() => ok?.classList.add('hidden'), 3500);
  demoForm.reset();
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
