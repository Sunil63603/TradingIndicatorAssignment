// Utility function to compute Bollinger Bands
// - Basis = SMA(close, length)
// - StdDev = sqrt(sum((x - mean)^2) / N) (population variant)
// - Upper = basis + multiplier * stddev
// - Lower = basis - multiplier * stddev
// - Offset shifts series by given bars.

export function computeBollingerBands(data: any[], options: any) {
  const { length, multiplier, offset } = options;
  const closes = data.map((d) => d.close);

  const sma = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const result: any[] = [];

  for (let i = 0; i < closes.length; i++) {
    if (i < length - 1) {
      result.push({ basis: null, upper: null, lower: null });
      continue;
    }

    const window = closes.slice(i - length + 1, i + 1);
    const mean = sma(window);
    const variance =
      window.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      window.length;
    const stddev = Math.sqrt(variance);

    const basis = mean;
    const upper = mean + multiplier * stddev;
    const lower = mean - multiplier * stddev;

    result.push({ basis, upper, lower });
  }

  // Apply offset (shift bands)
  if (offset !== 0) {
    for (let i = 0; i < Math.abs(offset); i++) {
      if (offset > 0) result.unshift({ basis: null, upper: null, lower: null });
      else result.push({ basis: null, upper: null, lower: null });
    }
  }

  return result;
}
