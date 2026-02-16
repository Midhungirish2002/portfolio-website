import { portfolioData } from "./portfolio-data.js";
import { initSite } from "./site.js";

const skillBoard = document.getElementById("skillBoard");

initSite(portfolioData);

function svgData(svgString) {
  return `data:image/svg+xml,${encodeURIComponent(svgString)}`;
}

function renderIcon(item) {
  if (item.svg) {
    return `<img class="skill-icon-img" alt="${item.name} logo" src="${svgData(item.svg)}" />`;
  }
  return `<div class="skill-icon" style="background:${item.color || "#ddd"}">${item.icon || ""}</div>`;
}

function render() {
  if (!skillBoard) return;
  skillBoard.innerHTML = "";

  (portfolioData.skillGroups || []).forEach((group) => {
    const section = document.createElement("section");
    section.className = "skill-section";

    const cards = (group.items || [])
      .map(
        (item) => `
        <article class="skill-card">
          ${renderIcon(item)}
          <p class="skill-name">${item.name}</p>
        </article>
      `
      )
      .join("");

    section.innerHTML = `
      <h2 class="skill-section-title">${group.title}</h2>
      <div class="skill-card-grid">${cards}</div>
    `;

    skillBoard.appendChild(section);
  });
}

render();
