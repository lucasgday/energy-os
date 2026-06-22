import {
  mapDefermentRow,
  mapProductionEventRow,
  mapWellRow,
  parseCsvRows,
  type CsvRow
} from "@energy-os/data-import";
import type { Deferment, ProductionEvent, Well } from "@energy-os/domain";

export type ImportEntityType = "wells" | "production_events" | "deferments";

export type ImportPreviewValue = Well | ProductionEvent | Deferment;

export type ImportPreviewRecord = {
  rowNumber: number;
  source: CsvRow;
  value: ImportPreviewValue;
};

export type ImportPreviewError = {
  rowNumber: number;
  source: CsvRow;
  message: string;
};

export type ImportPreview = {
  entityType: ImportEntityType;
  label: string;
  sourceColumns: string[];
  totalRows: number;
  validRecords: ImportPreviewRecord[];
  errors: ImportPreviewError[];
};

type ImportConfig = {
  label: string;
  mapRow: (row: CsvRow) => ImportPreviewValue;
};

const importConfigs: Record<ImportEntityType, ImportConfig> = {
  wells: {
    label: "Wells",
    mapRow: mapWellRow
  },
  production_events: {
    label: "Production events",
    mapRow: mapProductionEventRow
  },
  deferments: {
    label: "Deferments",
    mapRow: mapDefermentRow
  }
};

export function previewCsvImport(entityType: ImportEntityType, csv: string): ImportPreview {
  const config = importConfigs[entityType];
  const rows = parseCsvRows(csv);
  const validRecords: ImportPreviewRecord[] = [];
  const errors: ImportPreviewError[] = [];

  rows.forEach((source, index) => {
    const rowNumber = index + 2;

    try {
      validRecords.push({
        rowNumber,
        source,
        value: config.mapRow(source)
      });
    } catch (error) {
      errors.push({
        rowNumber,
        source,
        message: error instanceof Error ? error.message : "Unknown import error"
      });
    }
  });

  return {
    entityType,
    label: config.label,
    sourceColumns: rows[0] === undefined ? [] : Object.keys(rows[0]),
    totalRows: rows.length,
    validRecords,
    errors
  };
}
