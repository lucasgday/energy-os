# Argentina Capitulo IV Production Mapping

Access date: 2026-07-06

Official source:

- https://datos.gob.ar/dataset/energia-produccion-petroleo-gas-por-pozo-capitulo-iv

The official catalog describes this dataset as monthly production detail by well, field, concession, and province. It reports oil in `m3`, gas in `Miles de m3`, and water in `m3`. The catalog metadata currently does not specify a license, so Energy OS should keep using mapping code and synthetic tests until reuse terms are reviewed.

## Production Measurement Meaning

A `ProductionMeasurement` is one measured or reported production record for one well over one production period. The period can be daily, monthly, or another explicit interval.

It answers: what did this well produce during this period?

If `uptime_hours` is present, it is the uptime inside the measurement period. For a daily measurement it is usually 0-24; for a monthly measurement it can be hundreds of hours.

It is not:

- a deferment or downtime cause
- an intervention or physical job
- an opportunity or recommendation
- a commercial sale or invoice

## Unit Policy

Energy OS keeps imported source rows intact in `ImportedRecord.source`. The validated domain value can then normalize volumes while still labeling units explicitly.

Current canonical production units:

- Oil: `bbl`
- Gas: `Mcf`
- Water: `bbl`

Current display preference options:

- `field`: oil/water in `bbl`, gas in `Mcf`
- `metric`: oil/water in `m3`, gas in `thousand_m3`

Conversions used by the Capitulo IV mapper:

- `1 m3 = 6.28981077 bbl`
- `1 thousand_m3 = 35.3146667 Mcf`

The UI should display the user's preferred unit system, but never show volume numbers without unit labels.

## Production Mapping

| Source field | Energy OS field | Rule |
| --- | --- | --- |
| `idpozo` / `pozo` / `well_id` | `well_id` | Required. Preserved as the source well identifier. |
| `anio` + `mes` | `production_measurement_id` | `argentina-capitulo-iv:{well_id}:{YYYY-MM}`. |
| `anio` + `mes` | `period_start_date` | First calendar day of the month. |
| `anio` + `mes` | `period_end_date` and `production_date` | Last calendar day of the month. |
| `anio` + `mes` | `period_hours` | Calendar days in month multiplied by 24. |
| `prod_pet` / `petroleo_m3` / `oil_m3` | `oil_volume` | Convert source `m3` to canonical `bbl`; set `oil_volume_unit` to `bbl`. |
| `prod_gas` / `gas_miles_m3` / `gas_thousand_m3` | `gas_volume` | Convert source `thousand_m3` to canonical `Mcf`; set `gas_volume_unit` to `Mcf`. |
| `prod_agua` / `agua_m3` / `water_m3` | `water_volume` | Convert source `m3` to canonical `bbl`; set `water_volume_unit` to `bbl`. |
| monthly source record | `period_granularity` | `monthly`. |
| monthly source record | `measurement_method` | `reported`, because Capitulo IV is reported public production data rather than an assumed direct wellhead measurement. |
| source dataset | `source` | `argentina-capitulo-iv`. |

## Well Mapping Notes

The production resource is enough to derive a minimal `well_id`, but `Well` records should come from the well-specific resource or a reviewed join because the production rows alone do not fully define well type, lift type, status, coordinates, spud date, or completion context.

Potential metadata mappings to keep for future `Well` or `Field` enrichment:

- `yacimiento` -> field-like grouping
- `concesion` -> asset or concession metadata
- `provincia` -> regional metadata

## Current Implementation

`@energy-os/data-import` includes `importArgentinaCapituloIvProductionMeasurementRows` and tests it with synthetic Capitulo IV-shaped rows. No raw Capitulo IV data is committed.

The next implementation step is to wire this mapper into the web import preview as an explicit source preset, then add a tiny real-data sample only if license and attribution terms are confirmed.
