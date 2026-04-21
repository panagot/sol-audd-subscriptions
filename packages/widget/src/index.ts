type ScriptEl = HTMLScriptElement & {
  dataset: DOMStringMap & {
    plan?: string;
    api?: string;
  };
};

function boot() {
  const script = document.currentScript as ScriptEl | null;
  if (!script) return;

  const plan = script.dataset.plan;
  const api = script.dataset.api?.replace(/\/$/, "");

  if (!plan || !api) {
    // eslint-disable-next-line no-console
    console.error(
      "[audd-widget] Missing data-plan or data-api on the script tag.",
    );
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.src = `${api}/embed/${encodeURIComponent(plan)}`;
  iframe.title = "AUDD subscription checkout";
  iframe.loading = "lazy";
  iframe.style.width = "100%";
  iframe.style.maxWidth = "420px";
  iframe.style.minHeight = "520px";
  iframe.style.border = "0";
  iframe.style.borderRadius = "12px";
  iframe.setAttribute("allow", "clipboard-write");

  const wrap = document.createElement("div");
  wrap.style.width = "100%";
  wrap.style.display = "flex";
  wrap.style.justifyContent = "center";

  wrap.appendChild(iframe);
  script.parentNode?.insertBefore(wrap, script.nextSibling);
}

boot();
