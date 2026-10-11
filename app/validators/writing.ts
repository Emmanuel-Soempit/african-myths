import vine from '@vinejs/vine'

export const createWritingValidator = vine.compile(
  vine.object({
    type: vine.enum(['poem', 'story', 'article']),
    title: vine.string().trim().minLength(1).maxLength(255),
    cultureId: vine.string().uuid(),
    excerpt: vine.string().trim().maxLength(1000).optional(),
    content: vine.string().optional(),
    thumbnail: vine.string().trim().maxLength(500).optional(),
    intent: vine.enum(['draft', 'submit']).optional(),
  })
)

export const updateWritingValidator = vine.compile(
  vine.object({
    type: vine.enum(['poem', 'story', 'article']).optional(),
    title: vine.string().trim().minLength(1).maxLength(255).optional(),
    cultureId: vine.string().uuid().optional(),
    excerpt: vine.string().trim().maxLength(1000).optional(),
    content: vine.string().optional(),
    thumbnail: vine.string().trim().maxLength(500).optional(),
    intent: vine.enum(['draft', 'submit']).optional(),
  })
)

export const reviewWritingValidator = vine.compile(
  vine.object({
    decision: vine.enum(['approve', 'reject']),
    note: vine.string().trim().maxLength(2000).optional(),
  })
)
