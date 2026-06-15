export type VarianceMode = "population" | "sample";

export interface DeviationRow {
  value: number;
  deviation: number;
  squaredDeviation: number;
}

export interface DescriptiveResult {
  count: number;
  sorted: number[];
  sum: number;
  mean: number;
  median: number;
  modes: number[];
  max: number;
  min: number;
  range: number;
  deviationRows: DeviationRow[];
  squaredDeviationSum: number;
  variance: number;
  standardDeviation: number;
  mode: VarianceMode;
}

export function summarize(values: number[], mode: VarianceMode): DescriptiveResult {
  if (values.length === 0) {
    throw new Error("至少需要一個數字。");
  }
  if (mode === "sample" && values.length < 2) {
    throw new Error("樣本變異數至少需要兩個數字，因為分母是 n - 1。");
  }

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((total, value) => total + value, 0);
  const mean = sum / values.length;
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const deviationRows = values.map((value) => {
    const deviation = value - mean;
    return {
      value,
      deviation,
      squaredDeviation: deviation ** 2
    };
  });
  const squaredDeviationSum = deviationRows.reduce(
    (total, row) => total + row.squaredDeviation,
    0
  );
  const denominator = mode === "population" ? values.length : values.length - 1;
  const variance = squaredDeviationSum / denominator;

  return {
    count: values.length,
    sorted,
    sum,
    mean,
    median,
    modes: getModes(values),
    max,
    min,
    range: max - min,
    deviationRows,
    squaredDeviationSum,
    variance,
    standardDeviation: Math.sqrt(variance),
    mode
  };
}

export function getModes(values: number[]): number[] {
  const counts = new Map<number, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  const maxCount = Math.max(...counts.values());
  if (maxCount <= 1) {
    return [];
  }
  return [...counts.entries()]
    .filter(([, count]) => count === maxCount)
    .map(([value]) => value)
    .sort((a, b) => a - b);
}

export function frequencyTable(values: number[]): Array<{ value: number; count: number }> {
  const counts = new Map<number, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value - b.value);
}
