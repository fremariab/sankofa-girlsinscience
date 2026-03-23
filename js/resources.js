(function () {
  const endpoint = "send-email.php";

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".rs-reveal").forEach((el) => revealObserver.observe(el));

  const pills = document.querySelectorAll(".rs-pill");
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      const id = pill.getAttribute("data-target");
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const tabs = document.querySelectorAll(".rs-tab");
  const panels = document.querySelectorAll(".rs-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.getAttribute("data-career");
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const panel = document.getElementById("rs-" + key);
      if (panel) panel.classList.add("active");
    });
  });

  const form = document.getElementById("resourceRequestForm");
  if (!form) return;

  const status = document.createElement("p");
  status.style.marginTop = "12px";
  status.style.fontSize = "14px";
  status.style.fontWeight = "600";
  form.appendChild(status);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitButton = form.querySelector("button[type='submit']");
    const formData = new FormData(form);
    formData.append("form_type", "resource_request");

    status.textContent = "";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.textContent;
      submitButton.textContent = "Sending...";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      let payload = {};
      try {
        payload = await response.json();
      } catch (error) {
        payload = {};
      }

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Unable to send request right now.");
      }

      form.reset();
      status.style.color = "#15803d";
      status.textContent = "Request sent successfully. We will contact you soon.";
    } catch (error) {
      status.style.color = "#b91c1c";
      status.textContent = error.message || "Unable to send request right now.";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText || submitButton.textContent;
      }
    }
  });
})();
