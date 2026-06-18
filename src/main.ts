import "./styles.css";
import type { ConceptGroup, ConceptNode } from "./content/concepts";
import type { Diagnostic } from "./content/diagnostics";
import type { ExamDrill, PracticeQuestion } from "./content/practice";
import {
  questionTypeGuides,
  questionTypeOptions,
  type QuestionType,
  type QuestionTypeItem
} from "./content/questionTypes";

const chapters = [
  { href: "/index.html", label: "首頁" },
  { href: "/chapters/descriptive.html", label: "描述統計" },
  { href: "/chapters/probability.html", label: "機率與函數" },
  { href: "/chapters/binomial.html", label: "二項分配" },
  { href: "/chapters/normal.html", label: "常態分配" }
];

export function setupLayout(currentPath = window.location.pathname): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]");
  navLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    if (normalizePath(currentPath) === normalizePath(linkPath)) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  const select = document.querySelector<HTMLSelectElement>("[data-mobile-nav]");
  if (select) {
    select.innerHTML = chapters
      .map((chapter) => {
        const selected = normalizePath(currentPath) === normalizePath(chapter.href) ? "selected" : "";
        return `<option value="${chapter.href}" ${selected}>${chapter.label}</option>`;
      })
      .join("");
    select.addEventListener("change", () => {
      window.location.href = select.value;
    });
  }
}

export function renderConceptMap(container: HTMLElement, groups: ConceptGroup[]): void {
  const firstConcept = groups[0]?.concepts[0];
  container.innerHTML = `
    <div class="concept-map">
      <div class="concept-columns">
        ${groups
          .map(
            (group) => `
              <section class="concept-group">
                <h3>${group.title}</h3>
                <div class="concept-list">
                  ${group.concepts
                    .map(
                      (concept) => `
                        <button class="concept-node" type="button" data-concept-id="${concept.id}">
                          ${concept.title}
                        </button>
                      `
                    )
                    .join("")}
                </div>
              </section>
            `
          )
          .join("")}
      </div>
      <aside class="concept-detail" data-concept-detail aria-live="polite"></aside>
    </div>
  `;

  const detail = container.querySelector<HTMLElement>("[data-concept-detail]");
  const renderDetail = (concept: ConceptNode): void => {
    if (!detail) {
      return;
    }
    detail.innerHTML = `
      <span class="section-label">概念說明</span>
      <h3>${concept.title}</h3>
      <dl class="detail-list">
        <div><dt>解決什麼問題</dt><dd>${concept.solves}</dd></div>
        <div><dt>需要哪些前置概念</dt><dd>${concept.prerequisites.join("、")}</dd></div>
        <div><dt>常出現的題型</dt><dd>${concept.questionTypes.join("、")}</dd></div>
        <div><dt>和下一章的關係</dt><dd>${concept.nextRelation}</dd></div>
      </dl>
    `;
  };

  if (firstConcept) {
    renderDetail(firstConcept);
    container
      .querySelector<HTMLButtonElement>(`[data-concept-id="${firstConcept.id}"]`)
      ?.classList.add("active");
  }

  container.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-concept-id]");
    if (!button) {
      return;
    }
    const concept = groups
      .flatMap((group) => group.concepts)
      .find((item) => item.id === button.dataset.conceptId);
    if (!concept) {
      return;
    }
    container.querySelectorAll(".concept-node").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderDetail(concept);
  });
}

export function renderQuestionTypeTrainer(
  container: HTMLElement,
  questions: QuestionTypeItem[]
): void {
  let currentIndex = 0;
  let streak = 0;

  const renderQuestion = (): void => {
    const question = questions[currentIndex];
    container.innerHTML = `
      <div class="trainer-card">
        <div class="trainer-topline">
          <span class="section-label">題型判斷器</span>
          <span class="muted">第 ${currentIndex + 1} / ${questions.length} 題</span>
        </div>
        <p class="question-text">${question.prompt}</p>
        <div class="type-options" role="group" aria-label="選擇題型">
          ${questionTypeOptions
            .map(
              (type) => `
                <button class="ghost" type="button" data-type-answer="${type}">
                  ${type}
                </button>
              `
            )
            .join("")}
        </div>
        <div class="feedback" data-type-feedback aria-live="polite"></div>
        <div class="trainer-actions">
          <button class="secondary" type="button" data-next-type>下一題</button>
          <span class="streak">連續答對：${streak}</span>
        </div>
      </div>
    `;
  };

  container.addEventListener("click", (event) => {
    const answerButton = (event.target as HTMLElement).closest<HTMLButtonElement>(
      "[data-type-answer]"
    );
    const nextButton = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-next-type]");

    if (nextButton) {
      currentIndex = (currentIndex + 1) % questions.length;
      renderQuestion();
      return;
    }

    if (!answerButton) {
      return;
    }

    const selected = answerButton.dataset.typeAnswer as QuestionType;
    const question = questions[currentIndex];
    const correct = selected === question.answer;
    streak = correct ? streak + 1 : 0;

    container
      .querySelectorAll<HTMLButtonElement>("[data-type-answer]")
      .forEach((button) => button.classList.remove("correct", "wrong"));
    answerButton.classList.add(correct ? "correct" : "wrong");

    const feedback = container.querySelector<HTMLElement>("[data-type-feedback]");
    if (feedback) {
      const guide = questionTypeGuides[question.answer];
      const guideBlock = `
        <div class="trainer-guide">
          <span class="section-label">需要的知識點</span>
          <a href="${guide.href}">${correct ? "想再扎實一點就看" : "先回去複習"} ${question.answer} → ${guide.label}</a>
          <span class="muted">${guide.focus}</span>
        </div>
      `;
      feedback.className = `feedback ${correct ? "good" : "bad"}`;
      feedback.innerHTML = correct
        ? `
          <strong>判斷正確：${question.answer}</strong>
          <p>關鍵字：${question.keywords.join("、")}</p>
          <ol class="plain-steps">${question.reason.map((item) => `<li>${item}</li>`).join("")}</ol>
          ${guideBlock}
        `
        : `
          <strong>這題比較像 ${question.answer}。</strong>
          <p>${question.distractors[selected] ?? "你可能抓到單一詞，但還要確認題目條件是否完整符合該公式。"}</p>
          <p>正確判斷依據：${question.keywords.join("、")}。</p>
          ${guideBlock}
        `;
    }

    const streakLabel = container.querySelector<HTMLElement>(".streak");
    if (streakLabel) {
      streakLabel.textContent = `連續答對：${streak}`;
    }
  });

  renderQuestion();
}

export function renderPracticeSet(
  container: HTMLElement,
  questions: PracticeQuestion[],
  diagnostics: Diagnostic[]
): void {
  let streak = 0;
  const diagnosticMap = new Map(diagnostics.map((item) => [item.id, item]));

  container.innerHTML = `
    <div class="practice-header">
      <span class="section-label">互動驗證</span>
      <span class="streak" data-practice-streak>連續答對：0</span>
    </div>
    ${questions
      .map(
        (question, questionIndex) => `
          <div class="quiz-item">
            <strong>${question.prompt}</strong>
            <div class="quiz-options" role="group" aria-label="${question.prompt}">
              ${question.options
                .map(
                  (option, optionIndex) => `
                    <button class="ghost" type="button" data-practice-question="${questionIndex}" data-practice-option="${optionIndex}">
                      ${option.label}
                    </button>
                  `
                )
                .join("")}
            </div>
            <div class="feedback" data-practice-feedback="${questionIndex}" aria-live="polite"></div>
          </div>
        `
      )
      .join("")}
  `;

  container.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
      "button[data-practice-question]"
    );
    if (!button) {
      return;
    }

    const questionIndex = Number(button.dataset.practiceQuestion);
    const optionIndex = Number(button.dataset.practiceOption);
    const question = questions[questionIndex];
    const option = question.options[optionIndex];
    const correct = optionIndex === question.answerIndex;
    streak = correct ? streak + 1 : 0;

    container
      .querySelectorAll<HTMLButtonElement>(`button[data-practice-question="${questionIndex}"]`)
      .forEach((item) => item.classList.remove("correct", "wrong"));
    button.classList.add(correct ? "correct" : "wrong");

    const feedback = container.querySelector<HTMLElement>(
      `[data-practice-feedback="${questionIndex}"]`
    );
    if (feedback) {
      feedback.className = `feedback ${correct ? "good" : "bad"}`;
      if (correct) {
        feedback.innerHTML = `<strong>答對。</strong><p>${question.successFeedback}</p>`;
      } else {
        const diagnostic = option.diagnosticId ? diagnosticMap.get(option.diagnosticId) : undefined;
        feedback.innerHTML = diagnostic
          ? `
            <strong>${diagnostic.title}</strong>
            <p>錯誤原因：${diagnostic.reason}</p>
            <p>正確做法：${diagnostic.fix}</p>
            <p>簡單對比例子：${diagnostic.contrastExample}</p>
          `
          : "<strong>再檢查題目條件。</strong><p>先判斷題型，再決定要代哪個公式。</p>";
      }
    }

    const streakLabel = container.querySelector<HTMLElement>("[data-practice-streak]");
    if (streakLabel) {
      streakLabel.textContent = `連續答對：${streak}`;
    }
  });
}

export function renderExamDrills(container: HTMLElement, drills: ExamDrill[]): void {
  container.innerHTML = drills
    .map(
      (drill) => `
        <article class="exam-card">
          <div class="trainer-topline">
            <span class="section-label">${drill.title}</span>
            <span class="tag">考卷型</span>
          </div>
          <p class="question-text">${drill.prompt}</p>
          <p class="exam-hint">先自己想：要用哪個公式、數字怎麼代。動手算過再展開對步驟，比直接看答案有用很多。</p>
          <details class="exam-solution">
            <summary>算完了，展開解答</summary>
            <dl class="exam-steps">
              <div><dt>公式起手式</dt><dd><code>${drill.formula}</code></dd></div>
              <div><dt>代入式</dt><dd><code>${drill.substitution}</code></dd></div>
              <div><dt>答案</dt><dd>${drill.answer}</dd></div>
              <div><dt>考場提醒</dt><dd>${drill.examNote}</dd></div>
            </dl>
          </details>
        </article>
      `
    )
    .join("");
}

function normalizePath(path: string): string {
  if (path === "/") {
    return "/index.html";
  }
  return path;
}
