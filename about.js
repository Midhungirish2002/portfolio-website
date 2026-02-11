import { portfolioData } from "./portfolio-data.js";
import { initSite } from "./site.js";

const aboutText = document.getElementById("aboutText");
const statRow = document.getElementById("statRow");
const resumeBtn = document.getElementById("resumeBtn");
const factList = document.getElementById("factList");

initSite(portfolioData);

aboutText.textContent = portfolioData.about;
resumeBtn.href = portfolioData.resumeUrl;

const facts = [
  "Full-stack focus: backend + UI",
  "Case-study driven documentation",
  "Likes maintainable structure and clean UX"
];

facts.forEach((text) => {
  const li = document.createElement("li");
  li.textContent = text;
  factList.appendChild(li);
});

portfolioData.stats.forEach((item) => {
  const card = document.createElement("article");
  card.className = "about-stat-item";
  card.innerHTML = `<strong data-count="${item.value}">${item.value}</strong><span>${item.label}</span>`;
  statRow.appendChild(card);
});

// Animate numeric stats when visible.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const strong = entry.target;
      const raw = strong.getAttribute("data-count") || "";
      const number = Number(raw.replace(/[^0-9.]/g, ""));
      const suffix = raw.replace(/[0-9.]/g, "");

      if (!Number.isFinite(number) || raw === "" || /[a-zA-Z]/.test(raw)) {
        observer.unobserve(strong);
        return;
      }

      let current = 0;
      const steps = 18;
      const inc = number / steps;

      const tick = () => {
        current += inc;
        if (current >= number) {
          strong.textContent = `${number}${suffix}`;
          observer.unobserve(strong);
          return;
        }
        strong.textContent = `${Math.round(current)}${suffix}`;
        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll("[data-count]").forEach((node) => observer.observe(node));
