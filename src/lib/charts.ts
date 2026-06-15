import { formatNumber, formatPercent } from "./format";

export function renderBarChart(
  values: Array<{ label: string | number; value: number }>,
  highlightLabel?: string | number
): string {
  const width = 560;
  const height = 240;
  const padding = { top: 20, right: 16, bottom: 46, left: 42 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...values.map((item) => item.value), 1);
  const gap = 8;
  const barWidth = Math.max(8, (chartWidth - gap * (values.length - 1)) / values.length);

  const bars = values
    .map((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const x = padding.left + index * (barWidth + gap);
      const y = padding.top + chartHeight - barHeight;
      const active = item.label === highlightLabel ? " highlight" : "";
      return `
        <rect class="bar${active}" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4">
          <title>${item.label}: ${formatPercent(item.value, 2)}</title>
        </rect>
        <text x="${x + barWidth / 2}" y="${height - 18}" text-anchor="middle" font-size="12">${item.label}</text>
      `;
    })
    .join("");

  return `
    <svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="機率長條圖">
      <line class="axis" x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${width - padding.right}" y2="${padding.top + chartHeight}" />
      <line class="axis" x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartHeight}" />
      ${bars}
    </svg>
  `;
}

export function renderDotPlot(values: number[], mean: number): string {
  const width = 560;
  const height = 160;
  const padding = 36;
  const min = Math.min(...values, mean);
  const max = Math.max(...values, mean);
  const spread = max - min || 1;
  const scale = (value: number) => padding + ((value - min) / spread) * (width - padding * 2);
  const points = values
    .map((value, index) => {
      const x = scale(value);
      const y = 70 + (index % 3) * 18;
      return `<circle class="point" cx="${x}" cy="${y}" r="7"><title>${formatNumber(value)}</title></circle>`;
    })
    .join("");
  const meanX = scale(mean);

  return `
    <svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="資料點和平均數數線">
      <line class="axis" x1="${padding}" y1="112" x2="${width - padding}" y2="112" />
      <line stroke="#c96f36" stroke-width="3" x1="${meanX}" y1="28" x2="${meanX}" y2="124" />
      <text x="${meanX}" y="22" text-anchor="middle" font-size="13">平均 ${formatNumber(mean, 2)}</text>
      <text x="${padding}" y="140" text-anchor="middle" font-size="12">${formatNumber(min, 1)}</text>
      <text x="${width - padding}" y="140" text-anchor="middle" font-size="12">${formatNumber(max, 1)}</text>
      ${points}
    </svg>
  `;
}

export function renderNormalCurve(
  mean: number,
  standardDeviation: number,
  lower: number,
  upper: number,
  marker?: number
): string {
  const width = 560;
  const height = 260;
  const padding = { top: 22, right: 22, bottom: 38, left: 28 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const minX = mean - standardDeviation * 4;
  const maxX = mean + standardDeviation * 4;
  const maxDensity = normalDensity(mean, mean, standardDeviation);
  const xScale = (value: number) => padding.left + ((value - minX) / (maxX - minX)) * chartWidth;
  const yScale = (density: number) => padding.top + chartHeight - (density / maxDensity) * chartHeight;
  const points = Array.from({ length: 161 }, (_, index) => {
    const xValue = minX + ((maxX - minX) * index) / 160;
    return `${xScale(xValue)},${yScale(normalDensity(xValue, mean, standardDeviation))}`;
  }).join(" ");
  const shadePoints = Array.from({ length: 121 }, (_, index) => {
    const xValue = lower + ((upper - lower) * index) / 120;
    const clamped = Math.min(Math.max(xValue, minX), maxX);
    return `${xScale(clamped)},${yScale(normalDensity(clamped, mean, standardDeviation))}`;
  }).join(" ");
  const baseY = padding.top + chartHeight;
  const markerLine =
    marker === undefined
      ? ""
      : `<line stroke="#c96f36" stroke-width="3" x1="${xScale(marker)}" y1="${padding.top}" x2="${xScale(marker)}" y2="${baseY}" />`;

  return `
    <svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="常態分配曲線">
      <polygon class="shade" points="${xScale(lower)},${baseY} ${shadePoints} ${xScale(upper)},${baseY}" />
      <polyline class="curve" points="${points}" />
      ${markerLine}
      <line class="axis" x1="${padding.left}" y1="${baseY}" x2="${width - padding.right}" y2="${baseY}" />
      <text x="${xScale(mean)}" y="${height - 12}" text-anchor="middle" font-size="12">平均 ${formatNumber(mean, 1)}</text>
      <text x="${padding.left}" y="${height - 12}" text-anchor="start" font-size="12">${formatNumber(minX, 1)}</text>
      <text x="${width - padding.right}" y="${height - 12}" text-anchor="end" font-size="12">${formatNumber(maxX, 1)}</text>
    </svg>
  `;
}

function normalDensity(x: number, mean: number, standardDeviation: number): number {
  const coefficient = 1 / (standardDeviation * Math.sqrt(2 * Math.PI));
  const exponent = -0.5 * ((x - mean) / standardDeviation) ** 2;
  return coefficient * Math.exp(exponent);
}
