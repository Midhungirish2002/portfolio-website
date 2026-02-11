import { portfolioData } from "./portfolio-data.js";
import { initSite } from "./site.js";

const heroTagline = document.getElementById("heroTagline");
const heroTitle = document.getElementById("heroTitle");
const heroSubtitle = document.getElementById("heroSubtitle");
const resumeLink = document.getElementById("resumeLink");
const profileImage = document.getElementById("profileImage");
const profileName = document.getElementById("profileName");
const profileRole = document.getElementById("profileRole");
const socialLinks = document.getElementById("socialLinks");
const statGrid = document.getElementById("statGrid");
const spotlightProject = document.getElementById("spotlightProject");
const aboutText = document.getElementById("aboutText");
const heroBadges = document.getElementById("heroBadges");

initSite(portfolioData);

heroTagline.textContent = portfolioData.tagline;
heroTitle.textContent = portfolioData.title;
heroSubtitle.textContent = portfolioData.subtitle;
resumeLink.href = portfolioData.resumeUrl;
profileImage.src = portfolioData.profileImage;
profileImage.alt = `${portfolioData.name} profile image`;
profileName.textContent = portfolioData.name;
profileRole.textContent = portfolioData.role;
aboutText.textContent = portfolioData.about;
const featuredProject =
  portfolioData.projects.find((project) => project.id === "online-learning") ||
  portfolioData.projects[0];

if (heroBadges) {
  const badgeItems = [
    ...(featuredProject?.stack || []).slice(0, 3),
    portfolioData.role
  ];

  badgeItems.forEach((item) => {
    const chip = document.createElement("span");
    chip.textContent = item;
    heroBadges.appendChild(chip);
  });
}

initHomeMotion();

portfolioData.socials.forEach((social) => {
  const link = document.createElement("a");
  link.href = social.url;
  link.textContent = social.label;
  link.target = "_blank";
  link.rel = "noreferrer";
  socialLinks.appendChild(link);
});

portfolioData.stats.forEach((item) => {
  const value =
    String(item.label).toLowerCase() === "featured repositories"
      ? String(portfolioData.projects.length)
      : item.value;
  const card = document.createElement("article");
  card.className = "stat-card";
  card.innerHTML = `<strong>${value}</strong><span>${item.label}</span>`;
  statGrid.appendChild(card);
});

if (featuredProject && spotlightProject) {
  const featuredStack = featuredProject.stack.map((item) => `<span>${item}</span>`).join("");

  spotlightProject.innerHTML = `
    <p class="project-meta">Featured Case Study</p>
    <h3>${featuredProject.title}</h3>
    <p>${featuredProject.description}</p>
    <p class="meta">${featuredProject.impact}</p>
    <div class="stack">${featuredStack}</div>
    <div class="project-links">
      <a href="./project.html?project=${featuredProject.id}">Open Case Study</a>
      <a href="${featuredProject.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
    </div>
  `;
}

function initHomeMotion() {
  if (!document.body.classList.contains("home-page")) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const floatingNodes = Array.from(document.querySelectorAll("[data-float]"));

  const tiltTargets = Array.from(
    document.querySelectorAll(".hero-main, .hero-side, .stat-card, .spotlight")
  );

  if (!reducedMotion) {
    window.addEventListener(
      "pointermove",
      (event) => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;

        floatingNodes.forEach((node) => {
          const depth = Number(node.getAttribute("data-float")) || 0.2;
          const dx = Math.round(x * depth * 32);
          const dy = Math.round(y * depth * 32);
          node.style.transform = `translate(${dx}px, ${dy}px)`;
        });
      },
      { passive: true }
    );

    tiltTargets.forEach((node) => {
      node.addEventListener("pointermove", (event) => {
        const rect = node.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const rx = Number((-y * 5).toFixed(2));
        const ry = Number((x * 7).toFixed(2));
        node.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });

      node.addEventListener("pointerleave", () => {
        node.style.transform = "";
      });
    });
  }
}


