export function initSite(portfolioData) {
  initThemeToggle();

  const footerText = document.getElementById("footerText");
  if (footerText && portfolioData?.name) {
    footerText.textContent = `${new Date().getFullYear()} ${portfolioData.name}. Built with semantic HTML, CSS, and vanilla JavaScript.`;
  }

  initRevealAnimations();
}

export function initRevealAnimations() {
  const targets = Array.from(document.querySelectorAll(".reveal"));
  if (!targets.length) return;

  // Enable reveal-only hiding after JS has initialized.
  document.body.classList.add("has-reveal-js");

  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((target) => observer.observe(target));
}

export function initSectionObserver() {
  const sectionNodes = Array.from(document.querySelectorAll(".section-observe"));
  const navLinks = Array.from(document.querySelectorAll(".nav-links a[data-nav]"));

  if (!sectionNodes.length || !navLinks.length || !("IntersectionObserver" in window)) return;

  const linkMap = new Map(navLinks.map((link) => [link.dataset.nav, link]));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const key = entry.target.getAttribute("data-section");
        if (!key) return;

        navLinks.forEach((link) => link.removeAttribute("aria-current"));
        const active = linkMap.get(key);
        if (active) active.setAttribute("aria-current", "page");
      });
    },
    { threshold: 0.5 }
  );

  sectionNodes.forEach((node) => observer.observe(node));
}

export function initSmoothAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      const navOffset = 96;
      const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: "smooth" });
      history.replaceState(null, "", href);
    });
  });
}

const THEME_KEY = "portfolio-theme";

function initThemeToggle() {
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const stored = readStoredTheme();
  const initial = stored || preferred;
  applyTheme(initial);

  const button = document.getElementById("themeToggle");
  if (!button) return;

  updateToggleLabel(button, initial);
  button.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    writeStoredTheme(next);
    updateToggleLabel(button, next);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "dark");
}

function updateToggleLabel(button, theme) {
  const isDark = theme === "dark";
  button.textContent = isDark ? "Light" : "Dark";
  button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  button.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
}

function readStoredTheme() {
  try {
    const value = window.localStorage.getItem(THEME_KEY);
    return value === "dark" || value === "light" ? value : "";
  } catch {
    return "";
  }
}

function writeStoredTheme(theme) {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // No-op when storage is unavailable.
  }
}
