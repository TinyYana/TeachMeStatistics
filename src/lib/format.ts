export function round(value: number, digits = 4): number {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatNumber(value: number, digits = 4): string {
  if (!Number.isFinite(value)) {
    return "無法計算";
  }
  return round(value, digits).toLocaleString("zh-TW", {
    maximumFractionDigits: digits
  });
}

export function formatPercent(value: number, digits = 2): string {
  if (!Number.isFinite(value)) {
    return "無法計算";
  }
  return `${formatNumber(value * 100, digits)}%`;
}

export function parseNumberList(input: string): number[] {
  return input
    .split(/[,，\s]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map(Number)
    .filter((value) => Number.isFinite(value));
}
