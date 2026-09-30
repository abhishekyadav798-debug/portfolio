/* ================================================================
   ABHISHEK YADAV — PORTFOLIO  |  script.js (v2)
   ================================================================ */

(function () {
  'use strict';

  // ================================================================
  // 1. CUSTOM CURSOR
  // ================================================================
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const hoverTargets = 'a, button, .project-card, .contact-card, .skill-card, .glass';

  if (cursorDot && cursorRing && window.matchMedia('(pointer:fine)').matches) {
    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let rafCursor = null;

    const moveCursor = () => {
      cursorDot.style.left  = mx + 'px';
      cursorDot.style.top   = my + 'px';
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      rafCursor = requestAnimationFrame(moveCursor);
    };

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
    }, { passive: true });

    moveCursor();

    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovered');
        cursorRing.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovered');
        cursorRing.classList.remove('hovered');
      });
    });
  }

  // ================================================================
  // 2. SCROLL PROGRESS BAR
  // ================================================================
  const scrollBar = document.getElementById('scrollBar');
  const updateScrollBar = () => {
    if (!scrollBar) return;
    const scrolled = window.scrollY;
    const maxH = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.width = (maxH > 0 ? (scrolled / maxH) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', updateScrollBar, { passive: true });

  // ================================================================
  // 3. NAVBAR SCROLL STATE
  // ================================================================
  const navbar = document.getElementById('navbar');
  const handleNavScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ================================================================
  // 4. MOBILE NAV TOGGLE
  // ================================================================
  const navToggle      = document.getElementById('navToggle');
  const navMobilePanel = document.getElementById('navMobilePanel');

  if (navToggle && navMobilePanel) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMobilePanel.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    navMobilePanel.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navMobilePanel.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ================================================================
  // 5. ACTIVE NAV LINK ON SCROLL
  // ================================================================
  const sections   = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"], .nav-mobile-panel a[href^="#"]');

  const setActiveNav = () => {
    let current = '';
    sections.forEach((sec) => {
      if (sec.getBoundingClientRect().top < window.innerHeight * 0.45) {
        current = sec.id;
      }
    });
    navAnchors.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  // ================================================================
  // 6. SCROLL REVEAL  (IntersectionObserver)
  // ================================================================
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          io.unobserve(entry.target);
          // Trigger skill bars when they come into view
          entry.target.querySelectorAll('.skill-fill[data-pct]').forEach((bar) => {
            animateBar(bar);
          });
          // Trigger CGPA ring if present
          const ring = entry.target.querySelector('#cgpaRing');
          if (ring) animateCgpaRing(ring);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => {
      el.classList.add('in');
      el.querySelectorAll('.skill-fill[data-pct]').forEach(animateBar);
    });
    const ring = document.getElementById('cgpaRing');
    if (ring) animateCgpaRing(ring);
  }

  // ================================================================
  // 7. SKILL BARS
  // ================================================================
  function animateBar(bar) {
    const pct = parseInt(bar.dataset.pct, 10) || 0;
    requestAnimationFrame(() => { bar.style.width = pct + '%'; });
  }

  // ================================================================
  // 8. CGPA SVG RING  (circumference of r=42 → 2π×42 ≈ 263.9)
  // ================================================================
  function animateCgpaRing(ring) {
    const CIRC = 2 * Math.PI * 42; // ≈ 263.89
    const pct  = 8.01 / 10;
    const fill = pct * CIRC;
    ring.setAttribute('stroke-dasharray', `${fill} ${CIRC}`);
    ring.insertAdjacentHTML('afterend', `
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#8B6CFF"/>
          <stop offset="100%" stop-color="#2FE0C3"/>
        </linearGradient>
      </defs>
    `);
  }

  // ================================================================
  // 9. TYPEWRITER EFFECT
  // ================================================================
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const words = ['Web Developer', 'IT Student', 'Problem Solver', 'Hackathon Builder'];
    let wi = 0, ci = 0, deleting = false;

    const type = () => {
      const word = words[wi];
      if (!deleting) {
        typewriterEl.textContent = word.slice(0, ++ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
        setTimeout(type, 85);
      } else {
        typewriterEl.textContent = word.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
          setTimeout(type, 350);
          return;
        }
        setTimeout(type, 45);
      }
    };
    setTimeout(type, 600);
  }

  // ================================================================
  // 10. HERO PHOTO TILT
  // ================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const profileWrap = document.querySelector('.profile-card-wrap');

  if (profileWrap && !prefersReducedMotion && window.matchMedia('(pointer:fine)').matches) {
    const MAX_TILT = 10;
    profileWrap.style.transformStyle = 'preserve-3d';
    profileWrap.style.transition = 'transform .18s ease';

    profileWrap.addEventListener('mousemove', (e) => {
      const rect = profileWrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      profileWrap.style.transform = `perspective(800px) rotateY(${x * MAX_TILT * 2}deg) rotateX(${-y * MAX_TILT * 2}deg)`;
    });
    profileWrap.addEventListener('mouseleave', () => {
      profileWrap.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    });
  }

  // ================================================================
  // 11. BACK TO TOP BUTTON
  // ================================================================
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggleBTT = () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleBTT, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top:0, behavior:'smooth' });
    });
  }

  // ================================================================
  // 12. STAGGERED REVEAL DELAY for chip-rows & card grids
  // ================================================================
  document.querySelectorAll('.chip-row .chip').forEach((chip, i) => {
    chip.style.transitionDelay = `${i * 50}ms`;
  });
  document.querySelectorAll('.work-grid .project-card, .skills-grid .skill-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
  });
  document.querySelectorAll('.bento > div').forEach((box, i) => {
    box.style.transitionDelay = `${i * 60}ms`;
  });

})();
