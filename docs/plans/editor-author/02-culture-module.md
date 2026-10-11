# 02 · Culture Module: Shared Service + Editor Create/Edit

## 1. Context
- **Controller logic is inline** in `app/controllers/admin_controller.ts`:
  - `createCulture` (~L107): reads `name` and `ethnicGroupId`, creates with `authorId = auth.user.id` and `status: 'draft'`, then redirects to `/admin/cultures`.
  - `updateCulture` (~L127): partial update of `name`, `ethnicGroupId`, `history`, `language`, `thumbnail` and `status`, then `redirect().back()`. **It accepts any status from the client.**
  - `deleteCulture` (~L154): `findOrFail` then delete, redirects to `/admin/cultures`.
- **Renderers** in `app/services/admin/admin_renderer.ts`:
  - `renderCultures` (~L188): paginated, sortable, preloads `ethnicGroup`, renders `admin/cultures`.
  - `renderCultureEdit` (~L210): renders `cultures/edit`.
  - `renderCultureOverview` (~L220): renders `admin/culture-overview`.
- **Routes**:
  - `start/routes/api.ts`: `POST/PUT/DELETE /api/v1/admin/cultures[/:id]` behind `auth` + `role(['admin'])`.
  - `start/routes/web.ts`: `/admin/cultures`, `/admin/cultures/:id`, `/admin/cultures/:id/edit`.
- **Frontend hardcodes admin URLs**:
  - `inertia/admin/features/cultures/page.tsx`: L31 `router.visit('/admin/cultures')`, L45 `router.delete('/api/v1/admin/cultures/:id')`, L127/L134 links.
  - `inertia/admin/features/cultures/overview_page.tsx`: L23 myths link, L31 `/admin/stories` link, L69 `router.put('/api/v1/admin/cultures/:id', { status })`, L96 breadcrumb, L139 edit link. There is a status `<select>` at ~L119.
  - `inertia/admin/features/cultures/components/add_culture_modal.tsx`: L61 `action="/api/v1/admin/cultures"`.
  - `inertia/shared/features/cultures/culture_edit_view.tsx`: L16 `router.put('/api/v1/admin/cultures/:id')`, L116 `fetch('/api/v1/admin/upload')` (the upload URL changes in spec 05).
- `inertia/pages/cultures/edit.tsx` and `inertia/pages/admin/culture-overview.tsx` wrap the views in `AdminDashboardLayout`.

## 2. Depends on
- **01** (`resolveStatus`, `canDelete`, `AuthUtil.activeRoleName`).
- `useDashboardContext()`. If spec 06 hasn't created it yet, create it here, as defined in `00-overview.md`.

## 3. Goal
Move culture create/update/delete into one service used by both admin and editor. Let editors create and edit cultures under `/editor/...` without delete or publish rights.

## 4. Backend tasks

### 4.1 `app/services/culture/culture_service.ts`
```ts
export class CultureService {
  /** returns created Culture or null (errors flashed) */
  static async create(ctx: HttpContext): Promise<Culture | null>
  /** returns updated Culture or null */
  static async update(ctx: HttpContext): Promise<Culture | null>
  /** admin only; returns boolean */
  static async delete(ctx: HttpContext): Promise<boolean>
}
```
- [ ] `create`:
  - Validate `name` (required, 2–255) and `ethnicGroupId` (uuid, must exist).
  - Set `authorId = auth.user.id` and `status = resolveStatus(request.input('status'), role)`.
- [ ] `update`:
  - Same partial-update semantics as today.
  - `status = resolveStatus(request.input('status'), role, culture.status)`, applied on every update, so an editor's edit to a published culture sets it to `pending`.
- [ ] `delete`:
  - If `!canDelete(role)`, flash an error and return `false`.
  - Otherwise use the current delete logic.
- [ ] Add a VineJS validator `app/validators/culture.ts` (`createCultureValidator`, `updateCultureValidator`, all fields optional on update) and use it instead of `request.only`.

### 4.2 Controllers
- [ ] `AdminController.createCulture`, `updateCulture` and `deleteCulture` delegate to `CultureService` and keep their current redirects (`/admin/cultures`, back, `/admin/cultures`).
- [ ] `EditorController` (create the file if spec 06 hasn't) gets:
  - `createCulture`: redirects to `/editor/cultures`.
  - `updateCulture`: redirects back.
- [ ] **Renderers**: make `AdminRendererService.renderCultures`, `renderCultureEdit` and `renderCultureOverview` take an optional `view` arg (default the current admin page name), or move them into `CultureService.render*`. The editor renders its own pages (`editor/cultures`, `editor/culture-overview`, `editor/culture-edit`), built in spec 06.

## 5. Routes / API contract

| Method | Path | Middleware | Handler | Body | Response |
|---|---|---|---|---|---|
| POST | `/api/v1/admin/cultures` | auth, role(admin) | `AdminController.createCulture` | `name`, `ethnicGroupId` | redirect `/admin/cultures` |
| PUT | `/api/v1/admin/cultures/:id` | auth, role(admin) | `AdminController.updateCulture` | partial | redirect back |
| DELETE | `/api/v1/admin/cultures/:id` | auth, role(admin) | `AdminController.deleteCulture` | — | redirect `/admin/cultures` |
| POST | `/api/v1/editor/cultures` | auth, role(editor, admin) | `EditorController.createCulture` | `name`, `ethnicGroupId` | redirect `/editor/cultures` |
| PUT | `/api/v1/editor/cultures/:id` | auth, role(editor, admin) | `EditorController.updateCulture` | partial | redirect back |
| GET | `/editor/cultures` | auth, role(editor, admin) | `EditorController.renderCultures` | — | Inertia `editor/cultures` |
| GET | `/editor/cultures/:id` | auth, role(editor, admin) | `EditorController.renderCultureOverview` | — | Inertia `editor/culture-overview` |
| GET | `/editor/cultures/:id/edit` | auth, role(editor, admin) | `EditorController.renderCultureEdit` | — | Inertia `editor/culture-edit` |

There is no `DELETE /api/v1/editor/cultures/:id` route. Add the `/api/v1/editor` group in `start/routes/api.ts` if spec 06 hasn't.

## 6. Frontend tasks
- [ ] In every file listed in Context, replace hardcoded `/admin` and `/api/v1/admin` with `basePath` and `apiBase` from `useDashboardContext()`. The upload URL is handled in spec 05.
- [ ] `cultures/page.tsx`: render the delete action and confirm modal only when `can.delete`.
- [ ] `overview_page.tsx`:
  - When `!can.publish`, the status select offers only **Draft** and **Submit for review** (`pending`). If the current status is `published` or `rejected`, show it as a read-only badge next to the select.
  - The L31 "Stories" link points to `${basePath}/...writings` only for admins (spec 09). Hide it for editors.
- [ ] `add_culture_modal.tsx`: `action={`${apiBase}/cultures`}`.
- [ ] `culture_edit_view.tsx`: `router.put(`${apiBase}/cultures/${id}`)`.

## 7. Permissions
- Admin: create, edit, delete, any status.
- Editor: create and edit. Status is limited to draft and pending. Editing a published culture sets it to pending. No delete.

## 8. Acceptance criteria
- [ ] Admin culture create, edit, status change and delete work exactly as before.
- [ ] An editor can create a culture from `/editor/cultures`. It's saved as `draft`, with `author_id` set to the editor.
- [ ] An editor can edit a culture's history, language and thumbnail from `/editor/cultures/:id/edit`.
- [ ] An editor who sends `status=published` (e.g. with curl) gets a `draft` or `pending` result, never `published`.
- [ ] An editor's edit to a published culture leaves it `pending`.
- [ ] `DELETE /api/v1/editor/cultures/:id` returns 404, and `DELETE /api/v1/admin/cultures/:id` as an editor redirects to sign-in (role middleware).
- [ ] No delete button is shown to editors.

## 9. Verification
```bash
npm run typecheck && npm run lint && npm test
```
Manual: sign in as admin and as editor, then go through the acceptance list in `npm run dev`.

## 10. Out of scope / do not touch
- The editor layout and navigation (spec 06).
- The upload endpoint (spec 05).
- Myth routes under a culture (spec 03).
