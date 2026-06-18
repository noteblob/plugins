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

const plugin: NotePreviewNodePlugin = {
  async onPrepare({ assets }) {
    prism = await assets.loadLibrary<Prism>("vendor/prism.js");
    assets.loadStyle("vendor/prism.css");
  },

  render({ el, token }) {
    const grammar = prism.languages[token.lang];
    const code = grammar
      ? prism.highlight(token.source, grammar, token.lang)
      : escapeHtml(token.source);
    el.innerHTML = `<pre class="language-${token.lang}"><code>${code}</code></pre>`;
  },
};

export default plugin;
