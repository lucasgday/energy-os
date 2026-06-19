import { describe, expect, it } from "vitest";
import {
  DomainValidationError,
  validateDeferment,
  validateOpportunity,
  validateProductionEvent,
  validateWell,
  validateWithSchema,
  wellSchema,
  type Opportunity,
  type ProductionEvent,
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
      validateProductionEvent({
        production_event_id: "pe-001",
        well_id: "well-001",
        production_date: "06/17/2026",
        oil_volume: -1
      })
    ).toThrow(DomainValidationError);
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
      validateProductionEvent({
        production_event_id: "pe-001",
        well_id: "well-001",
        production_date: "2026-06-17",
        uptime_hours: 25
      });
    } catch (error) {
      expect(error).toBeInstanceOf(DomainValidationError);
      expect((error as DomainValidationError).issues[0]?.path).toBe("/uptime_hours");
      return;
    }

    throw new Error("Expected validation failure");
  });

  it("keeps production event types available to downstream packages", () => {
    const event: ProductionEvent = {
      production_event_id: "pe-001",
      well_id: "well-001",
      production_date: "2026-06-17"
    };

    expect(event.well_id).toBe("well-001");
  });
});
