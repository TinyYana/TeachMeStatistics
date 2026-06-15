export interface BinomialBreakdown {
  n: number;
  p: number;
  k: number;
  q: number;
  combinations: number;
  successPart: number;
  failurePart: number;
  probability: number;
  distribution: Array<{ x: number; probability: number }>;
}

export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("階乘只接受 0 或正整數。");
  }
  let result = 1;
  for (let value = 2; value <= n; value += 1) {
    result *= value;
  }
  return result;
}

export function combination(n: number, k: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) {
    throw new Error("組合 C(n,k) 需要 0 <= k <= n，且 n、k 都是整數。");
  }
  const smallerK = Math.min(k, n - k);
  let result = 1;
  for (let index = 1; index <= smallerK; index += 1) {
    result = (result * (n - smallerK + index)) / index;
  }
  return Math.round(result);
}

export function fixedSequenceProbability(p: number, successCount: number, totalCount: number): number {
  validateProbability(p);
  if (successCount < 0 || totalCount < 0 || successCount > totalCount) {
    throw new Error("成功次數必須介於 0 和總次數之間。");
  }
  return p ** successCount * (1 - p) ** (totalCount - successCount);
}

export function binomialProbability(n: number, p: number, k: number): number {
  return combination(n, k) * fixedSequenceProbability(p, k, n);
}

export function getBinomialBreakdown(n: number, p: number, k: number): BinomialBreakdown {
  validateBinomialInputs(n, p, k);
  const q = 1 - p;
  const combinations = combination(n, k);
  const successPart = p ** k;
  const failurePart = q ** (n - k);
  const probability = combinations * successPart * failurePart;
  const distribution = Array.from({ length: n + 1 }, (_, x) => ({
    x,
    probability: binomialProbability(n, p, x)
  }));

  return {
    n,
    p,
    k,
    q,
    combinations,
    successPart,
    failurePart,
    probability,
    distribution
  };
}

function validateProbability(p: number): void {
  if (!Number.isFinite(p) || p < 0 || p > 1) {
    throw new Error("機率 p 必須介於 0 和 1 之間。");
  }
}

function validateBinomialInputs(n: number, p: number, k: number): void {
  validateProbability(p);
  if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) {
    throw new Error("二項分配需要整數 n、k，且 0 <= k <= n。");
  }
}
