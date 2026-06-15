export type NormalAreaMode = "less" | "greater" | "between";

export function zScore(x: number, mean: number, standardDeviation: number): number {
  if (!Number.isFinite(standardDeviation) || standardDeviation <= 0) {
    throw new Error("標準差必須大於 0。");
  }
  return (x - mean) / standardDeviation;
}

export function standardNormalCdf(z: number): number {
  const sign = z < 0 ? -1 : 1;
  const absZ = Math.abs(z) / Math.sqrt(2);
  return 0.5 * (1 + sign * erf(absZ));
}

export function normalArea(
  mode: NormalAreaMode,
  mean: number,
  standardDeviation: number,
  x: number,
  upper?: number
): number {
  const firstZ = zScore(x, mean, standardDeviation);
  if (mode === "less") {
    return standardNormalCdf(firstZ);
  }
  if (mode === "greater") {
    return 1 - standardNormalCdf(firstZ);
  }
  if (upper === undefined) {
    throw new Error("介於兩個數值時，需要填入上限。");
  }
  const lowerX = Math.min(x, upper);
  const upperX = Math.max(x, upper);
  return (
    standardNormalCdf(zScore(upperX, mean, standardDeviation)) -
    standardNormalCdf(zScore(lowerX, mean, standardDeviation))
  );
}

function erf(value: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value);
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
  return sign * y;
}
