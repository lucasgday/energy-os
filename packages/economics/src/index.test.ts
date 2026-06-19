import { describe, expect, it } from "vitest";
import { calculateOpportunityEconomics } from "./index";

describe("calculateOpportunityEconomics", () => {
  it("calculates value and payout for oil and gas uplift", () => {
    const result = calculateOpportunityEconomics({
      expectedOilUpliftBblPerDay: 20,
      expectedGasUpliftMcfPerDay: 100,
      upliftDurationDays: 30,
      oilPriceUsdPerBbl: 70,
      gasPriceUsdPerMcf: 3,
      variableOilCostUsdPerBbl: 10,
      variableGasCostUsdPerMcf: 0.5,
      interventionCostUsd: 12000
    });

    expect(result.oilRevenueUsd).toBe(42000);
    expect(result.gasRevenueUsd).toBe(9000);
    expect(result.grossRevenueUsd).toBe(51000);
    expect(result.variableCostUsd).toBe(7500);
    expect(result.netValueUsd).toBe(31500);
    expect(result.dailyNetBeforeInterventionUsd).toBe(1450);
    expect(result.payoutDays).toBeCloseTo(8.2759, 4);
  });

  it("returns null payout when daily net value is not positive", () => {
    const result = calculateOpportunityEconomics({
      expectedOilUpliftBblPerDay: 10,
      upliftDurationDays: 30,
      oilPriceUsdPerBbl: 40,
      variableOilCostUsdPerBbl: 50,
      interventionCostUsd: 1000
    });

    expect(result.dailyNetBeforeInterventionUsd).toBe(-100);
    expect(result.payoutDays).toBeNull();
  });

  it("rejects negative or non-finite assumptions", () => {
    expect(() =>
      calculateOpportunityEconomics({
        expectedOilUpliftBblPerDay: -1,
        upliftDurationDays: 30,
        oilPriceUsdPerBbl: 70,
        interventionCostUsd: 12000
      })
    ).toThrow("expectedOilUpliftBblPerDay must be a non-negative finite number");
  });
});
