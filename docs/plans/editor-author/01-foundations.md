# 01 · Foundations: Schema, Writing Model, Helpers, Role Redirects

## 1. Context
- `database/migrations/1779483410781_create_myths_table.ts` defines `table.string("content")`, and `database/migrations/1779301503630_create_cultures_table.ts` defines `table.string("history")`. Both are **varchar(255)**, but they store Tiptap HTML. Saving anything longer than 255 characters fails. **This is an existing bug.**
- There is no model or table for poems, stories or articles. The admin "stories" page uses dummy data (`inertia/admin/features/stories/utils/dummy.ts`).
- Reading time is calculated inline, and duplicated, in `app/controllers/admin_controller.ts` (`createMyth` ~L168 and `updateMyth` ~L244): strip tags, count words, divide by 200, ceil, min 1.
- Nothing restricts which `status` a client can send. `updateCulture` (~L127) and `createMyth`/`updateMyth` accept `status` from the request as-is.
- `app/util/auth_util.ts` → `roleBasedRedirectRoute(role)` returns `/admin/dashboard` for admins and `/` for every other role.
- `app/services/auth/auth_service.ts` → `emailSignIn` (~L144) always redirects to `/`. `googleCallback` (~L76) and `assignRole` (~L173) already use `roleBasedRedirectRoute`.
- `app/models/culture.ts` and `app/models/user.ts` have `hasMany` for myths but no writings.

## 2. Depends on
Nothing. This spec must be merged before any other.

## 3. Goal
Lay down the schema and the shared helpers that every later spec relies on.

## 4. Backend tasks

### 4.1 Migration: widen content columns
- [ ] `node ace make:migration alter_content_columns_to_text --table=myths`
- [ ] In `up()`, alter `myths.content` to `text` and `cultures.history` to `text`. Use `this.schema.alterTable(..., t => t.text('content').alter())`. Do the same for `cultures.history` in the same migration.
- [ ] In `down()`, revert both columns to `string` (255). Add a comment noting that this can truncate data.

### 4.2 Migration: `writings` table
- [ ] `node ace make:migration create_writings_table`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | set in model `@beforeCreate` (same pattern as `Myth`) |
| `type` | enum `poem`,`story`,`article` | not null |
| `title` | string(255) | not null |
| `excerpt` | text | nullable |
| `content` | text | not null, default `''` |
| `thumbnail` | string | nullable |
| `culture_id` | uuid FK → `cultures.id` | `onDelete('CASCADE')`, not null, indexed |
| `author_id` | uuid FK → `users.id` | `onDelete('CASCADE')`, not null, indexed |
| `status` | enum `draft`,`pending`,`published`,`rejected` | default `draft`, indexed |
| `review_note` | text | nullable |
| `reviewed_by` | uuid FK → `users.id` | nullable, `onDelete('SET NULL')` |
| `published_at` | timestamp | nullable |
| `minutes_to_read` | float | default 0 |
| `created_at` / `updated_at` | timestamp | |

### 4.3 Model `app/models/writing.ts`
- [ ] Columns as above, camelCased (`cultureId`, `authorId`, `reviewNote`, `reviewedBy`, `publishedAt` as `@column.dateTime()`, `minutesToRead`).
- [ ] Export types: `export type WritingType = 'poem' | 'story' | 'article'` and `export type ContentStatus = 'draft' | 'pending' | 'published' | 'rejected'`. Put `ContentStatus` in `app/util/content_status.ts` and re-use it in `Culture`, `Myth` and `Writing` instead of the inline unions.
- [ ] Relations:
  - `@belongsTo(() => Culture)` as `culture`
  - `@belongsTo(() => User, { foreignKey: 'authorId' })` as `author`
  - `@belongsTo(() => User, { foreignKey: 'reviewedBy' })` as `reviewer`
- [ ] `@beforeCreate` assigns `randomUUID()` (same as `Myth`).
- [ ] `app/models/culture.ts`: add `@hasMany(() => Writing) declare writings`.
- [ ] `app/models/user.ts`: add `@hasMany(() => Writing, { foreignKey: 'authorId' }) declare writings`.

### 4.4 Helper `app/util/reading_time.ts`
```ts
export function calculateReadingTime(html: string | null | undefined): number
// strip tags → split on whitespace → Math.max(1, Math.ceil(words / 200)); empty → 1
```
- [ ] Don't refactor `AdminController` here. Specs 03 and 07 switch to this helper.

### 4.5 Helper `app/util/content_status.ts`
```ts
export type ContentStatus = 'draft' | 'pending' | 'published' | 'rejected'
export type RoleName = 'admin' | 'editor' | 'author' | 'reader'

/**
 * requested: status the client asked for (may be undefined)
 * role: active role of the acting user
 * current: existing status (undefined on create)
 */
export function resolveStatus(requested: string | undefined, role: RoleName, current?: ContentStatus): ContentStatus
export function canPublish(role: RoleName): boolean   // admin only
export function canDelete(role: RoleName): boolean    // admin only
```
Rules:
| role | requested | current | result |
|---|---|---|---|
| admin | any valid status | any | requested (or current/`draft` if undefined/invalid) |
| editor/author | `pending` | any | `pending` |
| editor/author | `draft` | any except `published` | `draft` |
| editor/author | `published`/`rejected`/invalid/undefined | `undefined` (create) | `draft` |
| editor/author | `published`/`rejected`/invalid/undefined | `draft`/`rejected` | `draft` |
| editor/author | anything | `published` | `pending` (an edit unpublishes it) |
| editor/author | `published`/`rejected`/invalid/undefined | `pending` | `pending` |
| reader | anything | — | throw (should never reach here) |

### 4.6 Auth helpers and redirects
- [ ] `app/util/auth_util.ts`:
  - `roleBasedRedirectRoute` maps `admin → /admin/dashboard`, `editor → /editor/dashboard`, `author → /author/dashboard`, and `reader → /`.
  - Add `static async activeRoleName(ctx: HttpContext): Promise<RoleName>`. It loads `metadata.role` on `ctx.auth.user` if needed and returns the role name. Services in 02, 03 and 07 use it.
- [ ] `app/services/auth/auth_service.ts` → `emailSignIn`: after login, load `metadata` with `role`, then redirect to `roleBasedRedirectRoute(user.metadata.role)`.

## 5. Routes / API contract
No route changes.

## 6. Frontend tasks
None.

## 7. Permissions
Defined by `resolveStatus`, `canPublish` and `canDelete`. These are the single source of truth for later specs.

## 8. Acceptance criteria
- [ ] `node ace migration:fresh && node ace db:seed` succeeds.
- [ ] A myth with more than 5,000 characters of HTML saves through the admin myth editor.
- [ ] The `writings` table exists with the FKs and indexes above.
- [ ] Signing in by email as an editor lands on `/editor/dashboard`, and as an author on `/author/dashboard`. Those routes may 404 until specs 06 and 08, which is fine.
- [ ] Unit tests for `resolveStatus` (every row of the table) and `calculateReadingTime` exist and pass (see spec 11).

## 9. Verification
```bash
node ace migration:fresh && node ace db:seed
npm run typecheck && npm run lint && npm test
```

## 10. Out of scope / do not touch
- Don't refactor controllers yet (specs 02 and 03).
- Don't touch `k8s/`, `.env` or the seeders' CSV logic.
