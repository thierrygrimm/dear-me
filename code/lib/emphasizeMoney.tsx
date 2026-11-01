import type { ReactNode } from "react";

/** Swiss money in copy: CHF 600, CHF 3'640, CHF 3'640.50 */
const MONEY_RE = /CHF\s+\d{1,3}(?:'\d{3})*(?:\.\d+)?/g;

/**
 * Wrap CHF amounts in `<b>` so chat answers match the design system
 * (e.g. About <b>CHF 600</b> less a month…).
 */
export function emphasizeMoney(text: string): ReactNode {
  if (!text) return text;

  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  MONEY_RE.lastIndex = 0;

  while ((match = MONEY_RE.exec(text))) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    nodes.push(<b key={`chf-${key++}`}>{match[0]}</b>);
    last = match.index + match[0].length;
  }

  if (last === 0) return text;
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
