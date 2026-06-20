import type { NotePreviewNodePlugin } from "@noteblob/plugin-sdk";

// Syntax highlighting via Prism — a *synchronous* render. No async, no cleanup.

interface Prism {
  languages: Record<string, unknown>;
  highlight(text: string, grammar: unknown, language: string): string;
}

let prism: Prism;

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
}

const languageAliases: Record<string, string> = {
  html: "markup",
  js: "javascript",
  shell: "bash",
  sh: "bash",
  ts: "typescript",
  xml: "markup",
};

function prismLanguage(raw: string): string {
  const language = raw.trim().toLowerCase();
  return languageAliases[language] ?? language;
}

function cssLanguageClass(language: string): string {
  return `language-${language.replace(/[^a-z0-9_-]/gi, "-")}`;
}

const plugin: NotePreviewNodePlugin = {
  async onPrepare({ assets }) {
    prism = await assets.loadLibrary<Prism>("vendor/prism.js");
    assets.loadStyle("vendor/prism.css");
  },

  render({ el, token }) {
    const language = prismLanguage(token.lang);
    const languageClass = cssLanguageClass(language);
    const grammar = prism.languages[language];
    const code = grammar
      ? prism.highlight(token.source, grammar, language)
      : escapeHtml(token.source);
    el.innerHTML = `<pre class="${languageClass}"><code class="${languageClass}">${code}</code></pre>`;
  },
};

export default plugin;
