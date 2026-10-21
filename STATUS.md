# Estado

_Actualizado 2026-10-21 · Claude Code (rescate trailkeep)_

## Probar

- CSV import preview por pegado y por archivo en desktop y móvil, con filas inválidas, en el demo de Vercel Cómo: Abrir https://open-energy-os.vercel.app/#import, subir y pegar CSVs sintéticos y mirar Rows/Valid/Issues. _(«Energy OS» · Codex · 07/07)_
- Navegación lateral, footer fijo con link a GitHub y pill de estado de pozos en el demo público Cómo: Abrir el demo sin login de Vercel; recorrer secciones, scrollear y revisar el footer en móvil. _(«Energy OS» · Codex · 07/07)_
- Revisión de términos de dominio con criterio de ingeniería de petróleo (ProductionMeasurement, measurement_method reported, unidades) Cómo: Leer docs/domain-model.md y docs/import-mappings/argentina-capitulo-iv.md. _(«Energy OS» · Codex · 07/07)_

## Destrabar

- Conseguir validación de la comunidad: mostrar el workflow diario de producción a ingenieros u operadores de producción **Recomiendo:** Contactar colegas directos: es track paralelo y no frena el desarrollo. (opciones: Contactar a 2 o 3 colegas petroleros conocidos / Publicar el demo y pedir feedback abierto / Dejarlo para después de tener el decision loop) _(«Energy OS» · Codex · 07/07)_
- Decidir si se compra un dominio propio para reemplazar open-energy-os.vercel.app antes de usarlo fuera del demo **Recomiendo:** Seguir con el alias hasta que haya auth o uso externo real. (opciones: Seguir con el alias de Vercel / Comprar un dominio ahora) _(«Energy OS» · Codex · 07/07)_
- Confirmar que Apache 2.0 es la licencia inicial que querés **Recomiendo:** Mantener Apache 2.0 (patentes y adopción corporativa). (opciones: Mantener Apache 2.0 / Cambiar a MIT / Cambiar a AGPL) _(«Energy OS» · Codex · 07/07)_

## Último cambio

- 2026-10-04 · docs: add CLAUDE.md importing AGENTS.md (ce956a9)

## Próxima sesión

Leer AGENTS.md, docs/agent-handoff.md (Pendientes) y docs/roadmap.md.
Empezar por el P0 de la review: unificar la regla de datos sintéticos únicamente; después el decision loop de Phase 1 (import aplicado al estado local y diario de decisiones).
