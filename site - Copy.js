export function initSite(portfolioData) {
  const year = new Date().getFullYear();

  const brandName = document.getElementById("brandName");
  if (brandName && portfolioData?.name) brandName.textContent = portfolioData.name;

  const footerText = document.getElementById("footerText");
  if (footerText && portfolioData?.name) {
    footerText.textContent = `${year} ${portfolioData.name}. Built with HTML, CSS, and JavaScript.`;
  }

  // Highlight current page in nav.
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const target = href.split("/").pop();
    if (target === current) link.setAttribute("aria-current", "page");
  });

  // Add click-triggered pulse animation on prominent headings.
  attachHeadingPulse([
    ".section-head h1",
    ".section-head h2",
    ".about-title",
    ".skill-section-title",
    ".detail-title"
  ]);

  // Quick search focus (/) on pages that have a search input.
  const searchInput =
    document.getElementById("projectSearch") ||
    document.getElementById("skillSearch") ||
    document.getElementById("processSearch");

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && searchInput && document.activeElement !== searchInput) {
      event.preventDefault();
      searchInput.focus();
    }
  });
}

function attachHeadingPulse(selectors) {
  const targets = selectors.flatMap((sel) => Array.from(document.querySelectorAll(sel)));
  targets.forEach((node) => {
    node.style.cursor = "pointer";
    node.addEventListener("click", () => {
      node.classList.remove("pulse-once");
      // Force reflow to restart animation
      void node.offsetWidth;
      node.classList.add("pulse-once");
    });
  });
}

let toastHost;
export function toast(message) {
  if (!message) return;

  if (!toastHost) {
    toastHost = document.createElement("div");
    toastHost.className = "toast-host";
    document.body.appendChild(toastHost);
  }

  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  toastHost.appendChild(node);

  requestAnimationFrame(() => node.classList.add("is-on"));
  window.setTimeout(() => {
    node.classList.remove("is-on");
    window.setTimeout(() => node.remove(), 180);
  }, 1600);
}

export async function copyToClipboard(text) {
  if (!text) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers.
    try {
      const temp = document.createElement("textarea");
      temp.value = text;
      temp.setAttribute("readonly", "true");
      temp.style.position = "fixed";
      temp.style.left = "-9999px";
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
      return true;
    } catch {
      return false;
    }
  }
}
