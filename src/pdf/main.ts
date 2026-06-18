import type { FilePreviewDocumentPlugin } from "@noteblob/plugin-sdk";

// A file-preview for `.pdf` (replacing Quick Look). `render` draws every page
// into the host-owned root; the Cleanup disposes the loaded document.

interface PdfViewport {
  width: number;
  height: number;
}
interface PdfPage {
  getViewport(opts: { scale: number }): PdfViewport;
  render(opts: {
    canvasContext: CanvasRenderingContext2D | null;
    viewport: PdfViewport;
  }): { promise: Promise<void> };
}
interface PdfDocument {
  numPages: number;
  getPage(n: number): Promise<PdfPage>;
  destroy?(): void;
}
interface PdfjsLib {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument(opts: { data: Uint8Array }): { promise: Promise<PdfDocument> };
}

let pdfjs: PdfjsLib;

const plugin: FilePreviewDocumentPlugin = {
  async onPrepare({ assets }) {
    pdfjs = await assets.loadLibrary<PdfjsLib>("vendor/pdf.js");
    pdfjs.GlobalWorkerOptions.workerSrc = assets.assetURL(
      "vendor/pdf.worker.mjs",
    );
  },

  async render({ root, file }) {
    const data = await file.bytes();
    const doc = await pdfjs.getDocument({ data }).promise;
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = root.ownerDocument.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      root.appendChild(canvas);
      await page.render({ canvasContext: canvas.getContext("2d"), viewport })
        .promise;
    }
    return () => doc.destroy?.();
  },
};

export default plugin;
