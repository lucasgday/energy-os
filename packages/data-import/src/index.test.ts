import { describe, expect, it } from "vitest";
import { DomainValidationError } from "@energy-os/domain";
import {
  importDefermentRows,
  importOpportunityRows,
  importProductionEventRows,
  importWellRows,
  parseCsvRows,
  requireString,
  toNumber
} from "./index";

describe("parseCsvRows", () => {
  it("parses CSV rows with headers and preserves source column names", () => {
    const rows = parseCsvRows("well_id,yacimiento,oil_volume\nwell-001,Alpha Field,82\n");

    expect(rows).toEqual([
      {
        well_id: "well-001",
        yacimiento: "Alpha Field",
        oil_volume: "82"
      }
    ]);
  });

  it("trims surrounding whitespace without changing source keys", () => {
    const rows = parseCsvRows("well_id,source\n well-001 , synthetic \n");

    expect(rows).toEqual([{ well_id: "well-001", source: "synthetic" }]);
  });
});

describe("toNumber", () => {
  it("converts numeric strings", () => {
    expect(toNumber("42")).toBe(42);
    expect(toNumber("3.14")).toBe(3.14);
  });

  it("keeps blank values undefined", () => {
    expect(toNumber("")).toBeUndefined();
    expect(toNumber(undefined)).toBeUndefined();
  });

  it("rejects non-numeric values", () => {
    expect(() => toNumber("not-a-number")).toThrow('Expected numeric value, received "not-a-number"');
  });
});

describe("requireString", () => {
  it("returns present string values", () => {
    expect(requireString({ well_id: "well-001" }, "well_id")).toBe("well-001");
    expect(requireString({ well_id: " well-001 " }, "well_id")).toBe("well-001");
  });

  it("throws for missing required values", () => {
    expect(() => requireString({}, "well_id")).toThrow('Missing required field "well_id"');
    expect(() => requireString({ well_id: "" }, "well_id")).toThrow('Missing required field "well_id"');
    expect(() => requireString({ well_id: "   " }, "well_id")).toThrow(
      'Missing required field "well_id"'
    );
  });
});

describe("domain CSV import helpers", () => {
  it("imports wells as validated domain values while preserving source rows", () => {
    const [record] = importWellRows(
      "well_id,field_id,name,well_type,status,artificial_lift_type,target_formation,source\n" +
        "well-001,field-alpha,Alpha-01,producer,producing,rod_pump,Sand A,synthetic\n"
    );

    expect(record?.source.artificial_lift_type).toBe("rod_pump");
    expect(record?.value).toEqual({
      well_id: "well-001",
      field_id: "field-alpha",
      name: "Alpha-01",
      well_type: "producer",
      status: "producing",
      artificial_lift_type: "rod_pump",
      target_formation: "Sand A",
      source: "synthetic"
    });
  });

  it("imports production events with numeric conversions and domain validation", () => {
    const [record] = importProductionEventRows(
      "production_event_id,well_id,production_date,oil_volume,gas_volume,water_volume,uptime_hours,period_hours,measurement_method,source\n" +
        "pe-001,well-001,2026-06-17,51,260,128,15,24,allocated,synthetic\n"
    );

    expect(record?.value.oil_volume).toBe(51);
    expect(record?.value.gas_volume).toBe(260);
    expect(record?.value.uptime_hours).toBe(15);
  });

  it("imports deferments and omits blank optional timestamps", () => {
    const [record] = importDefermentRows(
      "deferment_id,well_id,started_at,ended_at,category,cause,estimated_oil_loss,estimated_gas_loss,status,source\n" +
        "def-002,well-003,2026-06-15T00:00:00Z,,subsurface,Shut-in pending review,45,210,open,synthetic\n"
    );

    expect(record?.value.ended_at).toBeUndefined();
    expect(record?.value.estimated_oil_loss).toBe(45);
    expect(record?.value.category).toBe("subsurface");
  });

  it("imports opportunities with list-valued evidence refs", () => {
    const [record] = importOpportunityRows(
      "opportunity_id,well_id,title,source,hypothesis,expected_oil_uplift,expected_gas_uplift,estimated_cost,estimated_payout_days,status,evidence_refs\n" +
        "opp-001,well-001,Inspect rod pump after downtime,manual,Recent downtime caused material production loss,18,90,6500,6,proposed,def-001; pe-003\n"
    );

    expect(record?.value.evidence_refs).toEqual(["def-001", "pe-003"]);
    expect(record?.value.estimated_cost).toBe(6500);
  });

  it("rejects rows that map outside the Energy OS domain schema", () => {
    expect(() =>
      importProductionEventRows(
        "production_event_id,well_id,production_date,oil_volume,uptime_hours\n" +
          "pe-001,well-001,2026-06-17,-1,25\n"
      )
    ).toThrow(DomainValidationError);

    expect(() =>
      importWellRows("well_id,field_id,name,well_type,status\nwell-001,field-alpha,Alpha-01,producer,flowing\n")
    ).toThrow(DomainValidationError);
  });
});
