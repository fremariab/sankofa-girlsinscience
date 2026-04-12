(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    .querySelectorAll(".reveal, .reveal-left, .reveal-right")
    .forEach((element) => revealObserver.observe(element));

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.querySelectorAll("[data-target]").forEach((counterEl) => {
          const target = Number(counterEl.dataset.target || "0");
          const suffix = counterEl.dataset.suffix || "";

          if (reduceMotion) {
            counterEl.textContent = target.toLocaleString() + suffix;
            return;
          }

          const duration = 1600;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counterEl.textContent = Math.floor(eased * target).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        });

        entry.target.querySelectorAll(".number-block__bar-fill[data-width]").forEach((bar) => {
          bar.style.width = `${bar.dataset.width}%`;
        });

        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 },
  );

  document.querySelectorAll(".number-block").forEach((block) => counterObserver.observe(block));

  const widthObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.querySelectorAll("[data-width]").forEach((bar) => {
          bar.style.width = `${bar.dataset.width}%`;
        });

        widthObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 },
  );

  [".outcomes-chart", ".progress-section"].forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) widthObserver.observe(element);
  });

  const outcomePills = Array.from(document.querySelectorAll(".outcome-pill"));
  const outcomeDetail = document.getElementById("outcomeDetail");

  if (outcomePills.length > 0 && outcomeDetail) {
    const setActiveOutcome = (pill) => {
      outcomePills.forEach((item) => {
        const isActive = item === pill;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      const detail = pill.dataset.detail || "";
      outcomeDetail.textContent = detail ? `${detail}` : detail;
    };

    outcomePills.forEach((pill, index) => {
      pill.addEventListener("click", () => {
        setActiveOutcome(pill);
      });

      pill.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setActiveOutcome(pill);
          return;
        }

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          const next = outcomePills[(index + 1) % outcomePills.length];
          next.focus();
          setActiveOutcome(next);
          return;
        }

        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          const prev = outcomePills[(index - 1 + outcomePills.length) % outcomePills.length];
          prev.focus();
          setActiveOutcome(prev);
        }
      });
    });

    setActiveOutcome(outcomePills[0]);
  }

  const tooltip = document.getElementById("impactMapTooltip");
  const title = document.getElementById("impactTooltipTitle");
  const info = document.getElementById("impactTooltipInfo");
  const girls = document.getElementById("impactTooltipGirls");
  const mapWrap = document.getElementById("impactMapWrap");

  if (tooltip && title && info && girls && mapWrap) {
    document.querySelectorAll(".map-node").forEach((node) => {
      node.addEventListener("mouseenter", () => {
        title.textContent = node.dataset.region || "";
        info.textContent = node.dataset.info || "";
        girls.textContent = `${node.dataset.girls || ""} girls reached`;
        tooltip.classList.add("visible");
      });

      node.addEventListener("mousemove", (event) => {
        const wrapRect = mapWrap.getBoundingClientRect();
        tooltip.style.left = `${event.clientX - wrapRect.left + 14}px`;
        tooltip.style.top = `${event.clientY - wrapRect.top - 54}px`;
      });

      node.addEventListener("mouseleave", () => {
        tooltip.classList.remove("visible");
      });
    });
  }

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
      setTimeout(() => ripple.remove(), 720);
    });
  });
})();
