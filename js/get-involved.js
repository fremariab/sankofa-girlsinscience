(() => {
  const body = document.body;
  const overlays = document.querySelectorAll('.gi-overlay');
  const endpoint = 'send-email.php';
  const successModal = document.getElementById('giSuccessModal');
  const successText = document.getElementById('gi-success-text');

  const successMessages = {
    volunteer: 'Thank you for volunteering. We will review your application and contact you soon.',
    sponsor: 'Thank you for your sponsorship enquiry. We will be in touch soon to discuss partnership options.',
    mentee: 'Welcome to the SGiS journey. We will review your application and get back to you soon.',
  };

  async function submitForm(formType, form) {
    const formData = new FormData(form);
    formData.append('form_type', formType);

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    let payload = {};
    try {
      payload = await response.json();
    } catch (error) {
      payload = {};
    }

    if (!response.ok || !payload.success) {
      throw new Error(payload.error || 'Unable to send form right now.');
    }

    return payload;
  }

  function setBodyLocked(locked) {
    body.style.overflow = locked ? 'hidden' : '';
  }

  function openSuccessModal(type) {
    if (!successModal) return;
    if (successText) {
      successText.textContent = successMessages[type] || 'Thank you. Your submission has been received.';
    }
    successModal.classList.add('open');
    successModal.setAttribute('aria-hidden', 'false');
    setBodyLocked(true);
  }

  function closeSuccessModal() {
    if (!successModal) return;
    successModal.classList.remove('open');
    successModal.setAttribute('aria-hidden', 'true');
    setBodyLocked(false);
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
    if (successModal && successModal.classList.contains('open')) {
      closeSuccessModal();
      return;
    }
    overlays.forEach((overlay) => overlay.classList.remove('open'));
    setBodyLocked(false);
  });

  if (successModal) {
    successModal.querySelectorAll('[data-close-gi-success="true"]').forEach((node) => {
      node.addEventListener('click', closeSuccessModal);
    });
  }

  ['volunteer', 'sponsor', 'mentee'].forEach((type) => {
    const form = document.getElementById(`form-${type}`);
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
      }

      try {
        await submitForm(type, form);
        closeModal(type);
        openSuccessModal(type);
        form.reset();
      } catch (error) {
        alert(error.message || 'Unable to send form right now. Please try again.');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.originalText || submitButton.textContent;
        }
      }
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
