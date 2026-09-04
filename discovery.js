"use strict";

(() => {
  const example = document.querySelector("#planner-example");
  if (!example) return;
  const tabs = [...example.querySelectorAll("[data-example-tab]")];
  const panels = [...example.querySelectorAll("[data-example-panel]")];
  const tabList = example.querySelector(".example-steps");
  const daySelect = example.querySelector("#example-day");
  const days = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  const status = example.querySelector("#planner-example-status");
  const ingredients = [...example.querySelectorAll('.example-shopping-list input[type="checkbox"]')];

  function selectStep(key, focus = false) {
    const activeTab = tabs.find((tab) => tab.dataset.exampleTab === key);
    if (!activeTab) return;
    for (const tab of tabs) {
      const selected = tab === activeTab;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
    for (const panel of panels) panel.hidden = panel.dataset.examplePanel !== key;
    if (focus) activeTab.focus({ preventScroll: true });
  }

  tabList.setAttribute("role", "tablist");
  for (const tab of tabs) {
    const panel = panels.find((item) => item.dataset.examplePanel === tab.dataset.exampleTab);
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panel.id);
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    panel.tabIndex = 0;
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      selectStep(tab.dataset.exampleTab);
    });
    tab.addEventListener("keydown", (event) => {
      const index = tabs.indexOf(tab);
      let nextIndex;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = tabs.length - 1;
      else if (event.key === " ") nextIndex = index;
      else return;
      event.preventDefault();
      selectStep(tabs[nextIndex].dataset.exampleTab, true);
    });
  }
  for (const button of example.querySelectorAll("[data-example-next]"))
    button.addEventListener("click", () => selectStep(button.dataset.exampleNext, true));

  daySelect.addEventListener("change", () => {
    const index = Number(daySelect.value);
    if (!Number.isInteger(index) || !days[index]) return;
    for (const label of example.querySelectorAll("[data-example-day-name]")) label.textContent = days[index];
    for (const day of example.querySelectorAll("[data-example-day]"))
      day.classList.toggle("is-selected", Number(day.dataset.exampleDay) === index);
    status.textContent = `Pan de pita está en la merienda del ${days[index]} de este ejemplo.`;
  });

  function updateShoppingCount() {
    const pending = ingredients.filter((input) => !input.checked).length;
    example.querySelector(".example-shopping-count").textContent = pending === 0
      ? "Ya tenéis los cuatro ingredientes de este ejemplo."
      : `${pending} ${pending === 1 ? "ingrediente por revisar" : "ingredientes por revisar"}.`;
  }
  for (const input of ingredients) input.addEventListener("change", updateShoppingCount);
  updateShoppingCount();

  // All three steps are readable without JavaScript; enhance them only after setup.
  const linkedPanel = panels.find((panel) => `#${panel.id}` === window.location.hash);
  selectStep(linkedPanel?.dataset.examplePanel || "idea");
  example.classList.add("discovery-ready");
})();
