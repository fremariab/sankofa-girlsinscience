// Custom dropdown logic for contact form
document.addEventListener('DOMContentLoaded', function () {
  const dropdown = document.querySelector('.ct-custom-dropdown');
  if (!dropdown) return;
  const selected = dropdown.querySelector('.ct-dropdown-selected');
  const list = dropdown.querySelector('.ct-dropdown-list');
  const options = dropdown.querySelectorAll('.ct-dropdown-option');
  const input = document.getElementById('audience-input');

  function openDropdown() {
    dropdown.setAttribute('aria-expanded', 'true');
    list.style.display = 'block';
  }

  function closeDropdown() {
    dropdown.setAttribute('aria-expanded', 'false');
    list.style.display = 'none';
  }

  dropdown.addEventListener('click', function (e) {
    if (dropdown.getAttribute('aria-expanded') === 'true') {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  dropdown.addEventListener('blur', function () {
    closeDropdown();
  });

  options.forEach(function (opt) {
    opt.addEventListener('click', function (e) {
      options.forEach(o => o.removeAttribute('aria-selected'));
      opt.setAttribute('aria-selected', 'true');
      selected.textContent = opt.textContent;
      input.value = opt.dataset.value;
      closeDropdown();
    });
  });

  // Keyboard accessibility
  dropdown.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      openDropdown();
      e.preventDefault();
    }
    if (e.key === 'Escape') {
      closeDropdown();
    }
    if (e.key === 'Enter' && dropdown.getAttribute('aria-expanded') === 'true') {
      const focused = document.activeElement;
      if (focused.classList.contains('ct-dropdown-option')) {
        focused.click();
      }
      closeDropdown();
    }
  });
});
const btn = document.querySelector(".nav__toggle");
const list = document.querySelector("#primary-menu");

if (btn && list) {
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    list.style.display = open ? "none" : "flex";
  });
}
(function () {
  const belts = document.querySelectorAll(".belt");

  belts.forEach((belt) => {
    const track = belt.querySelector(".track");
    if (!track) return;

    const children = Array.from(track.children);
    const clone = track.cloneNode(true);
    clone
      .querySelectorAll("img")
      .forEach((img) => track.appendChild(img.cloneNode(true)));

    const dur = belt.dataset.speed || "50s";
    const dir =
      (belt.dataset.direction || "ltr").toLowerCase() === "rtl" ? -1 : 1;
    const delay = belt.dataset.delay || "0s";
    track.style.setProperty("--dur", dur);
    track.style.setProperty("--dir", dir);
    track.style.setProperty("--delay", delay);

    const pause = () => belt.classList.add("paused");
    const play = () => belt.classList.remove("paused");

    belt.addEventListener("mouseenter", pause);
    belt.addEventListener("mouseleave", play);
    belt.addEventListener("touchstart", pause, { passive: true });
    belt.addEventListener("touchend", play);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pause();
      else play();
    });
  });
})();

(function () {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) return;

  const particleRoot = document.querySelector(".soaring-particles");
  const orbRoot = document.querySelector(".glowing-orbs");
  if (!particleRoot || !orbRoot) return;

  function createParticles() {
    const density = Math.min(
      70,
      Math.max(30, Math.round((window.innerWidth * window.innerHeight) / 22000))
    );
    for (let i = 0; i < density; i++) {
      const wrap = document.createElement("div");
      wrap.className = "particle-wrap";
      wrap.style.left = (Math.random() * 100).toFixed(3) + "%";
      wrap.style.top = "0";

      const dot = document.createElement("div");
      dot.className = "particle";
      if (i % 2 === 0) dot.classList.add("alt");
      if (i % 5 === 0) dot.classList.add("big");
      if (i % 7 === 0) dot.classList.add("tiny");

      dot.style.animationDelay = (Math.random() * 10).toFixed(2) + "s";
      dot.style.animationDuration = (8 + Math.random() * 8).toFixed(2) + "s";

      wrap.appendChild(dot);
      particleRoot.appendChild(wrap);
    }
  }

  function createOrbs() {
    const count = Math.floor(5 + Math.random() * 3);
    const variants = ["variant-a", "variant-b", "variant-c"];

    for (let i = 0; i < count; i++) {
      const wrap = document.createElement("div");
      wrap.className = "orb-wrap";
      wrap.style.left = (10 + Math.random() * 80).toFixed(2) + "%";
      wrap.style.top = (Math.random() * 30).toFixed(2) + "%";

      const orb = document.createElement("div");
      orb.className = "orb " + variants[i % variants.length];

      const size = 90 + Math.random() * 120; // px
      orb.style.width = size + "px";
      orb.style.height = size + "px";

      orb.style.animationDelay = (-Math.random() * 12).toFixed(2) + "s";
      orb.style.animationDuration = (14 + Math.random() * 8).toFixed(2) + "s";

      wrap.appendChild(orb);
      orbRoot.appendChild(wrap);
    }
  }

  let px = 0,
    py = 0;
  function onMove(e) {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const r = hero.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;

    const x =
      (("touches" in e ? e.touches[0].clientX : e.clientX) - r.left) / r.width -
      0.5;
    const y =
      (("touches" in e ? e.touches[0].clientY : e.clientY) - r.top) / r.height -
      0.5;

    px += (x - px) * 0.08;
    py += (y - py) * 0.08;

    const pwraps = particleRoot.querySelectorAll(".particle-wrap");
    pwraps.forEach((w, i) => {
      const speed = 4 + (i % 3) * 2;
      w.style.transform = `translate(${px * speed}px, ${py * (speed * 0.6)}px)`;
    });

    const orbs = orbRoot.querySelectorAll(".orb-wrap");
    orbs.forEach((w, i) => {
      const speed = 8 + (i % 3) * 4;
      w.style.transform = `translate(${px * speed}px, ${py * (speed * 0.7)}px)`;
    });
  }

  createParticles();
  createOrbs();

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });

  let resizeTO;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => {
      particleRoot.innerHTML = "";
      orbRoot.innerHTML = "";
      createParticles();
      createOrbs();
    }, 120);
  });
})();
(function () {
  const section = document.querySelector(".testimonial");
  if (!section) return;

  const prevBtn = section.querySelector(".nav-btn--prev");
  const nextBtn = section.querySelector(".nav-btn--next");
  const slides = Array.from(section.querySelectorAll(".t-slide"));
  if (slides.length <= 1) return;

  let i = 0;

  slides.forEach((s, idx) => {
    s.setAttribute("role", "group");
    s.setAttribute("aria-roledescription", "slide");
    s.setAttribute("aria-label", `${idx + 1} of ${slides.length}`);
    if (idx !== 0) s.setAttribute("aria-hidden", "true");
  });

  function show(n) {
    slides[i].classList.remove("is-active");
    slides[i].setAttribute("aria-hidden", "true");
    i = (n + slides.length) % slides.length;
    slides[i].classList.add("is-active");
    slides[i].setAttribute("aria-hidden", "false");
  }

  prevBtn?.addEventListener("click", () => show(i - 1));
  nextBtn?.addEventListener("click", () => show(i + 1));

  section.setAttribute("tabindex", "0");
  section.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      show(i - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      show(i + 1);
    }
  });

  let startX = null;
  section.addEventListener(
    "touchstart",
    (e) => {
      startX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  section.addEventListener(
    "touchend",
    (e) => {
      if (startX == null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
      startX = null;
    },
    { passive: true }
  );
})();
