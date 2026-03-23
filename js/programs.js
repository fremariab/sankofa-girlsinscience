(function () {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document
    .querySelectorAll(".reveal, .rev-left, .rev-right")
    .forEach((el) => revealObserver.observe(el));

  const numberObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.dataset.target || "0");
        const suffix = el.dataset.suffix || "";
        const start = performance.now();
        const duration = 1700;

        const frame = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(frame);
        };

        requestAnimationFrame(frame);
        numberObserver.unobserve(el);
      });
    },
    { threshold: 0.45 },
  );

  document
    .querySelectorAll("[data-target]")
    .forEach((el) => numberObserver.observe(el));

  document.querySelectorAll("[data-ripple]").forEach((target) => {
    target.addEventListener("click", (event) => {
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      target.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  const journeySteps = Array.from(document.querySelectorAll(".journey-steps .step"));

  const setActiveStep = (activeStep) => {
    journeySteps.forEach((step) => {
      const isActive = step === activeStep;
      const detailsId = step.getAttribute("aria-controls");
      const detailsPanel = detailsId
        ? document.getElementById(detailsId)
        : null;

      step.classList.toggle("is-active", isActive);
      step.setAttribute("aria-pressed", isActive ? "true" : "false");
      step.setAttribute("aria-expanded", isActive ? "true" : "false");

      if (detailsPanel) {
        detailsPanel.hidden = !isActive;
      }
    });
  };

  journeySteps.forEach((step) => {
    const detailsId = step.getAttribute("aria-controls");
    const detailsPanel = detailsId
      ? document.getElementById(detailsId)
      : null;
    if (detailsPanel) {
      detailsPanel.hidden = !step.classList.contains("is-active");
    }
  });

  journeySteps.forEach((step) => {
    step.addEventListener("mouseenter", () => setActiveStep(step));
    step.addEventListener("click", () => setActiveStep(step));
    step.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setActiveStep(step);
      }
    });
  });
})();
