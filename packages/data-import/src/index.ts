import {
  validateDeferment,
  validateOpportunity,
  validateProductionMeasurement,
  validateWell,
  type Deferment,
  type GasVolumeUnit,
  type LiquidVolumeUnit,
  type Opportunity,
  type ProductionMeasurement,
  type SurfaceLocation,
  type Well
} from "@energy-os/domain";
import { parse } from "csv-parse/sync";

export type CsvRow = Record<string, string>;

export type ImportedRecord<T> = {
  source: CsvRow;
  value: T;
};

export type UnitSystemPreference = "field" | "metric";

export type ProductionVolumeFluid = "oil" | "gas" | "water";

export type ProductionVolumeDisplay = {
  value: number;
  unit: LiquidVolumeUnit | GasVolumeUnit;
};

export const CUBIC_METERS_TO_BARRELS = 6.28981077;
export const THOUSAND_CUBIC_METERS_TO_MCF = 35.3146667;

export function parseCsvRows(csv: string): CsvRow[] {
  return parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as CsvRow[];
}

export function toNumber(value: string | undefined): number | undefined {
  const normalizedValue = value?.trim();

  if (normalizedValue === undefined || normalizedValue === "") {
    return undefined;
  }

  const parsed = Number(normalizedValue);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Expected numeric value, received "${value}"`);
  }

  return parsed;
}

export function requireString(row: CsvRow, field: string): string {
  const value = row[field]?.trim();

  if (value === undefined || value === "") {
    throw new Error(`Missing required field "${field}"`);
  }

  return value;
}

export function mapWellRow(row: CsvRow): Well {
  return validateWell(
    omitUndefined({
      well_id: requireString(row, "well_id"),
      field_id: requireString(row, "field_id"),
      name: requireString(row, "name"),
      well_type: requireString(row, "well_type"),
      status: requireString(row, "status"),
      country: optionalString(row, "country"),
      basin: optionalString(row, "basin"),
      target_formation: optionalString(row, "target_formation"),
      artificial_lift_type: optionalString(row, "artificial_lift_type"),
      spud_date: optionalString(row, "spud_date"),
      first_production_date: optionalString(row, "first_production_date"),
      surface_location: surfaceLocationFromRow(row),
      source: optionalString(row, "source")
    })
  );
}

export function mapProductionMeasurementRow(row: CsvRow): ProductionMeasurement {
  return validateProductionMeasurement(
    omitUndefined({
      production_measurement_id: requireString(row, "production_measurement_id"),
      well_id: requireString(row, "well_id"),
      production_date: requireString(row, "production_date"),
      period_start_date: optionalString(row, "period_start_date"),
      period_end_date: optionalString(row, "period_end_date"),
      period_granularity: optionalString(row, "period_granularity"),
      oil_volume: toNumber(row.oil_volume),
      oil_volume_unit: optionalString(row, "oil_volume_unit"),
      gas_volume: toNumber(row.gas_volume),
      gas_volume_unit: optionalString(row, "gas_volume_unit"),
      water_volume: toNumber(row.water_volume),
      water_volume_unit: optionalString(row, "water_volume_unit"),
      uptime_hours: toNumber(row.uptime_hours),
      period_hours: toNumber(row.period_hours),
      measurement_method: optionalString(row, "measurement_method"),
      source: optionalString(row, "source")
    })
  );
}

export function mapArgentinaCapituloIvProductionMeasurementRow(row: CsvRow): ProductionMeasurement {
  const wellId = requireStringFromAliases(row, ["idpozo", "pozo", "well_id"]);
  const year = requireIntegerFromAliases(row, ["anio", "year"], 1900, 2200);
  const month = requireIntegerFromAliases(row, ["mes", "month"], 1, 12);
  const oilCubicMeters = requireNumberFromAliases(row, ["prod_pet", "petroleo_m3", "oil_m3"]);
  const gasThousandCubicMeters = requireNumberFromAliases(row, [
    "prod_gas",
    "gas_miles_m3",
    "gas_thousand_m3"
  ]);
  const waterCubicMeters = requireNumberFromAliases(row, ["prod_agua", "agua_m3", "water_m3"]);
  const monthLabel = `${year}-${String(month).padStart(2, "0")}`;
  const lastDay = lastDayOfMonth(year, month);

  return validateProductionMeasurement({
    production_measurement_id: `argentina-capitulo-iv:${wellId}:${monthLabel}`,
    well_id: wellId,
    production_date: formatDate(year, month, lastDay),
    period_start_date: formatDate(year, month, 1),
    period_end_date: formatDate(year, month, lastDay),
    period_granularity: "monthly",
    oil_volume: oilCubicMeters * CUBIC_METERS_TO_BARRELS,
    oil_volume_unit: "bbl",
    gas_volume: gasThousandCubicMeters * THOUSAND_CUBIC_METERS_TO_MCF,
    gas_volume_unit: "Mcf",
    water_volume: waterCubicMeters * CUBIC_METERS_TO_BARRELS,
    water_volume_unit: "bbl",
    period_hours: lastDay * 24,
    measurement_method: "unknown",
    source: "argentina-capitulo-iv"
  });
}

export function mapDefermentRow(row: CsvRow): Deferment {
  return validateDeferment(
    omitUndefined({
      deferment_id: requireString(row, "deferment_id"),
      well_id: requireString(row, "well_id"),
      started_at: requireString(row, "started_at"),
      ended_at: optionalString(row, "ended_at"),
      category: requireString(row, "category"),
      cause: optionalString(row, "cause"),
      estimated_oil_loss: toNumber(row.estimated_oil_loss),
      estimated_gas_loss: toNumber(row.estimated_gas_loss),
      status: requireString(row, "status"),
      source: optionalString(row, "source")
    })
  );
}

export function mapOpportunityRow(row: CsvRow): Opportunity {
  return validateOpportunity(
    omitUndefined({
      opportunity_id: requireString(row, "opportunity_id"),
      well_id: requireString(row, "well_id"),
      title: requireString(row, "title"),
      source: requireString(row, "source"),
      hypothesis: optionalString(row, "hypothesis"),
      expected_oil_uplift: toNumber(row.expected_oil_uplift),
      expected_gas_uplift: toNumber(row.expected_gas_uplift),
      estimated_cost: toNumber(row.estimated_cost),
      estimated_payout_days: toNumber(row.estimated_payout_days),
      status: requireString(row, "status"),
      evidence_refs: toStringList(row.evidence_refs)
    })
  );
}

export function importWellRows(csv: string): ImportedRecord<Well>[] {
  return importRows(csv, mapWellRow);
}

export function importProductionMeasurementRows(csv: string): ImportedRecord<ProductionMeasurement>[] {
  return importRows(csv, mapProductionMeasurementRow);
}

export function importArgentinaCapituloIvProductionMeasurementRows(
  csv: string
): ImportedRecord<ProductionMeasurement>[] {
  return importRows(csv, mapArgentinaCapituloIvProductionMeasurementRow);
}

export function importDefermentRows(csv: string): ImportedRecord<Deferment>[] {
  return importRows(csv, mapDefermentRow);
}

export function importOpportunityRows(csv: string): ImportedRecord<Opportunity>[] {
  return importRows(csv, mapOpportunityRow);
}

export function toDisplayProductionVolume(
  fluid: ProductionVolumeFluid,
  canonicalValue: number,
  unitSystem: UnitSystemPreference
): ProductionVolumeDisplay {
  if (fluid === "gas") {
    return unitSystem === "metric"
      ? { value: canonicalValue / THOUSAND_CUBIC_METERS_TO_MCF, unit: "thousand_m3" }
      : { value: canonicalValue, unit: "Mcf" };
  }

  return unitSystem === "metric"
    ? { value: canonicalValue / CUBIC_METERS_TO_BARRELS, unit: "m3" }
    : { value: canonicalValue, unit: "bbl" };
}

function importRows<T>(csv: string, mapper: (row: CsvRow) => T): ImportedRecord<T>[] {
  return parseCsvRows(csv).map((source) => ({
    source,
    value: mapper(source)
  }));
}

function optionalString(row: CsvRow, field: string): string | undefined {
  const value = row[field]?.trim();
  return value === undefined || value === "" ? undefined : value;
}

function requireStringFromAliases(row: CsvRow, fields: string[]): string {
  for (const field of fields) {
    const value = row[field]?.trim();
    if (value !== undefined && value !== "") {
      return value;
    }
  }

  throw new Error(`Missing required field "${fields.join('" or "')}"`);
}

function requireNumberFromAliases(row: CsvRow, fields: string[]): number {
  const value = toNumber(requireStringFromAliases(row, fields));

  if (value === undefined) {
    throw new Error(`Missing required numeric field "${fields.join('" or "')}"`);
  }

  return value;
}

function requireIntegerFromAliases(
  row: CsvRow,
  fields: string[],
  minimum: number,
  maximum: number
): number {
  const value = requireNumberFromAliases(row, fields);

  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(
      `Expected integer field "${fields.join('" or "')}" between ${minimum} and ${maximum}`
    );
  }

  return value;
}

function lastDayOfMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function surfaceLocationFromRow(row: CsvRow): SurfaceLocation | undefined {
  const latitude = toNumber(row.latitude ?? row.surface_latitude);
  const longitude = toNumber(row.longitude ?? row.surface_longitude);

  if (latitude === undefined && longitude === undefined) {
    return undefined;
  }

  return omitUndefined({ latitude, longitude }) as SurfaceLocation;
}

function toStringList(value: string | undefined): string[] | undefined {
  const normalizedValue = value?.trim();

  if (normalizedValue === undefined || normalizedValue === "") {
    return undefined;
  }

  const values = normalizedValue
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter((item) => item !== "");

  return values.length > 0 ? values : undefined;
}

function omitUndefined(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined)
  );
}
