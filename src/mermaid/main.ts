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
  render(id: string, source: string): Promise<{ svg: string }>;
}

let mermaid: Mermaid;
let counter = 0;

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
  const { svg } = await mermaid.render(`mmd-${counter++}`, token.source);
  el.innerHTML = svg;
}

const plugin: NotePreviewNodePlugin = {
  async onPrepare({ assets }) {
    mermaid = await assets.loadLibrary<Mermaid>("vendor/mermaid.js");
  },
  render: draw,
  onThemeChange: draw,
};

export default plugin;
