# 06 · Editor Module: Routes, Layout, Pages, Dashboard

## 1. Context
- **Unprotected route**: `start/routes/web.ts` registers `/editor/dashboard` with its middleware **commented out**: `// .use([middleware.auth(), middleware.role(['editor', 'admin'])])`. Anyone can open it.
- `app/controllers/editor_controller.ts` has only `renderDashboard`. `app/services/editor/editor_renderer.ts` renders `editor/dashboard` with no props.
- `inertia/pages/editor/dashboard.tsx` (~180 lines) is a **static mockup**: a hardcoded "Yoruba Culture" card, Google-hosted images, and buttons that do nothing.
- `inertia/editor/layout/editor-dashboard.tsx`:
  - The nav links point to `#`.
  - The user is hardcoded ("Olúwa Sola / Senior Editor").
  - Logout is `<Link href="/logout" method="post">`, a route that **doesn't exist** (the real one is `GET /api/v1/sign-out`).
  - The floating "Create New Myth Entry" button does nothing.
  - It uses the `editor-theme` CSS scope from `inertia/css/editor_styles.css`.
- `inertia/editor/layout/components/sidebar.tsx` is a second sidebar that isn't used.
- Shared Inertia props (`config/inertia.ts`) include `user`, with `metadata.role` and `profile` preloaded, and `flash`.
- The admin feature components reused here (cultures, myths, ethnic groups) are styled with `--color-admin-*` CSS variables. Admin layout reference: `inertia/admin/layout/admin-dashboard.tsx`, `components/sidebar.tsx`, `utils/sidebar_items.ts`.
- `AuthUtil.roleBasedRedirectRoute` sends editors to `/editor/dashboard` (spec 01).

## 2. Depends on
**01**, **02**, **03** and **04**, which supply the editor controller actions and renderers for cultures, myths and ethnic groups. This spec wires up the routes, layout and pages.

## 3. Goal
A working Editor dashboard: protected routes, a real layout, pages that reuse the shared features, and a dashboard built from real data.

## 4. Backend tasks

### 4.1 Routes: consolidate all editor routes
- [ ] `start/routes/web.ts`: replace the current editor block with one `/editor` group behind `.use([middleware.auth(), middleware.role(['editor', 'admin'])])`. It contains the dashboard plus every page route from specs 02, 03 and 04.
- [ ] `start/routes/api.ts`: one `/api/v1/editor` group with the same middleware, containing the POST and PUT routes from specs 02, 03 and 04. **No DELETE routes.**

### 4.2 `useDashboardContext` hook
If an earlier spec hasn't created it, add `inertia/shared/hooks/use_dashboard_context.ts` as specified in `00-overview.md`:
- `basePath` is `/editor` when `usePage().url` starts with `/editor`, and `/admin` otherwise.
- `role` comes from `usePage().props.user?.metadata?.role?.name`.
- `can.delete` and `can.publish` are both `role === 'admin'`.

### 4.3 Dashboard data: `EditorRendererService.renderDashboard`
Props:
```ts
{
  stats: { ethnicGroups: number; cultures: number; myths: number; myPending: number }
  mySubmissions: {
    cultures: Array<{ id, name, status, updatedAt }>
    myths: Array<{ id, name, cultureId, status, updatedAt }>
  } // author_id = current user, status in (draft, pending, rejected), latest 10 each
  recentlyUpdated: {
    cultures: Array<{ id, name, status, updatedAt, ethnicGroup: { canonicalName } }>
    myths: Array<{ id, name, cultureId, status, updatedAt, culture: { name } }>
  } // latest 5 each by updated_at
}
```
- [ ] Wrap it in try/catch and render `errors/server_error` on failure, following the existing pattern.

### 4.4 `EditorController`
- [ ] Make sure it has every handler named in specs 02–04 plus `renderDashboard`. Each handler is a one-line delegation to a service.

## 5. Routes / API contract (complete editor surface)

| Method | Path | Handler |
|---|---|---|
| GET | `/editor/dashboard` | `renderDashboard` |
| GET | `/editor/ethnic-groups` | `renderEthnicGroups` |
| GET | `/editor/ethnic-groups/:id` | `renderEthnicGroupDetail` |
| GET | `/editor/cultures` | `renderCultures` |
| GET | `/editor/cultures/:id` | `renderCultureOverview` |
| GET | `/editor/cultures/:id/edit` | `renderCultureEdit` |
| GET | `/editor/cultures/:cultureId/myths` | `renderMyths` |
| GET | `/editor/cultures/:cultureId/myths/create` | `renderMythCreate` |
| GET | `/editor/cultures/:cultureId/myths/:id/edit` | `renderMythEdit` |
| POST | `/api/v1/editor/ethnic-groups` | `createEthnicGroup` |
| PUT | `/api/v1/editor/ethnic-groups/:id` | `updateEthnicGroup` |
| POST | `/api/v1/editor/sub-ethnic-groups/:ethnicGroupId` | `createSubEthnicGroup` |
| PUT | `/api/v1/editor/sub-ethnic-groups/:id` | `updateSubEthnicGroup` |
| POST | `/api/v1/editor/cultures` | `createCulture` |
| PUT | `/api/v1/editor/cultures/:id` | `updateCulture` |
| POST | `/api/v1/editor/myths` | `createMyth` |
| PUT | `/api/v1/editor/myths/:id` | `updateMyth` |

All routes use the middleware `auth` + `role(['editor','admin'])`.

## 6. Frontend tasks

### 6.1 Layout `inertia/editor/layout/editor-dashboard.tsx`
- [ ] Nav items come from a new `inertia/editor/layout/utils/sidebar_items.ts` (Dashboard, Ethnic Groups, Cultures). The active state uses `usePage().url.startsWith(href)`.
- [ ] Show the user's real name (`profile.firstName lastName`) and role label from shared props. Use an initials avatar instead of the hardcoded Google image.
- [ ] Logout: `<Link href="/api/v1/sign-out">` (GET), the same as the admin sidebar.
- [ ] The floating action button links to `/editor/cultures`, labelled "Add or edit cultures".
- [ ] Remove the notification and help buttons, or leave them visually disabled. Don't wire them up.
- [ ] Add a `title` prop that sets `<Head title>`, and a `hideHeader` prop for full-screen editors, matching `AdminDashboardLayout`.
- [ ] Delete `inertia/editor/layout/components/sidebar.tsx`, or make the layout use it. Don't keep two sidebars.
- [ ] **Theme check**: the reused admin features rely on `--color-admin-*` variables. Make sure they're defined inside `.editor-theme` (in `inertia/css/editor_styles.css`), either by aliasing them to editor colours or by not overriding them. The pages must be readable and consistent.

### 6.2 Pages: new files under `inertia/pages/editor/`
Each page imports the existing feature component and sets `Page.layout = (page) => <EditorDashboardLayout title="...">{page}</EditorDashboardLayout>`.

| Page file | Feature component | Props from renderer |
|---|---|---|
| `ethnic-groups.tsx` | `~/admin/features/ethnic-groups/page` | same as `admin/ethnic-groups` |
| `ethnic-group-detail.tsx` | `~/admin/features/ethnic-groups/detail_page` | same as `admin/ethnic-group-detail` |
| `cultures.tsx` | `~/admin/features/cultures/page` | same as `admin/cultures` |
| `culture-overview.tsx` | `~/admin/features/cultures/overview_page` | same as `admin/culture-overview` |
| `culture-edit.tsx` | `~/shared/features/cultures/culture_edit_view` | `{ culture }` (use `hideHeader`) |
| `myths.tsx` | `~/admin/features/myths/page` | same as `admin/myths` |
| `myth-create.tsx` | `~/shared/features/myths/myth_create_view` | `{ subEthnicGroups, cultureId, myth? }` (use `hideHeader`) |

### 6.3 Dashboard `inertia/pages/editor/dashboard.tsx`
- [ ] Replace the mockup with `inertia/editor/features/dashboard/page.tsx`, using the props from §4.3:
  - Stat cards: ethnic groups, cultures, myths, and my pending items.
  - A "My submissions" table with status badges. Rejected rows are highlighted and link to the edit page.
  - "Recently updated" lists for cultures and myths, with edit links under `/editor/...`.
  - Quick actions: "New culture" (opens the cultures page) and "Browse ethnic groups".
- [ ] No hardcoded content or external image URLs.

## 7. Permissions
- Only `editor` and `admin` (active role) can reach `/editor/*` and `/api/v1/editor/*`.
- Inside the pages, delete and publish controls are hidden (specs 02–04, via `useDashboardContext`).

## 8. Acceptance criteria
- [ ] A logged-out visit to `/editor/dashboard` redirects to `/auth/sign-in`, and so does a visit with reader or author as the active role.
- [ ] Editor sign-in lands on `/editor/dashboard` with real counts.
- [ ] Every sidebar link works and highlights correctly.
- [ ] From the editor dashboard, an editor can go to Cultures, open a culture, edit it, open its myths, and create or edit a myth. Every redirect stays under `/editor`.
- [ ] Ethnic group and sub-group create and edit work under `/editor`.
- [ ] No delete buttons and no "Published" option anywhere under `/editor` for editors.
- [ ] Logout works.
- [ ] The dashboard has no dummy data.

## 9. Verification
```bash
npm run typecheck && npm run lint && npm test
```
Manual: walk through the acceptance list in `npm run dev` with an editor account. To create one, sign up, then pick "editor" on `/auth/roles`.

## 10. Out of scope / do not touch
- Editor account settings page (link it to `#` or hide it).
- Notifications.
- Admin layout changes.
