import { portfolioData } from "./portfolio-data.js";
import { initSite, toast, copyToClipboard } from "./site.js";

const emailLink = document.getElementById("emailLink");
const copyEmail = document.getElementById("copyEmail");
const socialLinks = document.getElementById("socialLinks");
const msgSubject = document.getElementById("msgSubject");
const msgBody = document.getElementById("msgBody");
const mailtoBtn = document.getElementById("mailtoBtn");
const clearMsg = document.getElementById("clearMsg");

initSite(portfolioData);

emailLink.href = `mailto:${portfolioData.email}`;
emailLink.textContent = portfolioData.email;

portfolioData.socials.forEach((social) => {
  const link = document.createElement("a");
  link.href = social.url;
  link.textContent = social.label;
  link.target = "_blank";
  link.rel = "noreferrer";
  socialLinks.appendChild(link);
});

function updateMailto() {
  const subject = encodeURIComponent(msgSubject?.value || "");
  const body = encodeURIComponent(msgBody?.value || "");
  const href = `mailto:${portfolioData.email}?subject=${subject}&body=${body}`;
  mailtoBtn.href = href;
}

updateMailto();

msgSubject?.addEventListener("input", updateMailto);
msgBody?.addEventListener("input", updateMailto);

copyEmail?.addEventListener("click", async () => {
  const ok = await copyToClipboard(portfolioData.email);
  toast(ok ? "Copied email" : "Copy failed");
});

clearMsg?.addEventListener("click", () => {
  if (msgSubject) msgSubject.value = "";
  if (msgBody) msgBody.value = "";
  updateMailto();
});
