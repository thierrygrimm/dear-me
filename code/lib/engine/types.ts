/** Core engine types — household is the single source of truth. */

export type Relationship =
  | "single"
  | "married"
  | "partnership"
  | "cohabiting";

export type ValueSource = "estimate" | "user" | "document";

export type Pillar2 = {
  pensionAt65?: number;
  currentCapital?: number;
  disability?: number;
  disabilityChildren?: number;
  widow?: number;
  orphan?: number;
  coverageCapital?: number;
};

export type Person = {
  sex: 1 | 2;
  birthYear: number;
  fullTimeIncome: number;
  workloadPc: number;
  withBVG: boolean;
  retirementAge?: number;
  pillar2?: Pillar2;
  source: Record<string, ValueSource>;
};

export type Household = {
  relationship: Relationship;
  sinceYear?: number;
  persons: [Person] | [Person, Person];
  children: { birthYear: number }[];
  postcode?: string;
  churchTax?: boolean;
  assets?: number;
  needs: {
    disabilityPc: number;
    deathPc: number;
    retirementPc: number;
  };
};

export type TraceUnit = "CHF/yr" | "CHF/mo" | "%";

export type Trace = {
  id: string;
  label: string;
  value: number;
  unit: TraceUnit;
  operation?: string;
  responseField?: string;
  inputs: Record<string, number | string>;
  derivation?: string;
  assumptions: string[];
  ruleId?: string;
  sources: ValueSource[];
  explanation: string;
  createdAt: string;
};

export type WorkloadStep = {
  workloadPc: number;
  grossIncome: number;
  pillar2PensionYr: number;
  salaryDropPc: number;
  pensionDropPc: number;
  monthlyDiff: number;
  overRetirement: number;
  disabilityCoverYr?: number;
  traces: {
    pillar2Pension: string;
    monthlyDiff: string;
  };
};

export type WorkloadSimulation = {
  personIndex: number;
  steps: WorkloadStep[];
  baselinePensionYr: number;
};

export type RiskScenario = {
  id: number;
  label: string;
  personIndex: 0 | 1;
  kind: "disability-illness" | "disability-accident" | "death-illness" | "death-accident";
  incomeNeedMo: number;
  incomeTotalMo: number;
  incomeGapMo: number;
  capitalGap: number;
  traceId: string;
};

export type CoverageSimulation = {
  scenarios: RiskScenario[];
};

export type RetirementAgeStep = {
  age: number;
  incomePillar1Yr: number;
  incomePillar2Yr: number;
  incomeGapYr: number;
  capitalNeeded: number;
  traceId: string;
};

export type RetirementAgeSimulation = {
  personIndex: number;
  steps: RetirementAgeStep[];
};

export type Tax3aResult = {
  personIndex: number;
  maxContribution: number;
  taxSaved: number;
  daysLeft: number;
  taxLocationId?: string;
  traceId: string;
};

export type Suggestion = {
  ruleId: string;
  kind: "product" | "not-needed" | "handover";
  title: string;
  body: string;
  amount?: number;
  amountUnit?: "CHF" | "CHF/yr" | "CHF/mo";
  productHint?: string;
  traceIds: string[];
};

export type AuditEntry = {
  id: string;
  createdAt: string;
  ruleId: string;
  suggestion: Suggestion;
  householdSnapshot: Household;
  traceIds: string[];
};

export type Lead = {
  id: string;
  createdAt: string;
  entryPoint: string;
  contactPreference: "call" | "video" | "office" | "message";
  household: Household;
  gaps: Suggestion[];
  questions: string[];
  traceIds: string[];
};
