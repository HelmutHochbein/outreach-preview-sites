const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const root = document.documentElement;
const hero = document.querySelector(".hero");

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

toggle.addEventListener("click", () => {
  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

let heroTicking = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateHeroMotion() {
  if (!hero) {
    return;
  }

  const rect = hero.getBoundingClientRect();
  const travel = Math.max(1, rect.height - window.innerHeight * .2);
  const progress = clamp(-rect.top / travel, 0, 1);
  root.style.setProperty("--hero-progress", progress.toFixed(4));
  heroTicking = false;
}

function requestHeroMotion() {
  if (heroTicking) {
    return;
  }

  heroTicking = true;
  window.requestAnimationFrame(updateHeroMotion);
}

window.addEventListener("scroll", requestHeroMotion, { passive: true });
window.addEventListener("resize", requestHeroMotion);

hero?.addEventListener("pointermove", (event) => {
  const rect = hero.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) - .5;
  const y = ((event.clientY - rect.top) / rect.height) - .5;
  root.style.setProperty("--hero-pointer-x", x.toFixed(4));
  root.style.setProperty("--hero-pointer-y", y.toFixed(4));
});

hero?.addEventListener("pointerleave", () => {
  root.style.setProperty("--hero-pointer-x", "0");
  root.style.setProperty("--hero-pointer-y", "0");
});

updateHeroMotion();

const revealSelectors = [
  ".intro .section-kicker",
  ".intro h2",
  ".intro p",
  ".section-heading",
  ".service-card",
  ".comfort-panel > div",
  ".process-grid article",
  ".area-copy",
  ".area-map",
  ".contact-card",
  ".contact-form",
  ".address-card"
];

let lastScrollY = window.scrollY;
let scrollDirection = "down";

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;
  scrollDirection = currentScrollY >= lastScrollY ? "down" : "up";
  lastScrollY = currentScrollY;
}, { passive: true });

const revealItems = document.querySelectorAll(revealSelectors.join(","));

revealItems.forEach((item, index) => {
  item.classList.add("reveal");
  item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.dataset.revealDirection = scrollDirection === "up" ? "up" : "down";
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px"
  });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) {
    return;
  }

  const data = new FormData(contactForm);
  const subject = "Anfrage über die neue Website";
  const body = [
    "Hallo Barnimer Rollladenbau,",
    "",
    "ich möchte ein Projekt anfragen:",
    "",
    `Name: ${data.get("name")}`,
    `Kontakt: ${data.get("phone")}`,
    `Ort / Objekt: ${data.get("place") || "-"}`,
    `Leistung: ${data.get("service")}`,
    "",
    "Kurzbeschreibung:",
    data.get("message") || "-"
  ].join("\n");

  formNote.textContent = "Die Anfrage wurde als E-Mail vorbereitet.";
  window.location.href = `mailto:info@rollladenbau-barnim.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
