import { conceptGroups } from "../content/concepts";
import { questionTypeItems } from "../content/questionTypes";
import { renderConceptMap, renderQuestionTypeTrainer, setupLayout } from "../main";

setupLayout();

const conceptMap = document.querySelector<HTMLElement>("[data-concept-map]");
const questionTypeTrainer = document.querySelector<HTMLElement>("[data-question-type-trainer]");

if (conceptMap) {
  renderConceptMap(conceptMap, conceptGroups);
}

if (questionTypeTrainer) {
  renderQuestionTypeTrainer(questionTypeTrainer, questionTypeItems);
}
