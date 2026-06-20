// src/mermaid/main.ts
var mermaid;
var counter = 0;
var fallbackPalettes = {
  light: {
    nodeBackground: "#f4f4f6",
    inlineBackground: "#f0f0f3",
    stripe: "#f7f7f9",
    text: "#1c1c1e",
    muted: "#6c6c70",
    link: "#007aff",
    accent: "#007aff",
    border: "#d0d0d4",
    fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", sans-serif'
  },
  dark: {
    nodeBackground: "#1c1c1e",
    inlineBackground: "#2c2c2e",
    stripe: "#1c1c1e",
    text: "#e7e7e8",
    muted: "#9c9ca1",
    link: "#0a84ff",
    accent: "#0a84ff",
    border: "#3a3a3c",
    fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", sans-serif'
  }
};
async function draw({ el, token }, { theme }) {
  const palette = hostPalette(el, theme.colorScheme);
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    darkMode: theme.colorScheme === "dark",
    themeVariables: mermaidThemeVariables(palette)
  });
  const { svg } = await mermaid.render(`mmd-${counter++}`, token.source);
  el.innerHTML = svg;
  constrainSVG(el);
}
function constrainSVG(el) {
  const svg = el.querySelector("svg");
  if (!svg) return;
  svg.style.width = "auto";
  svg.style.maxWidth = "100%";
  svg.style.height = "auto";
}
function hostPalette(el, scheme) {
  const fallback = fallbackPalettes[scheme];
  return {
    nodeBackground: cssVariable(el, "nb-theme-code-bg", fallback.nodeBackground),
    inlineBackground: cssVariable(el, "nb-theme-inline-code-bg", fallback.inlineBackground),
    stripe: cssVariable(el, "nb-theme-table-stripe", fallback.stripe),
    text: cssVariable(el, "nb-theme-fg", fallback.text),
    muted: cssVariable(el, "nb-theme-secondary-fg", fallback.muted),
    link: cssVariable(el, "nb-theme-link", fallback.link),
    accent: cssVariable(el, "nb-theme-accent", fallback.accent),
    border: cssVariable(el, "nb-theme-table-border", fallback.border),
    fontFamily: cssVariable(el, "nb-theme-body-font-family", fallback.fontFamily)
  };
}
function cssVariable(el, name, fallback) {
  const view = el.ownerDocument.defaultView;
  const value = view?.getComputedStyle(el.ownerDocument.documentElement).getPropertyValue(`--${name}`).trim();
  return value && value !== "transparent" ? value : fallback;
}
function mermaidThemeVariables(palette) {
  return {
    background: palette.nodeBackground,
    primaryColor: palette.nodeBackground,
    primaryTextColor: palette.text,
    primaryBorderColor: palette.accent,
    secondaryColor: palette.stripe,
    secondaryTextColor: palette.text,
    secondaryBorderColor: palette.border,
    tertiaryColor: palette.inlineBackground,
    tertiaryTextColor: palette.text,
    tertiaryBorderColor: palette.border,
    lineColor: palette.muted,
    arrowheadColor: palette.muted,
    textColor: palette.text,
    mainBkg: palette.nodeBackground,
    nodeBkg: palette.nodeBackground,
    nodeBorder: palette.accent,
    clusterBkg: palette.stripe,
    clusterBorder: palette.border,
    defaultLinkColor: palette.link,
    titleColor: palette.text,
    edgeLabelBackground: palette.nodeBackground,
    noteBkgColor: palette.inlineBackground,
    noteTextColor: palette.text,
    noteBorderColor: palette.accent,
    actorBkg: palette.nodeBackground,
    actorBorder: palette.accent,
    actorTextColor: palette.text,
    actorLineColor: palette.muted,
    signalColor: palette.muted,
    signalTextColor: palette.text,
    fontFamily: palette.fontFamily
  };
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
