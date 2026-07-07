import { describe, expect, it } from "vitest";
import { previewCsvImport } from "./import-preview";

describe("previewCsvImport", () => {
  it("builds a wells preview with validated records and preserved source columns", () => {
    const preview = previewCsvImport(
      "wells",
      "well_id,field_id,name,well_type,status,source\n" +
        "well-001,field-alpha,Alpha-01,producer,producing,synthetic\n" +
        "well-002,field-alpha,Alpha-02,producer,producing,synthetic\n"
    );

    expect(preview.label).toBe("Wells");
    expect(preview.totalRows).toBe(2);
    expect(preview.sourceColumns).toEqual([
      "well_id",
      "field_id",
      "name",
      "well_type",
      "status",
      "source"
    ]);
    expect(preview.validRecords).toHaveLength(2);
    expect(preview.validRecords[0]?.rowNumber).toBe(2);
    expect(preview.validRecords[0]?.value).toMatchObject({
      well_id: "well-001",
      status: "producing"
    });
    expect(preview.errors).toEqual([]);
  });

  it("keeps valid production measurement rows when another row fails validation", () => {
    const preview = previewCsvImport(
      "production_measurements",
      "production_measurement_id,well_id,production_date,oil_volume,uptime_hours,source\n" +
        "pm-001,well-001,2026-06-17,51,15,synthetic\n" +
        "pm-002,well-001,2026-06-18,-1,24,synthetic\n"
    );

    expect(preview.label).toBe("Production measurements");
    expect(preview.totalRows).toBe(2);
    expect(preview.validRecords).toHaveLength(1);
    expect(preview.validRecords[0]?.value).toMatchObject({
      production_measurement_id: "pm-001",
      oil_volume: 51
    });
    expect(preview.errors).toHaveLength(1);
    expect(preview.errors[0]).toMatchObject({
      rowNumber: 3,
      source: {
        production_measurement_id: "pm-002",
        oil_volume: "-1"
      }
    });
    expect(preview.errors[0]?.message).toContain("Domain validation failed");
  });

  it("builds a deferments preview with row-level import errors", () => {
    const preview = previewCsvImport(
      "deferments",
      "deferment_id,well_id,started_at,category,estimated_oil_loss,status,source\n" +
        "def-001,well-001,2026-06-17T09:00:00Z,surface,31,resolved,synthetic\n" +
        "def-002,well-002,2026-06-17T10:00:00Z,bad_category,12,open,synthetic\n"
    );

    expect(preview.label).toBe("Deferments");
    expect(preview.validRecords).toHaveLength(1);
    expect(preview.errors).toHaveLength(1);
    expect(preview.errors[0]?.rowNumber).toBe(3);
  });
});
