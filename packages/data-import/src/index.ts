import { parse } from "csv-parse/sync";

export type CsvRow = Record<string, string>;

export function parseCsvRows(csv: string): CsvRow[] {
  return parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as CsvRow[];
}

export function toNumber(value: string | undefined): number | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Expected numeric value, received "${value}"`);
  }

  return parsed;
}

export function requireString(row: CsvRow, field: string): string {
  const value = row[field];

  if (value === undefined || value === "") {
    throw new Error(`Missing required field "${field}"`);
  }

  return value;
}
