// src/highlight/main.ts
var prism;
function escapeHtml(s) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}
var languageAliases = {
  html: "markup",
  js: "javascript",
  shell: "bash",
  sh: "bash",
  ts: "typescript",
  xml: "markup"
};
function prismLanguage(raw) {
  const language = raw.trim().toLowerCase();
  return languageAliases[language] ?? language;
}
function cssLanguageClass(language) {
  return `language-${language.replace(/[^a-z0-9_-]/gi, "-")}`;
}
var plugin = {
  async onPrepare({ assets }) {
    prism = await assets.loadLibrary("vendor/prism.js");
    assets.loadStyle("vendor/prism.css");
  },
  render({ el, token }) {
    const language = prismLanguage(token.lang);
    const languageClass = cssLanguageClass(language);
    const grammar = prism.languages[language];
    const code = grammar ? prism.highlight(token.source, grammar, language) : escapeHtml(token.source);
    el.innerHTML = `<pre class="${languageClass}"><code class="${languageClass}">${code}</code></pre>`;
  }
};
var main_default = plugin;
export {
  main_default as default
};
