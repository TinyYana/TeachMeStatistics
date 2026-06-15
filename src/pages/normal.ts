import { diagnostics } from "../content/diagnostics";
import { examDrills, practiceSets } from "../content/practice";
import { renderNormalCurve } from "../lib/charts";
import { formatNumber, formatPercent } from "../lib/format";
import { normalArea, standardNormalCdf, zScore, type NormalAreaMode } from "../lib/normal";
import { renderExamDrills, renderPracticeSet, setupLayout } from "../main";

setupLayout();

const meanInput = document.querySelector<HTMLInputElement>("[data-normal-mean]");
const sdInput = document.querySelector<HTMLInputElement>("[data-normal-sd]");
const xInput = document.querySelector<HTMLInputElement>("[data-normal-x]");
const upperInput = document.querySelector<HTMLInputElement>("[data-normal-upper]");
const modeSelect = document.querySelector<HTMLSelectElement>("[data-normal-mode]");
const output = document.querySelector<HTMLElement>("[data-normal-output]");
const chart = document.querySelector<HTMLElement>("[data-normal-chart]");
const practice = document.querySelector<HTMLElement>("[data-practice]");
const examContainer = document.querySelector<HTMLElement>("[data-exam-drills]");

function render(): void {
  if (!meanInput || !sdInput || !xInput || !upperInput || !modeSelect || !output || !chart) {
    return;
  }
  const mean = Number(meanInput.value);
  const sd = Number(sdInput.value);
  const x = Number(xInput.value);
  const upper = Number(upperInput.value);
  const mode = modeSelect.value as NormalAreaMode;

  try {
    const z = zScore(x, mean, sd);
    const firstCdf = standardNormalCdf(z);
    const area = normalArea(mode, mean, sd, x, upper);
    const lowerX = Math.min(x, upper);
    const upperX = Math.max(x, upper);
    const lowerZ = zScore(lowerX, mean, sd);
    const upperZ = zScore(upperX, mean, sd);
    const lowerCdf = standardNormalCdf(lowerZ);
    const upperCdf = standardNormalCdf(upperZ);
    const direction = z > 0 ? "比平均數高" : z < 0 ? "比平均數低" : "剛好在平均數";
    const areaText = getAreaText(mode, firstCdf, lowerCdf, upperCdf);
    const lowerShade = mode === "less" ? mean - 4 * sd : mode === "greater" ? x : lowerX;
    const upperShade = mode === "less" ? x : mode === "greater" ? mean + 4 * sd : upperX;

    output.innerHTML = `
      <div class="metric-grid">
        <div class="metric"><span>原始 X</span><strong>${formatNumber(x, 2)}</strong></div>
        <div class="metric"><span>平均數 μ</span><strong>${formatNumber(mean, 2)}</strong></div>
        <div class="metric"><span>標準差 σ</span><strong>${formatNumber(sd, 2)}</strong></div>
        <div class="metric"><span>Z 分數</span><strong>${formatNumber(z, 4)}</strong></div>
        <div class="metric"><span>查表結果 P(Z&lt;z)</span><strong>${formatNumber(firstCdf, 4)}</strong></div>
        <div class="metric"><span>面積</span><strong>${formatPercent(area, 2)}</strong></div>
      </div>
      <div class="step-stack">
        <div class="step-row"><span>1</span><p>Z = (X − μ) ÷ σ = (${formatNumber(x, 2)} − ${formatNumber(mean, 2)}) ÷ ${formatNumber(sd, 2)} = ${formatNumber(z, 4)}</p></div>
        <div class="step-row"><span>2</span><p>Z 的白話意思：${direction} ${formatNumber(Math.abs(z), 2)} 個標準差。</p></div>
        <div class="step-row"><span>3</span><p>查表或用近似計算得到左側累積機率 P(Z &lt; ${formatNumber(z, 2)}) = ${formatNumber(firstCdf, 4)}。</p></div>
        <div class="step-row"><span>4</span><p>${areaText}</p></div>
        <div class="step-row"><span>5</span><p>圖形陰影已標出題目問的面積。</p></div>
      </div>
    `;
    chart.innerHTML = renderNormalCurve(mean, sd, lowerShade, upperShade, x);
  } catch (error) {
    output.innerHTML = `<p class="error">${(error as Error).message}</p>`;
    chart.innerHTML = "";
  }
}

function getAreaText(
  mode: NormalAreaMode,
  firstCdf: number,
  lowerCdf: number,
  upperCdf: number
): string {
  if (mode === "less") {
    return `小於 X：直接用左側累積機率 ${formatNumber(firstCdf, 4)}。`;
  }
  if (mode === "greater") {
    return `大於 X：用 1 − 左側累積機率 = 1 − ${formatNumber(firstCdf, 4)} = ${formatNumber(1 - firstCdf, 4)}。`;
  }
  return `介於兩數：用右邊累積機率減左邊累積機率 = ${formatNumber(upperCdf, 4)} − ${formatNumber(lowerCdf, 4)} = ${formatNumber(upperCdf - lowerCdf, 4)}。`;
}

meanInput?.addEventListener("input", render);
sdInput?.addEventListener("input", render);
xInput?.addEventListener("input", render);
upperInput?.addEventListener("input", render);
modeSelect?.addEventListener("change", render);
render();

if (practice) {
  renderPracticeSet(practice, practiceSets.normal, diagnostics);
}

if (examContainer) {
  renderExamDrills(examContainer, examDrills.normal);
}
