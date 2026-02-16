import { portfolioData } from "./portfolio-data.js";
import { initSite, toast, copyToClipboard } from "./site.js";

const projectSearch = document.getElementById("projectSearch");
const projectSort = document.getElementById("projectSort");
const projectClear = document.getElementById("projectClear");
const projectFilters = document.getElementById("projectFilters");
const projectCount = document.getElementById("projectCount");
const kpiTotal = document.getElementById("kpiTotal");
const kpiStacks = document.getElementById("kpiStacks");
const kpiYears = document.getElementById("kpiYears");
const bookPage = document.getElementById("bookPage");
const bookPrev = document.getElementById("bookPrev");
const bookNext = document.getElementById("bookNext");
const bookStatus = document.getElementById("bookStatus");

initSite(portfolioData);

let activeTags = new Set();
let visibleProjects = [];
let currentIndex = 0;

const uniqueStacks = new Set(
  portfolioData.projects.flatMap((project) => project.stack || []).map((item) => String(item))
);
const uniqueYears = new Set(portfolioData.projects.map((project) => String(project.year)));

if (kpiTotal) kpiTotal.textContent = String(portfolioData.projects.length);
if (kpiStacks) kpiStacks.textContent = String(uniqueStacks.size);
if (kpiYears) kpiYears.textContent = String(uniqueYears.size);

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

function buildTagList() {
  const tags = new Map();
  portfolioData.projects.forEach((project) => {
    (project.stack || []).forEach((tag) => {
      const key = String(tag);
      tags.set(key, (tags.get(key) || 0) + 1);
    });
  });
  return [...tags.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function renderTagFilters() {
  if (!projectFilters) return;
  projectFilters.innerHTML = "";

  buildTagList().forEach(([tag, count]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip chip-filter";
    btn.setAttribute("data-tag", tag);
    btn.setAttribute("aria-pressed", activeTags.has(tag) ? "true" : "false");
    btn.textContent = `${tag} (${count})`;

    btn.addEventListener("click", () => {
      if (activeTags.has(tag)) activeTags.delete(tag);
      else activeTags.add(tag);
      renderTagFilters();
      refreshVisibleProjects();
    });

    projectFilters.appendChild(btn);
  });
}

function matchesTags(project) {
  if (activeTags.size === 0) return true;
  const stack = project.stack || [];
  for (const tag of activeTags) {
    if (!stack.includes(tag)) return false;
  }
  return true;
}

function matchesSearch(project, query) {
  if (!query) return true;
  const haystack = [
    project.title,
    project.description,
    project.impact,
    project.role,
    project.year,
    ...(project.stack || [])
  ]
    .map(normalize)
    .join(" ");
  return haystack.includes(query);
}

function sortProjects(items) {
  const mode = projectSort?.value || "year_desc";
  const copy = [...items];

  if (mode === "title_asc") {
    copy.sort((a, b) => String(a.title).localeCompare(String(b.title)));
    return copy;
  }

  copy.sort((a, b) => String(b.year).localeCompare(String(a.year)));
  return copy;
}

function projectMarkup(project) {
  const stack = (project.stack || [])
    .map(
      (item) =>
        `<button type="button" class="chip chip-stack" data-tag="${String(item)}">${String(item)}</button>`
    )
    .join("");

  return `
    <article class="project project-book-page">
      <div class="project-top">
        <p class="project-meta">${project.year} • ${project.role}</p>
        <h3>${project.title}</h3>
      </div>
      <p>${project.description}</p>
      <p class="meta">${project.impact}</p>
      <div class="stack">${stack}</div>
      <details class="project-more">
        <summary>Quick notes</summary>
        <ul>
          <li><strong>Challenge:</strong> ${project.detail?.challenge || "-"}</li>
          <li><strong>Solution:</strong> ${project.detail?.solution || "-"}</li>
        </ul>
      </details>
      <div class="project-links">
        <a href="./project.html?project=${project.id}">Read Case Study</a>
        <a href="${project.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
        <button type="button" class="link-btn" data-copy="${project.repoUrl}">Copy repo</button>
      </div>
    </article>
  `;
}

function bindPageInteractions() {
  bookPage.querySelectorAll(".chip-stack").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.getAttribute("data-tag");
      if (!tag) return;
      if (activeTags.has(tag)) activeTags.delete(tag);
      else activeTags.add(tag);
      renderTagFilters();
      refreshVisibleProjects();
      projectFilters?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  const copyBtn = bookPage.querySelector("[data-copy]");
  copyBtn?.addEventListener("click", async () => {
    const url = copyBtn.getAttribute("data-copy");
    const ok = await copyToClipboard(url);
    toast(ok ? "Copied repo link" : "Copy failed");
  });
}

function renderCurrentPage(direction = "none") {
  if (!bookPage) return;

  if (visibleProjects.length === 0) {
    bookPage.innerHTML = `<div class="empty"><p>No projects match your filters.</p></div>`;
    if (bookStatus) bookStatus.textContent = "Page 0 of 0";
    if (bookPrev) bookPrev.disabled = true;
    if (bookNext) bookNext.disabled = true;
    return;
  }

  const project = visibleProjects[currentIndex];
  bookPage.classList.remove("flip-next", "flip-prev");
  void bookPage.offsetWidth;
  bookPage.innerHTML = projectMarkup(project);
  bindPageInteractions();

  if (direction === "next") bookPage.classList.add("flip-next");
  if (direction === "prev") bookPage.classList.add("flip-prev");

  if (bookStatus) bookStatus.textContent = `Page ${currentIndex + 1} of ${visibleProjects.length}`;
  if (bookPrev) bookPrev.disabled = currentIndex === 0;
  if (bookNext) bookNext.disabled = currentIndex >= visibleProjects.length - 1;
}

function refreshVisibleProjects() {
  const query = normalize(projectSearch?.value);
  visibleProjects = sortProjects(
    portfolioData.projects
      .filter((project) => matchesTags(project))
      .filter((project) => matchesSearch(project, query))
  );

  if (currentIndex >= visibleProjects.length) currentIndex = Math.max(visibleProjects.length - 1, 0);
  if (projectCount) {
    projectCount.textContent = `${visibleProjects.length} project${visibleProjects.length === 1 ? "" : "s"} shown`;
  }
  renderCurrentPage("none");
}

bookPrev?.addEventListener("click", () => {
  if (currentIndex <= 0) return;
  currentIndex -= 1;
  renderCurrentPage("prev");
});

bookNext?.addEventListener("click", () => {
  if (currentIndex >= visibleProjects.length - 1) return;
  currentIndex += 1;
  renderCurrentPage("next");
});

projectSearch?.addEventListener("input", () => {
  currentIndex = 0;
  refreshVisibleProjects();
});

projectSort?.addEventListener("change", () => {
  currentIndex = 0;
  refreshVisibleProjects();
});

projectClear?.addEventListener("click", () => {
  activeTags = new Set();
  if (projectSearch) projectSearch.value = "";
  if (projectSort) projectSort.value = "year_desc";
  currentIndex = 0;
  renderTagFilters();
  refreshVisibleProjects();
});

renderTagFilters();
refreshVisibleProjects();
