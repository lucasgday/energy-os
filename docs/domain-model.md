# Domain Model

This is the first-pass domain model for Energy OS. It favors operational clarity over completeness.

## Entities

### Field

A producing asset or operating area.

Important attributes:

- `field_id`
- `name`
- `country`
- `basin`
- `operator`
- `timezone`

### Well

A producing, injecting, shut-in, or abandoned well.

Important attributes:

- `well_id`
- `field_id`
- `name`
- `well_type`
- `status`
- `surface_location`
- `target_formation`
- `artificial_lift_type`
- `spud_date`
- `first_production_date`

### Completion

A producing or injecting interval associated with a well.

Important attributes:

- `completion_id`
- `well_id`
- `formation`
- `top_depth`
- `bottom_depth`
- `status`

### Production Measurement

Measured or reported production for one well over one explicit production period. The period can be daily, monthly, or periodic.

A production measurement answers: what did this well produce during this period?

It is not a downtime cause, intervention, recommendation, sale, or invoice.

Important attributes:

- `production_measurement_id`
- `well_id`
- `production_date`
- `period_start_date`
- `period_end_date`
- `period_granularity`
- `oil_volume`
- `oil_volume_unit`
- `gas_volume`
- `gas_volume_unit`
- `water_volume`
- `water_volume_unit`
- `uptime_hours`
- `period_hours`
- `source`

### Deferment

A production loss or downtime event.

Important attributes:

- `deferment_id`
- `well_id`
- `started_at`
- `ended_at`
- `category`
- `cause`
- `estimated_oil_loss`
- `estimated_gas_loss`
- `status`

### Intervention

A completed, planned, or proposed physical action on a well.

Important attributes:

- `intervention_id`
- `well_id`
- `type`
- `planned_start`
- `actual_start`
- `actual_end`
- `estimated_cost`
- `actual_cost`
- `status`

### Opportunity

A potential operating action with expected impact.

Important attributes:

- `opportunity_id`
- `well_id`
- `title`
- `source`
- `hypothesis`
- `expected_oil_uplift`
- `expected_gas_uplift`
- `estimated_cost`
- `estimated_payout_days`
- `status`

### Decision

An auditable record of a recommendation and its review.

Important attributes:

- `decision_id`
- `opportunity_id`
- `recommendation`
- `evidence_refs`
- `assumptions`
- `reviewer`
- `decision_status`
- `decided_at`
- `result_summary`

## Relationships

- A field has many wells.
- A well has zero or more completions.
- A well has many production measurements.
- A well has many deferments.
- A well has many interventions.
- A well has many opportunities.
- An opportunity can have zero or more decisions.
- A decision must keep evidence references and assumptions.

## Design Notes

- The model should keep original imported values where practical.
- Normalized values can be added, but should not destroy source context.
- Synthetic data should use realistic patterns without representing a real asset.
- Schema evolution should be explicit and documented.
