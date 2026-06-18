# Product Blueprint

## Product

Energy OS begins as an upstream production operations workspace for teams that manage wells, production losses, interventions, and economic decisions.

The first version should be useful to a production engineer preparing and running a daily production meeting.

## Primary Users

- Production engineer.
- Operations manager.
- Field superintendent.
- Reservoir or production analyst.
- Independent operator leadership.

## Core Workflow

1. Load well, production, deferment, and cost data.
2. Review field-level production changes.
3. Identify wells with material variance or downtime.
4. Classify deferments and operational events.
5. Generate or manually create opportunities.
6. Estimate economics for each opportunity.
7. Review, approve, reject, or execute decisions.
8. Track actual outcome against expected uplift.

## Product Modules

### Asset Model

Tracks fields, wells, completions, equipment, and operating status. This module gives every event and decision a stable asset reference.

### Production Surveillance

Shows production trends, variance, downtime, and anomalies. The first version should support daily oil, gas, water, and uptime data.

### Deferment Management

Captures production losses, cause categories, time windows, affected wells, estimated volume impact, and resolution status.

### Opportunity Ranking

Creates a prioritized queue of operational actions. An opportunity can come from manual entry, anomaly detection, recurring rules, or future models.

### Economics

Calculates simple expected value using estimated uplift, duration, commodity price assumptions, operating cost, intervention cost, and payout.

### Decision Journal

Records recommendation, evidence, assumptions, reviewer, approval status, execution status, and measured result. This is central to trust.

### Reporting

Produces daily and weekly summaries for production meetings, leadership review, and external exports.

## Open Source Core

- Domain model.
- Synthetic datasets.
- Basic importers.
- Production and deferment dashboards.
- Simple economics.
- Decision journal.
- API contracts.

## Commercial Surface

- Hosted SaaS.
- Private cloud or self-hosted support.
- Enterprise connectors.
- Advanced diagnostics.
- Role-based controls and compliance workflows.
- Implementation and support.

## Trust Principles

- Every recommendation must link to data and assumptions.
- Human review stays in the workflow.
- The system should preserve original values and avoid silent cleanup that changes meaning.
- Real data must never be required to contribute publicly.
- Safety-critical workflows require explicit review before they enter scope.

## Prototype Direction

The first prototype is hybrid: local-first for public contribution and SaaS-ready by architecture. It should run with synthetic data and no external services, while keeping domain logic, economics, import validation, and storage boundaries outside the web UI.
