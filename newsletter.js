(() => {
  "use strict";

  const section = document.getElementById("newsletter");
  const embed = document.getElementById("newsletter-embed");
  const status = document.getElementById("newsletter-status");
  const fallback = document.getElementById("newsletter-fallback");
  if (!section || !embed || !status || !fallback || embed.dataset.initialized)
    return;

  const embedUrl = "https://insatum.activehosted.com/f/embed.php?id=5";
  const hostedUrl = "https://insatum.activehosted.com/f/5";
  const scriptId = "infant-nook-newsletter-script";
  let started = false;
  let ready = false;
  let timeout;
  let formObserver;

  embed.dataset.initialized = "true";
  embed.classList.add("_form_5");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.setAttribute("aria-atomic", "true");
  fallback.href = hostedUrl;
  fallback.rel = "noopener noreferrer";

  function setState(state, message) {
    embed.dataset.state = state;
    embed.setAttribute("aria-busy", String(state === "loading"));
    status.textContent = message;
    status.hidden = state === "ready";
    fallback.hidden = state === "ready";
  }

  function enhanceForm() {
    const form = embed.querySelector("form");
    const email = form?.querySelector('input[name="email"]');
    const months = form?.querySelector('input[name="fullname"]');
    const button = form?.querySelector('button[type="submit"]');
    if (!form || !email || !months || !button) return false;

    // ActiveCampaign's serializer expects text inputs. Changing email's type to
    // "email" silently omits it from the request, so validate with a pattern.
    email.setAttribute("inputmode", "email");
    email.setAttribute("autocomplete", "email");
    email.setAttribute("autocapitalize", "none");
    email.setAttribute("spellcheck", "false");
    email.setAttribute("aria-required", "true");
    email.pattern = "[^\\s@]+@[^\\s@]+\\.[^\\s@]+";
    email.title =
      "Escribe un correo electrónico válido, por ejemplo, nombre@ejemplo.com.";
    email.required = true;

    // The existing automation stores the baby's age in the legacy fullname
    // field. Preserve that contract, including ActiveCampaign's validation.
    months.setAttribute("inputmode", "numeric");
    months.setAttribute("autocomplete", "off");
    months.setAttribute("aria-required", "true");
    months.pattern = "[0-9]+";
    months.title =
      "Escribe la edad en meses con un número entero igual o mayor que 0.";
    months.placeholder = "Por ejemplo, 8";
    months.required = true;
    form.setAttribute("aria-label", "Únete a los Nookies");
    // Native constraint validation runs before the provider's submit handler,
    // avoiding its duplicate and technical error messages on empty fields.
    form.noValidate = false;

    for (const [input, labelText] of [
      [email, "Correo electrónico"],
      [months, "Edad de tu peque en meses"],
    ]) {
      const label = Array.from(form.querySelectorAll("label")).find(
        (item) => item.htmlFor === input.id,
      );
      if (label) label.textContent = `${labelText} (obligatorio)`;
      else input.setAttribute("aria-label", `${labelText} (obligatorio)`);
    }

    ready = true;
    clearTimeout(timeout);
    formObserver?.disconnect();
    setState("ready", "");
    return true;
  }

  function showFallback() {
    if (ready) return;
    setState(
      "error",
      "El formulario no ha podido cargarse. Puedes abrirlo en otra página.",
    );
  }

  function loadForm() {
    if (started) return;
    started = true;
    setState("loading", "Cargando el formulario…");
    if (enhanceForm()) return;

    formObserver = new MutationObserver(enhanceForm);
    formObserver.observe(embed, { childList: true, subtree: true });
    timeout = setTimeout(showFallback, 12000);

    // A single official embed retains its own submission, error and success
    // handlers; no local request receives or stores subscription details.
    if (document.getElementById(scriptId)) return;
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = embedUrl;
    script.charset = "utf-8";
    script.async = true;
    script.addEventListener(
      "load",
      () => {
        if (!enhanceForm()) showFallback();
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => {
        clearTimeout(timeout);
        formObserver.disconnect();
        showFallback();
      },
      { once: true },
    );
    document.head.appendChild(script);
  }

  setState("idle", "El formulario se cargará al llegar a esta sección.");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          loadForm();
        }
      },
      { rootMargin: "500px 0px" },
    );
    observer.observe(section);
  } else {
    loadForm();
  }
})();
