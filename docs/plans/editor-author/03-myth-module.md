# 03 · Myth Module: Shared Service + Editor Create/Edit

## 1. Context
- **Controller logic is inline** in `app/controllers/admin_controller.ts`:
  - `createMyth` (~L168):
    - Reads `name`, `content`, `status`, `source`, `cultureId` and `subEthnicGroupId`.
    - Takes an optional `thumbnailFile` (5 MB, jpg/png/jpeg/webp/gif) and uploads it via `UploadService.uploadImage(file, 'myths')` (`app/services/upload/upload_service.ts`). Otherwise it falls back to the `thumbnail` text input.
    - Calculates reading time inline, creates the myth with `authorId = auth.user.id`, and redirects to `/admin/cultures/:cultureId/myths`.
  - `updateMyth` (~L244): same flow on an existing myth. **It accepts any `status` from the client.**
  - There is no delete method (out of scope).
- **Renderers** in `app/services/admin/admin_renderer.ts`:
  - `renderMyths` (~L230): paginated by culture, preloads culture and author.profile, renders `admin/myths`.
  - `renderMythCreate` (~L260) and `renderMythEdit` (~L276): load the culture's sub-ethnic groups as `{ value, label }` and render `admin/myths/create` (the edit page passes `myth`).
- **Routes**:
  - `start/routes/api.ts`: `POST /api/v1/admin/myths` and `PUT /api/v1/admin/myths/:id`.
  - `start/routes/web.ts`: `/admin/cultures/:cultureId/myths`, `/create` and `/:id/edit`.
- **Frontend hardcodes admin URLs**:
  - `inertia/admin/features/myths/page.tsx`: L21 list visit, L112 edit link, L143 create link. L105 links to the public `/myths/:id`, which is fine.
  - `inertia/shared/features/myths/myth_create_view.tsx`:
    - L58: `action = isEdit ? '/api/v1/admin/myths/:id' : '/api/v1/admin/myths'`.
    - L68 and L101: redirects to `/admin/cultures/:cultureId/myths`.
    - The status select starts at ~L50 (`statusOptions`), with a hidden input at L84.
- `inertia/pages/admin/myths/create.tsx` wraps the view in `AdminDashboardLayout`.

## 2. Depends on
- **01** (`resolveStatus`, `calculateReadingTime`, `AuthUtil.activeRoleName`).
- `useDashboardContext()` (see 00).

## 3. Goal
Move myth create/update into one service used by admin and editor, and let editors create and edit myths under `/editor/cultures/:cultureId/myths`.

## 4. Backend tasks

### 4.1 `app/services/myth/myth_service.ts`
```ts
export class MythService {
  static async create(ctx: HttpContext): Promise<Myth | null>
  static async update(ctx: HttpContext): Promise<Myth | null>
  /** shared by create/update: UploadService upload or text fallback; on update, destroyByUrl the replaced thumbnail */
  private static async resolveThumbnail(ctx: HttpContext, current?: string): Promise<string | null /* null = invalid file, error flashed */>
}
```
- [ ] Move the logic out of `AdminController.createMyth` and `updateMyth` without changing behaviour, except:
  - `status = resolveStatus(request.input('status'), role, myth?.status)`.
  - `minutesToRead = calculateReadingTime(content)`.
  - Check that `cultureId` exists and that `subEthnicGroupId`, if provided, belongs to the culture's ethnic group.
- [ ] Add `app/validators/myth.ts` (`name` required 1–255, `content` optional string, `source` optional, `cultureId` uuid, `subEthnicGroupId` optional uuid, `status` optional string).
- [ ] **Renderers**: move `renderMyths`, `renderMythCreate` and `renderMythEdit` logic into `MythService.renderList/renderCreate/renderEdit(ctx, view)`. `view` is the Inertia page name, so admin and editor share the queries. The admin renderer delegates to them.

### 4.2 Controllers
- [ ] `AdminController.createMyth` and `updateMyth` delegate to `MythService` and redirect to `/admin/cultures/:cultureId/myths` on success, or back on failure.
- [ ] `EditorController` gets:
  - `renderMyths`, `renderMythCreate` and `renderMythEdit`, rendering `editor/myths` and `editor/myth-create` (pages built in spec 06).
  - `createMyth` and `updateMyth`, redirecting to `/editor/cultures/:cultureId/myths`.

## 5. Routes / API contract

| Method | Path | Middleware | Handler | Body | Response |
|---|---|---|---|---|---|
| POST | `/api/v1/admin/myths` | auth, role(admin) | `AdminController.createMyth` | multipart: `name`, `content`, `status`, `source`, `cultureId`, `subEthnicGroupId`, `thumbnailFile` or `thumbnail` | redirect `/admin/cultures/:cultureId/myths` |
| PUT | `/api/v1/admin/myths/:id` | auth, role(admin) | `AdminController.updateMyth` | same | same |
| POST | `/api/v1/editor/myths` | auth, role(editor, admin) | `EditorController.createMyth` | same | redirect `/editor/cultures/:cultureId/myths` |
| PUT | `/api/v1/editor/myths/:id` | auth, role(editor, admin) | `EditorController.updateMyth` | same | same |
| GET | `/editor/cultures/:cultureId/myths` | auth, role(editor, admin) | `EditorController.renderMyths` | — | Inertia `editor/myths` |
| GET | `/editor/cultures/:cultureId/myths/create` | auth, role(editor, admin) | `EditorController.renderMythCreate` | — | Inertia `editor/myth-create` |
| GET | `/editor/cultures/:cultureId/myths/:id/edit` | auth, role(editor, admin) | `EditorController.renderMythEdit` | — | Inertia `editor/myth-create` (with `myth`) |

## 6. Frontend tasks
- [ ] `admin/features/myths/page.tsx`: use `basePath` for the list, create and edit links.
- [ ] `shared/features/myths/myth_create_view.tsx`:
  - The `action` uses `apiBase`, and the redirects and cancel use `basePath`.
  - `statusOptions` are filtered by `can.publish`. Non-admins get `Draft` and `Submit for review` (`pending`) only. If an existing myth is `published` or `rejected`, show its status as a read-only badge.
- [ ] The Tiptap upload URL is changed in spec 05. Don't touch it here.

## 7. Permissions
- Admin: create, edit, any status.
- Editor: create and edit. Status is limited to draft and pending. Editing a published myth sets it to pending.
- Nobody deletes in this spec.

## 8. Acceptance criteria
- [ ] Admin myth create and edit, including the thumbnail upload, behave exactly as before.
- [ ] An editor can create a myth under a culture with a sub-ethnic group, a thumbnail and long rich content (over 255 characters, relying on spec 01's fix).
- [ ] An editor's `status=published` request is downgraded. An editor's edit to a published myth leaves it `pending`.
- [ ] `minutes_to_read` is calculated with `calculateReadingTime`.
- [ ] `AdminController` no longer contains the reading-time or upload code.

## 9. Verification
```bash
npm run typecheck && npm run lint && npm test
```
Manual: create and edit a myth as admin, then as editor. Check the DB status values.

## 10. Out of scope / do not touch
- Myth delete.
- Reader myth pages (spec 10 only adds a `published` filter).
- The upload endpoint path (spec 05).
