import { portfolioData } from "./portfolio-data.js";
import { initSite } from "./site.js";

const processGrid = document.getElementById("processGrid");
const expandAll = document.getElementById("expandAll");
const collapseAll = document.getElementById("collapseAll");

initSite(portfolioData);

function render() {
  processGrid.innerHTML = "";

  portfolioData.process.forEach((step, index) => {
    const details = document.createElement("details");
    details.className = "process-step";

    details.innerHTML = `
      <summary>
        <span class="process-index">0${index + 1}</span>
        <span class="process-title">${step.title}</span>
      </summary>
      <div class="process-body">
        <p>${step.description}</p>
      </div>
    `;

    processGrid.appendChild(details);
  });
}

render();

expandAll?.addEventListener("click", () => {
  processGrid.querySelectorAll("details").forEach((node) => node.setAttribute("open", "true"));
});

collapseAll?.addEventListener("click", () => {
  processGrid.querySelectorAll("details").forEach((node) => node.removeAttribute("open"));
});
