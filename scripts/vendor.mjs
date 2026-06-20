import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = dirname(fileURLToPath(import.meta.url));
const packageRoot = dirname(root);

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function bundleVendor({ stdin, outfile }) {
  await ensureDir(dirname(join(packageRoot, outfile)));
  await build({
    stdin: {
      contents: stdin,
      loader: "js",
      resolveDir: packageRoot,
    },
    bundle: true,
    format: "esm",
    minify: true,
    platform: "browser",
    target: "es2020",
    outfile: join(packageRoot, outfile),
    logLevel: "silent",
  });
}

await bundleVendor({
  outfile: "dist/chart/vendor/chart.js",
  stdin: `
    import Chart from "chart.js/auto";
    export default Chart;
  `,
});

await bundleVendor({
  outfile: "dist/highlight/vendor/prism.js",
  stdin: `
    import Prism from "prismjs";
    import "prismjs/components/prism-markup.js";
    import "prismjs/components/prism-css.js";
    import "prismjs/components/prism-clike.js";
    import "prismjs/components/prism-javascript.js";
    import "prismjs/components/prism-typescript.js";
    import "prismjs/components/prism-python.js";
    import "prismjs/components/prism-json.js";
    import "prismjs/components/prism-bash.js";
    import "prismjs/components/prism-swift.js";
    export default Prism;
  `,
});
await copyFile(
  join(packageRoot, "node_modules/prismjs/themes/prism.css"),
  join(packageRoot, "dist/highlight/vendor/prism.css"),
);

await bundleVendor({
  outfile: "dist/mermaid/vendor/mermaid.js",
  stdin: `
    import mermaid from "mermaid";
    export default mermaid;
  `,
});

