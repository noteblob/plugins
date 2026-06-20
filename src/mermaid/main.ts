import type {
  ColorScheme,
  NotePreviewNodePlugin,
  PreviewContext,
  PreviewNode,
} from "@noteblob/plugin-sdk";

// Minimal type for the bits of mermaid we use — passed to loadLibrary<T>.
interface MermaidConfig {
  startOnLoad: boolean;
  securityLevel: string;
  theme: string;
  fontFamily?: string;
  flowchart?: {
    useMaxWidth: boolean;
  };
}

interface Mermaid {
  initialize(config: MermaidConfig): void;
  run(options: { nodes: ArrayLike<HTMLElement> }): Promise<void>;
}

const fallbackFontFamily =
  '-apple-system, BlinkMacSystemFont, "San Francisco", sans-serif';

let mermaid: Mermaid;

async function draw(
  { el, token }: PreviewNode,
  { theme }: PreviewContext,
): Promise<void> {
  mermaid.initialize(configFor(el, theme.colorScheme));
  el.classList.add("mermaid");
  el.removeAttribute("data-processed");
  el.textContent = token.source;
  await mermaid.run({ nodes: [el] });
  normalizeSVG(el);
}

function configFor(el: HTMLElement, colorScheme: ColorScheme): MermaidConfig {
  const fontFamily = getComputedStyle(el).fontFamily || fallbackFontFamily;
  return {
    startOnLoad: false,
    securityLevel: "strict",
    theme: colorScheme === "dark" ? "dark" : "default",
    fontFamily,
    flowchart: {
      useMaxWidth: false,
    },
  };
}

function normalizeSVG(el: HTMLElement): void {
  const svg = el.querySelector("svg");
  if (!svg) return;

  const naturalWidth = widthFromViewBox(svg.getAttribute("viewBox"));
  if (naturalWidth) {
    svg.style.width = `${Math.ceil(naturalWidth)}px`;
  }
  svg.style.maxWidth = "100%";
  svg.style.height = "auto";
}

function widthFromViewBox(viewBox: string | null): number | undefined {
  if (!viewBox) return undefined;

  const parts = viewBox.split(/[\s,]+/).map(Number);
  if (parts.length !== 4) return undefined;

  const width = parts[2];
  return Number.isFinite(width) && width > 0 ? width : undefined;
}

const plugin: NotePreviewNodePlugin = {
  async onPrepare({ assets }) {
    mermaid = await assets.loadLibrary<Mermaid>("vendor/mermaid.js");
  },
  render: draw,
  onThemeChange: draw,
};

export default plugin;
