import { portfolioData } from "./portfolio-data.js";
import { initSite } from "./site.js";

initSite(portfolioData);

const params = new URLSearchParams(window.location.search);
const projectId = params.get("project");
const index = portfolioData.projects.findIndex((item) => item.id === projectId);
const project = portfolioData.projects[index];

const projectMeta = document.getElementById("projectMeta");
const projectTitle = document.getElementById("projectTitle");
const projectSummary = document.getElementById("projectSummary");
const projectRole = document.getElementById("projectRole");
const projectYear = document.getElementById("projectYear");
const projectGithub = document.getElementById("projectGithub");
const projectStack = document.getElementById("projectStack");
const projectChallenge = document.getElementById("projectChallenge");
const projectSolution = document.getElementById("projectSolution");
const projectFeatures = document.getElementById("projectFeatures");
const projectGallery = document.getElementById("projectGallery");
const projectNav = document.getElementById("projectNav");

if (!project) {
  projectMeta.textContent = "404";
  projectTitle.textContent = "Project not found";
  projectSummary.textContent = "The project you requested is not available in this portfolio.";
  projectGithub.style.display = "none";
} else {
  // Core case-study fields.
  document.title = `${project.title} | ${portfolioData.name}`;
  projectMeta.textContent = `${project.role} • ${project.year}`;
  projectTitle.textContent = project.title;
  projectSummary.textContent = project.summary;
  projectRole.textContent = project.role;
  projectYear.textContent = project.year;
  projectGithub.href = project.repoUrl;

  // Stack chips.
  project.tags.forEach((tag) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = tag;
    projectStack.appendChild(chip);
  });

  // Case-study detail content.
  projectChallenge.textContent = project.detail.challenge;
  projectSolution.textContent = project.detail.solution;

  project.detail.features.forEach((feature) => {
    const item = document.createElement("li");
    item.textContent = feature;
    projectFeatures.appendChild(item);
  });

  // Screenshot gallery.
  projectGallery.innerHTML = project.screenshots
    .map(
      (shot) => `
      <figure>
        <img src="${shot.image}" alt="${project.title} - ${shot.label}" loading="lazy" />
        <figcaption>${shot.label}</figcaption>
      </figure>
    `
    )
    .join("");

  // Prev and next navigation.
  const prevProject = index > 0 ? portfolioData.projects[index - 1] : null;
  const nextProject = index < portfolioData.projects.length - 1 ? portfolioData.projects[index + 1] : null;

  projectNav.innerHTML = `
    ${prevProject ? `<a class="detail-link" href="./project.html?project=${prevProject.id}">Previous: ${prevProject.title}</a>` : `<span class="detail-link disabled">Previous</span>`}
    ${nextProject ? `<a class="detail-link" href="./project.html?project=${nextProject.id}">Next: ${nextProject.title}</a>` : `<span class="detail-link disabled">Next</span>`}
  `;
}
