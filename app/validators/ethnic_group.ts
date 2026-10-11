import vine from '@vinejs/vine'

export const createEthnicGroupValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(255),
    
    primaryLanguage: vine
      .string()
      .uuid(),
    
    description: vine
      .string()
      .trim()
      .maxLength(2000)
      .optional(),
    
    countries: vine
      .array(
        vine.object({
          countryId: vine
            .string()
            .uuid(),
          
          populationEstimate: vine
            .string()
            .trim()
            .maxLength(100)
            .optional(),
          
          source: vine
            .string()
            .trim()
            .maxLength(255)
            .optional(),
          
          isPrimaryHome: vine
            .enum(['on', 'off', true, false])
            .optional(),
        })
      )
      .minLength(1),
    
    nameAliases: vine
      .array(
        vine.object({
          nameVariant: vine
            .string()
            .trim()
            .minLength(1)
            .maxLength(255),
          
          language: vine
            .string()
            .trim()
            .maxLength(100)
            .optional(),
          
          source: vine
            .string()
            .trim()
            .maxLength(255)
            .optional(),
        })
      )
      .minLength(1),
  })
)

export const createSubEthnicGroupValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(255),
    
    description: vine
      .string()
      .trim()
      .maxLength(2000)
      .optional(),
    
    countries: vine
      .array(
        vine.object({
          countryId: vine
            .string()
            .uuid(),
          
          populationEstimate: vine
            .string()
            .trim()
            .maxLength(100)
            .optional(),
          
          source: vine
            .string()
            .trim()
            .maxLength(255)
            .optional(),
          
          isPrimaryHome: vine
            .enum(['on', 'off', true, false])
            .optional(),
        })
      )
      .minLength(1),
  })
)