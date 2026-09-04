"use strict";

(() => {
  function initVisualExperience() {
    document.documentElement.classList.add("visual-ready");
    const desktop = window.matchMedia("(min-width: 901px) and (min-height: 620px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const story = document.querySelector("#visual-story");
    const stage = story?.querySelector(".story-stage");
    const steps = [...(story?.querySelectorAll("[data-story-step]") || [])];
    const storyImages = [...(stage?.querySelectorAll("img[data-scene]") || [])];
    const storyButtons = [...document.querySelectorAll("[data-story-target]")];
    const progress = document.querySelector("#story-progress");
    const gallery = document.querySelector("#hero-gallery");
    const heroImages = [...(gallery?.querySelectorAll("img[data-hero-scene]") || [])];
    const heroButtons = [...document.querySelectorAll("[data-hero-target]")];
    const heroVisual = document.querySelector(".hero-visual");
    const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
    let activeStory;
    let lastProgress;
    let storyFrame = 0;
    let stopStoryTracking = () => {};
    let stopPointerTracking = () => {};

    function selectStory(key) {
      if (!steps.some((step) => step.dataset.storyStep === key)) return;
      if (activeStory === key) return;
      activeStory = key;
      if (stage) stage.dataset.active = key;
      for (const image of storyImages) {
        const selected = image.dataset.scene === key;
        image.classList.toggle("is-active", selected);
        image.setAttribute("aria-hidden", String(!selected));
      }
      for (const step of steps)
        step.classList.toggle("is-active", step.dataset.storyStep === key);
      for (const button of storyButtons) {
        const selected = button.dataset.storyTarget === key;
        button.classList.toggle("is-active", selected);
        if (selected) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
      }
    }

    function setProgress(value) {
      const next = Number(clamp(value).toFixed(4));
      if (next === lastProgress) return;
      lastProgress = next;
      story?.style.setProperty("--story-progress", String(next));
      progress?.setAttribute("aria-valuenow", String(Math.round(next * 100)));
    }

    function updateStoryFromScroll() {
      storyFrame = 0;
      const readingLine = window.innerHeight * 0.45;
      const positions = steps.map((step) => {
        const rect = step.getBoundingClientRect();
        return { key: step.dataset.storyStep, center: rect.top + rect.height / 2 };
      });
      let nearest = positions[0];
      for (const position of positions)
        if (Math.abs(position.center - readingLine) < Math.abs(nearest.center - readingLine))
          nearest = position;
      selectStory(nearest.key);
      const first = positions[0].center;
      const distance = positions[positions.length - 1].center - first;
      setProgress(distance > 0 ? (readingLine - first) / distance : 1);
    }

    function scheduleStoryUpdate() {
      if (!storyFrame) storyFrame = window.requestAnimationFrame(updateStoryFromScroll);
    }

    function configureStoryTracking() {
      stopStoryTracking();
      stopStoryTracking = () => {};
      if (!story || !steps.length) return;
      const enhanced = desktop.matches && !reducedMotion.matches;
      story.classList.toggle("story-enhanced", enhanced);
      if (!enhanced) {
        setProgress(0);
        return;
      }

      window.addEventListener("scroll", scheduleStoryUpdate, { passive: true });
      window.addEventListener("resize", scheduleStoryUpdate, { passive: true });
      // Recalculate when fonts or responsive content alter the chapter heights.
      const resizeObserver = "ResizeObserver" in window
        ? new ResizeObserver(scheduleStoryUpdate)
        : null;
      resizeObserver?.observe(story);
      for (const step of steps) resizeObserver?.observe(step);
      updateStoryFromScroll();
      stopStoryTracking = () => {
        window.removeEventListener("scroll", scheduleStoryUpdate);
        window.removeEventListener("resize", scheduleStoryUpdate);
        resizeObserver?.disconnect();
        if (storyFrame) window.cancelAnimationFrame(storyFrame);
        storyFrame = 0;
      };
    }

    function selectHero(key) {
      if (!heroImages.some((image) => image.dataset.heroScene === key)) return;
      gallery.dataset.active = key;
      for (const image of heroImages) {
        const selected = image.dataset.heroScene === key;
        image.classList.toggle("is-active", selected);
        image.setAttribute("aria-hidden", String(!selected));
      }
      for (const button of heroButtons) {
        const selected = button.dataset.heroTarget === key;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      }
    }

    function configurePointerTracking() {
      stopPointerTracking();
      stopPointerTracking = () => {};
      if (!heroVisual || reducedMotion.matches || !finePointer.matches) return;
      let pointerFrame = 0;
      let pointerX = 0;
      let pointerY = 0;

      const updatePointer = () => {
        pointerFrame = 0;
        const rect = heroVisual.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = clamp(((pointerX - rect.left) / rect.width) * 2 - 1, -1, 1);
        const y = clamp(((pointerY - rect.top) / rect.height) * 2 - 1, -1, 1);
        heroVisual.style.setProperty("--pointer-x", String(Number(x.toFixed(4))));
        heroVisual.style.setProperty("--pointer-y", String(Number(y.toFixed(4))));
      };
      const onPointerMove = (event) => {
        if (event.pointerType === "touch") return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!pointerFrame) pointerFrame = window.requestAnimationFrame(updatePointer);
      };
      const resetPointer = () => {
        if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
        pointerFrame = 0;
        heroVisual.style.setProperty("--pointer-x", "0");
        heroVisual.style.setProperty("--pointer-y", "0");
      };
      heroVisual.addEventListener("pointermove", onPointerMove, { passive: true });
      heroVisual.addEventListener("pointerleave", resetPointer);
      heroVisual.addEventListener("pointercancel", resetPointer);
      stopPointerTracking = () => {
        heroVisual.removeEventListener("pointermove", onPointerMove);
        heroVisual.removeEventListener("pointerleave", resetPointer);
        heroVisual.removeEventListener("pointercancel", resetPointer);
        resetPointer();
      };
    }

    for (const button of storyButtons) {
      button.addEventListener("click", (event) => {
        const step = steps.find((item) => item.dataset.storyStep === button.dataset.storyTarget);
        if (!step) return;
        event.preventDefault();
        selectStory(step.dataset.storyStep);
        const heading = step.querySelector("h3");
        if (heading) {
          heading.setAttribute("tabindex", "-1");
          heading.focus({ preventScroll: true });
        }
        step.scrollIntoView({
          behavior: reducedMotion.matches ? "instant" : "smooth",
          block: "center",
        });
      });
    }
    for (const button of heroButtons)
      button.addEventListener("click", () => selectHero(button.dataset.heroTarget));

    if (progress) {
      progress.setAttribute("role", "progressbar");
      progress.setAttribute("aria-label", "Recorrido por momentos");
      progress.setAttribute("aria-valuemin", "0");
      progress.setAttribute("aria-valuemax", "100");
    }
    if (steps.length) selectStory(steps[0].dataset.storyStep);
    setProgress(0);
    selectHero("connection");

    function configureMotion() {
      document.documentElement.classList.toggle("motion-reduced", reducedMotion.matches);
      configurePointerTracking();
      configureStoryTracking();
    }
    desktop.addEventListener("change", configureStoryTracking);
    finePointer.addEventListener("change", configurePointerTracking);
    reducedMotion.addEventListener("change", configureMotion);
    configureMotion();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initVisualExperience, { once: true });
  else initVisualExperience();
})();
