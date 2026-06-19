import { describe, expect, it } from "vitest";
import { parseCsvRows, requireString, toNumber } from "./index";

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
  });

  it("throws for missing required values", () => {
    expect(() => requireString({}, "well_id")).toThrow('Missing required field "well_id"');
    expect(() => requireString({ well_id: "" }, "well_id")).toThrow('Missing required field "well_id"');
  });
});
