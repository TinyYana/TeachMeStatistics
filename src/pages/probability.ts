import { fixedSequenceProbability } from "../lib/binomial";
import { diagnostics } from "../content/diagnostics";
import { examDrills, practiceSets } from "../content/practice";
import {
  complementProbability,
  diceEventResults,
  independentJointProbability,
  summarizeConditionalIndependence,
  summarizeProbabilityDistribution,
  type DiceEvent
} from "../lib/probability";
import { formatNumber, formatPercent, parseNumberList } from "../lib/format";
import { renderExamDrills, renderPracticeSet, setupLayout } from "../main";

setupLayout();

const diceSelect = document.querySelector<HTMLSelectElement>("[data-dice-event]");
const diceOutput = document.querySelector<HTMLElement>("[data-dice-output]");
const complementInput = document.querySelector<HTMLInputElement>("[data-complement-input]");
const complementOutput = document.querySelector<HTMLElement>("[data-complement-output]");
const independentA = document.querySelector<HTMLInputElement>("[data-independent-a]");
const independentB = document.querySelector<HTMLInputElement>("[data-independent-b]");
const independentOutput = document.querySelector<HTMLElement>("[data-independent-output]");
const sequenceP = document.querySelector<HTMLInputElement>("[data-sequence-p]");
const sequenceText = document.querySelector<HTMLInputElement>("[data-sequence-text]");
const sequenceOutput = document.querySelector<HTMLElement>("[data-sequence-output]");
const eventProbabilityInput = document.querySelector<HTMLInputElement>("[data-event-probability]");
const conditionProbabilityInput = document.querySelector<HTMLInputElement>(
  "[data-condition-probability]"
);
const intersectionProbabilityInput = document.querySelector<HTMLInputElement>(
  "[data-intersection-probability]"
);
const conditionalOutput = document.querySelector<HTMLElement>("[data-conditional-output]");
const distributionValuesInput =
  document.querySelector<HTMLInputElement>("[data-distribution-values]");
const distributionProbabilitiesInput = document.querySelector<HTMLInputElement>(
  "[data-distribution-probabilities]"
);
const distributionOutput = document.querySelector<HTMLElement>("[data-distribution-output]");
const practice = document.querySelector<HTMLElement>("[data-practice]");
const examContainer = document.querySelector<HTMLElement>("[data-exam-drills]");

function renderDice(): void {
  if (!diceSelect || !diceOutput) {
    return;
  }
  const results = diceEventResults(diceSelect.value as DiceEvent);
  diceOutput.innerHTML = `
    <div class="dice-row">
      ${[1, 2, 3, 4, 5, 6]
        .map((value) => `<span class="die ${results.includes(value) ? "active" : ""}">${value}</span>`)
        .join("")}
    </div>
    <p>符合事件的結果有 ${results.length} 個，全部可能結果有 6 個，所以機率是 ${results.length}/6 = ${formatPercent(results.length / 6, 2)}。</p>
  `;
}

function renderComplement(): void {
  if (!complementInput || !complementOutput) {
    return;
  }
  const probability = Number(complementInput.value);
  try {
    const complement = complementProbability(probability);
    complementOutput.innerHTML = `<p>補事件 = 1 - ${formatNumber(probability, 3)} = <strong>${formatNumber(complement, 3)}</strong>，也就是 ${formatPercent(complement)}。</p>`;
  } catch (error) {
    complementOutput.innerHTML = `<p class="error">${(error as Error).message}</p>`;
  }
}

function renderIndependent(): void {
  if (!independentA || !independentB || !independentOutput) {
    return;
  }
  const first = Number(independentA.value);
  const second = Number(independentB.value);
  try {
    const result = independentJointProbability(first, second);
    independentOutput.innerHTML = `<p>獨立事件同時發生 = ${formatNumber(first, 3)} x ${formatNumber(second, 3)} = <strong>${formatNumber(result, 4)}</strong>，也就是 ${formatPercent(result)}。</p>`;
  } catch (error) {
    independentOutput.innerHTML = `<p class="error">${(error as Error).message}</p>`;
  }
}

function renderSequence(): void {
  if (!sequenceP || !sequenceText || !sequenceOutput) {
    return;
  }
  const p = Number(sequenceP.value);
  const cleaned = sequenceText.value.toUpperCase().replace(/[^SF]/g, "");
  const successes = [...cleaned].filter((char) => char === "S").length;
  try {
    const result = fixedSequenceProbability(p, successes, cleaned.length);
    sequenceOutput.innerHTML = `<p>固定順序中有 ${successes} 次成功、${cleaned.length - successes} 次失敗，所以機率是 ${formatNumber(p, 3)}^${successes} x ${formatNumber(1 - p, 3)}^${cleaned.length - successes} = <strong>${formatNumber(result, 6)}</strong>，也就是 ${formatPercent(result)}。</p>`;
  } catch (error) {
    sequenceOutput.innerHTML = `<p class="error">${(error as Error).message}</p>`;
  }
}

function renderConditional(): void {
  if (
    !eventProbabilityInput ||
    !conditionProbabilityInput ||
    !intersectionProbabilityInput ||
    !conditionalOutput
  ) {
    return;
  }
  const eventProbability = Number(eventProbabilityInput.value);
  const conditionProbability = Number(conditionProbabilityInput.value);
  const intersectionProbability = Number(intersectionProbabilityInput.value);
  try {
    const result = summarizeConditionalIndependence(
      eventProbability,
      conditionProbability,
      intersectionProbability
    );
    const independenceText = result.isIndependent
      ? "A 且 B 剛好等於 P(A) × P(B)，這組數字可當成獨立事件。"
      : "A 且 B 不等於 P(A) × P(B)，知道 B 發生後，A 的機率有被改變。";
    conditionalOutput.innerHTML = `
      <div class="metric-grid">
        <div class="metric"><span>P(A|B)</span><strong>${formatNumber(result.conditionalProbability, 4)}</strong></div>
        <div class="metric"><span>若獨立，P(A)P(B)</span><strong>${formatNumber(result.expectedIntersectionIfIndependent, 4)}</strong></div>
        <div class="metric"><span>實際 P(A 且 B)</span><strong>${formatNumber(intersectionProbability, 4)}</strong></div>
      </div>
      <div class="step-stack">
        <div class="step-row"><span>1</span><p>P(A|B) = P(A 且 B) ÷ P(B) = ${formatNumber(intersectionProbability, 4)} ÷ ${formatNumber(conditionProbability, 4)} = ${formatNumber(result.conditionalProbability, 4)}。</p></div>
        <div class="step-row"><span>2</span><p>拿 P(A|B) 和 P(A) 比：${formatNumber(result.conditionalProbability, 4)} ${result.isIndependent ? "=" : "≠"} ${formatNumber(eventProbability, 4)}。</p></div>
        <div class="step-row"><span>3</span><p>${independenceText}</p></div>
      </div>
    `;
  } catch (error) {
    conditionalOutput.innerHTML = `<p class="error">${(error as Error).message}</p>`;
  }
}

function renderDistribution(): void {
  if (!distributionValuesInput || !distributionProbabilitiesInput || !distributionOutput) {
    return;
  }
  const values = parseNumberList(distributionValuesInput.value);
  const probabilities = parseNumberList(distributionProbabilitiesInput.value);
  try {
    const result = summarizeProbabilityDistribution(values, probabilities);
    distributionOutput.innerHTML = `
      <div class="metric-grid">
        <div class="metric"><span>ΣP(X)</span><strong>${formatNumber(result.probabilitySum, 4)}</strong></div>
        <div class="metric"><span>E(X)</span><strong>${formatNumber(result.expectedValue, 4)}</strong></div>
        <div class="metric"><span>E(X²)</span><strong>${formatNumber(result.expectedSquaredValue, 4)}</strong></div>
        <div class="metric"><span>Var(X)</span><strong>${formatNumber(result.variance, 4)}</strong></div>
        <div class="metric"><span>標準差</span><strong>${formatNumber(result.standardDeviation, 4)}</strong></div>
      </div>
      <table>
        <thead><tr><th>X</th><th>P(X)</th><th>X × P(X)</th><th>X² × P(X)</th></tr></thead>
        <tbody>
          ${result.rows
            .map(
              (row) => `
                <tr>
                  <td>${formatNumber(row.value, 4)}</td>
                  <td>${formatNumber(row.probability, 4)}</td>
                  <td>${formatNumber(row.weightedValue, 4)}</td>
                  <td>${formatNumber(row.weightedSquaredValue, 4)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
      <p>Var(X) = E(X²) − [E(X)]² = ${formatNumber(result.expectedSquaredValue, 4)} − ${formatNumber(result.expectedValue, 4)}² = ${formatNumber(result.variance, 4)}。</p>
    `;
  } catch (error) {
    distributionOutput.innerHTML = `<p class="error">${(error as Error).message}</p>`;
  }
}

diceSelect?.addEventListener("change", renderDice);
complementInput?.addEventListener("input", renderComplement);
independentA?.addEventListener("input", renderIndependent);
independentB?.addEventListener("input", renderIndependent);
sequenceP?.addEventListener("input", renderSequence);
sequenceText?.addEventListener("input", renderSequence);
eventProbabilityInput?.addEventListener("input", renderConditional);
conditionProbabilityInput?.addEventListener("input", renderConditional);
intersectionProbabilityInput?.addEventListener("input", renderConditional);
distributionValuesInput?.addEventListener("input", renderDistribution);
distributionProbabilitiesInput?.addEventListener("input", renderDistribution);
renderDice();
renderComplement();
renderIndependent();
renderSequence();
renderConditional();
renderDistribution();

if (practice) {
  renderPracticeSet(practice, practiceSets.probability, diagnostics);
}

if (examContainer) {
  renderExamDrills(examContainer, examDrills.probability);
}
