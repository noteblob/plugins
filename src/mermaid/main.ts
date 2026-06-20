import type {
  NotePreviewNodePlugin,
  PreviewNode,
  PreviewContext,
  ColorScheme,
} from "@noteblob/plugin-sdk";

// Minimal type for the bits of mermaid we use — passed to loadLibrary<T>.
interface Mermaid {
  initialize(config: {
    startOnLoad: boolean;
    securityLevel: string;
    theme: string;
  }): void;
  run(options: { nodes: ArrayLike<HTMLElement> }): Promise<void>;
}

let mermaid: Mermaid;

function themeName(scheme: ColorScheme): string {
  return scheme === "dark" ? "dark" : "default";
}

// SVG can't be restyled by CSS vars, so we re-render the diagram on theme change.
async function draw(
  { el, token }: PreviewNode,
  { theme }: PreviewContext,
): Promise<void> {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: themeName(theme.colorScheme),
  });
  el.classList.add("mermaid");
  el.removeAttribute("data-processed");
  el.textContent = token.source;
  await mermaid.run({ nodes: [el] });
  constrainSVG(el);
}

function constrainSVG(el: HTMLElement): void {
  const svg = el.querySelector("svg");
  if (!svg) return;

  svg.style.width = "auto";
  svg.style.maxWidth = "100%";
  svg.style.height = "auto";
}

const plugin: NotePreviewNodePlugin = {
  async onPrepare({ assets }) {
    mermaid = await assets.loadLibrary<Mermaid>("vendor/mermaid.js");
  },
  render: draw,
  onThemeChange: draw,
};

export default plugin;
