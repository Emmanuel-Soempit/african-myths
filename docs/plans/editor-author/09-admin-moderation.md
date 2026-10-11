# 09 · Admin Moderation: Writings List & Review

## 1. Context
- `start/routes/web.ts` (admin group) has:
  - `router.on('/').renderInertia('admin/stories')` under the `stories` prefix. This is static with no data.
  - `router.on('/:id/edit').renderInertia('stories/edit')`, which renders the dummy `story_edit_view`.
- `inertia/pages/admin/stories.tsx` renders `inertia/admin/features/stories/page.tsx`. That page loops over `ADMIN_STORIES` from `inertia/admin/features/stories/utils/dummy.ts`, and its type lives in `stories/types/index.ts`.
- `inertia/pages/stories/edit.tsx` wraps `~/shared/features/stories/story_edit_view` (dummy).
- Admin sidebar: `inertia/admin/layout/utils/sidebar_items.ts` (Dashboard, Ethnic Groups, Cultures, Users, Settings). There's no Stories entry.
- `inertia/admin/features/cultures/overview_page.tsx` L31 links to `/admin/stories`.
- `AdminRendererService.renderDashboard` (`app/services/admin/admin_renderer.ts` ~L11) calculates `pendingApprovals` from pending cultures and myths only.
- `WritingService.listForAdmin` and `review` come from spec 07. `writing_edit_view` with `mode="admin-review"` comes from spec 08.

## 2. Depends on
**07** and **08**.

## 3. Goal
Admins can see every writing, filter it, and approve or reject pending ones with a note. Remove the dummy stories code.

## 4. Backend tasks
- [ ] Add to `AdminController`:
  - `renderWritings`: calls `AdminRendererService.renderWritings`, rendering `admin/writings`.
  - `renderWritingReview`: renders `admin/writing-review`.
  - `reviewWriting`: calls `WritingService.review`, then redirects to `/admin/writings` on success, or back on failure.
  - `deleteWriting`: calls `WritingService.delete`, then redirects to `/admin/writings`.
- [ ] `AdminRendererService.renderWritings`:
  - Props: `writings` (paginated, from `WritingService.listForAdmin` with `type`, `status` and `cultureId` filters and `pending` first, preloading `culture` and `author.profile`), `filters`.
- [ ] `AdminRendererService.renderWritingReview`:
  - Props: `writing` (preloading `culture`, `author.profile` and `reviewer.profile`).
- [ ] `AdminRendererService.renderDashboard`: add pending writings to `pendingApprovals`, and add a `pendingWritings` count to `stats`.

## 5. Routes / API contract

**web.ts** (inside the existing admin group, which already has `auth` + `role(['admin'])`). Replace the `stories` block:

| Method | Path | Handler |
|---|---|---|
| GET | `/admin/writings` | `AdminController.renderWritings` (query: `type`, `status`, `cultureId`, `page`) |
| GET | `/admin/writings/:id` | `AdminController.renderWritingReview` |
| GET | `/admin/stories` | `router.redirect('/admin/writings')`, kept for old links |

**api.ts** (inside the existing `/api/v1/admin` group):

| Method | Path | Handler | Body |
|---|---|---|---|
| PUT | `/api/v1/admin/writings/:id/review` | `AdminController.reviewWriting` | `decision: approve|reject`, `note?` (required for reject) |
| DELETE | `/api/v1/admin/writings/:id` | `AdminController.deleteWriting` | — |

## 6. Frontend tasks
- [ ] Rename `inertia/admin/features/stories/` to `inertia/admin/features/writings/`.
  - `page.tsx` becomes a `DataTable` with columns Title, Type, Culture, Author, Status, Submitted/Updated, and Actions (Review, Delete).
  - Filters: Type, Status (default `pending`) and Culture (async select).
  - Delete `utils/dummy.ts` and update `types/index.ts` to the real `Writing` shape (or import from `inertia/types`).
- [ ] `inertia/pages/admin/stories.tsx` becomes `inertia/pages/admin/writings.tsx`.
- [ ] New `inertia/pages/admin/writing-review.tsx`:
  - Uses `writing_edit_view` with `mode="admin-review"`, read-only content and `hideHeader`.
  - Review panel: **Approve** and **Reject**, plus a note textarea that's required for Reject. Posts to `PUT /api/v1/admin/writings/:id/review`.
  - Shows the previous `reviewNote` and the reviewer if there are any.
  - The panel is hidden unless the status is `pending`.
- [ ] Delete `inertia/pages/stories/edit.tsx` and `inertia/shared/features/stories/` (if spec 08 hasn't already).
- [ ] `sidebar_items.ts`: add `{ label: 'Writings', icon: 'history_edu', href: '/admin/writings' }` after Cultures.
- [ ] `cultures/overview_page.tsx` L31: link to `/admin/writings?cultureId=${culture.id}`. Admin only, as noted in spec 02.
- [ ] Admin home stats (`inertia/admin/features/home/components/stats.tsx`): the pending approvals card links to `/admin/writings?status=pending`.

## 7. Permissions
Admin only, enforced by the existing admin route groups and by `canPublish` and `canDelete` in `WritingService`.

## 8. Acceptance criteria
- [ ] `/admin/writings` lists real writings, with pending first. The filters work and pagination works.
- [ ] Approving a pending writing sets `published`, `published_at` and `reviewed_by`, and the writing shows on the reader site (spec 10).
- [ ] Rejecting without a note is blocked. With a note, the status becomes `rejected` and the author sees the note (spec 08).
- [ ] The review panel isn't shown for writings that aren't pending.
- [ ] The dashboard's pending approvals count includes writings.
- [ ] `/admin/stories` redirects to `/admin/writings`.
- [ ] No `ADMIN_STORIES`, `DEFAULT_STORY` or `story_edit_view` references remain (`grep -r "ADMIN_STORIES\|DEFAULT_STORY\|story_edit_view" inertia` returns nothing).

## 9. Verification
```bash
npm run typecheck && npm run lint && npm test
```

## 10. Out of scope / do not touch
- Review queues for cultures and myths. Admins keep using the status select on those pages.
- Email notifications to authors.
