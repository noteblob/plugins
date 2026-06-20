// src/mermaid/main.ts
var diagramBackground = "#ffffff";
var fallbackFontFamily = '-apple-system, BlinkMacSystemFont, "San Francisco", sans-serif';
var mermaid;
async function draw({ el, token }) {
  mermaid.initialize(configFor(el));
  el.classList.add("mermaid");
  el.removeAttribute("data-processed");
  el.textContent = token.source;
  await mermaid.run({ nodes: [el] });
  normalizeSVG(el);
}
function configFor(el) {
  const fontFamily = getComputedStyle(el).fontFamily || fallbackFontFamily;
  return {
    startOnLoad: false,
    securityLevel: "strict",
    theme: "default",
    fontFamily,
    flowchart: {
      useMaxWidth: false
    },
    themeVariables: {
      background: diagramBackground,
      fontFamily
    }
  };
}
function normalizeSVG(el) {
  const svg = el.querySelector("svg");
  if (!svg) return;
  const naturalWidth = widthFromViewBox(svg.getAttribute("viewBox"));
  if (naturalWidth) {
    svg.style.width = `${Math.ceil(naturalWidth)}px`;
  }
  svg.style.maxWidth = "100%";
  svg.style.height = "auto";
  svg.style.backgroundColor = diagramBackground;
}
function widthFromViewBox(viewBox) {
  if (!viewBox) return void 0;
  const parts = viewBox.split(/[\s,]+/).map(Number);
  if (parts.length !== 4) return void 0;
  const width = parts[2];
  return Number.isFinite(width) && width > 0 ? width : void 0;
}
var plugin = {
  async onPrepare({ assets }) {
    mermaid = await assets.loadLibrary("vendor/mermaid.js");
  },
  render: draw
};
var main_default = plugin;
export {
  main_default as default
};
