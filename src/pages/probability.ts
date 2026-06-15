import { fixedSequenceProbability } from "../lib/binomial";
import {
  complementProbability,
  diceEventResults,
  independentJointProbability,
  type DiceEvent
} from "../lib/probability";
import { formatNumber, formatPercent } from "../lib/format";
import { setupLayout, renderQuiz, type QuizQuestion } from "../main";

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
const quiz = document.querySelector<HTMLElement>("[data-quiz]");

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

diceSelect?.addEventListener("change", renderDice);
complementInput?.addEventListener("input", renderComplement);
independentA?.addEventListener("input", renderIndependent);
independentB?.addEventListener("input", renderIndependent);
sequenceP?.addEventListener("input", renderSequence);
sequenceText?.addEventListener("input", renderSequence);
renderDice();
renderComplement();
renderIndependent();
renderSequence();

if (quiz) {
  const questions: QuizQuestion[] = [
    {
      prompt: "丟一顆公平骰子，出現偶數的機率是多少？",
      options: [
        { label: "3/6 = 0.5", correct: true, feedback: "對，偶數是 2、4、6，共 3 個結果。" },
        { label: "2/6", correct: false, feedback: "偶數不是只有 2，還有 4 和 6。" },
        { label: "1/6", correct: false, feedback: "1/6 是指定某一個點數的機率。" }
      ]
    },
    {
      prompt: "命中率是 0.3，沒命中的機率是多少？",
      options: [
        { label: "0.7", correct: true, feedback: "對，補事件是 1 - 0.3 = 0.7。" },
        { label: "0.3", correct: false, feedback: "0.3 是命中，不是沒命中。" },
        { label: "1.3", correct: false, feedback: "機率不會超過 1。" }
      ]
    },
    {
      prompt: "兩次獨立投籃都命中，命中率都是 0.3，起手式是什麼？",
      options: [
        { label: "0.3 x 0.3", correct: true, feedback: "對，獨立事件同時發生用乘法。" },
        { label: "0.3 + 0.3", correct: false, feedback: "同時發生不是直接相加。" },
        { label: "1 - 0.3", correct: false, feedback: "這是在算補事件，不是兩次都命中。" }
      ]
    }
  ];
  renderQuiz(quiz, questions);
}
