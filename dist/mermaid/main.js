// src/mermaid/main.ts
var mermaid;
async function draw({ el, token }) {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "default"
  });
  el.classList.add("mermaid");
  el.removeAttribute("data-processed");
  el.textContent = token.source;
  await mermaid.run({ nodes: [el] });
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
