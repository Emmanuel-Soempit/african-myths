# 07 · Writing Module: Service & Validator (poems, stories, articles)

## 1. Context
- The `writings` table, the `Writing` model, `resolveStatus`, `canDelete` and `calculateReadingTime` all come from spec 01.
- The upload endpoint `/api/v1/upload` with `folder=writings` comes from spec 05.
- There's no existing writing code. Follow the service pattern in `app/services/ethic_group/ethic_group_service.ts` (static methods that take `HttpContext`, flash errors, and return a result or `false`/`null`), and the validator style in `app/validators/ethnic_group.ts`.

## 2. Depends on
**01** and **05**.

## 3. Goal
One service that holds every rule for the writing lifecycle. Author and admin controllers (specs 08 and 09) only call it.

## 4. Backend tasks

### 4.1 Validator `app/validators/writing.ts`
```ts
export const createWritingValidator = vine.compile(vine.object({
  type: vine.enum(['poem', 'story', 'article']),
  title: vine.string().trim().minLength(1).maxLength(255),
  cultureId: vine.string().uuid(),
  excerpt: vine.string().trim().maxLength(1000).optional(),
  content: vine.string().optional(),         // Tiptap HTML
  thumbnail: vine.string().trim().maxLength(500).optional(),
  intent: vine.enum(['draft', 'submit']).optional(),  // which button was pressed
}))
export const updateWritingValidator = /* same fields, all optional except none required */
export const reviewWritingValidator = vine.compile(vine.object({
  decision: vine.enum(['approve', 'reject']),
  note: vine.string().trim().maxLength(2000).optional(),  // required when reject (enforce in service)
}))
```

### 4.2 `app/services/writing/writing_service.ts`
```ts
export class WritingService {
  static async create(ctx): Promise<Writing | null>
  static async update(ctx): Promise<Writing | null>
  static async submit(ctx): Promise<boolean>     // draft|rejected → pending
  static async withdraw(ctx): Promise<boolean>   // pending → draft
  static async delete(ctx): Promise<boolean>
  static async review(ctx): Promise<boolean>     // admin: pending → published|rejected

  // queries used by renderers (specs 08/09/10)
  static listForAuthor(userId: string, filters: { type?, status?, page, limit })
  static listForAdmin(filters: { type?, status?, cultureId?, page, limit })   // pending first
  static statsForAuthor(userId: string)   // counts by type and by status
  static publishedForCulture(cultureId: string)  // grouped by type
  static findPublished(id: string)         // preload culture, author.profile
}
```

**Rules:**
- [ ] **Ownership**: everything except `review` and the admin queries requires `writing.authorId === auth.user.id`, unless the active role is `admin`. A failed ownership check is reported as not found, so other users' writings aren't revealed.
- [ ] **create**:
  - `authorId = auth.user.id`.
  - The culture must exist and be `published`.
  - `status` is `pending` if `intent === 'submit'`, otherwise `draft`.
  - `minutesToRead = calculateReadingTime(content)`.
  - When `excerpt` is empty, generate it from the plain text of `content` (first 200 characters).
- [ ] **update**: authors can update only when the status is `draft` or `rejected`, which matches the editor being read-only for `pending` and `published`.
  - Updating a `rejected` writing moves it back to `draft`, keeping `review_note` until the next review.
  - If `intent === 'submit'`, the status becomes `pending`.
  - Recalculate `minutesToRead`.
- [ ] **submit**: allowed from `draft` or `rejected`, sets `pending`.
- [ ] **withdraw**: allowed from `pending`, sets `draft`.
- [ ] **delete**:
  - Authors: own writing, status `draft` only.
  - Admins: any writing (use `canDelete`).
- [ ] **review**: admin only (check `canPublish(role)`). Allowed only from `pending`.
  - Approve sets `status=published`, `publishedAt=now`, `reviewedBy=user.id` and `reviewNote=note ?? null`.
  - Reject requires a `note`, then sets `status=rejected`, `reviewedBy` and `reviewNote`.
- [ ] Do every status change through these methods. Never assign `status` straight from the request.
- [ ] Use `session.flashErrors({ error })` and `session.flash({ success })` messages, as in the rest of the codebase.

## 5. Routes / API contract
None here. Routes are defined in spec 08 (author) and spec 09 (admin).

## 6. Frontend tasks
None.

## 7. Permissions

| Action | Author (own) | Author (others') | Admin |
|---|---|---|---|
| create | ✅ | — | ✅ |
| update | draft/rejected | ❌ | ✅ any status (status unchanged unless via review) |
| submit | draft/rejected | ❌ | ✅ |
| withdraw | pending | ❌ | ✅ |
| delete | draft | ❌ | ✅ any |
| review | ❌ | ❌ | ✅ pending only |

## 8. Acceptance criteria
- [ ] Every rule above is covered by functional tests (spec 11), or at minimum by manual checks recorded in the PR.
- [ ] Creating a writing against a culture that isn't published fails with a flash error.
- [ ] Rejecting without a note fails.
- [ ] `published_at` is set only on approval.

## 9. Verification
```bash
npm run typecheck && npm run lint && npm test
```

## 10. Out of scope / do not touch
- Multiple cultures per writing, tags, collections, and comments.
- Revision history.
