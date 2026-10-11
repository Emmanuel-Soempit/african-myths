import vine from '@vinejs/vine'

export const inviteUserValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    firstName: vine.string().trim().minLength(2).maxLength(100),
    lastName: vine.string().trim().minLength(2).maxLength(100),
    roleId: vine.string().uuid(),
  })
)
