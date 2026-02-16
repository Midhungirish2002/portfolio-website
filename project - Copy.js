import { portfolioData } from "./portfolio-data.js";
import { initSite, toast, copyToClipboard } from "./site.js";

const params = new URLSearchParams(window.location.search);
const projectId = params.get("project");
const projectIndex = portfolioData.projects.findIndex((item) => item.id === projectId);
const project = portfolioData.projects[projectIndex];

const projectBadge = document.getElementById("projectBadge");
const projectTitle = document.getElementById("projectTitle");
const projectDescription = document.getElementById("projectDescription");
const projectLinks = document.getElementById("projectLinks");
const projectChallenge = document.getElementById("projectChallenge");
const projectSolution = document.getElementById("projectSolution");
const projectApproach = document.getElementById("projectApproach");
const projectHighlights = document.getElementById("projectHighlights");
const projectArchitecture = document.getElementById("projectArchitecture");
const projectStack = document.getElementById("projectStack");
const projectNav = document.getElementById("projectNav");

initSite(portfolioData);

if (!project) {
  projectBadge.textContent = "404";
  projectTitle.textContent = "Project not found";
  projectDescription.textContent = "The case study you requested is not available.";
} else {
  document.title = `${project.title} | ${portfolioData.name}`;
  projectBadge.textContent = `${project.title} | ${project.year}`;
  projectTitle.textContent = project.title;
  projectDescription.textContent = project.description;
  projectChallenge.textContent = project.detail.challenge;
  projectSolution.textContent = project.detail.solution;

  project.detail.approach.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    projectApproach.appendChild(li);
  });

  project.detail.highlights.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    projectHighlights.appendChild(li);
  });

  project.detail.architecture.forEach((note) => {
    const li = document.createElement("li");
    li.textContent = note;
    projectArchitecture.appendChild(li);
  });

  project.stack.forEach((item) => {
    const chip = document.createElement("span");
    chip.className = "skill-chip";
    chip.textContent = item;
    projectStack.appendChild(chip);
  });

  projectLinks.innerHTML = `
    <a class="btn btn-primary" href="${project.repoUrl}" target="_blank" rel="noreferrer">View Repository</a>
    <button class="btn btn-ghost" type="button" id="copyRepo">Copy Repo Link</button>
    <a class="btn btn-ghost" href="./projects.html">Back to Projects</a>
  `;

  document.getElementById("copyRepo")?.addEventListener("click", async () => {
    const ok = await copyToClipboard(project.repoUrl);
    toast(ok ? "Copied repo link" : "Copy failed");
  });

  const prevProject = projectIndex > 0 ? portfolioData.projects[projectIndex - 1] : null;
  const nextProject = projectIndex < portfolioData.projects.length - 1 ? portfolioData.projects[projectIndex + 1] : null;

  projectNav.innerHTML = `
    ${prevProject ? `<a class="detail-jump" href="./project.html?project=${prevProject.id}">Prev: ${prevProject.title}</a>` : `<span class="detail-jump disabled">Start</span>`}
    ${nextProject ? `<a class="detail-jump" href="./project.html?project=${nextProject.id}">Next: ${nextProject.title}</a>` : `<span class="detail-jump disabled">End</span>`}
  `;
}
