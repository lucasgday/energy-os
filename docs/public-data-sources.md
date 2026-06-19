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
- monthly oil/gas/water volumes -> `ProductionEvent`

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
