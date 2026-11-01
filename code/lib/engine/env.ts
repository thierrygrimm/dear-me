/** Server-only engine configuration. */

function flag(name: string, fallback = false): boolean {
  const v = process.env[name];
  if (v === undefined || v === "") return fallback;
  return v === "1" || v.toLowerCase() === "true" || v === "yes";
}

export function engineEnv() {
  return {
    logismataBaseUrl:
      process.env.LOGISMATA_BASE_URL?.replace(/\/$/, "") ??
      "https://api.logismata.com",
    logismataToken: process.env.LOGISMATA_API_TOKEN ?? "",
    /** Serve recorded fixtures only (stage / offline). */
    demoCache: flag("DEMO_CACHE", !process.env.LOGISMATA_API_TOKEN),
    llmApiKey: process.env.LLM_API_KEY ?? "",
    llmBaseUrl: process.env.LLM_BASE_URL?.replace(/\/$/, "") ?? "",
  };
}

export function hasLogismataCredentials(): boolean {
  const { logismataToken, demoCache } = engineEnv();
  return Boolean(logismataToken) && !demoCache;
}
