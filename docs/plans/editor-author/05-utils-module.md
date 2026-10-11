# 05 · Utils Module: Shared Upload, Culture Search, Cleanup

## 1. Context
- `app/controllers/utils_controller.ts`:
  - `searchLanguages` (~L13) and `searchCountry` (~L43): public, paginated, `ilike`.
  - `getLanguageById` (~L25) and `getCountryById` (~L55): contain `console.log` calls, and `throw new Error` when there is no id.
  - `uploadFile` (~L72): 5 MB image, moved to `public/cultures/<cuid>.<ext>`, returns `{ url }`.
  - `searchEthnicGroups` (~L99): public, limit 100.
  - `searchSubEthnicGroups` (~L115): **no route points to it**.
- `start/routes/api.ts`:
  - `/upload` sits inside the **admin-only** group (`/api/v1/admin/upload`), so editors and authors can't upload.
  - Public utils: `/api/v1/language`, `/api/v1/country`, `/api/v1/ethnic-group`.
- Upload callers:
  - `inertia/lib/tiptap-utils.ts` L403: `xhr.open("POST", "/api/v1/admin/upload")`, used by every Tiptap editor.
  - `inertia/shared/features/cultures/culture_edit_view.tsx` L116: `fetch('/api/v1/admin/upload')`.
- `inertia/shared/hooks/use_utils.ts` has fetchers for languages, countries and ethnic groups, but none for cultures.

## 2. Depends on
**01**, for the `writings` work that follows. This spec is otherwise independent.

## 3. Goal
Let admins, editors and authors upload images, add a culture search endpoint for the author's culture picker, and tidy the utils controller.

## 4. Backend tasks
- [ ] Add a role-protected upload route: `POST /api/v1/upload` behind `auth` + `role(['admin','editor','author'])`, handled by `UtilsController.uploadFile`.
- [ ] Keep `POST /api/v1/admin/upload` as an alias for one release, with a `// deprecated: use /api/v1/upload` comment. It can be removed once nothing calls it.
- [ ] `uploadFile` takes an optional `folder` input from a whitelist: `cultures | myths | writings` (default `cultures`). It moves the file to `public/<folder>` and returns `{ url: '/<folder>/<file>' }`.
- [ ] Add `searchCultures(ctx)`:
  - `GET /api/v1/culture?search=&limit=`, public.
  - Returns `[{ id, name, ethnicGroupName }]`, **published only**, ordered by name, limit 50.
- [ ] Add `GET /api/v1/sub-ethnic-group?search=&ethnicGroupId=`, handled by `searchSubEthnicGroups`. Add the optional `ethnicGroupId` filter.
- [ ] Remove the `console.log` calls. When there is no id, `getLanguageById` and `getCountryById` should return `response.badRequest` instead of throwing.

## 5. Routes / API contract

| Method | Path | Middleware | Handler | Params | Response |
|---|---|---|---|---|---|
| POST | `/api/v1/upload` | auth, role(admin, editor, author) | `UtilsController.uploadFile` | multipart `image`, optional `folder` | `200 { url }` / `400 { error }` |
| POST | `/api/v1/admin/upload` | auth, role(admin) | `UtilsController.uploadFile` | same | same (deprecated alias) |
| GET | `/api/v1/culture` | — | `UtilsController.searchCultures` | `search`, `limit` | `[{ id, name, ethnicGroupName }]` |
| GET | `/api/v1/sub-ethnic-group` | — | `UtilsController.searchSubEthnicGroups` | `search`, `ethnicGroupId` | `[{ id, canonicalName }]` |

Check that `/api/v1/culture` doesn't clash with the admin `/api/v1/admin/cultures` group. It doesn't, because the prefixes differ.

## 6. Frontend tasks
- [ ] `inertia/lib/tiptap-utils.ts` L403: use `/api/v1/upload`.
- [ ] `inertia/shared/features/cultures/culture_edit_view.tsx` L116: use `/api/v1/upload` with `folder=cultures`.
- [ ] `inertia/shared/hooks/use_utils.ts`: add `searchCultures(term)`, following the existing `searchEthnicGroups` pattern.

## 7. Permissions
- Upload: admin, editor and author.
- Search endpoints: public. Culture search returns published cultures only.

## 8. Acceptance criteria
- [ ] Image upload in the Tiptap editor works for an editor (for example in a myth) and, after spec 08, for an author.
- [ ] A reader, or a logged-out user, gets redirected or rejected when posting to `/api/v1/upload`.
- [ ] `GET /api/v1/culture?search=yor` returns only published cultures.
- [ ] `folder=../../etc` is rejected or falls back to `cultures`.

## 9. Verification
```bash
npm run typecheck && npm run lint && npm test
curl -s 'http://localhost:3333/api/v1/culture?search=a' | head
```

## 10. Out of scope / do not touch
- Persistent volume or object storage for uploads.
- Changing size or extension limits.
