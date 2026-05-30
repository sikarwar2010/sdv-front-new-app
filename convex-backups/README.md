# Convex backup & deployment sync

Snapshots in this folder are full exports from a Convex deployment: **all table data** plus **file storage** (survey photos, etc.) when exported with `--include-file-storage`.

## Current project deployments

| Target | Deployment | CLI flag |
|--------|------------|----------|
| Dev (`.env.local`) | `dapper-frog-598` | *(default)* |
| Production | project default prod | `--prod` |

Backups may come from a different dev deployment (e.g. `basic-shark-848`). That is fine — import restores documents and storage blobs into whichever deployment you target.

## Quick restore (from existing ZIP)

**Dev** — replaces data in imported tables:

```powershell
npm run convex:import:dev -- convex-backups/convex-dev-basic-shark-848-with-storage-2026-05-30_172713.zip
```

**Production** — same snapshot, prod deployment:

```powershell
npm run convex:import:prod -- convex-backups/convex-dev-basic-shark-848-with-storage-2026-05-30_172713.zip
```

Scripts use `--replace-all -y`: existing rows in those tables are wiped and replaced; tables in the schema but absent from the ZIP are cleared. **Production import is destructive** — confirm before running.

## Export a fresh snapshot

From the machine linked to Convex (`npx convex login`):

```powershell
# Dev + storage
npm run convex:export:dev

# Production + storage
npm run convex:export:prod
```

Files are written here as `convex-<deployment>-with-storage-<timestamp>.zip`.

## Sync dev → production

1. Deploy backend code: `npm run deploy:backend`
2. Export dev (or use an existing ZIP): `npm run convex:export:dev`
3. Import into prod: `npm run convex:import:prod -- convex-backups/<your-export>.zip`

Code and schema must already be on prod before importing data.

## Verify after import

```powershell
npx convex data surveys --limit 3
npx convex data photos --limit 3
npx convex data --prod surveys --limit 3
```

Open [Convex dashboard → Files](https://dashboard.convex.dev) for the target deployment and confirm storage objects exist.

## Notes

- ZIP snapshots include a `_storage/` directory (JPEG/PNG blobs) and `_storage/documents.jsonl` (metadata). Import restores both when present.
- Clerk user IDs in `users` refer to your Clerk app; the same Clerk project must be used on web and mobile.
- Do not commit large ZIP files unless your team wants them in git; keep them in `convex-backups/` locally or in object storage.
- Extracted folders (`_inspect/`) are gitignored.
