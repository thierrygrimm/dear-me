/** Turn spoken workload phrases into a pensum %. */
export function daysCue(pensum: number): string {
  if (pensum >= 100) return "That's full time.";
  if (pensum >= 80) return "That's 4 days a week.";
  if (pensum >= 60) return "That's 3 days a week.";
  if (pensum >= 40) return "That's about 2 days a week.";
  return "Got it.";
}

export function parsePensum(text: string): { value: number; cue: string } | null {
  const t = text.toLowerCase();

  const pct = t.match(/(\d{1,3})\s*(?:%|percent|per\s*cent)/);
  if (pct) {
    const n = Number(pct[1]);
    if (n >= 20 && n <= 100) return { value: n, cue: daysCue(n) };
  }

  if (/\b(full[\s-]?time|five days|5 days)\b/.test(t)) {
    return { value: 100, cue: daysCue(100) };
  }
  if (/\b(four days|4 days)\b/.test(t)) {
    return { value: 80, cue: daysCue(80) };
  }
  if (/\b(three days|3 days)\b/.test(t)) {
    return { value: 60, cue: daysCue(60) };
  }
  if (/\b(two days|2 days|half[\s-]?time)\b/.test(t)) {
    return { value: 40, cue: daysCue(40) };
  }

  return null;
}

/** Demo phrase that matches the IntakeCard preview. */
export const DEMO_SPEAK_PHRASE =
  "I work four days a week, so about 80 percent";

export function highlightPensumQuote(text: string): string {
  return text
    .replace(
      /(four days a week|three days a week|two days a week|five days a week|full time)/gi,
      "<mark>$1</mark>",
    )
    .replace(/(\d{1,3}\s*(?:%|percent))/gi, "<mark>$1</mark>");
}
