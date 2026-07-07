"use client";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Database,
  Droplet,
  ExternalLink,
  FileText,
  Gauge,
  LineChart,
  ShieldCheck,
  Upload,
  Waves,
  Wrench,
  Zap
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode
} from "react";
import {
  previewCsvImport,
  type ImportEntityType,
  type ImportPreview,
  type ImportPreviewRecord
} from "../lib/import-preview";
import type {
  DefermentReview,
  OpportunityReview,
  ProductionReview,
  WellReview
} from "../lib/production-review";

type ProductionReviewShellProps = {
  review: ProductionReview;
};

const navItems = [
  { label: "Overview", icon: Gauge, sectionId: "overview" },
  { label: "Import", icon: Upload, sectionId: "import" },
  { label: "Surveillance", icon: Activity, sectionId: "surveillance" },
  { label: "Deferments", icon: ClipboardList, sectionId: "deferments" },
  { label: "Opportunities", icon: LineChart, sectionId: "opportunities" },
  { label: "Decision Journal", icon: BookOpen, sectionId: "journal" },
  { label: "Data Sources", icon: Database, sectionId: "data-sources" }
] as const;

type SectionId = (typeof navItems)[number]["sectionId"];

const sectionIds = navItems.map((item) => item.sectionId);

const importEntityOptions = [
  {
    type: "wells",
    label: "Wells",
    expectedColumns: ["well_id", "field_id", "name", "well_type", "status"]
  },
  {
    type: "production_measurements",
    label: "Production",
    expectedColumns: [
      "production_measurement_id",
      "well_id",
      "production_date",
      "oil_volume",
      "gas_volume"
    ]
  },
  {
    type: "deferments",
    label: "Deferments",
    expectedColumns: ["deferment_id", "well_id", "started_at", "category", "status"]
  }
] satisfies Array<{
  type: ImportEntityType;
  label: string;
  expectedColumns: string[];
}>;

export function ProductionReviewShell({ review }: ProductionReviewShellProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(
    review.opportunities[0]?.opportunity_id ?? ""
  );
  const [importEntityType, setImportEntityType] = useState<ImportEntityType>("wells");
  const [importCsvText, setImportCsvText] = useState("");
  const [importFileName, setImportFileName] = useState("");
  const [importPreview, setImportPreview] = useState<ImportPreview | undefined>(undefined);
  const [importError, setImportError] = useState<string | undefined>(undefined);
  const selectedOpportunity = useMemo(
    () =>
      review.opportunities.find(
        (opportunity) => opportunity.opportunity_id === selectedOpportunityId
      ) ?? review.opportunities[0],
    [review.opportunities, selectedOpportunityId]
  );
  const selectedImportOption =
    importEntityOptions.find((option) => option.type === importEntityType) ??
    importEntityOptions[0]!;
  const updateImportPreview = useCallback((entityType: ImportEntityType, csv: string) => {
    try {
      setImportPreview(previewCsvImport(entityType, csv));
      setImportError(undefined);
    } catch (error) {
      setImportPreview(undefined);
      setImportError(error instanceof Error ? error.message : "Unknown CSV import error");
    }
  }, []);
  const handleImportTypeChange = useCallback(
    (entityType: ImportEntityType) => {
      setImportEntityType(entityType);

      if (importCsvText.trim() !== "") {
        updateImportPreview(entityType, importCsvText);
      }
    },
    [importCsvText, updateImportPreview]
  );
  const handleImportFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file === undefined) {
        return;
      }

      const csv = await file.text();
      setImportFileName(file.name);
      setImportCsvText(csv);
      updateImportPreview(importEntityType, csv);
      event.target.value = "";
    },
    [importEntityType, updateImportPreview]
  );
  const clearImportPreview = useCallback(() => {
    setImportCsvText("");
    setImportFileName("");
    setImportPreview(undefined);
    setImportError(undefined);
  }, []);
  const scrollToSection = useCallback((sectionId: SectionId) => {
    const section = document.getElementById(sectionId);

    if (section === null) {
      return;
    }

    setActiveSection(sectionId);
    window.history.replaceState(null, "", `#${sectionId}`);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const syncActiveSectionFromHash = () => {
      const hashSectionId = window.location.hash.slice(1);

      if (isSectionId(hashSectionId)) {
        setActiveSection(hashSectionId);
      }
    };

    syncActiveSectionFromHash();

    window.addEventListener("hashchange", syncActiveSectionFromHash);
    window.addEventListener("popstate", syncActiveSectionFromHash);

    return () => {
      window.removeEventListener("hashchange", syncActiveSectionFromHash);
      window.removeEventListener("popstate", syncActiveSectionFromHash);
    };
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Energy OS navigation">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <Droplet size={22} strokeWidth={2.4} />
          </span>
          <span>Energy OS</span>
        </div>

        <nav className="nav-list" aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.sectionId === activeSection;

            return (
              <a
                className={isActive ? "nav-item active" : "nav-item"}
                href={`#${item.sectionId}`}
                key={item.label}
                aria-current={isActive ? "page" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(item.sectionId);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="field-control">
            <span>Field</span>
            <div className="field-chip">{review.field.name}</div>
          </div>
          <div className="data-stamp">
            <span>Data as of</span>
            <strong>{formatDate(review.field.latestProductionDate)}</strong>
          </div>
        </div>
      </aside>

      <main className="workspace">
        <section className="nav-section overview-section" id="overview">
          <header className="topbar">
            <div>
              <p className="screen-label">Upstream production review</p>
              <h1>{review.field.name}</h1>
            </div>
            <div className="topbar-meta" aria-label="Review metadata">
              <span>
                <CalendarDays size={16} />
                {formatDate(review.field.latestProductionDate)}
              </span>
              <span>
                <Clock3 size={16} />
                Local synthetic data
              </span>
              <span>
                <Bell size={16} />
                {review.summary.openDeferments} open
              </span>
              <span className="avatar">PE</span>
            </div>
          </header>

          <section className="summary-strip" aria-label="Field summary">
            <HealthGauge score={review.field.healthScore} />
            <Metric
              icon={<Droplet size={18} />}
              label="Oil"
              value={`${formatNumber(review.summary.latestOilVolume)} bbl/d`}
              delta={review.summary.oilDelta}
              suffix="bbl/d"
            />
            <Metric
              icon={<Zap size={18} />}
              label="Gas"
              value={`${formatNumber(review.summary.latestGasVolume)} Mcf/d`}
              delta={review.summary.gasDelta}
              suffix="Mcf/d"
            />
            <Metric
              icon={<Waves size={18} />}
              label="Water"
              value={`${formatNumber(review.summary.latestWaterVolume)} bbl/d`}
              delta={review.summary.waterDelta}
              suffix="bbl/d"
              inverse
            />
            <Metric
              icon={<Activity size={18} />}
              label="Avg uptime"
              value={`${review.summary.averageUptimeHours.toFixed(1)} h`}
              detail="24 h period"
            />
            <Metric
              icon={<ArrowUpRight size={18} />}
              label="Ranked opps"
              value={String(review.summary.rankedOpportunities)}
              detail="deterministic economics"
            />
          </section>
        </section>

        <div className="content-grid">
          <section className="panel import-panel nav-section" id="import">
            <PanelHeader
              title="CSV import preview"
              count={importPreview === undefined ? "Local" : `${importPreview.validRecords.length} valid`}
            />
            <ImportPreviewPanel
              entityType={importEntityType}
              fileName={importFileName}
              importError={importError}
              preview={importPreview}
              selectedOption={selectedImportOption}
              onClear={clearImportPreview}
              onFileChange={handleImportFileChange}
              onTypeChange={handleImportTypeChange}
            />
          </section>

          <section className="panel well-panel nav-section" id="surveillance">
            <PanelHeader
              title="Well surveillance"
              count={`${review.wells.length} wells`}
              action="View wells"
              onAction={() => scrollToSection("surveillance")}
            />
            <WellTable wells={review.wells} />
          </section>

          <section className="panel deferment-panel nav-section" id="deferments">
            <PanelHeader
              title="Deferments"
              count={`${review.summary.openDeferments} open`}
              action="View log"
              onAction={() => scrollToSection("deferments")}
            />
            <DefermentTable deferments={review.deferments} />
          </section>

          <section className="panel journal-panel nav-section" id="journal">
            <PanelHeader
              title="Decision journal"
              count="Latest"
              action="Open journal"
              onAction={() => scrollToSection("journal")}
            />
            <div className="journal-list">
              {review.journal.slice(0, 5).map((entry) => (
                <article className="journal-row" key={entry.id}>
                  <span className="journal-time">{entry.timestamp}</span>
                  <div>
                    <strong>{entry.decision}</strong>
                    <span>
                      {entry.type} · {entry.wellName}
                    </span>
                  </div>
                  <span
                    className={entry.impactLabel.startsWith("+") ? "impact positive" : "impact negative"}
                  >
                    {entry.impactLabel}
                  </span>
                  <span className="owner">{entry.owner}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel opportunities-panel nav-section" id="opportunities">
            <PanelHeader
              title="Top opportunities"
              count={`${review.opportunities.length}`}
              action="View all"
              onAction={() => scrollToSection("opportunities")}
            />
            <div className="opportunity-list">
              {review.opportunities.map((opportunity, index) => (
                <button
                  type="button"
                  key={opportunity.opportunity_id}
                  className={
                    opportunity.opportunity_id === selectedOpportunity?.opportunity_id
                      ? "opportunity-row selected"
                      : "opportunity-row"
                  }
                  onClick={() => setSelectedOpportunityId(opportunity.opportunity_id)}
                  aria-pressed={opportunity.opportunity_id === selectedOpportunity?.opportunity_id}
                >
                  <span className="rank">{index + 1}</span>
                  <span>
                    <strong>{opportunity.wellName}</strong>
                    <small>{opportunity.title}</small>
                  </span>
                  <span className="impact positive">
                    {formatCurrency(opportunity.economics.netValueUsd)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel selected-panel">
            {selectedOpportunity === undefined ? (
              <EmptyOpportunity />
            ) : (
              <SelectedOpportunity opportunity={selectedOpportunity} review={review} />
            )}
          </section>

          <section className="panel data-sources-panel nav-section" id="data-sources">
            <PanelHeader title="Data sources" count="Public-safe" />
            <DataSourcesPanel review={review} />
          </section>
        </div>

        <footer className="app-footer">
          <span>Open source Energy OS</span>
          <a href="https://github.com/lucasgday/energy-os" target="_blank" rel="noreferrer">
            GitHub
            <ExternalLink size={15} />
          </a>
        </footer>
      </main>
    </div>
  );
}

function ImportPreviewPanel({
  entityType,
  fileName,
  importError,
  preview,
  selectedOption,
  onClear,
  onFileChange,
  onTypeChange
}: {
  entityType: ImportEntityType;
  fileName: string;
  importError: string | undefined;
  preview: ImportPreview | undefined;
  selectedOption: (typeof importEntityOptions)[number];
  onClear: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (entityType: ImportEntityType) => void;
}) {
  return (
    <div className="import-preview">
      <div className="import-toolbar">
        <div className="segmented-control" aria-label="CSV import type">
          {importEntityOptions.map((option) => (
            <button
              type="button"
              className={option.type === entityType ? "segment active" : "segment"}
              key={option.type}
              onClick={() => onTypeChange(option.type)}
              aria-pressed={option.type === entityType}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="import-actions">
          <label className="file-action">
            <Upload size={16} />
            Choose CSV
            <input
              className="sr-only"
              type="file"
              accept=".csv,text/csv"
              onChange={onFileChange}
            />
          </label>
          {preview !== undefined || importError !== undefined ? (
            <button type="button" className="secondary-action" onClick={onClear}>
              Clear
            </button>
          ) : null}
        </div>
      </div>

      <div className="import-warning">
        <ShieldCheck size={16} />
        <span>Public-safe CSV only. Local preview does not persist records.</span>
      </div>

      <div className="expected-columns">
        <span>Expected columns</span>
        <div>
          {selectedOption.expectedColumns.map((column) => (
            <code key={column}>{column}</code>
          ))}
        </div>
      </div>

      {importError !== undefined ? (
        <div className="import-error">
          <AlertTriangle size={17} />
          <span>{importError}</span>
        </div>
      ) : null}

      {preview === undefined ? (
        <div className="empty-import">
          <strong>No CSV loaded</strong>
          <span>{fileName === "" ? "Choose a file to inspect rows." : fileName}</span>
        </div>
      ) : (
        <ImportPreviewResults preview={preview} fileName={fileName} />
      )}
    </div>
  );
}

function ImportPreviewResults({
  preview,
  fileName
}: {
  preview: ImportPreview;
  fileName: string;
}) {
  const validRows = preview.validRecords.slice(0, 5);
  const errorRows = preview.errors.slice(0, 5);

  return (
    <div className="import-results">
      <div className="import-summary">
        <ImportStat label="File" value={fileName || "CSV"} />
        <ImportStat label="Rows" value={String(preview.totalRows)} />
        <ImportStat label="Valid" value={String(preview.validRecords.length)} />
        <ImportStat
          label="Issues"
          value={String(preview.errors.length)}
          tone={preview.errors.length === 0 ? "ok" : "warning"}
        />
        <ImportStat label="Columns" value={String(preview.sourceColumns.length)} />
      </div>

      <div className="source-columns">
        {preview.sourceColumns.map((column) => (
          <code key={column}>{column}</code>
        ))}
      </div>

      <div className="preview-tables">
        <PreviewTable
          title="Valid rows"
          count={preview.validRecords.length}
          columns={["Row", "ID", "Well", "Signal"]}
        >
          {validRows.length === 0 ? (
            <tr>
              <td colSpan={4}>No valid rows yet.</td>
            </tr>
          ) : (
            validRows.map((record) => (
              <tr key={`${record.rowNumber}-${recordId(record)}`}>
                <td>{record.rowNumber}</td>
                <td>{recordId(record)}</td>
                <td>{recordWell(record)}</td>
                <td>{recordSignal(record)}</td>
              </tr>
            ))
          )}
        </PreviewTable>

        <PreviewTable title="Issues" count={preview.errors.length} columns={["Row", "ID", "Message"]}>
          {errorRows.length === 0 ? (
            <tr>
              <td colSpan={3}>No row-level issues.</td>
            </tr>
          ) : (
            errorRows.map((error) => (
              <tr key={`${error.rowNumber}-${error.message}`}>
                <td>{error.rowNumber}</td>
                <td>{sourceRowId(error.source)}</td>
                <td>{error.message}</td>
              </tr>
            ))
          )}
        </PreviewTable>
      </div>
    </div>
  );
}

function ImportStat({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone?: "ok" | "warning";
}) {
  return (
    <div className={tone === undefined ? "import-stat" : `import-stat ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PreviewTable({
  title,
  count,
  columns,
  children
}: {
  title: string;
  count: number;
  columns: string[];
  children: ReactNode;
}) {
  return (
    <div className="preview-table-block">
      <div className="preview-table-title">
        <h3>{title}</h3>
        <span>{count}</span>
      </div>
      <div className="table-scroll">
        <table className="preview-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function PanelHeader({
  title,
  count,
  action,
  onAction
}: {
  title: string;
  count: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="panel-header">
      <div>
        <h2>{title}</h2>
        <span>{count}</span>
      </div>
      {action !== undefined && onAction !== undefined ? (
        <button type="button" className="ghost-action" onClick={onAction}>
          {action}
          <ArrowUpRight size={15} />
        </button>
      ) : null}
    </div>
  );
}

function HealthGauge({ score }: { score: number }) {
  const background = `conic-gradient(var(--accent) ${score * 3.6}deg, #e8eeeb 0deg)`;

  return (
    <article className="health-card">
      <span>Field health</span>
      <div className="gauge" style={{ background }}>
        <span className="gauge-value">
          <strong>{score}</strong>
          <small>/100</small>
        </span>
      </div>
    </article>
  );
}

function Metric({
  icon,
  label,
  value,
  delta,
  suffix,
  detail,
  inverse = false
}: {
  icon: ReactNode;
  label: string;
  value: string;
  delta?: number;
  suffix?: string;
  detail?: string;
  inverse?: boolean;
}) {
  const hasDelta = delta !== undefined;
  const deltaIsPositive = hasDelta && delta > 0;
  const deltaClass = inverse ? (deltaIsPositive ? "negative" : "positive") : deltaIsPositive ? "positive" : "negative";

  return (
    <article className="metric-card">
      <div className="metric-label">
        {icon}
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
      {hasDelta ? (
        <span className={`metric-delta ${delta === 0 ? "neutral" : deltaClass}`}>
          {delta > 0 ? "+" : ""}
          {formatNumber(delta)} {suffix}
        </span>
      ) : (
        <span className="metric-detail">{detail}</span>
      )}
      {hasDelta ? <small>vs prior production day</small> : null}
    </article>
  );
}

function WellTable({ wells }: { wells: WellReview[] }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Well</th>
            <th>Status</th>
            <th>Oil</th>
            <th>Δ Oil</th>
            <th>Gas</th>
            <th>Water</th>
            <th>Uptime</th>
            <th>Lift</th>
            <th>Alerts</th>
          </tr>
        </thead>
        <tbody>
          {wells.map((well) => (
            <tr key={well.well_id}>
              <td>
                <strong>{well.name}</strong>
                <span>{well.target_formation}</span>
              </td>
              <td>
                <StatusPill label={well.statusLabel} status={well.status} />
              </td>
              <td>{formatNumber(well.latest.oil_volume ?? 0)}</td>
              <td>
                <span className={well.oilDelta >= 0 ? "positive" : "negative"}>
                  {well.oilDelta > 0 ? "+" : ""}
                  {formatNumber(well.oilDelta)}
                </span>
              </td>
              <td>{formatNumber(well.latest.gas_volume ?? 0)}</td>
              <td>{formatNumber(well.latest.water_volume ?? 0)}</td>
              <td>{(well.latest.uptime_hours ?? 0).toFixed(1)} h</td>
              <td>{liftLabel(well.artificial_lift_type)}</td>
              <td>
                <AlertCount count={well.openDeferments} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DefermentTable({ deferments }: { deferments: DefermentReview[] }) {
  return (
    <div className="deferment-list">
      {deferments.map((deferment) => (
        <article className="deferment-row" key={deferment.deferment_id}>
          <div>
            <strong>{deferment.wellName}</strong>
            <span>{deferment.cause ?? deferment.category}</span>
          </div>
          <span className={deferment.status === "open" ? "status-warning" : "status-ok"}>
            {deferment.status}
          </span>
          <span className="impact negative">-{deferment.estimated_oil_loss ?? 0} bbl</span>
        </article>
      ))}
    </div>
  );
}

function SelectedOpportunity({
  opportunity,
  review
}: {
  opportunity: OpportunityReview;
  review: ProductionReview;
}) {
  return (
    <>
      <div className="selected-header">
        <div>
          <h2>{opportunity.wellName}</h2>
          <p>{opportunity.title}</p>
        </div>
        <span className="recommendation">Recommended</span>
      </div>

      <div className="detail-grid">
        <Detail label="Source" value={opportunity.source} />
        <Detail label="Status" value={opportunity.status} />
        <Detail label="Expected oil uplift" value={`${opportunity.expected_oil_uplift ?? 0} bbl/d`} />
        <Detail label="Expected gas uplift" value={`${opportunity.expected_gas_uplift ?? 0} Mcf/d`} />
        <Detail label="Net value" value={formatCurrency(opportunity.economics.netValueUsd)} />
        <Detail
          label="Payout"
          value={
            opportunity.economics.payoutDays === null
              ? "No payout"
              : `${opportunity.economics.payoutDays.toFixed(1)} days`
          }
        />
      </div>

      <div className="hypothesis">
        <h3>Hypothesis</h3>
        <p>{opportunity.hypothesis}</p>
      </div>

      <div className="evidence">
        <h3>Evidence</h3>
        {opportunity.evidenceLabels.length === 0 ? (
          <p>No evidence references yet.</p>
        ) : (
          opportunity.evidenceLabels.map((label) => (
            <span key={label}>
              <FileText size={15} />
              {label}
            </span>
          ))
        )}
      </div>

      <div className="assumptions">
        <h3>Assumptions</h3>
        <span>{review.assumptions.upliftDurationDays} day uplift window</span>
        <span>{formatCurrency(review.assumptions.oilPriceUsdPerBbl)}/bbl oil</span>
        <span>{formatCurrency(review.assumptions.gasPriceUsdPerMcf)}/Mcf gas</span>
      </div>

      <div className="selected-actions">
        <button type="button" className="primary-action" disabled>
          <Wrench size={17} />
          Create action
        </button>
        <button type="button" className="icon-action" aria-label="Bookmark opportunity" disabled>
          <ShieldCheck size={17} />
        </button>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyOpportunity() {
  return (
    <div className="empty-state">
      <CheckCircle2 size={28} />
      <h2>No opportunities loaded</h2>
      <p>Load synthetic opportunities to review ranked actions.</p>
    </div>
  );
}

function DataSourcesPanel({ review }: { review: ProductionReview }) {
  return (
    <div className="source-list">
      <article className="source-row">
        <div>
          <strong>Synthetic field dataset</strong>
          <span>datasets/synthetic-field-v0</span>
        </div>
        <span className="source-status">local</span>
      </article>
      <article className="source-row">
        <div>
          <strong>Validated entities</strong>
          <span>{review.wells.length} wells · {review.deferments.length} deferments</span>
        </div>
        <span className="source-status">schema-backed</span>
      </article>
      <article className="source-row">
        <div>
          <strong>Economics assumptions</strong>
          <span>
            {formatCurrency(review.assumptions.oilPriceUsdPerBbl)}/bbl ·{" "}
            {formatCurrency(review.assumptions.gasPriceUsdPerMcf)}/Mcf ·{" "}
            {review.assumptions.upliftDurationDays} days
          </span>
        </div>
        <span className="source-status">explicit</span>
      </article>
    </div>
  );
}

function StatusPill({ label, status }: { label: string; status: WellReview["status"] }) {
  const className =
    status === "producing" || status === "injecting" ? "status-pill ok" : "status-pill warning";
  return <span className={className}>{label}</span>;
}

function AlertCount({ count }: { count: number }) {
  if (count === 0) {
    return (
      <span className="alert-count clear">
        <CheckCircle2 size={15} />
        0
      </span>
    );
  }

  return (
    <span className="alert-count active">
      <AlertTriangle size={15} />
      {count}
    </span>
  );
}

function recordId(record: ImportPreviewRecord) {
  return sourceRowId(record.source);
}

function recordWell(record: ImportPreviewRecord) {
  if ("well_id" in record.value) {
    return record.value.well_id;
  }

  return record.source.well_id ?? "-";
}

function recordSignal(record: ImportPreviewRecord) {
  const value = record.value;

  if ("production_measurement_id" in value) {
    return `${value.production_date} · ${formatNumber(value.oil_volume ?? 0)} oil`;
  }

  if ("deferment_id" in value) {
    return `${value.category} · ${value.status}`;
  }

  return `${value.name} · ${wellStatusLabel(value.status)}`;
}

function sourceRowId(source: Record<string, string>) {
  return (
    source.production_measurement_id ??
    source.deferment_id ??
    source.well_id ??
    source.id ??
    "-"
  );
}

function wellStatusLabel(status: string) {
  return status
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

function isSectionId(value: string): value is SectionId {
  return sectionIds.includes(value as SectionId);
}

function liftLabel(value: WellReview["artificial_lift_type"]) {
  if (value === undefined || value === "none") {
    return "None";
  }

  return value
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00Z`));
}
