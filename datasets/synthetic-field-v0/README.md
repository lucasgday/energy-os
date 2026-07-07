# Synthetic Field V0

This directory contains the first synthetic field dataset for Energy OS.

The dataset is intentionally small. It is designed to exercise the first production review workflow without exposing real field, operator, well, or production data.

## Files

- `wells.csv`: fictional well metadata for one mature field.
- `production_measurements.csv`: three daily production records per well.
- `deferments.csv`: example production loss and downtime events.
- `opportunities.csv`: example opportunity records linked to deferment evidence.

## Assumptions

- Field and well names are fictional.
- Dates are sample operating dates.
- Oil and water volumes are daily barrel-like volumes.
- Gas volumes are synthetic Mcf-like volumes.
- Costs are expressed in USD-like values.
- Coordinates are omitted to avoid implying a real asset location.
- Production behavior is realistic enough for workflow testing, but does not copy any real production history.

## Scenario

`field-alpha` is a fictional mature field with four wells:

- `well-001` has a rod pump downtime event and material production drop.
- `well-002` is a stable ESP producer.
- `well-003` is shut in and pending review.
- `well-004` is a stable PCP producer.

The dataset should support a simple review:

1. Identify production changes.
2. Inspect deferments.
3. Link deferments to operating opportunities.
4. Rank opportunities with simple economics in later implementation tasks.

## Data Safety

Do not replace these files with real asset data. If a real workflow inspires a fixture, convert it into a synthetic example before committing it.
