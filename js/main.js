// =====================================================
//  PAGE LOADER
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.setAttribute('aria-hidden', 'true');
      setTimeout(() => loader.remove(), 500);
    }, 800);
  }

  // Update year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// =====================================================
//  THEME TOGGLE
// =====================================================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

// Load saved preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.body.classList.remove('theme-dark');
  document.body.classList.add('theme-light');
  if (themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('theme-light');
    document.body.classList.toggle('theme-dark', !isLight);
    if (themeIcon) {
      themeIcon.classList.toggle('fa-moon', !isLight);
      themeIcon.classList.toggle('fa-sun', isLight);
    }
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// =====================================================
//  HAMBURGER MOBILE MENU
// =====================================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
let mobileMenuOpen = false;

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    mobileMenuOpen = !mobileMenuOpen;
    hamburger.setAttribute('aria-expanded', String(mobileMenuOpen));

    if (mobileMenuOpen) {
      navLinks.classList.add('nav-mobile-open');
      navLinks.style.display = 'flex';
    } else {
      navLinks.classList.remove('nav-mobile-open');
      navLinks.style.display = '';
    }
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuOpen = false;
      hamburger.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('nav-mobile-open');
      navLinks.style.display = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (mobileMenuOpen && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      mobileMenuOpen = false;
      hamburger.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('nav-mobile-open');
      navLinks.style.display = '';
    }
  });
}

// On resize: reset mobile menu state
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    if (navLinks) { navLinks.style.display = ''; navLinks.classList.remove('nav-mobile-open'); }
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    mobileMenuOpen = false;
  }
});

// =====================================================
//  ACTIVE NAV LINK ON SCROLL
// =====================================================
const sections = document.querySelectorAll('section[id], div[id="home"]');
const navItems = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

sections.forEach(s => navObserver.observe(s));

// =====================================================
//  SMOOTH SCROLL
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

// =====================================================
//  TYPEWRITER TAGLINE
// =====================================================
const typeEl = document.getElementById('typewriter-text');
const taglines = [
  'Frontend Designer',
  'WordPress Expert',
  'Content Writer',
  'BCA Student',
  'Problem Solver',
];
let ti = 0, ci = 0, isDeleting = false;

function typeLoop() {
  if (!typeEl) return;
  const txt = taglines[ti];

  if (!isDeleting) {
    typeEl.textContent = txt.slice(0, ci++);
    if (ci > txt.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    typeEl.textContent = txt.slice(0, ci--);
    if (ci < 0) {
      isDeleting = false;
      ti = (ti + 1) % taglines.length;
      ci = 0;
      setTimeout(typeLoop, 400);
      return;
    }
  }
  setTimeout(typeLoop, isDeleting ? 55 : 100);
}
typeLoop();

// =====================================================
//  CANVAS PARTICLE / CONSTELLATION BG
// =====================================================
const canvas = document.getElementById('bg-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;

  window.addEventListener('resize', () => {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  });

  const NUM = Math.min(Math.floor((w * h) / 55000) + 55, 120);
  const particles = Array.from({ length: NUM }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    r: Math.random() * 1.4 + 0.4,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
  }));

  let mouse = { x: -9999, y: -9999 };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#02020e');
    g.addColorStop(1, '#0a0a12');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 150) { p.vx += dx * 0.0005; p.vy += dy * 0.0005; }
      // speed limit
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.5) { p.vx = (p.vx / speed) * 1.5; p.vy = (p.vy / speed) * 1.5; }
      ctx.beginPath();
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Draw constellation lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 11000) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(127,90,240,${0.13 * (1 - dist2 / 11000)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// =====================================================
//  INTERSECTION OBSERVER — FADE IN + COUNTERS + SKILL BARS
// =====================================================
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');

      // Counters
      entry.target.querySelectorAll('.count').forEach(el => {
        if (!el.dataset.started) {
          el.dataset.started = '1';
          const target = +el.dataset.target;
          let cur = 0;
          const duration = 1400;
          const step = target / (duration / 16);
          const iv = setInterval(() => {
            cur = Math.min(cur + step, target);
            el.textContent = target >= 100
              ? Math.floor(cur).toLocaleString()
              : Math.floor(cur);
            if (cur >= target) clearInterval(iv);
          }, 16);
        }
      });

      // Skill bars
      entry.target.querySelectorAll('.skill-bar').forEach(bar => {
        const fill = bar.querySelector('.skill-bar-fill');
        if (fill) fill.style.width = bar.dataset.percent + '%';
      });

      // Animate timeline line height
      const line = entry.target.querySelector('.timeline-line');
      if (line) {
        line.style.transition = 'height 1.5s ease';
        line.style.height = '100%';
      }
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-up, .about-section, .timeline-section, .skills-section, .projects-section, .social-section, .contact-section')
  .forEach(el => io.observe(el));

// =====================================================
//  PROJECT FILTER BUTTONS
// =====================================================
document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? 'flex' : 'none';
      if (show) {
        card.style.animation = 'none';
        requestAnimationFrame(() => {
          card.style.animation = 'card-pop 0.3s ease forwards';
        });
      }
    });
  });
});

// =====================================================
//  CONTACT FORM
// =====================================================
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = '⚠ Please fill in all required fields.';
      status.style.color = '#f87171';
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...'; }
    status.textContent = '';

    setTimeout(() => {
      status.innerHTML = '✅ Message sent — thank you, ' + name + '!';
      status.style.color = 'var(--accent-cyan)';
      form.reset();
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message'; }
    }, 1200);
  });
}

// =====================================================
//  BACK TO TOP
// =====================================================
const backBtn = document.getElementById('back-to-top');
if (backBtn) {
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// =====================================================
//  SCROLL PROGRESS BAR
// =====================================================
window.addEventListener('scroll', () => {
  const el = document.getElementById('scroll-progress');
  if (!el) return;
  const max = document.body.scrollHeight - window.innerHeight;
  const pct = (window.scrollY / max) * 100;
  el.style.width = Math.min(100, Math.max(0, pct)) + '%';
}, { passive: true });

// =====================================================
//  CUSTOM CURSOR + TRAIL (desktop only)
// =====================================================
if (window.matchMedia('(pointer:fine)').matches) {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  const trailNodes = [];

  for (let i = 0; i < 8; i++) {
    const n = document.createElement('div');
    const size = Math.max(2, 8 - i);
    n.style.cssText = `width:${size}px;height:${size}px;border-radius:50%;position:fixed;pointer-events:none;background:rgba(127,90,240,${0.15 - i*0.015});z-index:9998;transform:translate(-50%,-50%)`;
    document.body.appendChild(n);
    trailNodes.push(n);
  }

  window.addEventListener('mousemove', e => {
    if (cursor) { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }
    trailNodes.forEach((n, idx) => {
      setTimeout(() => {
        n.style.left = e.clientX + 'px';
        n.style.top = e.clientY + 'px';
      }, idx * 22);
    });
  }, { passive: true });
}

// =====================================================
//  KONAMI CODE EASTER EGG
// =====================================================
(() => {
  const code = [38,38,40,40,37,39,37,39,66,65];
  let k = 0;
  window.addEventListener('keydown', e => {
    if (e.keyCode === code[k]) {
      k++;
      if (k === code.length) {
        k = 0;
        document.body.classList.add('konami');
        setTimeout(() => document.body.classList.remove('konami'), 4000);
      }
    } else k = 0;
  });
})();

// =====================================================
//  KEYBOARD FOCUS STYLES
// =====================================================
let usingMouse = false;
window.addEventListener('mousedown', () => usingMouse = true, { passive: true });
window.addEventListener('keydown', () => usingMouse = false, { passive: true });
document.addEventListener('focusin', e => { if (!usingMouse) e.target.classList.add('focus-visible'); });
document.addEventListener('focusout', e => e.target.classList.remove('focus-visible'));

// end of file
