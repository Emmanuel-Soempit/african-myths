# 11 · Tests: Unit & Functional

## 1. Context
- Japa is configured in `tests/bootstrap.ts` with the `assert()` and `pluginAdonisJS(app)` plugins. The `functional` suite starts the HTTP server.
- Suites in `adonisrc.ts`: `unit` (`tests/unit/**/*.spec.ts`, 2s timeout) and `functional` (`tests/functional/**/*.spec.ts`, 30s timeout).
- **There are no tests yet.** Only `tests/bootstrap.ts` exists.
- **Not installed**: `@japa/api-client`, plus the session and auth test helpers that functional HTTP tests need (`@adonisjs/session/plugins/api_client` and `@adonisjs/auth/plugins/api_client` ship with the installed packages but need `@japa/api-client`).
- The DB is PostgreSQL (`config/database.ts`). The test database is configured through env vars (`.env.test`).

## 2. Depends on
Write tests alongside each spec: unit tests with 01, and functional tests with 02–10.

## 3. Goal
Cover the permission and status rules automatically, so role regressions are caught.

## 4. Tasks

### 4.1 Unit tests (no new dependencies)
- [ ] `tests/unit/content_status.spec.ts`: one test per row of the table in spec 01 §4.5, plus `canPublish` and `canDelete`.
- [ ] `tests/unit/reading_time.spec.ts`: empty or null input gives 1, 199 words gives 1, 201 words gives 2, and HTML tags aren't counted.

### 4.2 Functional tests (need a new dev dependency, so flag it first)
> ⚠️ Adding `@japa/api-client` is a new dev dependency. Note it in the PR description. Use a version published at least 7 days ago and pin it with `^major.minor`.

Setup:
- [ ] `npm i -D @japa/api-client`.
- [ ] In `tests/bootstrap.ts`, add `apiClient()`, `sessionApiClient(app)` and `authApiClient(app)` to `plugins`.
- [ ] Add `.env.test`, which is **not committed** because `.env*` is gitignored. Add a committed `.env.test.example` with `DB_DATABASE=african_myths_test` and `SESSION_DRIVER=memory`.
- [ ] Wrap each test in a global transaction with `testUtils.db().withGlobalTransaction()`. Migrate in `runnerHooks.setup` with `() => testUtils.db().migrate()`.
- [ ] Factories (`database/factories/`), or a small helper `tests/helpers/users.ts`:
  - `makeUser(role: 'admin'|'editor'|'author'|'reader')` creates the user, profile, metadata with `activeRoleId`, and the role pivot.
  - Seed roles in setup, using the role seeder logic.

Test files:
- [ ] `tests/functional/editor_access.spec.ts`:
  - Logged-out, reader and author users hitting `/editor/dashboard` are redirected to `/auth/sign-in`.
  - An editor gets 200.
  - An editor hitting `/admin/dashboard` is redirected.
  - `DELETE /api/v1/admin/cultures/:id` as an editor is rejected, and the row still exists.
  - `DELETE /api/v1/editor/cultures/:id` returns 404.
- [ ] `tests/functional/editor_content.spec.ts`:
  - An editor creating a culture with `status=published` gets `draft`.
  - An editor updating a published culture leaves it `pending`.
  - The same two checks for myths.
  - An editor can create an ethnic group (with valid language and country fixtures).
- [ ] `tests/functional/author_writings.spec.ts`:
  - Create (draft), then update, then submit (pending), then update is blocked, then withdraw (draft), then delete.
  - Another author can't update, submit or delete (not-found).
  - Creating against an unpublished culture is rejected.
  - An author hitting `/editor/*` and `/admin/*` is redirected.
- [ ] `tests/functional/admin_review.spec.ts`:
  - Approving sets `published`, `published_at` and `reviewed_by`.
  - Rejecting without a note fails.
  - Rejecting with a note sets `rejected` and `review_note`.
  - Reviewing a writing that isn't pending fails.
  - Non-admins get redirected.
- [ ] `tests/functional/reader_visibility.spec.ts`:
  - `/writings/:id` returns not-found for draft, pending and rejected writings, and 200 for published ones.
  - `/myths/:id` returns not-found for draft myths.

## 5. Routes / API contract
None of its own. It tests the routes from specs 02–10.

## 6. Frontend tasks
None. Browser tests are out of scope.

## 7. Permissions
Not applicable.

## 8. Acceptance criteria
- [ ] `npm test` runs both suites green locally against a Postgres test DB.
- [ ] Every permission rule in `00-overview.md` has at least one functional assertion.

## 9. Verification
```bash
docker compose up -d   # local postgres
createdb -h 127.0.0.1 -U root african_myths_test   # once
NODE_ENV=test npm test
```

## 10. Out of scope / do not touch
- Adding tests to CI (`.github/workflows/deploy.yml`). Propose it in the PR, don't change it.
- Browser (Playwright) tests.
