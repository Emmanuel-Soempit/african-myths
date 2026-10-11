import { randomBytes } from 'node:crypto'
import Language from '#models/language'
import User from '#models/user'

export const AI_SOURCE = 'ai-generated'

export class PopulationSupport {
  /**
   * Placeholder language for ethnic groups whose language cannot be matched
   * confidently yet. Enrichment re-checks it.
   */
  static async ensureUnspecifiedLanguage(): Promise<Language> {
    const existing = await Language.findBy('name', 'Unspecified')
    if (existing) return existing
    return Language.create({
      name: 'Unspecified',
      familyId: 'unassigned',
      parentId: 'unassigned',
      level: 'language',
    })
  }

  /**
   * Dedicated system user that authors AI-generated cultures
   * (cultures.author_id is non-nullable). Cannot log in.
   */
  static async ensureAiCurator(): Promise<User> {
    const email = 'ai-curator@system.local'
    const existing = await User.findBy('email', email)
    if (existing) return existing

    const user = await User.create({
      email,
      password: randomBytes(32).toString('hex'),
    })
    await user.related('profile').create({
      firstName: 'AI',
      lastName: 'Curator',
    })
    await user.related('metadata').create({
      signUpMethod: 'email',
      signUpType: 'organic',
      emailVerifiedAt: null,
    })
    return user
  }

  static addUsage(
    total: { input: number; output: number },
    usage: { input: number; output: number }
  ) {
    total.input += usage.input
    total.output += usage.output
  }
}
