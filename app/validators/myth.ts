import vine from '@vinejs/vine'

export const mythValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    content: vine.string().optional(),
    source: vine.string().optional(),
    cultureId: vine.string().uuid(),
    subEthnicGroupId: vine.string().uuid().optional(),
    status: vine.string().optional(),
    thumbnail: vine.string().optional(),
  })
)
