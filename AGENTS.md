# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## Project
**African Myths & Stories** ("Kólà"): a platform for cataloguing African ethnic groups, cultures and myths, plus author-written poems, stories and articles.

Stack:
- **Backend**: AdonisJS 6 (TypeScript, ESM), Lucid ORM on PostgreSQL, `@adonisjs/auth` (session guard), `@adonisjs/ally` (Google), VineJS validators.
- **Frontend**: Inertia.js + React 19 (SSR enabled), Tiptap rich-text editor, Sass and Tailwind-style utility classes.
- **Infra**: Docker (multi-stage), Kubernetes via Kustomize (`k8s/`), GitHub Actions deploy (`.github/workflows/deploy.yml`).

## Commands
| Task | Command |
|---|---|
| Install | `npm ci` |
| Dev server (HMR) | `npm run dev` |
| Typecheck | `npm run typecheck` |
| Lint | `npm run lint` |
| Tests (Japa) | `npm test` (suites: `tests/unit/**/*.spec.ts`, `tests/functional/**/*.spec.ts`) |
| Migrations | `node ace migration:run` |
| Rollback | `node ace migration:rollback` |
| Seed roles, countries, languages | `node ace db:seed` (needs `country-codes.csv` and `languoid.csv` in the cwd) |
| Create migration | `node ace make:migration <name>` |
| Local Postgres | `docker compose up -d` |

Run `npm run typecheck` and `npm run lint` before declaring any task done.

## Layout
```
app/controllers/   Thin HTTP controllers. Delegate to services.
app/services/      Business logic, grouped by domain (admin/, auth/, editor/, ethic_group/, reader/ ...)
app/models/        Lucid models (uuid primary keys set in @beforeCreate)
app/validators/    VineJS validators
app/middleware/    auth, guest, role (role checks user_metadata.active_role_id)
app/util/          Small pure helpers
start/routes/      web.ts (Inertia pages), api.ts (/api/v1/* form/JSON actions)
database/          migrations/, seeders/
inertia/pages/     Inertia page entry points (route targets)
inertia/<persona>/ Feature code per persona: admin/, editor/, author/, reader/, authentication/
inertia/shared/    Components, features and hooks reused across personas
```

## Conventions
- Import with path aliases (`#controllers/*`, `#services/*`, `#models/*`, `#validators/*`, `#start/*`). On the frontend, use `~/...`.
- **Controllers stay thin.** Put logic in `app/services/<domain>/<domain>_service.ts` as `export class XService { public static async method(ctx) {} }`. Follow the existing style in `app/services/ethic_group/ethic_group_service.ts`.
- **Renderers.** Inertia page rendering lives in `app/services/<persona>/<persona>_renderer.ts`.
- **Errors.** Use `session.flashErrors({ error: '...' })` and `response.redirect().back()` for form actions. Render `errors/server_error` for page failures.
- **Roles and statuses.** Roles are `admin | editor | author | reader`. Content status is `draft | pending | published | rejected`.
- **Code style.** Don't add or remove comments unnecessarily. Match the formatting of the surrounding code (Prettier config: `@adonisjs/prettier-config`).

## Rules
- Never edit or commit `.env`, `k8s/overlays/*/secrets/secrets.yaml`, or any credentials.
- Don't change `k8s/`, `Dockerfile` or `.github/workflows/` unless the task says so.
- Don't push to `main`. Work on a feature branch and open a PR into `development`.
- Use one branch/PR per spec file in `docs/plans/`.
- Don't add npm dependencies without flagging it in the PR description.

## Active work
The Editor and Author dashboards are specified in [`docs/plans/editor-author/`](docs/plans/editor-author/00-overview.md). Start with `00-overview.md` and follow its execution order.
