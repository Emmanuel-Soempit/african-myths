# 04 · Ethnic Group Module: Editor Create/Edit for Ethnic & Sub-Ethnic Groups

## 1. Context
- **The service already exists**: `app/services/ethic_group/ethic_group_service.ts` (`EthicGroupService`). Each method returns a `boolean`:
  - `createEthnicGroup` (~L11): `createEthnicGroupValidator`, plus countries and name aliases in a transaction.
  - `updateEthnicGroup` (~L49): updates base fields and **adds only new** countries and aliases. Removed ones are not deleted, which is existing behaviour, so don't change it.
  - `createSubEthnicGroup` (~L103), `updateSubEthnicGroup` (~L135)
  - `deleteSubEthnicGroup` (~L175), `deleteEthnicGroup` (~L202)
- **Validators**: `app/validators/ethnic_group.ts` (`createEthnicGroupValidator`, `createSubEthnicGroupValidator`).
- **Controller** wrappers in `app/controllers/admin_controller.ts`: `createEthnicGroup` (~L34), `updateEthnicGroup` (~L44), `createSubEthnicGroup` (~L53), `updateSubEthnicGroup` (~L62), `deleteSubEthnicGroup` (~L71), `deleteEthnicGroup` (~L80).
  - **Bug**: `deleteEthnicGroup` calls `redirect().toRoute('/admin/ethnic-groups')`. That's a path, not a route name, so it should be `toPath`.
- **Renderers** in `app/services/admin/admin_renderer.ts`:
  - `renderEthnicGroups` (~L124) renders `admin/ethnic-groups`.
  - `renderEthnicGroupDetail` (~L154) renders `admin/ethnic-group-detail`. If the group isn't found it returns `undefined` (blank response). It should 404 or render `errors/not_found`.
  - There are leftover `console.log` calls (~L145, ~L175, ~L177).
- **Routes** in `start/routes/api.ts`:
  - `/api/v1/admin/ethnic-groups` (POST, PUT `/:id`, DELETE `/:id`)
  - `/api/v1/admin/sub-ethnic-groups` (POST `/:ethnicGroupId`, PUT `/:id`, DELETE `/:id`)
- **Frontend hardcodes admin URLs**:
  - `inertia/admin/features/ethnic-groups/page.tsx`: L30 list visit, L71 detail link, L153 `router.delete(...)`.
  - `inertia/admin/features/ethnic-groups/detail_page.tsx`: L109 sub-group delete, L134/L141 breadcrumbs, L169 update form `action`.
  - `components/add_ethnic_group_modal.tsx` L129, `add_sub_ethnic_group_modal.tsx` L78, `update_sub_ethnic_group_modal.tsx` L91.
  - `components/view_sub_ethnic_group_modal.tsx` is read-only.

## 2. Depends on
- **01** (`canDelete`, `AuthUtil.activeRoleName`).
- `useDashboardContext()` (see 00).

## 3. Goal
Editors can create and edit ethnic groups and sub-ethnic groups through the existing service. Delete stays admin-only.

## 4. Backend tasks
- [ ] Add a defensive role check to `EthicGroupService.deleteEthnicGroup` and `deleteSubEthnicGroup`: `if (!canDelete(role)) { flash; return false }`.
- [ ] Move `renderEthnicGroups` and `renderEthnicGroupDetail` into `EthicGroupService.renderList(ctx, view)` and `renderDetail(ctx, view)`, or give the admin renderer a `view` param, so the editor reuses the queries.
  - Fix the not-found case: render `errors/not_found`, or use `findOrFail`.
  - Remove the `console.log` calls.
- [ ] `AdminController.deleteEthnicGroup`: change `toRoute` to `toPath`.
- [ ] `EditorController` gets:
  - `renderEthnicGroups`, rendering `editor/ethnic-groups`.
  - `renderEthnicGroupDetail`, rendering `editor/ethnic-group-detail`.
  - `createEthnicGroup`, redirecting to `/editor/ethnic-groups`.
  - `updateEthnicGroup`, redirecting to `/editor/ethnic-groups/:id`.
  - `createSubEthnicGroup`, redirecting to `/editor/ethnic-groups/:ethnicGroupId`.
  - `updateSubEthnicGroup`, redirecting back.

## 5. Routes / API contract

| Method | Path | Middleware | Handler | Response |
|---|---|---|---|---|
| GET | `/editor/ethnic-groups` | auth, role(editor, admin) | `EditorController.renderEthnicGroups` | Inertia `editor/ethnic-groups` |
| GET | `/editor/ethnic-groups/:id` | auth, role(editor, admin) | `EditorController.renderEthnicGroupDetail` | Inertia `editor/ethnic-group-detail` |
| POST | `/api/v1/editor/ethnic-groups` | auth, role(editor, admin) | `EditorController.createEthnicGroup` | redirect `/editor/ethnic-groups` |
| PUT | `/api/v1/editor/ethnic-groups/:id` | auth, role(editor, admin) | `EditorController.updateEthnicGroup` | redirect `/editor/ethnic-groups/:id` |
| POST | `/api/v1/editor/sub-ethnic-groups/:ethnicGroupId` | auth, role(editor, admin) | `EditorController.createSubEthnicGroup` | redirect `/editor/ethnic-groups/:ethnicGroupId` |
| PUT | `/api/v1/editor/sub-ethnic-groups/:id` | auth, role(editor, admin) | `EditorController.updateSubEthnicGroup` | redirect back |

No editor DELETE routes. The request bodies are unchanged; they match `createEthnicGroupValidator` and `createSubEthnicGroupValidator`.

Ethnic groups have no `status` column, so editor changes take effect immediately. That's acceptable because these are reference data. Adding status to ethnic groups is out of scope.

## 6. Frontend tasks
- [ ] Replace the hardcoded URLs in every file listed in Context with `basePath` and `apiBase`.
- [ ] Render delete buttons, delete confirm modals and their handlers only when `can.delete`:
  - `ethnic-groups/page.tsx` (group delete)
  - `detail_page.tsx` (sub-group delete)
- [ ] Breadcrumbs in `detail_page.tsx` use `basePath`.

## 7. Permissions
- Admin: full CRUD.
- Editor: create and edit groups and sub-groups. No delete.

## 8. Acceptance criteria
- [ ] Admin ethnic group and sub-group CRUD is unchanged, and deleting a group now redirects correctly.
- [ ] An editor can create a group with countries and aliases, edit it, and add or edit sub-groups.
- [ ] Editors see no delete controls. Editor DELETE requests to `/api/v1/admin/...` are rejected by the role middleware.
- [ ] `/editor/ethnic-groups/<unknown-uuid>` shows the not-found page instead of a blank response.

## 9. Verification
```bash
npm run typecheck && npm run lint && npm test
```

## 10. Out of scope / do not touch
- Changing how `updateEthnicGroup` merges countries and aliases.
- Adding status or moderation to ethnic groups.
