# Public Data Sources

Energy OS uses synthetic data for public fixtures by default. Real public datasets are useful for validation and importer development, but raw public data should not be committed until license terms, attribution requirements, size, and privacy or operational sensitivity have been reviewed.

## Data Policy

- Keep `datasets/synthetic-field-v0` as the default public fixture.
- Prefer importers and mapping documentation over committing large raw public dumps.
- Commit small real-data samples only when the source license and attribution terms are clear.
- Preserve source field names and original values during import.
- Record source URL, access date, license, and transformation notes for any real-data fixture.

## Argentina

### Secretaría de Energía: Producción de petróleo y gas por pozo (Capítulo IV)

Official catalog page:

- https://datos.gob.ar/dataset/energia-produccion-petroleo-gas-por-pozo-capitulo-iv

Official CKAN API:

- https://datos.gob.ar/api/3/action/package_show?id=energia-produccion-petroleo-gas-por-pozo-capitulo-iv

Why it matters:

- Monthly production by well, field, concession, and province.
- Oil in `m3`, gas in `Miles de m3`, and water in `m3`.
- Includes annual CSV resources and well-related resources such as `Capítulo IV - Pozos`.
- Strong first candidate for mapping into `Well` and `ProductionEvent`.

Current caveat:

- The catalog metadata currently reports `license_id: notspecified` and `license_title: No se especificó la licencia`.
- Do not commit raw copies or large extracts until reuse terms are reviewed.

Potential Energy OS mapping:

- `pozo` / well identifier -> `well_id`
- `yacimiento` -> field-like grouping
- `concesion` -> operating asset or concession metadata
- `provincia` -> regional metadata
- monthly oil/gas/water volumes -> monthly `ProductionEvent`

Current implementation:

- Mapping notes live in `docs/import-mappings/argentina-capitulo-iv.md`.
- `@energy-os/data-import` includes a Capítulo IV production-row mapper tested with synthetic source-shaped rows.
- The mapper preserves source rows and converts source metric volumes into unit-labeled canonical production events.
- Raw Capítulo IV data is not committed.

Coverage gap:

- Does not directly cover deferments, opportunity ranking, intervention economics, or decision journaling.

## United States

### U.S. Energy Information Administration (EIA) Open Data

Official page:

- https://www.eia.gov/opendata/

Why it matters:

- Useful for macro context, prices, regional production, state-level production, and market assumptions.
- Good source for economic assumptions and benchmark context.

Coverage gap:

- Generally too aggregated for well-level production workflows.

Price use:

- EIA is the first public benchmark source for Energy OS price assumptions.
- Useful benchmark series include WTI Cushing spot price, Brent spot price, and Henry Hub natural gas spot price.
- These are benchmark assumptions, not a substitute for realized operator prices, contract formulas, quality adjustments, transport differentials, hedges, or customer terms.

### Railroad Commission of Texas (RRC)

Official download page:

- https://www.rrc.texas.gov/resource-center/research/data-sets-available-for-download/

Why it matters:

- Free public datasets covering production, wellbore, API data, drilling permits, field data, and regulatory records.
- Useful for testing import complexity against real U.S. regulator formats.

Coverage gap:

- Formats are mixed and often legacy-oriented. Importers should isolate parsing from the core Energy OS domain model.

### Bureau of Safety and Environmental Enforcement (BSEE) Data Center

Official page:

- https://www.data.bsee.gov/

Why it matters:

- Public offshore oil and gas data for U.S. Outer Continental Shelf operations.
- Useful for offshore production context and future offshore-specific importer experiments.

Coverage gap:

- Offshore-focused and not a direct substitute for mature onshore field operations data.

## First Real-Data Task

The first real-data task should be a mapping exercise, not a bulk import:

> Map Argentina Capítulo IV data to the Energy OS `Well` and `ProductionEvent` schemas.

Expected output:

- Field-level mapping notes.
- Unit conversion decisions.
- Source columns preserved in importer tests.
- A tiny, license-reviewed sample only if public reuse terms are confirmed.

Current status:

- Mapping notes and synthetic importer tests exist for monthly production rows.
- Well-specific mapping still needs a reviewed join against the official well resource.
- Real-data fixture work remains blocked on license and attribution review.

## Commodity Price Sources

Commodity prices should enter Energy OS as explicit `PriceScenario` assumptions. Public benchmark prices are useful for demos and sensitivity analysis. Real realized prices, contract formulas, hedges, customer terms, and negotiation positions are confidential and should be private workspace data.

### EIA WTI and Brent spot prices

Official WTI page:

- https://www.eia.gov/dnav/pet/hist/RWTCD.htm

Official Brent page:

- https://www.eia.gov/dnav/pet/hist/RBRTED.htm

Why it matters:

- Daily public benchmark oil prices in USD per barrel.
- Good default assumptions for synthetic opportunity economics and price sensitivity tests.

Coverage gap:

- Does not represent a specific operator's realized price, crude quality differential, transportation cost, sales contract, or tax/royalty treatment.

### EIA Henry Hub natural gas spot price

Official page:

- https://www.eia.gov/dnav/ng/hist/rngwhhdD.htm

Why it matters:

- Daily public benchmark U.S. natural gas price in USD per MMBtu.
- Useful for gas uplift sensitivity, especially before local or contract-specific gas pricing exists.

Coverage gap:

- Not equivalent to Argentina local gas realized price, regulated prices, LNG pricing, pipeline basis, buyer-specific terms, or contract formulas.

### World Bank commodity price data

Official page:

- https://www.worldbank.org/en/research/commodity-markets

Why it matters:

- Monthly and annual commodity price files for broad benchmark context, including energy commodities.
- Useful for public examples, long-term price scenario history, and macro sensitivity analysis.

Coverage gap:

- Monthly/annual macro data is too coarse for daily operational economics and does not represent operator-specific realized sales prices.
