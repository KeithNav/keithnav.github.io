import './style.css';

// ─── Navbar: add .scrolled class on scroll ───────────────────────────────────
function initNavbar(): void {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─── Mobile hamburger menu ────────────────────────────────────────────────────
function initMobileMenu(): void {
  const hamburger = document.getElementById('hamburger') as HTMLButtonElement | null;
  const menu      = document.getElementById('nav-menu');
  if (!hamburger || !menu) return;

  const toggle = (open: boolean) => {
    hamburger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  };

  hamburger.addEventListener('click', () => toggle(!menu.classList.contains('open')));

  // Close on link click
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => toggle(false))
  );

  // Close on outside click
  const navEl = document.getElementById('navbar');
  document.addEventListener('click', (e) => {
    if (!navEl?.contains(e.target as Node)) toggle(false);
  });
}

// ─── Active nav link on scroll ───────────────────────────────────────────────
function initActiveNav(): void {
  const sections  = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
  const navLinks  = document.querySelectorAll<HTMLAnchorElement>('#nav-menu a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
}

// ─── Typing animation ────────────────────────────────────────────────────────
const ROLES = [
  'Logisztikus',
  'IT Infrastruktúra Üzemeltető',
  'Hálózati és Rendszeradminisztrátor',
  'AI & LLM Enthusiast',
];

function initTyping(): void {
  const el = document.getElementById('typed-text');
  if (!el) return;

  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;

  const tick = () => {
    const current = ROLES[roleIdx];

    if (deleting) {
      el.textContent = current.slice(0, --charIdx);
    } else {
      el.textContent = current.slice(0, ++charIdx);
    }

    if (!deleting && charIdx === current.length) {
      setTimeout(() => { deleting = true; tick(); }, 2200);
      return;
    }
    if (deleting && charIdx === 0) {
      deleting = false;
      roleIdx  = (roleIdx + 1) % ROLES.length;
    }

    setTimeout(tick, deleting ? 55 : 110);
  };

  tick();
}

// ─── Scroll-reveal (IntersectionObserver) ────────────────────────────────────
function initScrollReveal(): void {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);   // animate once
      }
    }),
    { threshold: 0.1 }
  );

  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}

// ─── Cookie banner ───────────────────────────────────────────────────────────
function initCookieBanner(): void {
  const banner    = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  if (!banner || !acceptBtn) return;

  if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => banner.classList.add('show'), 1800);
  }

  acceptBtn.addEventListener('click', () => {
    banner.classList.remove('show');
    localStorage.setItem('cookiesAccepted', 'true');
  });
}

// ─── Video crossfade loop ─────────────────────────────────────────────────────
// Two identical video elements are stacked; each crossfades into the other
// before the playing one reaches its end, eliminating the visible jump.
function initVideoLoop(): void {
  const videos = Array.from(
    document.querySelectorAll<HTMLVideoElement>('.hero-video')
  );
  if (videos.length < 2) return;

  const FADE_S   = 1.4;   // must match CSS transition duration (seconds)
  const BEFORE_S = 1.6;   // how many seconds before end to start crossfade

  // Ensure both videos are loaded enough to measure duration
  const setup = () => {
    videos[0].style.opacity = '1';
    videos[1].style.opacity = '0';
    videos[0].play().catch(() => {/* autoplay blocked */});
    listenForCrossfade(0, 1);
  };

  const listenForCrossfade = (from: number, to: number) => {
    const vFrom = videos[from];
    const vTo   = videos[to];
    let triggered = false;

    const onTimeUpdate = () => {
      if (triggered) return;
      const remaining = vFrom.duration - vFrom.currentTime;
      if (isNaN(remaining) || remaining > BEFORE_S) return;

      triggered = true;
      vFrom.removeEventListener('timeupdate', onTimeUpdate);

      // Start the standby video slightly before the crossfade
      vTo.currentTime = 0;
      vTo.play().catch(() => {});

      // Crossfade: fade in standby, fade out active
      vTo.style.opacity   = '1';
      vFrom.style.opacity = '0';

      // After fade completes, pause & reset the old one, set up next crossfade
      setTimeout(() => {
        vFrom.pause();
        vFrom.currentTime = 0;
        listenForCrossfade(to, from);
      }, (FADE_S + 0.2) * 1000);
    };

    vFrom.addEventListener('timeupdate', onTimeUpdate);
  };

  // Wait for metadata so .duration is available
  if (videos[0].readyState >= 1) {
    setup();
  } else {
    videos[0].addEventListener('loadedmetadata', setup, { once: true });
  }
}


// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initActiveNav();
  initScrollReveal();
  initCookieBanner();
  initTyping();
  initVideoLoop();
});

