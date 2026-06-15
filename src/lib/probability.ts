export type DiceEvent = "one" | "even" | "greaterThan4" | "lessOrEqual3";

export function diceEventResults(event: DiceEvent): number[] {
  const outcomes = [1, 2, 3, 4, 5, 6];
  if (event === "one") {
    return [1];
  }
  if (event === "even") {
    return outcomes.filter((value) => value % 2 === 0);
  }
  if (event === "greaterThan4") {
    return outcomes.filter((value) => value > 4);
  }
  return outcomes.filter((value) => value <= 3);
}

export function complementProbability(probability: number): number {
  validateProbability(probability);
  return 1 - probability;
}

export function independentJointProbability(first: number, second: number): number {
  validateProbability(first);
  validateProbability(second);
  return first * second;
}

function validateProbability(probability: number): void {
  if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
    throw new Error("機率必須介於 0 和 1 之間。");
  }
}
