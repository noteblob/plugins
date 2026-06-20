// src/mermaid/main.ts
var mermaid;
function themeName(scheme) {
  return scheme === "dark" ? "dark" : "default";
}
async function draw({ el, token }, { theme }) {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: themeName(theme.colorScheme)
  });
  el.classList.add("mermaid");
  el.removeAttribute("data-processed");
  el.textContent = token.source;
  await mermaid.run({ nodes: [el] });
  constrainSVG(el);
}
function constrainSVG(el) {
  const svg = el.querySelector("svg");
  if (!svg) return;
  svg.style.width = "auto";
  svg.style.maxWidth = "100%";
  svg.style.height = "auto";
}
var plugin = {
  async onPrepare({ assets }) {
    mermaid = await assets.loadLibrary("vendor/mermaid.js");
  },
  render: draw,
  onThemeChange: draw
};
var main_default = plugin;
export {
  main_default as default
};
