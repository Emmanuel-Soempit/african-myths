# 10 · Reader Module: Public Writing Pages

## 1. Context
- `app/controllers/reader_controller.ts`: `renderHome`, `renderMythDetail`, `renderCultureDetail`.
- `app/services/reader/reader_renderer.ts`:
  - `renderHome` (~L6): latest 5 published cultures and myths.
  - `renderMythDetail` (~L30): **doesn't filter by `published`**, so draft and pending myths are publicly reachable by id. Its related myths aren't filtered either.
  - `renderCultureDetail` (~L54): preloads the culture's ethnic group, language and countries, plus its published myths. **It doesn't check that the culture itself is published.**
- `start/routes/web.ts`: `/`, `/cultures/:id`, `/myths/:id`.
- Frontend:
  - `inertia/pages/cultures/detail.tsx` renders `inertia/reader/features/culture-detail/page.tsx`. Its sections use components from `culture-detail/components/` (`myths-section.tsx`, `section-card.tsx`, ...) and fall back to `culture_dummy`.
  - `inertia/pages/myths/detail.tsx` renders `inertia/reader/features/myth-detail/page.tsx`, with components in `myth-detail/components/` (e.g. `bread-crumbs.tsx`).
- `WritingService.publishedForCulture` and `findPublished` come from spec 07.

## 2. Depends on
**07**. Approved content to test with comes from **09**.

## 3. Goal
Readers can read published poems, stories and articles, and find them from the culture page. Nothing unpublished is publicly visible.

## 4. Backend tasks
- [ ] Add `ReaderRendererService.renderWritingDetail`:
  - `findPublished(id)`, or render `errors/not_found` if it isn't published or doesn't exist.
  - Props: `writing` (with `culture` and the author's display name only, **not** email), and `related` (up to 3 other published writings from the same culture).
- [ ] `ReaderController.renderWritingDetail` delegates to it.
- [ ] `renderCultureDetail`:
  - Add a `writings` prop: `{ poems: Writing[], stories: Writing[], articles: Writing[] }` from `publishedForCulture`.
  - Render not-found if the culture isn't `published`.
- [ ] `renderMythDetail`: add `.where('status', 'published')` to the main query and to the related query.
- [ ] When serialising, never expose the author's `email` or `password` (the `password` is already `serializeAs: null`). Select only the profile name.

## 5. Routes / API contract

| Method | Path | Middleware | Handler | Response |
|---|---|---|---|---|
| GET | `/writings/:id` | — (public) | `ReaderController.renderWritingDetail` | Inertia `writings/detail` |

Register it next to `/myths/:id` in `start/routes/web.ts`.

## 6. Frontend tasks
- [ ] `inertia/pages/writings/detail.tsx` renders the new `inertia/reader/features/writing-detail/page.tsx`. Use the reader layout that the myth detail page uses, and reuse `myth-detail` components where they fit (breadcrumbs, hero).
  - Show: type badge, title, culture link (`/cultures/:id`), author name, reading time, published date, thumbnail, and the content rendered as HTML (same approach as myth detail).
  - Poems keep their line breaks and are centred. Use a `type === 'poem'` style variant.
  - Related writings at the bottom.
- [ ] `inertia/reader/features/culture-detail/page.tsx`: add a "Poems, Stories & Articles" section built from a new `components/writings-section.tsx`, with tabs or sub-headings per type and cards linking to `/writings/:id`. Hide the section when there are no writings. **Don't** fall back to dummy data for this section.
- [ ] Add a `Writing` reader type in `inertia/reader/features/writing-detail/types/index.d.ts`, or reuse `inertia/types`.

## 7. Permissions
Public, and published content only.

## 8. Acceptance criteria
- [ ] After admin approval, a writing appears on its culture's page under the right type and opens at `/writings/:id`.
- [ ] Draft, pending and rejected writings return not-found at `/writings/:id`.
- [ ] Draft and pending myths return not-found at `/myths/:id`. Related myths show published ones only.
- [ ] An unpublished culture returns not-found at `/cultures/:id`.
- [ ] No author email appears in the page props (check the `data-page` JSON in view-source).

## 9. Verification
```bash
npm run typecheck && npm run lint && npm test
```

## 10. Out of scope / do not touch
- Removing the existing dummy fallbacks on the home, culture and myth pages. That's tracked separately. Only the new writings section must have no dummy data.
- A writings section on the home page, search, comments.
