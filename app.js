"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#main-nav");
const header = document.querySelector("#site-header");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const books = [...document.querySelectorAll("[data-book]")];
const count = document.querySelector("#book-count");
const dialog = document.querySelector("#guide-finder");
const options = document.querySelector("#finder-options");
const result = document.querySelector("#finder-result");
const finderIntro = document.querySelector(".finder-intro");
let finderOrigin;

function closeMenu(returnFocus = false) {
  menuToggle.setAttribute("aria-expanded", "false");
  menu.classList.remove("open");
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menu.classList.toggle("open", open);
});
menu.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.classList.contains("open"))
    closeMenu(true);
});
document.addEventListener("click", (event) => {
  if (!header.contains(event.target)) closeMenu();
});
matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});
const updateHeader = () =>
  header.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

function filterBooks(category) {
  let visibleCount = 0;
  for (const book of books) {
    const visible = category === "todos" || book.dataset.category === category;
    book.hidden = !visible;
    if (visible) visibleCount += 1;
  }
  for (const button of filterButtons)
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === category),
    );
  count.textContent =
    visibleCount === 1
      ? "1 libro para explorar"
      : `${visibleCount} libros para explorar`;
}
for (const button of filterButtons)
  button.addEventListener("click", () => filterBooks(button.dataset.filter));
for (const link of document.querySelectorAll("[data-category-link]"))
  link.addEventListener("click", () => filterBooks(link.dataset.categoryLink));

function resetFinder() {
  document.querySelector("#finder-title").textContent = "¿Qué os ocupa ahora?";
  options.hidden = false;
  result.hidden = true;
  result.replaceChildren();
  finderIntro.hidden = false;
}
for (const trigger of document.querySelectorAll(".finder-trigger")) {
  trigger.addEventListener("click", () => {
    finderOrigin = trigger;
    resetFinder();
    closeMenu();
    dialog.showModal();
    options.querySelector("button").focus();
  });
}
dialog
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    dialog.close();
});
dialog.addEventListener("close", () => finderOrigin?.focus());
options.addEventListener("click", (event) => {
  const choice = event.target.closest("[data-find]");
  if (!choice) return;
  const book = books.find((item) => item.dataset.book === choice.dataset.find);
  if (!book) return;
  const card = document.createElement("div");
  card.className = "finder-result-card";
  const cover = book.querySelector("img").cloneNode();
  cover.removeAttribute("loading");
  const content = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = book.querySelector("h3").textContent;
  title.className = "finder-result-title";
  title.tabIndex = -1;
  const description = document.createElement("p");
  description.textContent = book.querySelector(".book-meta p").textContent;
  const link = document.createElement("a");
  link.className = "button";
  link.href = book.querySelector("a").href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Ver en Amazon ↗";
  link.setAttribute(
    "aria-label",
    `${title.textContent} — Ver en Amazon (nueva pestaña)`,
  );
  content.append(title, description, link);
  card.append(cover, content);
  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "text-button finder-reset";
  reset.textContent = "← Explorar otro momento";
  reset.addEventListener("click", () => {
    resetFinder();
    choice.focus();
  });
  document.querySelector("#finder-title").textContent =
    "Por aquí podéis empezar.";
  result.replaceChildren(card, reset);
  options.hidden = true;
  finderIntro.hidden = true;
  result.hidden = false;
  title.focus();
});

if (
  "IntersectionObserver" in window &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12 },
  );
  document
    .querySelectorAll(
      ".topic-card,.section-heading,.planner-panel,.principles article",
    )
    .forEach((element) => observer.observe(element));
}
