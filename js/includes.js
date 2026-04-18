(async function () {
  // Inject partials
  const nodes = document.querySelectorAll('[data-include]');
  await Promise.all(
    [...nodes].map(async (el) => {
      const path = el.getAttribute('data-include');
      const candidates = [path];
      if (path && !path.startsWith('/')) {
        candidates.push(`/${path.replace(/^\.?\//, '')}`);
      }

      for (const candidate of candidates) {
        const res = await fetch(candidate);
        if (res.ok) {
          el.outerHTML = await res.text();
          break;
        }
      }
    }),
  );

  // Active nav by pathname
  const map = {
    '': 'home',
    'index.html': 'home',
    'about.html': 'about',
    'programs.html': 'programs',
    'impact.html': 'impact',
    'events.html': 'events',
    'get-involved.html': 'get-involved',
    'resources.html': 'resources',
    'contact.html': 'contact',
  };
  const file = location.pathname.split('/').pop();
  const current = map[file] || '';
  if (current) {
    const link = document.querySelector(`.nav__links a[data-nav="${current}"]`);
    if (link) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  }

  // Mobile nav toggle
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('primary-menu');
  // Add overlay for mobile menu
  let navOverlay = document.querySelector('.nav__overlay');
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav__overlay';
    const nav = document.querySelector('.nav'); // ← change this
    nav.appendChild(navOverlay); // ← and this
  }
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) {
        menu.classList.add('open');
        navOverlay.classList.add('open');
        toggle.textContent = '✕';
        toggle.setAttribute('aria-label', 'Close menu'); // ← add
      } else {
        menu.classList.remove('open');
        navOverlay.classList.remove('open');
        toggle.textContent = '☰';
        toggle.setAttribute('aria-label', 'Open menu'); // ← add
      }
    });
    navOverlay.addEventListener('click', () => {
      menu.classList.remove('open');
      navOverlay.classList.remove('open');
      toggle.setAttribute('aria-label', 'Open menu');
      toggle.textContent = '☰'; // ← add this
    });
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        navOverlay.classList.remove('open');
        toggle.setAttribute('aria-label', 'Open menu');
        toggle.textContent = '☰';
      });
    });
  }

  // Shared floating back-to-top button across all pages.
  let backToTop = document.querySelector('.back-to-top');
  if (!backToTop) {
    backToTop = document.createElement('button');
    backToTop.type = 'button';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.textContent = '↑';
    document.body.appendChild(backToTop);
  }

  const toggleBackToTop = () => {
    if (window.scrollY > 320) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  };

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
})();
