import { diagnostics } from "../content/diagnostics";
import { examDrills, practiceSets } from "../content/practice";
import { renderBarChart, renderDotPlot } from "../lib/charts";
import { summarize, frequencyTable, type VarianceMode } from "../lib/descriptive";
import { formatNumber, parseNumberList } from "../lib/format";
import { renderExamDrills, renderPracticeSet, setupLayout } from "../main";

setupLayout();

const input = document.querySelector<HTMLTextAreaElement>("[data-descriptive-input]");
const modeInputs = document.querySelectorAll<HTMLInputElement>("[name='variance-mode']");
const output = document.querySelector<HTMLElement>("[data-descriptive-output]");
const chart = document.querySelector<HTMLElement>("[data-descriptive-chart]");
const practice = document.querySelector<HTMLElement>("[data-practice]");
const examContainer = document.querySelector<HTMLElement>("[data-exam-drills]");

function render(): void {
  if (!input || !output || !chart) {
    return;
  }

  const values = parseNumberList(input.value);
  const mode = document.querySelector<HTMLInputElement>("[name='variance-mode']:checked")
    ?.value as VarianceMode | undefined;

  if (values.length === 0 || !mode) {
    output.innerHTML = `<p class="error">請輸入至少一個數字，例如 60, 70, 70, 80, 100。</p>`;
    chart.innerHTML = "";
    return;
  }

  try {
    const result = summarize(values, mode);
    const denominator = result.mode === "population" ? result.count : result.count - 1;
    const denominatorText = result.mode === "population" ? "N" : "n - 1";
    const modesText = result.modes.length === 0 ? "沒有眾數" : result.modes.join("、");

    output.innerHTML = `
      <div class="metric-grid">
        <div class="metric"><span>輸入資料</span><strong>${values.join("、")}</strong></div>
        <div class="metric"><span>平均數</span><strong>${formatNumber(result.mean, 2)}</strong></div>
        <div class="metric"><span>分母</span><strong>${denominatorText} = ${denominator}</strong></div>
        <div class="metric"><span>變異數</span><strong>${formatNumber(result.variance, 4)}</strong></div>
        <div class="metric"><span>標準差</span><strong>${formatNumber(result.standardDeviation, 4)}</strong></div>
        <div class="metric"><span>補充：中位數 / 眾數</span><strong>${formatNumber(result.median, 2)} / ${modesText}</strong></div>
      </div>
      <div class="step-stack">
        <div class="step-row"><span>1</span><p>每個數字減平均數：${result.deviationRows
          .map((row) => `${formatNumber(row.value, 2)} − ${formatNumber(result.mean, 2)} = ${formatNumber(row.deviation, 2)}`)
          .join("；")}</p></div>
        <div class="step-row"><span>2</span><p>離均差平方：${result.deviationRows
          .map((row) => formatNumber(row.squaredDeviation, 4))
          .join(" + ")}</p></div>
        <div class="step-row"><span>3</span><p>平方後加總 = ${formatNumber(result.squaredDeviationSum, 4)}</p></div>
        <div class="step-row"><span>4</span><p>${result.mode === "population" ? "母體資料除以 N" : "樣本資料除以 n − 1"}：${formatNumber(result.squaredDeviationSum, 4)} ÷ ${denominator} = ${formatNumber(result.variance, 4)}</p></div>
        <div class="step-row"><span>5</span><p>白話解讀：這組資料通常離平均數大約 ${formatNumber(result.standardDeviation, 2)} 個單位。</p></div>
      </div>
      <table>
        <thead><tr><th>資料值</th><th>減平均數</th><th>離均差平方</th></tr></thead>
        <tbody>
          ${result.deviationRows
            .map(
              (row) => `
                <tr>
                  <td>${formatNumber(row.value, 2)}</td>
                  <td>${formatNumber(row.deviation, 2)}</td>
                  <td>${formatNumber(row.squaredDeviation, 4)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;

    const frequencies = frequencyTable(values).map((item) => ({
      label: item.value,
      value: item.count / values.length
    }));
    chart.innerHTML = `
      <h3>資料點與平均數</h3>
      ${renderDotPlot(values, result.mean)}
      <h3>各數值出現比例</h3>
      ${renderBarChart(frequencies)}
    `;
  } catch (error) {
    output.innerHTML = `<p class="error">${(error as Error).message}</p>`;
    chart.innerHTML = "";
  }
}

input?.addEventListener("input", render);
modeInputs.forEach((item) => item.addEventListener("change", render));
render();

if (practice) {
  renderPracticeSet(practice, practiceSets.descriptive, diagnostics);
}

if (examContainer) {
  renderExamDrills(examContainer, examDrills.descriptive);
}
