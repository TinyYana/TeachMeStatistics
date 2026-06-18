import { describe, expect, it } from "vitest";
import { diagnostics } from "../src/content/diagnostics";
import { examDrills } from "../src/content/practice";
import { questionTypeItems, questionTypeOptions } from "../src/content/questionTypes";
import { binomialProbability, combination, factorial } from "../src/lib/binomial";
import { summarize } from "../src/lib/descriptive";
import { fixedSequenceProbability } from "../src/lib/binomial";
import { normalArea, standardNormalCdf, zScore } from "../src/lib/normal";
import {
  summarizeConditionalIndependence,
  summarizeProbabilityDistribution
} from "../src/lib/probability";

describe("descriptive statistics", () => {
  it("summarizes mean, median, mode and range", () => {
    const result = summarize([60, 70, 70, 80, 100], "population");

    expect(result.sorted).toEqual([60, 70, 70, 80, 100]);
    expect(result.mean).toBe(76);
    expect(result.median).toBe(70);
    expect(result.modes).toEqual([70]);
    expect(result.range).toBe(40);
  });

  it("distinguishes population and sample variance", () => {
    const population = summarize([4, 6, 8], "population");
    const sample = summarize([4, 6, 8], "sample");

    expect(population.variance).toBeCloseTo(8 / 3, 8);
    expect(population.standardDeviation).toBeCloseTo(Math.sqrt(8 / 3), 8);
    expect(sample.variance).toBeCloseTo(4, 8);
    expect(sample.standardDeviation).toBeCloseTo(2, 8);
  });

  it("returns multiple modes and no mode when appropriate", () => {
    expect(summarize([1, 1, 2, 2, 3], "population").modes).toEqual([1, 2]);
    expect(summarize([1, 2, 3], "population").modes).toEqual([]);
  });
});

describe("binomial helpers", () => {
  it("calculates factorial and combinations", () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(5)).toBe(120);
    expect(combination(8, 2)).toBe(28);
  });

  it("matches the core binomial example", () => {
    expect(binomialProbability(8, 0.3, 2)).toBeCloseTo(0.29647548, 8);
  });

  it("separates fixed sequence probability from total binomial probability", () => {
    const fixed = fixedSequenceProbability(0.3, 2, 8);
    const total = binomialProbability(8, 0.3, 2);

    expect(fixed).toBeCloseTo(0.01058841, 8);
    expect(total).toBeCloseTo(combination(8, 2) * fixed, 8);
    expect(total).toBeGreaterThan(fixed);
  });
});

describe("normal distribution helpers", () => {
  it("calculates z scores", () => {
    expect(zScore(85, 70, 10)).toBe(1.5);
  });

  it("approximates common cumulative probability values", () => {
    expect(standardNormalCdf(1)).toBeCloseTo(0.8413, 4);
    expect(standardNormalCdf(-1)).toBeCloseTo(0.1587, 4);
  });

  it("calculates less than, greater than and between areas", () => {
    expect(normalArea("less", 70, 10, 80)).toBeCloseTo(0.8413, 4);
    expect(normalArea("greater", 70, 10, 80)).toBeCloseTo(0.1587, 4);
    expect(normalArea("between", 70, 10, 60, 80)).toBeCloseTo(0.6827, 4);
  });
});

describe("probability helpers", () => {
  it("calculates conditional probability and independence", () => {
    const result = summarizeConditionalIndependence(0.3, 0.5, 0.15);

    expect(result.conditionalProbability).toBeCloseTo(0.3, 8);
    expect(result.expectedIntersectionIfIndependent).toBeCloseTo(0.15, 8);
    expect(result.isIndependent).toBe(true);
  });

  it("summarizes probability functions", () => {
    const result = summarizeProbabilityDistribution([0, 1, 2], [0.2, 0.5, 0.3]);

    expect(result.probabilitySum).toBeCloseTo(1, 8);
    expect(result.expectedValue).toBeCloseTo(1.1, 8);
    expect(result.expectedSquaredValue).toBeCloseTo(1.7, 8);
    expect(result.variance).toBeCloseTo(0.49, 8);
    expect(result.standardDeviation).toBeCloseTo(0.7, 8);
  });
});

describe("question type trainer content", () => {
  it("includes the required answer choices", () => {
    expect(questionTypeOptions).toEqual([
      "描述統計",
      "機率基礎",
      "機率函數",
      "二項分配",
      "常態分配",
      "信賴區間",
      "假設檢定"
    ]);
  });

  it("has complete feedback data for each question type item", () => {
    expect(questionTypeItems.length).toBeGreaterThanOrEqual(6);
    for (const item of questionTypeItems) {
      expect(item.prompt.length).toBeGreaterThan(0);
      expect(questionTypeOptions).toContain(item.answer);
      expect(item.keywords.length).toBeGreaterThan(0);
      expect(item.reason.length).toBeGreaterThan(0);
    }
  });
});

describe("diagnostic content", () => {
  it("covers the mistake types with complete guidance", () => {
    expect(diagnostics).toHaveLength(14);
    for (const diagnostic of diagnostics) {
      expect(diagnostic.title.length).toBeGreaterThan(0);
      expect(diagnostic.reason.length).toBeGreaterThan(0);
      expect(diagnostic.fix.length).toBeGreaterThan(0);
      expect(diagnostic.contrastExample.length).toBeGreaterThan(0);
    }
  });
});

describe("exam drill content", () => {
  it("adds exam-style formula practice for each MVP chapter", () => {
    expect(examDrills.descriptive.length).toBeGreaterThanOrEqual(2);
    expect(examDrills.probability.length).toBeGreaterThanOrEqual(3);
    expect(examDrills.binomial.length).toBeGreaterThanOrEqual(2);
    expect(examDrills.normal.length).toBeGreaterThanOrEqual(3);

    for (const drill of [
      ...examDrills.descriptive,
      ...examDrills.probability,
      ...examDrills.binomial,
      ...examDrills.normal
    ]) {
      expect(drill.prompt.length).toBeGreaterThan(0);
      expect(drill.formula.length).toBeGreaterThan(0);
      expect(drill.substitution.length).toBeGreaterThan(0);
      expect(drill.answer.length).toBeGreaterThan(0);
      expect(drill.examNote.length).toBeGreaterThan(0);
    }
  });
});
