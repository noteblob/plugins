// src/mermaid/main.ts
var mermaid;
var counter = 0;
function themeName(scheme) {
  return scheme === "dark" ? "dark" : "default";
}
async function draw({ el, token }, { theme }) {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: themeName(theme.colorScheme)
  });
  const { svg } = await mermaid.render(`mmd-${counter++}`, token.source);
  el.innerHTML = svg;
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
