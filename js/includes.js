 (async function () {
  // Inject partials
  const nodes = document.querySelectorAll("[data-include]");
  await Promise.all([...nodes].map(async (el) => {
    const path = el.getAttribute("data-include");
    const res = await fetch(path, { cache: "no-store" });
    if (res.ok) el.outerHTML = await res.text();
  }));

  // Active nav by pathname
  const map = {
    "": "home",
    "index.html": "home",
    "about.html": "about",
    "programs.html": "programs",
    "impact.html": "impact",
    "events.html": "events",
    "get-involved.html": "get-involved",
    "resources.html": "resources",
    "contact.html": "contact",
  };
  const file = location.pathname.split("/").pop();
  const current = map[file] || "";
  if (current) {
    const link = document.querySelector(`.nav__links a[data-nav="${current}"]`);
    if (link) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  }

  // Mobile nav toggle
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("primary-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      menu.style.display = expanded ? "none" : "flex";
    });
  }
})();
 