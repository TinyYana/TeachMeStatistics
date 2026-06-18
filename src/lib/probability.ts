export type DiceEvent = "one" | "even" | "greaterThan4" | "lessOrEqual3";

export interface ConditionalIndependenceSummary {
  conditionalProbability: number;
  expectedIntersectionIfIndependent: number;
  intersectionDifference: number;
  isIndependent: boolean;
}

export interface ProbabilityDistributionRow {
  value: number;
  probability: number;
  weightedValue: number;
  weightedSquaredValue: number;
}

export interface ProbabilityDistributionSummary {
  rows: ProbabilityDistributionRow[];
  probabilitySum: number;
  expectedValue: number;
  expectedSquaredValue: number;
  variance: number;
  standardDeviation: number;
}

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

export function summarizeConditionalIndependence(
  eventProbability: number,
  conditionProbability: number,
  intersectionProbability: number,
  tolerance = 1e-6
): ConditionalIndependenceSummary {
  validateProbability(eventProbability);
  validateProbability(conditionProbability);
  validateProbability(intersectionProbability);
  if (conditionProbability === 0) {
    throw new Error("條件事件的機率必須大於 0，才算得出條件機率。");
  }
  if (intersectionProbability > Math.min(eventProbability, conditionProbability)) {
    throw new Error("A 且 B 的機率不能大於 A 或 B 本身。");
  }

  const conditional = intersectionProbability / conditionProbability;
  const expectedIntersection = eventProbability * conditionProbability;
  const difference = Math.abs(intersectionProbability - expectedIntersection);

  return {
    conditionalProbability: conditional,
    expectedIntersectionIfIndependent: expectedIntersection,
    intersectionDifference: difference,
    isIndependent: difference <= tolerance
  };
}

export function summarizeProbabilityDistribution(
  values: number[],
  probabilities: number[]
): ProbabilityDistributionSummary {
  if (values.length === 0 || probabilities.length === 0) {
    throw new Error("請至少輸入一組 X 值和對應機率。");
  }
  if (values.length !== probabilities.length) {
    throw new Error("X 值和 P(X) 的數量要一樣多。");
  }
  for (const value of values) {
    if (!Number.isFinite(value)) {
      throw new Error("X 值必須是有效數字。");
    }
  }
  for (const probability of probabilities) {
    validateProbability(probability);
  }

  const probabilitySum = probabilities.reduce((sum, probability) => sum + probability, 0);
  if (Math.abs(probabilitySum - 1) > 1e-6) {
    throw new Error("P(X) 加總必須等於 1。");
  }

  const rows = values.map((value, index) => {
    const probability = probabilities[index];
    return {
      value,
      probability,
      weightedValue: value * probability,
      weightedSquaredValue: value * value * probability
    };
  });
  const expectedValue = rows.reduce((sum, row) => sum + row.weightedValue, 0);
  const expectedSquaredValue = rows.reduce((sum, row) => sum + row.weightedSquaredValue, 0);
  const variance = Math.max(0, expectedSquaredValue - expectedValue ** 2);

  return {
    rows,
    probabilitySum,
    expectedValue,
    expectedSquaredValue,
    variance,
    standardDeviation: Math.sqrt(variance)
  };
}

function validateProbability(probability: number): void {
  if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
    throw new Error("機率必須介於 0 和 1 之間。");
  }
}
