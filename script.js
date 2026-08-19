// ============================================
// Mobile nav toggle
// ============================================
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after tapping a link (mobile)
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================
// Scroll-reveal for sections & cards
// ============================================
const revealTargets = document.querySelectorAll(
  '.exp-card, .tool-chip, .thumb, .intro__line, .section__head'
);

revealTargets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

// ============================================
// Live timecode ticker in hero
// ============================================
const timecodeEl = document.querySelector('.hero__timecode');

if (timecodeEl) {
  let seconds = 12;
  setInterval(() => {
    seconds += 1;
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    timecodeEl.innerHTML = `REC <span class="hero__dot"></span> ${h}:${m}:${s}`;
  }, 1000);
}

// ============================================
// Sticky nav shadow on scroll
// ============================================
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (nav) {
    nav.style.boxShadow = current > 12
      ? '0 10px 30px -14px rgba(0,0,0,0.6)'
      : 'none';
  }
  lastScroll = current;
});
