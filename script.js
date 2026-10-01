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
  document.querySelectorAll('.freelance-svc-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 70}ms`;
  });

  // ================================================================
  // 13. FREELANCE SECTION & FORM INTERACTION
  // ================================================================
  const flCards = document.querySelectorAll('.freelance-svc-card');
  const flTypeSelect = document.getElementById('fl-type');
  const flForm = document.getElementById('freelanceForm');
  const flStatus = document.getElementById('fl-status');
  const flSubmitBtn = document.getElementById('fl-submit-btn');

  // Service card quick-select
  flCards.forEach((card) => {
    card.addEventListener('click', () => {
      flCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const projectType = card.getAttribute('data-type');
      if (flTypeSelect && projectType) {
        flTypeSelect.value = projectType;
      }

      // Smooth scroll to form on mobile
      if (window.innerWidth < 768) {
        const formWrap = document.getElementById('project-form-wrap');
        if (formWrap) {
          formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Form submission
  if (flForm) {
    flForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('fl-name')?.value.trim();
      const email = document.getElementById('fl-email')?.value.trim();
      const phone = document.getElementById('fl-phone')?.value.trim();
      const projectType = document.getElementById('fl-type')?.value;
      const budget = document.getElementById('fl-budget')?.value;
      const deadline = document.getElementById('fl-deadline')?.value.trim();
      const description = document.getElementById('fl-desc')?.value.trim();

      if (!name || !email || !description) {
        if (flStatus) {
          flStatus.className = 'fl-status-box error';
          flStatus.textContent = 'Please fill in all required fields (Name, Email, and Project Details).';
          flStatus.style.display = 'block';
        }
        return;
      }

      // Button loading state
      const originalBtnHtml = flSubmitBtn ? flSubmitBtn.innerHTML : '';
      if (flSubmitBtn) {
        flSubmitBtn.disabled = true;
        flSubmitBtn.innerHTML = `<span>Submitting...</span>`;
      }

      const requestPayload = {
        name,
        email,
        phone,
        projectType,
        budget,
        deadline,
        description
      };

      try {
        // Try posting to local backend if available
        const res = await fetch('http://localhost:5000/api/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload)
        });

        if (res.ok) {
          const data = await res.json();
          if (flStatus) {
            flStatus.className = 'fl-status-box success';
            flStatus.innerHTML = `
              <strong>🎉 Project Request Submitted Successfully!</strong><br>
              ${data.requestId ? `<span style="font-family:'IBM Plex Mono'; font-size:13px;">Request ID: <strong>${data.requestId}</strong></span><br>` : ''}
              Thank you, ${name}! I have received your request and will review it and reply within 24 hours.
            `;
            flStatus.style.display = 'block';
          }
          flForm.reset();
        } else {
          throw new Error('Server responded with error');
        }
      } catch (err) {
        // Fallback: direct WhatsApp message format + direct email
        const waMsg = encodeURIComponent(
          `*New Freelance Project Request*\n\n` +
          `*Name:* ${name}\n` +
          `*Email:* ${email}\n` +
          `*Phone:* ${phone || 'Not provided'}\n` +
          `*Type:* ${projectType}\n` +
          `*Budget:* ${budget}\n` +
          `*Deadline:* ${deadline || 'Flexible'}\n` +
          `*Details:* ${description}`
        );

        if (flStatus) {
          flStatus.className = 'fl-status-box success';
          flStatus.innerHTML = `
            <strong>✅ Request recorded!</strong><br>
            To get the fastest response, send your details directly via WhatsApp:<br>
            <a href="https://wa.me/917985718872?text=${waMsg}" target="_blank" rel="noopener" class="btn btn-wa" style="margin-top:10px; display:inline-flex; font-size:13px; padding:8px 18px;">
              <span>Open in WhatsApp &amp; Send</span> ↗
            </a>
          `;
          flStatus.style.display = 'block';
        }
      } finally {
        if (flSubmitBtn) {
          flSubmitBtn.disabled = false;
          flSubmitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }

})();
