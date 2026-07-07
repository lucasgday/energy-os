import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  importDefermentRows,
  importOpportunityRows,
  importProductionMeasurementRows,
  importWellRows
} from "@energy-os/data-import";
import type { Deferment, Opportunity, ProductionMeasurement, Well } from "@energy-os/domain";
import { calculateOpportunityEconomics, type OpportunityEconomics } from "@energy-os/economics";

export type ProductionReview = {
  field: {
    field_id: string;
    name: string;
    latestProductionDate: string;
    previousProductionDate: string;
    healthScore: number;
  };
  summary: {
    activeWells: number;
    openDeferments: number;
    rankedOpportunities: number;
    latestOilVolume: number;
    latestGasVolume: number;
    latestWaterVolume: number;
    averageUptimeHours: number;
    oilDelta: number;
    gasDelta: number;
    waterDelta: number;
  };
  assumptions: {
    upliftDurationDays: number;
    oilPriceUsdPerBbl: number;
    gasPriceUsdPerMcf: number;
    variableOilCostUsdPerBbl: number;
    variableGasCostUsdPerMcf: number;
  };
  wells: WellReview[];
  deferments: DefermentReview[];
  opportunities: OpportunityReview[];
  journal: DecisionJournalEntry[];
};

export type WellReview = Well & {
  statusLabel: string;
  latest: ProductionMeasurement;
  previous: ProductionMeasurement | undefined;
  oilDelta: number;
  gasDelta: number;
  waterDelta: number;
  uptimeDelta: number;
  openDeferments: number;
};

export type DefermentReview = Deferment & {
  wellName: string;
};

export type OpportunityReview = Opportunity & {
  wellName: string;
  economics: OpportunityEconomics;
  evidenceLabels: string[];
};

export type DecisionJournalEntry = {
  id: string;
  timestamp: string;
  decision: string;
  type: "Opportunity" | "Deferment";
  wellName: string;
  impactLabel: string;
  owner: string;
};

const ASSUMPTIONS = {
  upliftDurationDays: 30,
  oilPriceUsdPerBbl: 70,
  gasPriceUsdPerMcf: 3,
  variableOilCostUsdPerBbl: 10,
  variableGasCostUsdPerMcf: 0.5
} as const;

export function getProductionReview(): ProductionReview {
  const wells = loadWells();
  const productionMeasurements = loadProductionMeasurements();
  const deferments = loadDeferments();
  const opportunities = loadOpportunities();
  const dates = [
    ...new Set(productionMeasurements.map((measurement) => measurement.production_date))
  ].sort();
  const latestProductionDate = dates.at(-1);
  const previousProductionDate = dates.at(-2);

  if (latestProductionDate === undefined || previousProductionDate === undefined) {
    throw new Error("Synthetic production review requires at least two production dates");
  }

  const wellNameById = new Map(wells.map((well) => [well.well_id, well.name]));
  const latestMeasurements = productionMeasurements.filter(
    (measurement) => measurement.production_date === latestProductionDate
  );
  const previousMeasurements = productionMeasurements.filter(
    (measurement) => measurement.production_date === previousProductionDate
  );
  const previousByWell = new Map(
    previousMeasurements.map((measurement) => [measurement.well_id, measurement])
  );
  const openDeferments = deferments.filter((deferment) => deferment.status === "open");
  const activeWells = wells.filter((well) => well.status === "producing" || well.status === "injecting");
  const latestTotals = totalProduction(latestMeasurements);
  const previousTotals = totalProduction(previousMeasurements);
  const reviewedWells = wells.map((well) => {
    const latest = latestMeasurements.find((measurement) => measurement.well_id === well.well_id);

    if (latest === undefined) {
      throw new Error(`Missing latest production measurement for well "${well.well_id}"`);
    }

    const previous = previousByWell.get(well.well_id);

    return {
      ...well,
      statusLabel: statusLabel(well.status),
      latest,
      previous,
      oilDelta: valueDelta(latest.oil_volume, previous?.oil_volume),
      gasDelta: valueDelta(latest.gas_volume, previous?.gas_volume),
      waterDelta: valueDelta(latest.water_volume, previous?.water_volume),
      uptimeDelta: valueDelta(latest.uptime_hours, previous?.uptime_hours),
      openDeferments: openDeferments.filter((deferment) => deferment.well_id === well.well_id).length
    };
  });

  const reviewedDeferments = deferments.map((deferment) => ({
    ...deferment,
    wellName: wellNameById.get(deferment.well_id) ?? deferment.well_id
  }));
  const reviewedOpportunities = opportunities
    .map((opportunity) => toOpportunityReview(opportunity, wellNameById))
    .sort((left, right) => right.economics.netValueUsd - left.economics.netValueUsd);

  return {
    field: {
      field_id: "field-alpha",
      name: "Alpha Field",
      latestProductionDate,
      previousProductionDate,
      healthScore: fieldHealthScore(latestTotals.oil, previousTotals.oil, openDeferments.length)
    },
    summary: {
      activeWells: activeWells.length,
      openDeferments: openDeferments.length,
      rankedOpportunities: reviewedOpportunities.length,
      latestOilVolume: latestTotals.oil,
      latestGasVolume: latestTotals.gas,
      latestWaterVolume: latestTotals.water,
      averageUptimeHours: average(
        latestMeasurements.map((measurement) => measurement.uptime_hours ?? 0)
      ),
      oilDelta: latestTotals.oil - previousTotals.oil,
      gasDelta: latestTotals.gas - previousTotals.gas,
      waterDelta: latestTotals.water - previousTotals.water
    },
    assumptions: ASSUMPTIONS,
    wells: reviewedWells,
    deferments: reviewedDeferments,
    opportunities: reviewedOpportunities,
    journal: toDecisionJournal(reviewedOpportunities, reviewedDeferments)
  };
}

function loadWells(): Well[] {
  return importWellRows(readDatasetFile("wells.csv")).map((record) => record.value);
}

function loadProductionMeasurements(): ProductionMeasurement[] {
  return importProductionMeasurementRows(readDatasetFile("production_measurements.csv")).map((record) => record.value);
}

function loadDeferments(): Deferment[] {
  return importDefermentRows(readDatasetFile("deferments.csv")).map((record) => record.value);
}

function loadOpportunities(): Opportunity[] {
  return importOpportunityRows(readDatasetFile("opportunities.csv")).map((record) => record.value);
}

function readDatasetFile(fileName: string): string {
  return readFileSync(join(datasetDirectory(), fileName), "utf8");
}

function datasetDirectory(): string {
  const rootDataset = join(process.cwd(), "datasets", "synthetic-field-v0");

  if (existsSync(rootDataset)) {
    return rootDataset;
  }

  return join(process.cwd(), "..", "..", "datasets", "synthetic-field-v0");
}

function totalProduction(
  measurements: ProductionMeasurement[]
): { oil: number; gas: number; water: number } {
  return measurements.reduce(
    (total, measurement) => ({
      oil: total.oil + (measurement.oil_volume ?? 0),
      gas: total.gas + (measurement.gas_volume ?? 0),
      water: total.water + (measurement.water_volume ?? 0)
    }),
    { oil: 0, gas: 0, water: 0 }
  );
}

function valueDelta(latest: number | undefined, previous: number | undefined): number {
  return (latest ?? 0) - (previous ?? 0);
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function statusLabel(status: Well["status"]): string {
  const labels: Record<Well["status"], string> = {
    abandoned: "Abandoned",
    injecting: "Injecting",
    planned: "Planned",
    producing: "Producing",
    shut_in: "Shut in",
    unknown: "Unknown"
  };

  return labels[status];
}

function fieldHealthScore(latestOil: number, previousOil: number, openDeferments: number): number {
  const oilPenalty = Math.max(0, previousOil - latestOil) / Math.max(previousOil, 1);
  const defermentPenalty = openDeferments * 8;
  return Math.max(0, Math.round(86 - oilPenalty * 100 - defermentPenalty));
}

function toOpportunityReview(
  opportunity: Opportunity,
  wellNameById: Map<string, string>
): OpportunityReview {
  const economics = calculateOpportunityEconomics({
    ...(opportunity.expected_oil_uplift === undefined
      ? {}
      : { expectedOilUpliftBblPerDay: opportunity.expected_oil_uplift }),
    ...(opportunity.expected_gas_uplift === undefined
      ? {}
      : { expectedGasUpliftMcfPerDay: opportunity.expected_gas_uplift }),
    upliftDurationDays: ASSUMPTIONS.upliftDurationDays,
    oilPriceUsdPerBbl: ASSUMPTIONS.oilPriceUsdPerBbl,
    gasPriceUsdPerMcf: ASSUMPTIONS.gasPriceUsdPerMcf,
    variableOilCostUsdPerBbl: ASSUMPTIONS.variableOilCostUsdPerBbl,
    variableGasCostUsdPerMcf: ASSUMPTIONS.variableGasCostUsdPerMcf,
    interventionCostUsd: opportunity.estimated_cost ?? 0
  });

  return {
    ...opportunity,
    wellName: wellNameById.get(opportunity.well_id) ?? opportunity.well_id,
    economics,
    evidenceLabels: opportunity.evidence_refs ?? []
  };
}

function toDecisionJournal(
  opportunities: OpportunityReview[],
  deferments: DefermentReview[]
): DecisionJournalEntry[] {
  const opportunityEntries = opportunities.map((opportunity, index) => ({
    id: `journal-${opportunity.opportunity_id}`,
    timestamp: `2026-06-17 ${String(9 + index).padStart(2, "0")}:00`,
    decision: opportunity.title,
    type: "Opportunity" as const,
    wellName: opportunity.wellName,
    impactLabel: `+$${Math.round(opportunity.economics.netValueUsd).toLocaleString("en-US")} net`,
    owner: "PE"
  }));
  const defermentEntries = deferments.map((deferment, index) => ({
    id: `journal-${deferment.deferment_id}`,
    timestamp: `2026-06-17 ${String(13 + index).padStart(2, "0")}:30`,
    decision: deferment.cause ?? `Review ${deferment.category} deferment`,
    type: "Deferment" as const,
    wellName: deferment.wellName,
    impactLabel: `-${deferment.estimated_oil_loss ?? 0} bbl oil`,
    owner: "PE"
  }));

  return [...opportunityEntries, ...defermentEntries];
}
