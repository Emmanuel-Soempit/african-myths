import vine from '@vinejs/vine'

export const emailRegistrationValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const user = await db.query().from('users').where('email', value).first()
        return !user
      })
      .trim(),
    firstName: vine.string().trim(),
    lastName: vine.string().trim(),
    password: vine.string().minLength(8).confirmed({ confirmationField: 'passwordConfirmation' }),
  })
)

export const emailSignInValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    password: vine.string().minLength(8),
  })
)
