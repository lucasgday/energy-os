import { describe, expect, it } from "vitest";
import {
  DomainValidationError,
  validateDeferment,
  validateOpportunity,
  validateProductionMeasurement,
  validateWell,
  validateWithSchema,
  wellSchema,
  type Opportunity,
  type ProductionMeasurement,
  type Well
} from "./index";

describe("domain validators", () => {
  it("returns typed well values when input matches the schema", () => {
    const well = validateWell({
      well_id: "well-001",
      field_id: "field-alpha",
      name: "Alpha-01",
      well_type: "producer",
      status: "producing",
      artificial_lift_type: "rod_pump",
      target_formation: "Sand A",
      source: "synthetic"
    });

    expect(well satisfies Well).toBe(well);
    expect(well.name).toBe("Alpha-01");
  });

  it("rejects invalid well enum values", () => {
    expect(() =>
      validateWell({
        well_id: "well-001",
        field_id: "field-alpha",
        name: "Alpha-01",
        well_type: "producer",
        status: "flowing"
      })
    ).toThrow(DomainValidationError);
  });

  it("rejects invalid production dates and negative volumes", () => {
    expect(() =>
      validateProductionMeasurement({
        production_measurement_id: "pm-001",
        well_id: "well-001",
        production_date: "06/17/2026",
        oil_volume: -1
      })
    ).toThrow(DomainValidationError);
  });

  it("accepts monthly production measurements with explicit volume units", () => {
    const measurement = validateProductionMeasurement({
      production_measurement_id: "argentina-capitulo-iv:well-001:2023-02",
      well_id: "well-001",
      production_date: "2023-02-28",
      period_start_date: "2023-02-01",
      period_end_date: "2023-02-28",
      period_granularity: "monthly",
      oil_volume: 62.8981077,
      oil_volume_unit: "bbl",
      gas_volume: 88.28666675,
      gas_volume_unit: "Mcf",
      water_volume: 18.86943231,
      water_volume_unit: "bbl",
      uptime_hours: 600,
      period_hours: 672,
      measurement_method: "reported",
      source: "argentina-capitulo-iv"
    });

    expect(measurement.period_granularity).toBe("monthly");
    expect(measurement.uptime_hours).toBe(600);
    expect(measurement.period_hours).toBe(672);
    expect(measurement.measurement_method).toBe("reported");
    expect(measurement.oil_volume_unit).toBe("bbl");
  });

  it("accepts deferments with ISO timestamps", () => {
    const deferment = validateDeferment({
      deferment_id: "def-001",
      well_id: "well-001",
      started_at: "2026-06-17T09:00:00Z",
      ended_at: "2026-06-17T18:00:00Z",
      category: "surface",
      status: "resolved"
    });

    expect(deferment.category).toBe("surface");
  });

  it("accepts opportunities with evidence references", () => {
    const opportunity = validateOpportunity({
      opportunity_id: "opp-001",
      well_id: "well-001",
      title: "Inspect rod pump after downtime",
      source: "manual",
      expected_oil_uplift: 18,
      estimated_cost: 6500,
      status: "proposed",
      evidence_refs: ["def-001"]
    });

    expect(opportunity satisfies Opportunity).toBe(opportunity);
    expect(opportunity.evidence_refs).toEqual(["def-001"]);
  });
});

describe("validateWithSchema", () => {
  it("can validate callers against exported schemas", () => {
    const well = validateWithSchema<Well>(wellSchema, {
      well_id: "well-001",
      field_id: "field-alpha",
      name: "Alpha-01",
      well_type: "producer",
      status: "producing"
    });

    expect(well.well_id).toBe("well-001");
  });

  it("includes schema error details on validation failure", () => {
    try {
      validateProductionMeasurement({
        production_measurement_id: "pm-001",
        well_id: "well-001",
        production_date: "2026-06-17",
        period_granularity: "weekly"
      });
    } catch (error) {
      expect(error).toBeInstanceOf(DomainValidationError);
      expect((error as DomainValidationError).issues[0]?.path).toBe("/period_granularity");
      return;
    }

    throw new Error("Expected validation failure");
  });

  it("keeps production measurement types available to downstream packages", () => {
    const measurement: ProductionMeasurement = {
      production_measurement_id: "pm-001",
      well_id: "well-001",
      production_date: "2026-06-17"
    };

    expect(measurement.well_id).toBe("well-001");
  });
});
