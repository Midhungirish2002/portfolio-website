import { portfolioData } from "./portfolio-data.js";
import * as site from "./site.js";

const byId = (id) => document.getElementById(id);
const getSkillIconUrl = (name) => {
  const iconMap = {
    "HTML5": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    "CSS3": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    "JavaScript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    "TypeScript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    "React": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    "Express": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    "Django": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
    "WebSockets": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg",
    "PostgreSQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    "MongoDB": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    "Redis": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    "Docker": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    "CI/CD": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg",
    "AWS Basics": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
  };

  return iconMap[name] || "";
};

const getSkillGlyph = (name) => {
  const known = {
    "JavaScript": "JS",
    "TypeScript": "TS",
    "Node.js": "ND",
    "React": "RC",
    "PostgreSQL": "PS",
    "MongoDB": "MG",
    "AWS Basics": "AWS",
    "CI/CD": "CI"
  };

  if (known[name]) return known[name];
  const parts = name.split(/\s+|\/|&|-/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join("");
};

const initHornbill = () => {
  const bird = byId("hornbill");
  if (!bird) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  let x = 48;
  let y = 88;
  let tx = x;
  let ty = y;
  let lastRandomAt = 0;
  let perchSection = null;
  let cursorSpeed = 0;
  let lastPointer = null;
  const sectionNodes = Array.from(document.querySelectorAll(".section-observe"));

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const pickRandomTarget = () => {
    tx = 40 + Math.random() * Math.max(120, window.innerWidth - 80);
    ty = 64 + Math.random() * Math.max(140, window.innerHeight - 120);
    lastRandomAt = performance.now();
  };

  pickRandomTarget();

  window.addEventListener(
    "pointermove",
    (event) => {
      const now = performance.now();
      if (lastPointer) {
        const dt = Math.max(16, now - lastPointer.t);
        const dx = event.clientX - lastPointer.x;
        const dy = event.clientY - lastPointer.y;
        const distance = Math.hypot(dx, dy);
        // px per ms, damped for smoother response.
        cursorSpeed = cursorSpeed * 0.6 + (distance / dt) * 0.4;
      }
      lastPointer = { x: event.clientX, y: event.clientY, t: now };

      // Perch on top of whichever section the cursor is currently over.
      const stack = document.elementsFromPoint(event.clientX, event.clientY);
      let section = null;
      for (const node of stack) {
        const candidate = node?.closest?.(".section-observe");
        if (candidate && sectionNodes.includes(candidate)) {
          section = candidate;
          break;
        }
      }
      perchSection = section;
    },
    { passive: true }
  );

  const tick = () => {
    if (perchSection) {
      const rect = perchSection.getBoundingClientRect();
      const heading =
        perchSection.querySelector(".section-head h1, .section-head h2, .section-head h3") ||
        perchSection.querySelector("h1, h2, h3");

      if (heading) {
        const headingRect = heading.getBoundingClientRect();
        tx = clamp(headingRect.left + headingRect.width * 0.5, 40, window.innerWidth - 40);
        ty = clamp(headingRect.top - 16, 40, window.innerHeight - 40);
      } else {
        tx = clamp(rect.left + rect.width * 0.5, 40, window.innerWidth - 40);
        ty = clamp(rect.top - 10, 40, window.innerHeight - 40);
      }
    } else {
      const dx = tx - x;
      const dy = ty - y;
      const dist = Math.hypot(dx, dy);
      const stale = performance.now() - lastRandomAt > 2800;
      if (dist < 18 || stale) pickRandomTarget();
    }

    const speedFactor = perchSection
      ? 0.045
      : clamp(0.02 + cursorSpeed * 0.08, 0.02, 0.07);
    x += (tx - x) * speedFactor;
    y += (ty - y) * speedFactor;
    const clampedX = clamp(x, 24, window.innerWidth - 24);
    const clampedY = clamp(y, 24, window.innerHeight - 24);
    const angle = Math.max(-16, Math.min(16, (tx - x) * 0.1));
    bird.style.left = `${clampedX}px`;
    bird.style.top = `${clampedY}px`;
    bird.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

try {
  site.initSite?.(portfolioData);

  const heroSubtext = byId("heroSubtext");
  const resumeLink = byId("resumeLink");
  if (heroSubtext) heroSubtext.textContent = portfolioData.heroSubtext || portfolioData.role;
  if (resumeLink) resumeLink.href = portfolioData.resumeUrl;

  const projectGrid = byId("projectGrid");
  if (projectGrid) {
    portfolioData.projects.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card reveal";

      const tags = project.tags.map((tag) => `<span>${tag}</span>`).join("");

      card.innerHTML = `
        <p class="project-year">${project.year}</p>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="tag-row">${tags}</div>
        <div class="project-actions">
          <a class="btn btn-ghost" href="./project.html?project=${project.id}">Case Study</a>
          <a class="btn btn-ghost" href="${project.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      `;

      projectGrid.appendChild(card);
    });
  }

  const skillsGrid = byId("skillsGrid");
  if (skillsGrid) {
    portfolioData.skills.forEach((group) => {
      const block = document.createElement("article");
      block.className = "skill-block reveal";

      const items = group.items
        .map(
          (item) => {
            const iconUrl = getSkillIconUrl(item);
            const visual = iconUrl
              ? `<img class="skill-logo" src="${iconUrl}" alt="${item} icon" loading="lazy" />`
              : `<span class="skill-glyph" aria-hidden="true">${getSkillGlyph(item)}</span>`;

            return `
            <li class="skill-icon-item">
              ${visual}
              <span class="skill-label">${item}</span>
            </li>
          `;
          }
        )
        .join("");

      block.innerHTML = `
        <h3>${group.category}</h3>
        <ul class="skill-icon-grid">${items}</ul>
      `;

      skillsGrid.appendChild(block);
    });
  }

  const aboutBio = byId("aboutBio");
  const aboutStrengths = byId("aboutStrengths");
  const aboutTools = byId("aboutTools");
  const aboutImage = byId("aboutImage");

  if (aboutBio) aboutBio.textContent = portfolioData.about.bio;
  if (aboutImage) {
    aboutImage.src = "./assets/profile.jpeg";
    aboutImage.alt = `${portfolioData.name} portrait`;
  }
  if (aboutTools) aboutTools.textContent = portfolioData.about.tools.join(" | ");

  if (aboutStrengths) {
    portfolioData.about.strengths.forEach((strength) => {
      const li = document.createElement("li");
      li.textContent = strength;
      aboutStrengths.appendChild(li);
    });
  }

  const contactInfo = byId("contactInfo");
  if (contactInfo) {
    const socialLinks = portfolioData.socials
      .map((social) => `<a href="${social.url}" target="_blank" rel="noreferrer">${social.label}</a>`)
      .join("");

    contactInfo.innerHTML = `
      <p class="contact-title">Let us build something useful.</p>
      <p><a href="mailto:${portfolioData.email}">${portfolioData.email}</a></p>
      <div class="social-row">${socialLinks}</div>
    `;
  }

  document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button[type='submit']");
    if (!button) return;
    const original = button.textContent;
    button.textContent = "Message Ready";
    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  });

  site.initSmoothAnchorScroll?.();
  site.initSectionObserver?.();
  site.initRevealAnimations?.();
  initHornbill();
} catch (error) {
  console.error("Portfolio initialization failed:", error);
  document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
}
