# Deployment

The public demo should remain deployable without private data or external services. The current app reads `datasets/synthetic-field-v0` and does not require credentials.

## Local Production Build

From the repository root:

```bash
corepack enable
pnpm install
pnpm --filter @energy-os/web build
```

The current public demo is configured as a static Next.js export. `apps/web/next.config.ts` writes the deployable output to `apps/web/out`, and `vercel.json` points Vercel at that directory.

Current production demo:

- https://energy-os-demo.vercel.app

## Vercel Preview

Use preview deployments for early sharing. Do not add production domains or environment secrets until the deployment process is intentionally reviewed.

Recommended command from the repository root:

```bash
vercel deploy -y
```

If the Vercel project prompts for settings, use:

- Framework: Other or static output from the root build command
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm --filter @energy-os/web build`
- Development command: `pnpm --filter @energy-os/web dev`
- Output directory: `apps/web/out`

## Production Deployment

Only promote or deploy to production after:

- `pnpm typecheck` passes.
- `pnpm test` passes.
- `pnpm build` passes.
- The demo uses synthetic or approved public data only.
- The public README points to a stable URL, not a one-off preview URL.
- Any future server-rendered, authenticated, or API-backed version intentionally revisits the static export setting.

Production deploy command:

```bash
vercel deploy --prod -y
```

## Data and Secret Rules

- Do not add real operator data, customer data, contracts, prices, credentials, or tokens to Vercel environment variables for the public demo.
- If future private deployments need secrets, refer to them by environment variable name only in docs.
- The public deployment should remain safe to inspect and share.
