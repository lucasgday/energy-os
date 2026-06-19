import { describe, expect, it } from "vitest";
import { getProductionReview } from "./production-review";

describe("getProductionReview", () => {
  it("loads the synthetic field dataset into a production review", () => {
    const review = getProductionReview();

    expect(review.field.name).toBe("Alpha Field");
    expect(review.field.latestProductionDate).toBe("2026-06-17");
    expect(review.summary.activeWells).toBe(3);
    expect(review.summary.openDeferments).toBe(1);
    expect(review.summary.rankedOpportunities).toBe(2);
    expect(review.summary.latestOilVolume).toBe(248);
    expect(review.summary.oilDelta).toBe(-32);
  });

  it("keeps well-level production signals tied to validated domain records", () => {
    const review = getProductionReview();
    const alpha01 = review.wells.find((well) => well.well_id === "well-001");
    const alpha03 = review.wells.find((well) => well.well_id === "well-003");

    expect(alpha01?.name).toBe("Alpha-01");
    expect(alpha01?.latest.oil_volume).toBe(51);
    expect(alpha01?.oilDelta).toBe(-28);
    expect(alpha01?.statusLabel).toBe("Producing");
    expect(alpha03?.statusLabel).toBe("Shut in");
    expect(alpha03?.openDeferments).toBe(1);
  });

  it("ranks opportunities with deterministic economics", () => {
    const review = getProductionReview();
    const [topOpportunity] = review.opportunities;

    expect(topOpportunity?.opportunity_id).toBe("opp-002");
    expect(topOpportunity?.wellName).toBe("Alpha-03");
    expect(topOpportunity?.economics.netValueUsd).toBe(57000);
    expect(topOpportunity?.economics.payoutDays).toBeCloseTo(7.2, 1);
    expect(topOpportunity?.evidenceLabels).toEqual(["def-002"]);
  });
});
