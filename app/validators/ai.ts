import vine from '@vinejs/vine'

/*
|--------------------------------------------------------------------------
| Validators for DeepSeek JSON responses (AI population pipeline)
|--------------------------------------------------------------------------
| Used with vine.validate({ schema, data }) inside the populate services.
*/

export const groupListResponseSchema = vine.object({
  groups: vine
    .array(
      vine.object({
        canonicalName: vine.string().trim().minLength(2).maxLength(255),
        alternateNames: vine.array(vine.string().trim().maxLength(255)).optional(),
        primaryLanguageName: vine.string().trim().maxLength(255).optional(),
        estimatedPopulation: vine.string().trim().maxLength(255).optional(),
      })
    )
    .minLength(1)
    .maxLength(60),
})

export const groupEnrichResponseSchema = vine.object({
  description: vine.string().trim().minLength(50),
  alternateNames: vine.array(vine.string().trim().maxLength(255)).optional(),
  primaryLanguageName: vine.string().trim().maxLength(255).optional(),
  countries: vine
    .array(
      vine.object({
        isoAlpha2: vine.string().trim().minLength(2).maxLength(2),
        populationEstimate: vine.string().trim().maxLength(255).optional(),
        isPrimaryHome: vine.boolean().optional(),
      })
    )
    .maxLength(30)
    .optional(),
  subGroups: vine
    .array(
      vine.object({
        canonicalName: vine.string().trim().minLength(2).maxLength(255),
        description: vine.string().trim().optional(),
        countries: vine.array(vine.string().trim().maxLength(2)).optional(),
      })
    )
    .maxLength(30)
    .optional(),
})

export const cultureResponseSchema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(255),
  history: vine.string().trim().minLength(100),
  language: vine.string().trim().maxLength(255).optional(),
})
