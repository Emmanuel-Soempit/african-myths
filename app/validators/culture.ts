import vine from '@vinejs/vine'

export const createCultureValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    ethnicGroupId: vine.string().uuid(),
  })
)

export const updateCultureValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    ethnicGroupId: vine.string().uuid().optional(),
    history: vine.string().optional(),
    language: vine.string().optional(),
    thumbnail: vine.string().optional(),
    status: vine.string().optional(),
  })
)
