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
  ChevronDown,
  ChevronsLeft,
  ClipboardList,
  Clock3,
  Database,
  Droplet,
  ExternalLink,
  FileText,
  Gauge,
  LineChart,
  Settings,
  ShieldCheck,
  Waves,
  Wrench,
  Zap
} from "lucide-react";
import { useMemo, useState } from "react";
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
  { label: "Overview", icon: Gauge, active: true },
  { label: "Surveillance", icon: Activity, active: false },
  { label: "Deferments", icon: ClipboardList, active: false },
  { label: "Opportunities", icon: LineChart, active: false },
  { label: "Decision Journal", icon: BookOpen, active: false },
  { label: "Data Sources", icon: Database, active: false }
];

export function ProductionReviewShell({ review }: ProductionReviewShellProps) {
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(
    review.opportunities[0]?.opportunity_id ?? ""
  );
  const selectedOpportunity = useMemo(
    () =>
      review.opportunities.find(
        (opportunity) => opportunity.opportunity_id === selectedOpportunityId
      ) ?? review.opportunities[0],
    [review.opportunities, selectedOpportunityId]
  );

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
            return (
              <button
                className={item.active ? "nav-item active" : "nav-item"}
                type="button"
                key={item.label}
                aria-current={item.active ? "page" : undefined}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="field-control">
            <span>Field</span>
            <button type="button">
              {review.field.name}
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="data-stamp">
            <span>Data as of</span>
            <strong>{formatDate(review.field.latestProductionDate)}</strong>
          </div>
          <button className="collapse-button" type="button">
            <ChevronsLeft size={18} />
            <span>Collapse</span>
          </button>
        </div>
      </aside>

      <main className="workspace">
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

        <div className="content-grid">
          <section className="panel well-panel">
            <PanelHeader
              title="Well surveillance"
              count={`${review.wells.length} wells`}
              action="View wells"
            />
            <WellTable wells={review.wells} />
          </section>

          <section className="panel deferment-panel">
            <PanelHeader
              title="Deferments"
              count={`${review.summary.openDeferments} open`}
              action="View log"
            />
            <DefermentTable deferments={review.deferments} />
          </section>

          <section className="panel journal-panel">
            <PanelHeader title="Decision journal" count="Latest" action="Open journal" />
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

          <section className="panel opportunities-panel">
            <PanelHeader
              title="Top opportunities"
              count={`${review.opportunities.length}`}
              action="View all"
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
        </div>
      </main>
    </div>
  );
}

function PanelHeader({ title, count, action }: { title: string; count: string; action: string }) {
  return (
    <div className="panel-header">
      <div>
        <h2>{title}</h2>
        <span>{count}</span>
      </div>
      <button type="button" className="ghost-action">
        {action}
        <ExternalLink size={15} />
      </button>
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
  icon: React.ReactNode;
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
        <button type="button" className="primary-action">
          <Wrench size={17} />
          Create action
        </button>
        <button type="button" className="icon-action" aria-label="Bookmark opportunity">
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
