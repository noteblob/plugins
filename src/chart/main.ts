import type { NotePreviewNodePlugin, ColorScheme } from "@noteblob/plugin-sdk";

// A ```chart fence holds a Chart.js config as JSON. `render` builds a live chart
// and returns a Cleanup that disposes it; `onThemeChange` recolors it in place.

interface ChartInstance {
  options: { color?: string };
  update(): void;
  destroy(): void;
}
interface ChartConstructor {
  new (canvas: HTMLCanvasElement, config: unknown): ChartInstance;
  getChart(canvas: HTMLCanvasElement): ChartInstance | undefined;
}

let Chart: ChartConstructor;

function tickColor(scheme: ColorScheme): string {
  return scheme === "dark" ? "#ddd" : "#222";
}

const plugin: NotePreviewNodePlugin = {
  async onPrepare({ assets }) {
    Chart = await assets.loadLibrary<ChartConstructor>("vendor/chart.js");
  },

  render({ el, token }, { theme }) {
    const config = JSON.parse(token.source);
    config.options = {
      responsive: true,
      maintainAspectRatio: false,
      ...config.options,
      color: tickColor(theme.colorScheme),
    };
    const canvas = el.ownerDocument.createElement("canvas");
    el.replaceChildren(canvas);
    const chart = new Chart(canvas, config);
    return () => chart.destroy();
  },

  onThemeChange({ el }, { theme }) {
    const canvas = el.querySelector("canvas");
    const chart = canvas ? Chart.getChart(canvas) : undefined;
    if (!chart) return;
    chart.options.color = tickColor(theme.colorScheme);
    chart.update();
  },
};

export default plugin;
