export const wellSchema = {
  $id: "https://energy-os.org/schemas/wells.schema.json",
  title: "Well",
  type: "object",
  additionalProperties: false,
  required: ["well_id", "field_id", "name", "well_type", "status"],
  properties: {
    well_id: { type: "string", minLength: 1 },
    field_id: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1 },
    well_type: {
      type: "string",
      enum: ["producer", "injector", "monitor", "disposal", "other"]
    },
    status: {
      type: "string",
      enum: ["producing", "injecting", "shut_in", "abandoned", "planned", "unknown"]
    },
    country: { type: "string" },
    basin: { type: "string" },
    target_formation: { type: "string" },
    artificial_lift_type: {
      type: "string",
      enum: ["none", "rod_pump", "esp", "gas_lift", "pcp", "jet_pump", "plunger_lift", "unknown"]
    },
    spud_date: { type: "string", format: "date" },
    first_production_date: { type: "string", format: "date" },
    surface_location: {
      type: "object",
      additionalProperties: false,
      properties: {
        latitude: { type: "number", minimum: -90, maximum: 90 },
        longitude: { type: "number", minimum: -180, maximum: 180 }
      }
    },
    source: { type: "string" }
  }
} as const;

export const productionMeasurementSchema = {
  $id: "https://energy-os.org/schemas/production-measurements.schema.json",
  title: "Production Measurement",
  type: "object",
  additionalProperties: false,
  required: ["production_measurement_id", "well_id", "production_date"],
  properties: {
    production_measurement_id: { type: "string", minLength: 1 },
    well_id: { type: "string", minLength: 1 },
    production_date: { type: "string", format: "date" },
    period_start_date: { type: "string", format: "date" },
    period_end_date: { type: "string", format: "date" },
    period_granularity: {
      type: "string",
      enum: ["daily", "monthly", "periodic", "unknown"]
    },
    oil_volume: { type: "number", minimum: 0 },
    oil_volume_unit: {
      type: "string",
      enum: ["bbl", "m3"]
    },
    gas_volume: { type: "number", minimum: 0 },
    gas_volume_unit: {
      type: "string",
      enum: ["Mcf", "thousand_m3"]
    },
    water_volume: { type: "number", minimum: 0 },
    water_volume_unit: {
      type: "string",
      enum: ["bbl", "m3"]
    },
    uptime_hours: { type: "number", minimum: 0 },
    period_hours: { type: "number", minimum: 0 },
    measurement_method: {
      type: "string",
      enum: ["metered", "allocated", "reported", "estimated", "manual", "unknown"]
    },
    source: { type: "string" }
  }
} as const;

export const defermentSchema = {
  $id: "https://energy-os.org/schemas/deferments.schema.json",
  title: "Deferment",
  type: "object",
  additionalProperties: false,
  required: ["deferment_id", "well_id", "started_at", "category", "status"],
  properties: {
    deferment_id: { type: "string", minLength: 1 },
    well_id: { type: "string", minLength: 1 },
    started_at: { type: "string", format: "date-time" },
    ended_at: { type: "string", format: "date-time" },
    category: {
      type: "string",
      enum: ["surface", "subsurface", "facility", "power", "market", "weather", "planned", "unknown"]
    },
    cause: { type: "string" },
    estimated_oil_loss: { type: "number", minimum: 0 },
    estimated_gas_loss: { type: "number", minimum: 0 },
    status: {
      type: "string",
      enum: ["open", "resolved", "reviewed", "dismissed"]
    },
    source: { type: "string" }
  }
} as const;

export const opportunitySchema = {
  $id: "https://energy-os.org/schemas/opportunities.schema.json",
  title: "Opportunity",
  type: "object",
  additionalProperties: false,
  required: ["opportunity_id", "well_id", "title", "source", "status"],
  properties: {
    opportunity_id: { type: "string", minLength: 1 },
    well_id: { type: "string", minLength: 1 },
    title: { type: "string", minLength: 1 },
    source: {
      type: "string",
      enum: ["manual", "rule", "model", "imported"]
    },
    hypothesis: { type: "string" },
    expected_oil_uplift: { type: "number", minimum: 0 },
    expected_gas_uplift: { type: "number", minimum: 0 },
    estimated_cost: { type: "number", minimum: 0 },
    estimated_payout_days: { type: "number", minimum: 0 },
    status: {
      type: "string",
      enum: ["proposed", "reviewed", "approved", "rejected", "executed", "measured"]
    },
    evidence_refs: {
      type: "array",
      items: { type: "string" }
    }
  }
} as const;
