import { engineEnv, hasLogismataCredentials } from "../env";
import { cacheGet, cacheKey, cacheSet } from "../cache";

export type LogismataOperation =
  | "calculateRetirementBase"
  | "calculateRisk"
  | "calculateRetirement"
  | "getSaving3aLimits"
  | "searchLocation"
  | "calculateSaving3a";

export class LogismataError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly operation?: LogismataOperation,
  ) {
    super(message);
    this.name = "LogismataError";
  }
}

/**
 * Server-side Logismata proxy. Token never leaves the server.
 * Responses are cached by hashed request body.
 */
export async function logismataCall<T>(
  operation: LogismataOperation,
  body: Record<string, unknown>,
): Promise<T> {
  const key = cacheKey(`logismata:${operation}`, body);
  const cached = cacheGet<T>(key);
  if (cached) return cached;

  if (!hasLogismataCredentials()) {
    throw new LogismataError(
      "Logismata credentials are not configured",
      503,
      operation,
    );
  }

  const { logismataBaseUrl, logismataToken } = engineEnv();
  const res = await fetch(`${logismataBaseUrl}/${operation}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${logismataToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new LogismataError(
      friendlyLogismataMessage(operation, res.status, detail),
      res.status,
      operation,
    );
  }

  const data = (await res.json()) as T;
  return cacheSet(key, data);
}

function friendlyLogismataMessage(
  operation: LogismataOperation,
  status: number,
  detail: string,
): string {
  if (status === 400 && /retirement|age/i.test(detail)) {
    return "This person is too close to retirement for that calculation.";
  }
  return `Pension engine could not complete ${operation} (${status}).`;
}

export function toLogismataPerson(
  person: {
    sex: 1 | 2;
    birthYear: number;
    fullTimeIncome: number;
    workloadPc: number;
    withBVG: boolean;
    retirementAge?: number;
    pillar2?: Record<string, number | undefined>;
  },
  workloadOverride?: number,
) {
  const workloadPc = workloadOverride ?? person.workloadPc;
  const gross = Math.round((person.fullTimeIncome * workloadPc) / 100);
  return {
    Sex: person.sex,
    BirthYear: person.birthYear,
    GrossIncome: gross,
    WithBVG: person.withBVG,
    DesiredRetirementAge: person.retirementAge ?? 65,
    RetirementPillar2: person.pillar2
      ? {
          PensionAt65: person.pillar2.pensionAt65,
          CurrentCapital: person.pillar2.currentCapital,
        }
      : undefined,
    RiskPensionPillar2: person.pillar2
      ? {
          Disability: person.pillar2.disability,
          DisabilityChildren: person.pillar2.disabilityChildren,
          Widow: person.pillar2.widow,
          Orphan: person.pillar2.orphan,
          CoverageCapital: person.pillar2.coverageCapital,
        }
      : undefined,
  };
}
