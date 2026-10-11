export type ContentStatus = 'draft' | 'pending' | 'published' | 'rejected'
export type RoleName = 'admin' | 'editor' | 'author' | 'reader'

const VALID_STATUSES: ContentStatus[] = ['draft', 'pending', 'published', 'rejected']

function isValidStatus(value: string | undefined): value is ContentStatus {
  return !!value && (VALID_STATUSES as string[]).includes(value)
}

/**
 * requested: status the client asked for (may be undefined)
 * role: active role of the acting user
 * current: existing status (undefined on create)
 */
export function resolveStatus(
  requested: string | undefined,
  role: RoleName,
  current?: ContentStatus
): ContentStatus {
  if (role === 'admin') {
    return isValidStatus(requested) ? requested : (current ?? 'draft')
  }

  if (role === 'editor' || role === 'author') {
    if (requested === 'pending') return 'pending'
    if (requested === 'draft' && current !== 'published') return 'draft'
    if (current === 'published') return 'pending'
    if (current === 'pending') return 'pending'
    return 'draft'
  }

  throw new Error(`Role "${role}" cannot set content status`)
}

export function canPublish(role: RoleName): boolean {
  return role === 'admin'
}

export function canDelete(role: RoleName): boolean {
  return role === 'admin'
}
