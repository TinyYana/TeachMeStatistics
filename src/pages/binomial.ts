import { diagnostics } from "../content/diagnostics";
import { examDrills, practiceSets } from "../content/practice";
import { fixedSequenceProbability, getBinomialBreakdown } from "../lib/binomial";
import { renderBarChart } from "../lib/charts";
import { formatNumber, formatPercent } from "../lib/format";
import { renderExamDrills, renderPracticeSet, setupLayout } from "../main";

setupLayout();

const nInput = document.querySelector<HTMLInputElement>("[data-binomial-n]");
const pInput = document.querySelector<HTMLInputElement>("[data-binomial-p]");
const kInput = document.querySelector<HTMLInputElement>("[data-binomial-k]");
const output = document.querySelector<HTMLElement>("[data-binomial-output]");
const chart = document.querySelector<HTMLElement>("[data-binomial-chart]");
const shotGrid = document.querySelector<HTMLElement>("[data-shot-grid]");
const shotOutput = document.querySelector<HTMLElement>("[data-shot-output]");
const practice = document.querySelector<HTMLElement>("[data-practice]");
const examContainer = document.querySelector<HTMLElement>("[data-exam-drills]");
let selectedShots = new Set<number>([1, 2]);

function render(): void {
  if (!nInput || !pInput || !kInput || !output || !chart) {
    return;
  }
  const n = Number(nInput.value);
  const p = Number(pInput.value);
  const k = Number(kInput.value);

  try {
    const result = getBinomialBreakdown(n, p, k);
    const fixedProbability = fixedSequenceProbability(p, k, n);
    output.innerHTML = `
      <div class="metric-grid">
        <div class="metric"><span>n 總次數</span><strong>${result.n} 次</strong></div>
        <div class="metric"><span>p 成功機率</span><strong>${formatNumber(result.p, 4)}</strong></div>
        <div class="metric"><span>k 成功次數</span><strong>${result.k} 次成功</strong></div>
        <div class="metric"><span>1 − p 失敗機率</span><strong>${formatNumber(result.q, 4)}</strong></div>
        <div class="metric"><span>固定順序機率</span><strong>${formatNumber(fixedProbability, 8)}</strong></div>
        <div class="metric"><span>C(n, k) 位置數</span><strong>${result.combinations}</strong></div>
        <div class="metric"><span>小數答案</span><strong>${formatNumber(result.probability, 8)}</strong></div>
        <div class="metric"><span>百分比答案</span><strong>${formatPercent(result.probability, 2)}</strong></div>
      </div>
      <div class="step-stack">
        <div class="step-row"><span>1</span><p>固定順序機率 = p<sup>k</sup> × (1−p)<sup>n−k</sup> = ${formatNumber(p, 3)}<sup>${k}</sup> × ${formatNumber(result.q, 3)}<sup>${n - k}</sup> = ${formatNumber(fixedProbability, 8)}</p></div>
        <div class="step-row"><span>2</span><p>成功位置有 C(${n}, ${k}) = ${result.combinations} 種。</p></div>
        <div class="step-row"><span>3</span><p>為什麼要乘 C(n, k)：固定順序只算一種排法，但題目沒有指定第幾次成功，所以要把所有成功位置都算進來。</p></div>
        <div class="step-row"><span>4</span><p>完整機率 = ${result.combinations} × ${formatNumber(result.successPart, 6)} × ${formatNumber(result.failurePart, 6)} = ${formatNumber(result.probability, 8)}</p></div>
      </div>
      <div class="formula">
        <code>P(X = ${k}) = C(${n}, ${k}) × ${formatNumber(p, 3)}<sup>${k}</sup> × ${formatNumber(result.q, 3)}<sup>${n - k}</sup></code>
        <span>白話：成功位置數 × 成功 k 次的機率 × 失敗 ${n - k} 次的機率。</span>
      </div>
    `;
    chart.innerHTML = renderBarChart(
      result.distribution.map((item) => ({ label: item.x, value: item.probability })),
      k
    );
    renderShots(n, p);
  } catch (error) {
    output.innerHTML = `<p class="error">${(error as Error).message}</p>`;
    chart.innerHTML = "";
  }
}

function renderShots(n: number, p: number): void {
  if (!shotGrid || !shotOutput) {
    return;
  }
  selectedShots = new Set([...selectedShots].filter((value) => value <= n));
  shotGrid.innerHTML = Array.from({ length: n }, (_, index) => {
    const shot = index + 1;
    const active = selectedShots.has(shot);
    return `<button class="shot ${active ? "active" : ""}" type="button" data-shot="${shot}" aria-pressed="${active}">${active ? "成功" : "失敗"}</button>`;
  }).join("");
  const successes = selectedShots.size;
  const probability = fixedSequenceProbability(p, successes, n);
  shotOutput.innerHTML = `<p>你目前指定 ${successes} 次成功、${n - successes} 次失敗。這是固定順序機率：${formatNumber(p, 3)}<sup>${successes}</sup> × ${formatNumber(1 - p, 3)}<sup>${n - successes}</sup> = <strong>${formatNumber(probability, 8)}</strong>，也就是 ${formatPercent(probability, 2)}。</p>`;
}

nInput?.addEventListener("input", render);
pInput?.addEventListener("input", render);
kInput?.addEventListener("input", render);
shotGrid?.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-shot]");
  if (!button || !nInput || !pInput) {
    return;
  }
  const shot = Number(button.dataset.shot);
  if (selectedShots.has(shot)) {
    selectedShots.delete(shot);
  } else {
    selectedShots.add(shot);
  }
  renderShots(Number(nInput.value), Number(pInput.value));
});
render();

if (practice) {
  renderPracticeSet(practice, practiceSets.binomial, diagnostics);
}

if (examContainer) {
  renderExamDrills(examContainer, examDrills.binomial);
}
