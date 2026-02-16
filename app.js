import { portfolioData } from "./portfolio-data.js";
import * as site from "./site.js?v=20260211-2";

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

  let x = window.innerWidth * 0.2;
  let y = Math.max(80, window.innerHeight * 0.18);
  let vx = 0;
  let vy = 0;
  let tx = x;
  let ty = y;
  let wanderAt = 0;
  let perchSection = null;
  let cursorSpeed = 0;
  let lastPointer = null;
  let pointer = { x: x, y: y, moving: false, t: performance.now() };
  let lastFrame = performance.now();
  let wingPhase = 0;
  const sectionNodes = Array.from(document.querySelectorAll(".section-observe"));

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const pickWanderTarget = (now) => {
    tx = 56 + Math.random() * Math.max(120, window.innerWidth - 112);
    ty = 72 + Math.random() * Math.max(160, window.innerHeight - 136);
    wanderAt = now;
  };

  pickWanderTarget(performance.now());

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
      pointer = { x: event.clientX, y: event.clientY, moving: true, t: now };

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

  const tick = (now) => {
    const dt = clamp((now - lastFrame) / 16.666, 0.5, 1.8);
    lastFrame = now;
    const idlePointer = now - pointer.t > 1100;
    if (idlePointer) pointer.moving = false;

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
      // Blend mouse-influenced flight with ambient wandering.
      const wanderTimeout = now - wanderAt > 2600;
      const distToTarget = Math.hypot(tx - x, ty - y);
      if (distToTarget < 36 || wanderTimeout) pickWanderTarget(now);

      if (pointer.moving) {
        const lead = 28 + clamp(cursorSpeed * 18, 0, 56);
        tx = clamp(pointer.x + lead, 40, window.innerWidth - 40);
        ty = clamp(pointer.y - 18, 40, window.innerHeight - 40);
      } else {
        const driftX = Math.sin(now * 0.0011) * 18;
        const driftY = Math.cos(now * 0.0014) * 10;
        tx = clamp(tx + driftX * 0.015, 40, window.innerWidth - 40);
        ty = clamp(ty + driftY * 0.015, 40, window.innerHeight - 40);
      }
    }

    const dx = tx - x;
    const dy = ty - y;
    const distance = Math.hypot(dx, dy) || 1;

    if (distance < 1.0) {
      x = tx;
      y = ty;
      vx = 0;
      vy = 0;
    } else {
      const dirX = dx / distance;
      const dirY = dy / distance;

      const maxSpeed = perchSection
        ? 2.0
        : clamp(1.2 + cursorSpeed * 18, 1.2, 5.0);
      const steering = perchSection ? 0.13 : 0.095;
      const damping = perchSection ? 0.88 : 0.93;

      vx += dirX * steering * dt;
      vy += dirY * steering * dt;
      vx *= damping;
      vy *= damping;

      const speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const ratio = maxSpeed / speed;
        vx *= ratio;
        vy *= ratio;
      }
    }

    x += vx * dt;
    y += vy * dt;
    const clampedX = clamp(x, 24, window.innerWidth - 24);
    const clampedY = clamp(y, 24, window.innerHeight - 24);
    x = clampedX;
    y = clampedY;

    const angle = clamp(Math.atan2(vy, Math.max(0.001, vx)) * (180 / Math.PI), -18, 18);
    const speedForFlap = Math.hypot(vx, vy);
    wingPhase += (0.055 + speedForFlap * 0.02) * dt;
    const bob = Math.sin(wingPhase) * (perchSection ? 1.4 : 2.6);
    bird.style.setProperty("--hornbill-flap-rate", `${clamp(0.95 - speedForFlap * 0.08, 0.55, 0.95)}s`);

    bird.style.left = `${clampedX}px`;
    bird.style.top = `${clampedY + bob}px`;
    bird.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    requestAnimationFrame(tick);
  };

  requestAnimationFrame((time) => {
    lastFrame = time;
    tick(time);
  });
};

try {
  // Prevent browser from restoring scroll position on refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Force scroll to top on page load
  window.scrollTo(0, 0);

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
    const getSocialIcon = (label) => {
      const iconUrls = {
        "GitHub": "./assets/github-icon.svg",
        "LinkedIn": "./assets/linkedin-icon.svg"
      };
      return iconUrls[label] || "";
    };

    const socialLinks = portfolioData.socials
      .map((social) => {
        const iconUrl = getSocialIcon(social.label);
        return `<a href="${social.url}" target="_blank" rel="noreferrer" aria-label="${social.label}"><img src="${iconUrl}" alt="${social.label}" /></a>`;
      })
      .join("");

    contactInfo.innerHTML = `
      <p class="contact-title">Let us build something useful.</p>
      <p><a href="mailto:${portfolioData.email}">${portfolioData.email}</a></p>
      <div class="social-row">${socialLinks}</div>
    `;
  }

  // Initialize EmailJS
  const EMAILJS_PUBLIC_KEY = "17TxEKBv6_gS82F-0"; // Your EmailJS public key
  const EMAILJS_SERVICE_ID = "service_82623do"; // Your EmailJS service ID
  const EMAILJS_TEMPLATE_ID = "template_a3mxy88"; // Your EmailJS template ID (for you)
  const EMAILJS_AUTOREPLY_TEMPLATE_ID = "template_o6ymez6"; // Auto-reply template ID (for visitor)

  // Handle contact form submission with EmailJS
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const submitButton = contactForm.querySelector("button[type='submit']");
      const originalButtonText = submitButton.textContent;

      // Show loading state
      submitButton.textContent = "Sending...";
      submitButton.disabled = true;

      // Check if EmailJS is configured
      if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY_HERE") {
        // Fallback to mailto if EmailJS not configured
        const name = document.getElementById("contactName").value;
        const email = document.getElementById("contactEmail").value;
        const message = document.getElementById("contactMessage").value;

        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        window.location.href = `mailto:${portfolioData.email}?subject=${subject}&body=${body}`;

        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        contactForm.reset();
        return;
      }

      // Initialize EmailJS
      emailjs.init(EMAILJS_PUBLIC_KEY);

      // Send email to you (the portfolio owner)
      const sendToOwner = emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm);

      // Send auto-reply to the visitor
      const sendAutoReply = emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID, contactForm);

      // Wait for both emails to send
      Promise.all([sendToOwner, sendAutoReply])
        .then(() => {
          submitButton.textContent = "Message Sent! ✓";
          submitButton.style.background = "#10b981";
          contactForm.reset();

          setTimeout(() => {
            submitButton.textContent = originalButtonText;
            submitButton.style.background = "";
            submitButton.disabled = false;
          }, 3000);
        })
        .catch((error) => {
          console.error("EmailJS Error:", error);
          submitButton.textContent = "Error - Try Again";
          submitButton.style.background = "#ef4444";

          setTimeout(() => {
            submitButton.textContent = originalButtonText;
            submitButton.style.background = "";
            submitButton.disabled = false;
          }, 3000);
        });
    });
  }

  site.initSmoothAnchorScroll?.();
  site.initSectionObserver?.();
  site.initRevealAnimations?.();
  initHornbill();
} catch (error) {
  console.error("Portfolio initialization failed:", error);
  document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
}
