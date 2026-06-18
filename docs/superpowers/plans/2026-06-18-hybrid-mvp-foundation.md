# Hybrid MVP Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first local-running foundation for Energy OS: typed domain packages, synthetic data, deterministic economics, and a Next.js shell that can display a production review from synthetic data.

**Architecture:** Use a pnpm monorepo with a Next.js app in `apps/web` and reusable packages in `packages/domain`, `packages/economics`, and `packages/data-import`. Keep domain validation and economics outside the UI so the prototype can run locally now and evolve into a hosted SaaS later.

**Tech Stack:** TypeScript, pnpm workspaces, Next.js App Router, Tailwind CSS, Ajv, Vitest, CSV fixtures.

---

## File Structure

- Create `package.json` for root workspace scripts.
- Create `pnpm-workspace.yaml` for workspace membership.
- Create `tsconfig.base.json` for shared TypeScript options.
- Create `packages/domain` for schema-backed types and validation.
- Create `packages/economics` for payout and opportunity ranking logic.
- Create `packages/data-import` for loading and validating synthetic CSV files.
- Create `apps/web` for the first read-only production review UI.
- Modify `datasets/synthetic-field-v0` with CSV fixtures and dataset documentation.
- Modify `docs/agent-handoff.md` after implementation status changes.

### Task 1: Workspace Baseline

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`

- [ ] **Step 1: Create root package manifest**

```json
{
  "name": "energy-os",
  "private": true,
  "version": "0.1.0",
  "description": "Open source operating layer for low-headcount upstream energy operations.",
  "license": "Apache-2.0",
  "scripts": {
    "build": "pnpm -r build",
    "dev": "pnpm --filter @energy-os/web dev",
    "test": "pnpm -r test",
    "typecheck": "pnpm -r typecheck"
  },
  "packageManager": "pnpm@10.0.0"
}
```

- [ ] **Step 2: Create workspace file**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 3: Create shared TypeScript config**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

- [ ] **Step 4: Install dependencies**

Run: `pnpm install`

Expected: lockfile is created and install exits with code 0.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json pnpm-lock.yaml
git commit -m "chore: add workspace baseline"
```

### Task 2: Domain Package

**Files:**
- Create: `packages/domain/package.json`
- Create: `packages/domain/tsconfig.json`
- Create: `packages/domain/src/index.ts`
- Create: `packages/domain/src/types.ts`
- Create: `packages/domain/src/validation.ts`
- Test: `packages/domain/src/validation.test.ts`

- [ ] **Step 1: Create package manifest**

```json
{
  "name": "@energy-os/domain",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "ajv": "^8.17.1",
    "ajv-formats": "^3.0.1"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create package TypeScript config**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "noEmit": true
  },
  "include": ["src/**/*.ts"]
}
```

- [ ] **Step 3: Write domain types**

```ts
export type WellStatus = "producing" | "injecting" | "shut_in" | "abandoned" | "planned" | "unknown";

export type Well = {
  well_id: string;
  field_id: string;
  name: string;
  well_type: "producer" | "injector" | "monitor" | "disposal" | "other";
  status: WellStatus;
  artificial_lift_type?: "none" | "rod_pump" | "esp" | "gas_lift" | "pcp" | "jet_pump" | "plunger_lift" | "unknown";
};

export type ProductionEvent = {
  production_event_id: string;
  well_id: string;
  production_date: string;
  oil_volume?: number;
  gas_volume?: number;
  water_volume?: number;
  uptime_hours?: number;
  period_hours?: number;
  measurement_method?: "metered" | "allocated" | "estimated" | "manual" | "unknown";
};

export type Deferment = {
  deferment_id: string;
  well_id: string;
  started_at: string;
  ended_at?: string;
  category: "surface" | "subsurface" | "facility" | "power" | "market" | "weather" | "planned" | "unknown";
  cause?: string;
  estimated_oil_loss?: number;
  estimated_gas_loss?: number;
  status: "open" | "resolved" | "reviewed" | "dismissed";
};

export type Opportunity = {
  opportunity_id: string;
  well_id: string;
  title: string;
  source: "manual" | "rule" | "model" | "imported";
  hypothesis?: string;
  expected_oil_uplift?: number;
  expected_gas_uplift?: number;
  estimated_cost?: number;
  estimated_payout_days?: number;
  status: "proposed" | "reviewed" | "approved" | "rejected" | "executed" | "measured";
  evidence_refs?: string[];
};
```

- [ ] **Step 4: Write validation helper**

```ts
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export function validateWithSchema<T>(schema: object, value: unknown): T {
  const validate = ajv.compile(schema);
  if (!validate(value)) {
    const message = ajv.errorsText(validate.errors, { separator: "; " });
    throw new Error(message);
  }

  return value as T;
}
```

- [ ] **Step 5: Export package API**

```ts
export type { Deferment, Opportunity, ProductionEvent, Well, WellStatus } from "./types";
export { validateWithSchema } from "./validation";
```

- [ ] **Step 6: Add validation test**

```ts
import { describe, expect, it } from "vitest";
import { validateWithSchema, type Well } from "./index";

const wellSchema = {
  type: "object",
  additionalProperties: false,
  required: ["well_id", "field_id", "name", "well_type", "status"],
  properties: {
    well_id: { type: "string", minLength: 1 },
    field_id: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1 },
    well_type: { type: "string", enum: ["producer", "injector"] },
    status: { type: "string", enum: ["producing", "shut_in"] }
  }
};

describe("validateWithSchema", () => {
  it("returns typed values when input matches the schema", () => {
    const well = validateWithSchema<Well>(wellSchema, {
      well_id: "well-001",
      field_id: "field-001",
      name: "North-01",
      well_type: "producer",
      status: "producing"
    });

    expect(well.name).toBe("North-01");
  });

  it("throws when input does not match the schema", () => {
    expect(() => validateWithSchema<Well>(wellSchema, { well_id: "" })).toThrow();
  });
});
```

- [ ] **Step 7: Run tests**

Run: `pnpm --filter @energy-os/domain test`

Expected: both validation tests pass.

- [ ] **Step 8: Commit**

```bash
git add packages/domain
git commit -m "feat: add domain validation package"
```

### Task 3: Economics Package

**Files:**
- Create: `packages/economics/package.json`
- Create: `packages/economics/tsconfig.json`
- Create: `packages/economics/src/index.ts`
- Test: `packages/economics/src/index.test.ts`

- [ ] **Step 1: Create package manifest**

```json
{
  "name": "@energy-os/economics",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create package TypeScript config**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "noEmit": true
  },
  "include": ["src/**/*.ts"]
}
```

- [ ] **Step 3: Write economics functions**

```ts
export type OpportunityEconomicsInput = {
  expectedOilUpliftBblPerDay: number;
  upliftDurationDays: number;
  oilPriceUsdPerBbl: number;
  variableCostUsdPerBbl: number;
  interventionCostUsd: number;
};

export type OpportunityEconomics = {
  grossRevenueUsd: number;
  variableCostUsd: number;
  netValueUsd: number;
  payoutDays: number | null;
};

export function calculateOpportunityEconomics(input: OpportunityEconomicsInput): OpportunityEconomics {
  const dailyNetUsd = input.expectedOilUpliftBblPerDay * (input.oilPriceUsdPerBbl - input.variableCostUsdPerBbl);
  const grossRevenueUsd = input.expectedOilUpliftBblPerDay * input.upliftDurationDays * input.oilPriceUsdPerBbl;
  const variableCostUsd = input.expectedOilUpliftBblPerDay * input.upliftDurationDays * input.variableCostUsdPerBbl;
  const netValueUsd = grossRevenueUsd - variableCostUsd - input.interventionCostUsd;

  return {
    grossRevenueUsd,
    variableCostUsd,
    netValueUsd,
    payoutDays: dailyNetUsd > 0 ? input.interventionCostUsd / dailyNetUsd : null
  };
}
```

- [ ] **Step 4: Add tests**

```ts
import { describe, expect, it } from "vitest";
import { calculateOpportunityEconomics } from "./index";

describe("calculateOpportunityEconomics", () => {
  it("calculates payout and net value for a positive uplift", () => {
    const result = calculateOpportunityEconomics({
      expectedOilUpliftBblPerDay: 20,
      upliftDurationDays: 30,
      oilPriceUsdPerBbl: 70,
      variableCostUsdPerBbl: 10,
      interventionCostUsd: 12000
    });

    expect(result.grossRevenueUsd).toBe(42000);
    expect(result.variableCostUsd).toBe(6000);
    expect(result.netValueUsd).toBe(24000);
    expect(result.payoutDays).toBe(10);
  });

  it("returns null payout when daily net value is not positive", () => {
    const result = calculateOpportunityEconomics({
      expectedOilUpliftBblPerDay: 10,
      upliftDurationDays: 30,
      oilPriceUsdPerBbl: 40,
      variableCostUsdPerBbl: 50,
      interventionCostUsd: 1000
    });

    expect(result.payoutDays).toBeNull();
  });
});
```

- [ ] **Step 5: Run tests**

Run: `pnpm --filter @energy-os/economics test`

Expected: both economics tests pass.

- [ ] **Step 6: Commit**

```bash
git add packages/economics
git commit -m "feat: add basic opportunity economics"
```

### Task 4: Synthetic Field Dataset

**Files:**
- Modify: `datasets/synthetic-field-v0/README.md`
- Create: `datasets/synthetic-field-v0/wells.csv`
- Create: `datasets/synthetic-field-v0/production_events.csv`
- Create: `datasets/synthetic-field-v0/deferments.csv`
- Create: `datasets/synthetic-field-v0/opportunities.csv`

- [ ] **Step 1: Add well fixture**

```csv
well_id,field_id,name,well_type,status,artificial_lift_type,target_formation,source
well-001,field-alpha,Alpha-01,producer,producing,rod_pump,Sand A,synthetic
well-002,field-alpha,Alpha-02,producer,producing,esp,Sand A,synthetic
well-003,field-alpha,Alpha-03,producer,shut_in,gas_lift,Sand B,synthetic
well-004,field-alpha,Alpha-04,producer,producing,pcp,Sand B,synthetic
```

- [ ] **Step 2: Add production fixture**

```csv
production_event_id,well_id,production_date,oil_volume,gas_volume,water_volume,uptime_hours,period_hours,measurement_method,source
pe-001,well-001,2026-06-15,82,410,120,24,24,allocated,synthetic
pe-002,well-001,2026-06-16,79,398,124,24,24,allocated,synthetic
pe-003,well-001,2026-06-17,51,260,128,15,24,allocated,synthetic
pe-004,well-002,2026-06-15,140,700,210,24,24,metered,synthetic
pe-005,well-002,2026-06-16,137,690,215,24,24,metered,synthetic
pe-006,well-002,2026-06-17,132,670,220,23,24,metered,synthetic
pe-007,well-003,2026-06-15,0,0,0,0,24,manual,synthetic
pe-008,well-003,2026-06-16,0,0,0,0,24,manual,synthetic
pe-009,well-003,2026-06-17,0,0,0,0,24,manual,synthetic
pe-010,well-004,2026-06-15,63,310,180,24,24,allocated,synthetic
pe-011,well-004,2026-06-16,64,315,179,24,24,allocated,synthetic
pe-012,well-004,2026-06-17,65,319,181,24,24,allocated,synthetic
```

- [ ] **Step 3: Add deferment fixture**

```csv
deferment_id,well_id,started_at,ended_at,category,cause,estimated_oil_loss,estimated_gas_loss,status,source
def-001,well-001,2026-06-17T09:00:00Z,2026-06-17T18:00:00Z,surface,Rod pump downtime,31,150,resolved,synthetic
def-002,well-003,2026-06-15T00:00:00Z,,subsurface,Shut-in pending review,45,210,open,synthetic
```

- [ ] **Step 4: Add opportunity fixture**

```csv
opportunity_id,well_id,title,source,hypothesis,expected_oil_uplift,expected_gas_uplift,estimated_cost,estimated_payout_days,status,evidence_refs
opp-001,well-001,Inspect rod pump after downtime,manual,Recent downtime caused material production loss,18,90,6500,6,proposed,def-001
opp-002,well-003,Review shut-in restart candidate,manual,Well is shut in with estimated recoverable daily production,35,160,18000,9,proposed,def-002
```

- [ ] **Step 5: Update dataset README**

Document that all values are fictional, units are daily barrels for oil and water, gas units are synthetic Mcf-like volumes, and dates are sample operating dates.

- [ ] **Step 6: Commit**

```bash
git add datasets/synthetic-field-v0
git commit -m "data: add synthetic field dataset"
```

### Task 5: Data Import Package

**Files:**
- Create: `packages/data-import/package.json`
- Create: `packages/data-import/tsconfig.json`
- Create: `packages/data-import/src/index.ts`
- Test: `packages/data-import/src/index.test.ts`

- [ ] **Step 1: Create package manifest**

```json
{
  "name": "@energy-os/data-import",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "@energy-os/domain": "workspace:*",
    "csv-parse": "^5.6.0"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create TypeScript config**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "noEmit": true
  },
  "include": ["src/**/*.ts"]
}
```

- [ ] **Step 3: Write CSV parser**

```ts
import { parse } from "csv-parse/sync";

export function parseCsvRows(csv: string): Record<string, string>[] {
  return parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
}

export function toNumber(value: string | undefined): number | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Expected numeric value, received "${value}"`);
  }

  return parsed;
}
```

- [ ] **Step 4: Add parser tests**

```ts
import { describe, expect, it } from "vitest";
import { parseCsvRows, toNumber } from "./index";

describe("parseCsvRows", () => {
  it("parses CSV rows with headers", () => {
    const rows = parseCsvRows("well_id,name\nwell-001,Alpha-01\n");

    expect(rows).toEqual([{ well_id: "well-001", name: "Alpha-01" }]);
  });
});

describe("toNumber", () => {
  it("converts numeric strings", () => {
    expect(toNumber("42")).toBe(42);
  });

  it("keeps blank values undefined", () => {
    expect(toNumber("")).toBeUndefined();
  });

  it("rejects non-numeric values", () => {
    expect(() => toNumber("not-a-number")).toThrow("Expected numeric value");
  });
});
```

- [ ] **Step 5: Run tests**

Run: `pnpm --filter @energy-os/data-import test`

Expected: CSV parser tests pass.

- [ ] **Step 6: Commit**

```bash
git add packages/data-import
git commit -m "feat: add CSV import helpers"
```

### Task 6: Web App Shell

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/app/layout.tsx`
- Create: `apps/web/app/page.tsx`
- Create: `apps/web/app/globals.css`

- [ ] **Step 1: Create web package manifest**

```json
{
  "name": "@energy-os/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "@energy-os/economics": "workspace:*",
    "next": "^15.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.8.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create app TypeScript config**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "noEmit": true,
    "allowJs": true,
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create Next config**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: Create global CSS**

```css
:root {
  color-scheme: light;
  --background: #f7f8f8;
  --foreground: #141817;
  --muted: #66706b;
  --line: #dfe5e1;
  --accent: #0f766e;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

main {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 20px;
}
```

- [ ] **Step 5: Create layout**

```tsx
import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Create first page**

```tsx
const summary = [
  { label: "Active wells", value: "3" },
  { label: "Open deferments", value: "1" },
  { label: "Ranked opportunities", value: "2" }
];

export default function Home() {
  return (
    <main>
      <header>
        <p style={{ color: "var(--accent)", fontWeight: 700 }}>Energy OS</p>
        <h1>Production review</h1>
        <p style={{ color: "var(--muted)", maxWidth: 720 }}>
          Local-first upstream production workspace using synthetic data.
        </p>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginTop: 24 }}>
        {summary.map((item) => (
          <article key={item.label} style={{ border: "1px solid var(--line)", borderRadius: 8, padding: 16, background: "#fff" }}>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>{item.label}</div>
            <strong style={{ display: "block", fontSize: 28, marginTop: 8 }}>{item.value}</strong>
          </article>
        ))}
      </section>
    </main>
  );
}
```

- [ ] **Step 7: Run local build**

Run: `pnpm --filter @energy-os/web build`

Expected: Next.js build exits with code 0.

- [ ] **Step 8: Commit**

```bash
git add apps/web
git commit -m "feat: add web app shell"
```

### Task 7: Final Verification

**Files:**
- Modify: `docs/agent-handoff.md`

- [ ] **Step 1: Run full checks**

Run: `pnpm test`

Expected: all package tests pass.

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`

Expected: all TypeScript projects pass.

- [ ] **Step 3: Run build**

Run: `pnpm build`

Expected: all packages and the web app build successfully.

- [ ] **Step 4: Update handoff**

Record completed implementation status, verification commands, remaining manual QA, and blockers in `docs/agent-handoff.md`.

- [ ] **Step 5: Commit**

```bash
git add docs/agent-handoff.md
git commit -m "docs: update hybrid MVP handoff"
```

## Self-Review

- Spec coverage: The plan covers hybrid architecture, local-first execution, SaaS-ready package boundaries, synthetic data, domain validation, economics, import helpers, and the first web shell.
- Placeholder scan: No task uses placeholder implementation language. Each task lists exact files, commands, and code snippets.
- Type consistency: Entity field names match the current JSON schemas and domain model.
