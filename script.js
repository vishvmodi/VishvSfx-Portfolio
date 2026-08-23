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
(function initCompareSlider() {
  const frame = document.getElementById('ctrFrame');
  if (!frame) return;

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const setPos = (pct) => {
    const clamped = clamp(pct, 0, 100);
    frame.style.setProperty('--pos', `${clamped}%`);
    frame.setAttribute('aria-valuenow', String(Math.round(clamped)));
  };

  const posFromClientX = (clientX) => {
    const rect = frame.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  };

  let dragging = false;

  frame.addEventListener('pointerdown', (e) => {
    dragging = true;
    frame.setPointerCapture(e.pointerId);
    setPos(posFromClientX(e.clientX));
  });

  frame.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    setPos(posFromClientX(e.clientX));
  });

  const stopDrag = () => {
    dragging = false;
  };

  frame.addEventListener('pointerup', stopDrag);
  frame.addEventListener('pointercancel', stopDrag);

  frame.addEventListener('keydown', (e) => {
    const current = parseFloat(frame.style.getPropertyValue('--pos')) || 50;
    if (e.key === 'ArrowLeft') {
      setPos(current - 5);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      setPos(current + 5);
      e.preventDefault();
    }
  });
})();

// ============================================
// NEW: Scroll-reveal for the 3 new sections
// Same fade/slide pattern as the existing
// reveal system, kept as its own observer so
// nothing above this block needs to change.
// ============================================
const newRevealTargets = document.querySelectorAll(
  '.testi-card, .ctr-compare'
);

newRevealTargets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const newSectionsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          newSectionsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  newRevealTargets.forEach((el) => newSectionsObserver.observe(el));
} else {
  newRevealTargets.forEach((el) => el.classList.add('is-visible'));
}


// ============================================
// SMOOTH SCROLL FOR ALL ANCHOR LINKS
// ============================================
(function initSmoothAnchorScroll() {

  function smoothScrollTo(targetY, duration = 700) {
    const start = window.scrollY;
    const distance = targetY - start;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out
      const eased = 1 - Math.pow(1 - progress, 4);

      window.scrollTo(
        0,
        start + distance * eased
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  // Find every link that points to a section
  document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener('click', function(e) {

      const targetId = this.getAttribute('href');

      // Ignore empty "#"
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);

      if (!target) return;

      e.preventDefault();

      // Account for your sticky navigation
      const nav = document.querySelector('.nav');
      const navOffset = nav
        ? nav.getBoundingClientRect().height + 16
        : 16;

      const targetY =
        target.getBoundingClientRect().top +
        window.scrollY -
        navOffset;

      smoothScrollTo(targetY);

      // Update URL without jumping
      history.pushState(null, '', targetId);
    });

  });

})();


// ============================================
// BACK TO TOP
// ============================================
(function initBackToTop() {
  const btn = document.getElementById('backToTop');

  if (!btn) {
    console.error('Back to Top button #backToTop was not found.');
    return;
  }

  // Show / hide button
  function updateButton() {
    btn.classList.toggle('is-visible', window.scrollY > 480);
  }

  window.addEventListener('scroll', updateButton, {
    passive: true
  });

  updateButton();

  // Smooth scroll to top
  btn.addEventListener('click', function (e) {
    e.preventDefault();

    const start = window.scrollY;
    const duration = 700;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out
      const eased = 1 - Math.pow(1 - progress, 4);

      window.scrollTo(0, start * (1 - eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  });
})();
