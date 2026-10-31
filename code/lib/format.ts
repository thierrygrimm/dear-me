/** Swiss-style CHF formatting: CHF 3'640 */
export function formatCHF(amount: number, opts?: { exact?: boolean }): string {
  const value = opts?.exact ? Math.round(amount) : Math.round(amount / 100) * 100;
  const abs = Math.abs(value);
  const formatted = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  const sign = value < 0 ? "−" : "";
  return `CHF ${sign}${formatted}`;
}

export function formatPercent(value: number): string {
  return `${value} %`;
}
