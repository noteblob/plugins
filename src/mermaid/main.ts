import type { NotePreviewNodePlugin, PreviewNode } from "@noteblob/plugin-sdk";

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

async function draw({ el, token }: PreviewNode): Promise<void> {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "default",
  });
  el.classList.add("mermaid");
  el.removeAttribute("data-processed");
  el.textContent = token.source;
  await mermaid.run({ nodes: [el] });
}

const plugin: NotePreviewNodePlugin = {
  async onPrepare({ assets }) {
    mermaid = await assets.loadLibrary<Mermaid>("vendor/mermaid.js");
  },
  render: draw,
};

export default plugin;
