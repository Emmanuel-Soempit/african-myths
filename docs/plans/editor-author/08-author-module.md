# 08 · Author Module: Routes, Controller, Layout, Dashboard, Writings

## 1. Context
- `inertia/author/` is **empty**. There's no author controller, renderer or route.
- Authors pick their role on `/auth/roles` (`inertia/authentication/features/roles-selection/page.tsx`, which posts to `/api/v1/assign-role`). After spec 01, `roleBasedRedirectRoute` sends authors to `/author/dashboard`.
- Reusable frontend pieces:
  - Tiptap editor wrapper: `inertia/shared/ui/editor-section.tsx` (used by `inertia/shared/features/myths/myth_create_view.tsx`). Note that `shared/features/myths/components/myth_content_editor.tsx` is a plain textarea mockup and is **not** Tiptap.
  - Form controls: `inertia/shared/ui/{input,select,textarea,button,confirm_delete_modal}.tsx`.
  - Table: `inertia/shared/ui/data-table` (`DataTable`, `Column<T>`, `PaginationMeta`, with `onPageChange`, `onSort`, `filters` and `renderActions`).
  - Layout pattern: `inertia/editor/layout/editor-dashboard.tsx`, after spec 06.
  - Culture search: `searchCultures` in `inertia/shared/hooks/use_utils.ts` (spec 05).
  - Upload: `/api/v1/upload` with `folder=writings` (spec 05). Tiptap uploads go through `inertia/lib/tiptap-utils.ts`.
- **Dummy code to replace**: `inertia/shared/features/stories/story_edit_view.tsx` (hardcoded `DEFAULT_STORY`).

## 2. Depends on
**05**, **06** (layout pattern) and **07** (`WritingService`).

## 3. Goal
Authors get a dashboard where they write poems, stories and articles, tie each one to a culture, and take it through draft → submit → (admin review) → published, or rejected and then fixed.

## 4. Backend tasks

### 4.1 `app/controllers/author_controller.ts`
Thin handlers:
- Pages: `renderDashboard`, `renderWritings`, `renderWritingCreate`, `renderWritingEdit`.
- Actions: `createWriting`, `updateWriting`, `submitWriting`, `withdrawWriting`, `deleteWriting`.

Action redirects:
- create: to `/author/writings/:id/edit`, so the author keeps editing (or to `/author/writings` if submitted).
- update: back.
- submit, withdraw, delete: to `/author/writings`.
- On failure: back.

### 4.2 `app/services/author/author_renderer.ts`
| Method | Inertia page | Props |
|---|---|---|
| `renderDashboard` | `author/dashboard` | `stats` (from `WritingService.statsForAuthor`: `{ byType: {poem,story,article}, byStatus: {draft,pending,published,rejected} }`), `recent` (latest 5), `rejected` (all rejected, with `reviewNote`) |
| `renderWritings` | `author/writings` | `writings` (paginated, from `listForAuthor`, preloading `culture`), `filters: { type, status }` |
| `renderWritingCreate` | `author/writing-edit` | `writing: null`, `type` (from `?type=`, default `story`) |
| `renderWritingEdit` | `author/writing-edit` | `writing` (own only, preloading `culture`), `readOnly: status in (pending, published)` |

## 5. Routes / API contract

**`start/routes/web.ts`**: group `/author` with `.use([middleware.auth(), middleware.role(['author','admin'])])`

| Method | Path | Handler |
|---|---|---|
| GET | `/author/dashboard` | `renderDashboard` |
| GET | `/author/writings` | `renderWritings` (query: `type`, `status`, `page`) |
| GET | `/author/writings/create` | `renderWritingCreate` (query: `type`) |
| GET | `/author/writings/:id/edit` | `renderWritingEdit` |

**`start/routes/api.ts`**: group `/api/v1/author` with the same middleware

| Method | Path | Handler | Body |
|---|---|---|---|
| POST | `/api/v1/author/writings` | `createWriting` | `type, title, cultureId, excerpt?, content?, thumbnail?, intent?` |
| PUT | `/api/v1/author/writings/:id` | `updateWriting` | same, all optional |
| POST | `/api/v1/author/writings/:id/submit` | `submitWriting` | — |
| POST | `/api/v1/author/writings/:id/withdraw` | `withdrawWriting` | — |
| DELETE | `/api/v1/author/writings/:id` | `deleteWriting` | — |

Register `/author/writings/create` **before** `/author/writings/:id/edit`. They can't clash, but keep the order for readability.

## 6. Frontend tasks

### 6.1 Layout `inertia/author/layout/author-dashboard.tsx`
- [ ] Same structure as the editor layout after spec 06: sidebar, header with the real user, `/api/v1/sign-out` logout, and `title` and `hideHeader` props.
- [ ] Nav from `inertia/author/layout/utils/sidebar_items.ts`:
  - Dashboard: `/author/dashboard`
  - Poems: `/author/writings?type=poem`
  - Stories: `/author/writings?type=story`
  - Articles: `/author/writings?type=article`
  - All Writings: `/author/writings`
- [ ] A floating "New writing" button opens a menu (Poem, Story or Article) that goes to `/author/writings/create?type=...`.
- [ ] Reuse the editor theme CSS, or add an `author-theme` that inherits it. Keep the visuals consistent.

### 6.2 Types: `inertia/types/writing.ts` (or extend `index.d.ts`)
```ts
export type WritingType = 'poem' | 'story' | 'article'
export type ContentStatus = 'draft' | 'pending' | 'published' | 'rejected'
export interface Writing { id; type; title; excerpt; content; thumbnail; cultureId; culture?: { id; name }; authorId; status; reviewNote; publishedAt; minutesToRead; createdAt; updatedAt }
```

### 6.3 Dashboard: `inertia/author/features/dashboard/page.tsx` and `inertia/pages/author/dashboard.tsx`
- [ ] Stat cards by type (poems, stories, articles) and by status.
- [ ] "Needs attention": rejected writings showing the `reviewNote` and an "Edit" link.
- [ ] Recent writings list.
- [ ] Three "New poem / story / article" buttons.

### 6.4 Writings list: `inertia/author/features/writings/page.tsx` and `inertia/pages/author/writings.tsx`
- [ ] `DataTable` columns: Title, Type, Culture, Status (badge), Updated, Actions.
- [ ] Filters (the `filters` slot): Type select and Status select. Changing one calls `router.visit('/author/writings', { data: {...}, preserveState: true })`.
- [ ] Actions per row, by status:
  - draft: Edit, Submit, Delete (with `confirm_delete_modal`)
  - pending: View, Withdraw
  - rejected: Edit, Submit
  - published: View public page (`/writings/:id`, spec 10)

### 6.5 Writing editor: `inertia/shared/features/writings/writing_edit_view.tsx` and `inertia/pages/author/writing-edit.tsx`
- [ ] Fields:
  - Type (segmented control: Poem, Story or Article)
  - Title
  - Culture (react-select async with `searchCultures`, required)
  - Excerpt (textarea, optional)
  - Thumbnail (upload to `/api/v1/upload` with `folder=writings`, plus a preview)
  - Content (`EditorSection` / Tiptap)
- [ ] Buttons: **Save draft** (`intent=draft`) and **Submit for review** (`intent=submit`).
  - Create posts to `/api/v1/author/writings`.
  - Edit puts to `/api/v1/author/writings/:id`.
- [ ] When the writing is `rejected`, show a banner with the `reviewNote`.
- [ ] When `readOnly` (pending or published), disable all inputs. For pending, show only a **Withdraw** button.
- [ ] Toasts come from `flash` (via `react-hot-toast`, as elsewhere).
- [ ] The component takes a `mode: 'author' | 'admin-review'` prop. Spec 09 reuses it read-only with approve and reject controls.
- [ ] Delete `inertia/shared/features/stories/story_edit_view.tsx`. Its route is removed in spec 09.

## 7. Permissions
- Only `author` and `admin` can reach these routes.
- Authors see and act on their own writings only (enforced in `WritingService`).
- No author UI ever offers "Published".

## 8. Acceptance criteria
- [ ] An author signs in and lands on `/author/dashboard` with zero counts.
- [ ] An author creates a poem tied to a published culture, saves it as a draft, edits it, then submits it. The status goes draft → pending, and the editor becomes read-only.
- [ ] Withdraw returns it to draft.
- [ ] Deleting a draft works. There's no delete option for pending or published writings.
- [ ] After an admin rejects a writing (spec 09), the author sees the note on the dashboard and in the editor, can edit and resubmit, and the status goes rejected → draft → pending.
- [ ] Opening another author's writing (`/author/writings/<their-id>/edit`) shows not-found.
- [ ] Image upload works in the Tiptap content and the thumbnail.
- [ ] An editor or reader with that active role can't reach `/author/*`.

## 9. Verification
```bash
npm run typecheck && npm run lint && npm test
```
Manual: walk through the acceptance list with an author account and an admin account.

## 10. Out of scope / do not touch
- Public reader pages (spec 10).
- Admin review UI (spec 09).
- Author profile and settings.
