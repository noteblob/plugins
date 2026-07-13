// src/chart/main.ts
var Chart;
function tickColor(scheme) {
  return scheme === "dark" ? "#ddd" : "#222";
}
var plugin = {
  async onPrepare({ assets }) {
    Chart = await assets.loadLibrary("vendor/chart.js");
  },
  render({ el, token }, { theme }) {
    const config = JSON.parse(token.source);
    config.options = {
      responsive: true,
      maintainAspectRatio: false,
      ...config.options,
      color: tickColor(theme.colorScheme)
    };
    const canvas = el.ownerDocument.createElement("canvas");
    el.replaceChildren(canvas);
    const chart = new Chart(canvas, config);
    return () => chart.destroy();
  },
  onThemeChange({ el }, { theme }) {
    const canvas = el.querySelector("canvas");
    const chart = canvas ? Chart.getChart(canvas) : void 0;
    if (!chart) return;
    chart.options.color = tickColor(theme.colorScheme);
    chart.update();
  }
};
var main_default = plugin;
export {
  main_default as default
};
