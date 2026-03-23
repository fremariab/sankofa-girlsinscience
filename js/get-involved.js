(() => {
  const body = document.body;
  const overlays = document.querySelectorAll('.gi-overlay');

  function setBodyLocked(locked) {
    body.style.overflow = locked ? 'hidden' : '';
  }

  function openModal(type) {
    const overlay = document.getElementById(`modal-${type}`);
    if (!overlay) return;
    overlay.classList.add('open');
    setBodyLocked(true);
  }

  function closeModal(type) {
    const overlay = document.getElementById(`modal-${type}`);
    if (!overlay) return;
    overlay.classList.remove('open');
    setBodyLocked(false);
  }

  document.querySelectorAll('[data-open-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.getAttribute('data-open-modal');
      if (type) openModal(type);
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.getAttribute('data-close-modal');
      if (type) closeModal(type);
    });
  });

  overlays.forEach((overlay) => {
    overlay.addEventListener('click', (event) => {
      if (event.target !== overlay) return;
      overlay.classList.remove('open');
      setBodyLocked(false);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    overlays.forEach((overlay) => overlay.classList.remove('open'));
    setBodyLocked(false);
  });

  ['volunteer', 'sponsor', 'mentee'].forEach((type) => {
    const form = document.getElementById(`form-${type}`);
    const success = document.getElementById(`success-${type}`);
    if (!form || !success) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.style.display = 'none';
      success.style.display = 'block';
    });
  });

  const cards = document.querySelectorAll('.gi-card');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.animationPlayState = 'running';
      });
    },
    { threshold: 0.12 },
  );

  cards.forEach((card) => {
    card.style.animationPlayState = 'paused';
    observer.observe(card);
  });
})();
