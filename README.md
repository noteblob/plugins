# NoteBlob Official Plugins

The official plugin package for NoteBlob, providing commonly used features and themes.

## Plugins

- Chats: Render `chart` code blocks using [Chart.js](https://www.chartjs.org).
- Syntax highlighting: Render fenced code blocks using [prismjs](https://prismjs.com).
- Mermaid: Render [mermaid](https://mermaid.ai) code blocks.
- Themes: Enjoy additional application themes.

## Contributing

This folder has its own npm install and depends on the published
`@noteblob/plugin-sdk` package, so the plugins type-check against the same SDK
surface external plugin authors use.

```sh
fnm exec --using .node-version npm install
fnm exec --using .node-version npm test
```

Edit `noteblob-package.json` directly. The SDK validator checks it against the
SDK-provided schema.

Source files live under `src/`:

- `src/chart/main.ts`
- `src/highlight/main.ts`
- `src/mermaid/main.ts`

Theme templates live under `themes/` and are referenced directly by the
manifest because theme plugins are JSON-only:

- `themes/notebook.json`

`npm run build` regenerates `dist/`, which is the installable package payload
referenced by `noteblob-package.json`:

- `dist/chart/main.js`
- `dist/chart/vendor/chart.js`
- `dist/highlight/main.js`
- `dist/highlight/vendor/prism.css`
- `dist/highlight/vendor/prism.js`
- `dist/mermaid/main.js`
- `dist/mermaid/vendor/mermaid.js`

The root `noteblob-package.json` describes all official plugins as one
installable NoteBlob package.
