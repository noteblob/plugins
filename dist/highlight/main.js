// src/highlight/main.ts
var prism;
function escapeHtml(s) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}
var plugin = {
  async onPrepare({ assets }) {
    prism = await assets.loadLibrary("vendor/prism.js");
    assets.loadStyle("vendor/prism.css");
  },
  render({ el, token }) {
    const grammar = prism.languages[token.lang];
    const code = grammar ? prism.highlight(token.source, grammar, token.lang) : escapeHtml(token.source);
    el.innerHTML = `<pre class="language-${token.lang}"><code>${code}</code></pre>`;
  }
};
var main_default = plugin;
export {
  main_default as default
};
