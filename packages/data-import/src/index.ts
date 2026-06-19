import {
  validateDeferment,
  validateOpportunity,
  validateProductionEvent,
  validateWell,
  type Deferment,
  type Opportunity,
  type ProductionEvent,
  type SurfaceLocation,
  type Well
} from "@energy-os/domain";
import { parse } from "csv-parse/sync";

export type CsvRow = Record<string, string>;

export type ImportedRecord<T> = {
  source: CsvRow;
  value: T;
};

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

export function mapProductionEventRow(row: CsvRow): ProductionEvent {
  return validateProductionEvent(
    omitUndefined({
      production_event_id: requireString(row, "production_event_id"),
      well_id: requireString(row, "well_id"),
      production_date: requireString(row, "production_date"),
      oil_volume: toNumber(row.oil_volume),
      gas_volume: toNumber(row.gas_volume),
      water_volume: toNumber(row.water_volume),
      uptime_hours: toNumber(row.uptime_hours),
      period_hours: toNumber(row.period_hours),
      measurement_method: optionalString(row, "measurement_method"),
      source: optionalString(row, "source")
    })
  );
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

export function importProductionEventRows(csv: string): ImportedRecord<ProductionEvent>[] {
  return importRows(csv, mapProductionEventRow);
}

export function importDefermentRows(csv: string): ImportedRecord<Deferment>[] {
  return importRows(csv, mapDefermentRow);
}

export function importOpportunityRows(csv: string): ImportedRecord<Opportunity>[] {
  return importRows(csv, mapOpportunityRow);
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
