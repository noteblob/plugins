// src/pdf/main.ts
var pdfjs;
var plugin = {
  async onPrepare({ assets }) {
    pdfjs = await assets.loadLibrary("vendor/pdf.js");
    pdfjs.GlobalWorkerOptions.workerSrc = assets.assetURL(
      "vendor/pdf.worker.mjs"
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
      await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    }
    return () => doc.destroy?.();
  }
};
var main_default = plugin;
export {
  main_default as default
};
