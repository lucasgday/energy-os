export type OpportunityEconomicsInput = {
  expectedOilUpliftBblPerDay?: number;
  expectedGasUpliftMcfPerDay?: number;
  upliftDurationDays: number;
  oilPriceUsdPerBbl?: number;
  gasPriceUsdPerMcf?: number;
  variableOilCostUsdPerBbl?: number;
  variableGasCostUsdPerMcf?: number;
  interventionCostUsd: number;
};

export type OpportunityEconomics = {
  oilRevenueUsd: number;
  gasRevenueUsd: number;
  grossRevenueUsd: number;
  variableCostUsd: number;
  interventionCostUsd: number;
  netValueUsd: number;
  dailyNetBeforeInterventionUsd: number;
  payoutDays: number | null;
};

export function calculateOpportunityEconomics(input: OpportunityEconomicsInput): OpportunityEconomics {
  assertNonNegative("expectedOilUpliftBblPerDay", input.expectedOilUpliftBblPerDay);
  assertNonNegative("expectedGasUpliftMcfPerDay", input.expectedGasUpliftMcfPerDay);
  assertNonNegative("upliftDurationDays", input.upliftDurationDays);
  assertNonNegative("oilPriceUsdPerBbl", input.oilPriceUsdPerBbl);
  assertNonNegative("gasPriceUsdPerMcf", input.gasPriceUsdPerMcf);
  assertNonNegative("variableOilCostUsdPerBbl", input.variableOilCostUsdPerBbl);
  assertNonNegative("variableGasCostUsdPerMcf", input.variableGasCostUsdPerMcf);
  assertNonNegative("interventionCostUsd", input.interventionCostUsd);

  const oilUplift = input.expectedOilUpliftBblPerDay ?? 0;
  const gasUplift = input.expectedGasUpliftMcfPerDay ?? 0;
  const oilPrice = input.oilPriceUsdPerBbl ?? 0;
  const gasPrice = input.gasPriceUsdPerMcf ?? 0;
  const oilVariableCost = input.variableOilCostUsdPerBbl ?? 0;
  const gasVariableCost = input.variableGasCostUsdPerMcf ?? 0;

  const oilRevenueUsd = oilUplift * input.upliftDurationDays * oilPrice;
  const gasRevenueUsd = gasUplift * input.upliftDurationDays * gasPrice;
  const variableCostUsd =
    oilUplift * input.upliftDurationDays * oilVariableCost +
    gasUplift * input.upliftDurationDays * gasVariableCost;
  const grossRevenueUsd = oilRevenueUsd + gasRevenueUsd;
  const dailyNetBeforeInterventionUsd =
    oilUplift * (oilPrice - oilVariableCost) + gasUplift * (gasPrice - gasVariableCost);
  const netValueUsd = grossRevenueUsd - variableCostUsd - input.interventionCostUsd;

  return {
    oilRevenueUsd,
    gasRevenueUsd,
    grossRevenueUsd,
    variableCostUsd,
    interventionCostUsd: input.interventionCostUsd,
    netValueUsd,
    dailyNetBeforeInterventionUsd,
    payoutDays:
      dailyNetBeforeInterventionUsd > 0
        ? input.interventionCostUsd / dailyNetBeforeInterventionUsd
        : null
  };
}

function assertNonNegative(field: string, value: number | undefined): void {
  if (value === undefined) {
    return;
  }

  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${field} must be a non-negative finite number`);
  }
}
