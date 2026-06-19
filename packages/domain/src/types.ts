export type WellType = "producer" | "injector" | "monitor" | "disposal" | "other";

export type WellStatus =
  | "producing"
  | "injecting"
  | "shut_in"
  | "abandoned"
  | "planned"
  | "unknown";

export type ArtificialLiftType =
  | "none"
  | "rod_pump"
  | "esp"
  | "gas_lift"
  | "pcp"
  | "jet_pump"
  | "plunger_lift"
  | "unknown";

export type SurfaceLocation = {
  latitude?: number;
  longitude?: number;
};

export type Well = {
  well_id: string;
  field_id: string;
  name: string;
  well_type: WellType;
  status: WellStatus;
  country?: string;
  basin?: string;
  target_formation?: string;
  artificial_lift_type?: ArtificialLiftType;
  spud_date?: string;
  first_production_date?: string;
  surface_location?: SurfaceLocation;
  source?: string;
};

export type MeasurementMethod = "metered" | "allocated" | "estimated" | "manual" | "unknown";

export type ProductionEvent = {
  production_event_id: string;
  well_id: string;
  production_date: string;
  oil_volume?: number;
  gas_volume?: number;
  water_volume?: number;
  uptime_hours?: number;
  period_hours?: number;
  measurement_method?: MeasurementMethod;
  source?: string;
};

export type DefermentCategory =
  | "surface"
  | "subsurface"
  | "facility"
  | "power"
  | "market"
  | "weather"
  | "planned"
  | "unknown";

export type DefermentStatus = "open" | "resolved" | "reviewed" | "dismissed";

export type Deferment = {
  deferment_id: string;
  well_id: string;
  started_at: string;
  ended_at?: string;
  category: DefermentCategory;
  cause?: string;
  estimated_oil_loss?: number;
  estimated_gas_loss?: number;
  status: DefermentStatus;
  source?: string;
};

export type OpportunitySource = "manual" | "rule" | "model" | "imported";

export type OpportunityStatus =
  | "proposed"
  | "reviewed"
  | "approved"
  | "rejected"
  | "executed"
  | "measured";

export type Opportunity = {
  opportunity_id: string;
  well_id: string;
  title: string;
  source: OpportunitySource;
  hypothesis?: string;
  expected_oil_uplift?: number;
  expected_gas_uplift?: number;
  estimated_cost?: number;
  estimated_payout_days?: number;
  status: OpportunityStatus;
  evidence_refs?: string[];
};
