/** Swiss-style number: 3'640 or 6.0 */
export function formatSwiss(amount: number, decimals = 0): string {
  if (decimals > 0) {
    return amount.toFixed(decimals);
  }
  const value = Math.round(amount);
  const abs = Math.abs(value);
  const formatted = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return value < 0 ? `−${formatted}` : formatted;
}

/** Swiss-style CHF formatting: CHF 3'640 */
export function formatCHF(amount: number, opts?: { exact?: boolean }): string {
  const value = opts?.exact ? Math.round(amount) : Math.round(amount / 100) * 100;
  return `CHF ${formatSwiss(value)}`;
}

export function formatPercent(value: number): string {
  const decimals = Number.isInteger(value) ? 0 : 1;
  return `${formatSwiss(value, decimals)} %`;
}
