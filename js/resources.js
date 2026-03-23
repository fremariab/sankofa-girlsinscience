(function () {
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const body = encodeURIComponent(
      "Name: " + (data.name || "") +
        "\nEmail: " + (data.email || "") +
        "\nSchool/Org: " + (data.organization || "") +
        "\nResource: " + (data.resource || "") +
        "\n\nContext:\n" + (data.message || "")
    );

    window.location.href =
      "mailto:sankofagisfoundation@gmail.com?subject=Resource Request - SGiS Foundation&body=" +
      body;
  });
})();
