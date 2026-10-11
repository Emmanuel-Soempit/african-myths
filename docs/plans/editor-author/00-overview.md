# 00 · Editor & Author Dashboards: Overview

Read this first. It defines the product rules, shared conventions and execution order for every spec in this folder.

## Goal
Finish two role-based dashboards:

- **Editor**: maintains reference data, meaning **ethnic groups**, their **sub-ethnic groups**, **cultures**, and the **myths** under each culture. Editors can **create and edit**, but **cannot delete** and **cannot publish**.
- **Author**: writes **poems, stories and articles**, each tied to exactly **one culture**. Authors manage only their own writings.
- **Admin**: reviews and publishes all content and is the only role that can delete.
- **Reader** (public): sees published writings on culture pages and on a writing detail page.

## Role / permission matrix

| Capability | Admin | Editor | Author | Reader |
|---|---|---|---|---|
| View `/admin/*` | ✅ | ❌ | ❌ | ❌ |
| View `/editor/*` | ✅ | ✅ | ❌ | ❌ |
| View `/author/*` | ✅ | ❌ | ✅ | ❌ |
| Create/edit ethnic groups & sub-groups | ✅ | ✅ | ❌ | ❌ |
| Delete ethnic groups & sub-groups | ✅ | ❌ | ❌ | ❌ |
| Create/edit cultures | ✅ | ✅ | ❌ | ❌ |
| Delete cultures | ✅ | ❌ | ❌ | ❌ |
| Create/edit myths | ✅ | ✅ | ❌ | ❌ |
| Delete myths | ✅ (not built yet, out of scope) | ❌ | ❌ | ❌ |
| Create/edit **own** writings | ✅ | ❌ | ✅ (only while `draft`/`rejected`) | ❌ |
| Delete **own** writings | ✅ (any) | ❌ | ✅ (only `draft`) | ❌ |
| Set status `published` / `rejected` | ✅ | ❌ | ❌ | ❌ |
| Set status `draft` / `pending` | ✅ | ✅ | ✅ | ❌ |
| Upload images | ✅ | ✅ | ✅ | ❌ |

Route access uses the existing `role` middleware (`app/middleware/role_middleware.ts`), which checks the user's **active** role (`user_metadata.active_role_id`). Admins are included in the editor and author route groups so they can use those screens too.

## Status workflow

```
draft ──submit──▶ pending ──admin approve──▶ published
  ▲                 │  └──admin reject──▶ rejected ──edit──▶ draft
  └──withdraw───────┘
```

- Applies to cultures, myths and writings.
- **Editor edits a `published` culture or myth**: the status becomes `pending`, which hides it from readers until an admin re-approves it. This is a known trade-off. Revision history is out of scope.
- All status decisions go through one helper, `resolveStatus()` (spec 01). Never trust the `status` field sent by the client.

## Shared conventions introduced by these specs
| Name | Where | Spec |
|---|---|---|
| `resolveStatus(requested, roleName, current)` | `app/util/content_status.ts` | 01 |
| `calculateReadingTime(html)` | `app/util/reading_time.ts` | 01 |
| `activeRoleName(ctx)` | `app/util/auth_util.ts` (add) | 01 |
| `CultureService` | `app/services/culture/culture_service.ts` | 02 |
| `MythService` | `app/services/myth/myth_service.ts` | 03 |
| `WritingService` | `app/services/writing/writing_service.ts` | 07 |
| `useDashboardContext()` | `inertia/shared/hooks/use_dashboard_context.ts` | 06 (also used by 02–04) |

`useDashboardContext()` returns:
```ts
{
  basePath: '/admin' | '/editor'       // from usePage().url
  apiBase: '/api/v1/admin' | '/api/v1/editor'
  role: 'admin' | 'editor' | 'author' | 'reader'  // from shared prop user.metadata.role.name
  can: { delete: boolean; publish: boolean }      // true only for admin
}
```
Specs 02–04 need this hook. If 06 isn't done yet, create the hook as the first step of whichever spec you start.

## Execution order

```
01-foundations
   ├── 02-culture-module
   ├── 03-myth-module
   ├── 04-ethnic-group-module
   └── 05-utils-module
          └── 06-editor-module
                 └── 07-writing-module
                        └── 08-author-module
                               └── 09-admin-moderation
                                      └── 10-reader-module
11-tests: write each spec's tests alongside it. The functional test setup has a dependency question, see the spec.
```

Specs 02–05 are independent of each other once 01 is merged.

## Definition of done (every spec)
- [ ] All checklist items in the spec are ticked.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes, with no new warnings in touched files.
- [ ] `npm test` passes.
- [ ] Migrations run cleanly on a fresh DB (`node ace migration:fresh && node ace db:seed`) when the spec adds migrations.
- [ ] The spec's manual verification steps have been done with `npm run dev`.
- [ ] Admin behaviour is unchanged unless the spec says otherwise.
- [ ] The PR description lists the spec number, what changed, and any deviations from the spec, with reasons.

## Out of scope for this whole effort
- Myth delete, user detail and settings pages, invitation acceptance.
- ~~Persistent storage for uploads~~ — done: `UploadService` (`app/services/upload/upload_service.ts`) supports Cloudinary via `STORAGE_DRIVER=cloudinary`.
- Revision history and diff review.
- Email notifications.
- Kubernetes and CI changes.

## Spec index
| # | File | Summary |
|---|---|---|
| 01 | [01-foundations.md](01-foundations.md) | Migrations, Writing model, status and reading-time helpers, role redirects |
| 02 | [02-culture-module.md](02-culture-module.md) | Extract CultureService. Editor create/edit for cultures |
| 03 | [03-myth-module.md](03-myth-module.md) | Extract MythService. Editor create/edit for myths |
| 04 | [04-ethnic-group-module.md](04-ethnic-group-module.md) | Editor create/edit for ethnic groups and sub-groups |
| 05 | [05-utils-module.md](05-utils-module.md) | Shared upload endpoint, culture search endpoint, cleanup |
| 06 | [06-editor-module.md](06-editor-module.md) | Editor routes, layout, pages, real dashboard |
| 07 | [07-writing-module.md](07-writing-module.md) | WritingService and validator |
| 08 | [08-author-module.md](08-author-module.md) | Author routes, layout, dashboard, writings list and editor |
| 09 | [09-admin-moderation.md](09-admin-moderation.md) | Admin writings list and review/approve flow |
| 10 | [10-reader-module.md](10-reader-module.md) | Public writing pages, culture page section |
| 11 | [11-tests.md](11-tests.md) | Unit and functional tests |
