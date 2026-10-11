import type { HttpContext } from '@adonisjs/core/http'
import Myth from '#models/myth'
import Culture from '#models/culture'

export class ReaderRendererService {
  public static async renderHome(ctx: HttpContext) {
    try {
      const cultures = await Culture.query()
        .preload('ethnicGroup')
        .where('status', 'published')
        .orderBy('created_at', 'desc')
        .limit(5)

      const myths = await Myth.query()
        .preload('culture')
        .where('status', 'published')
        .orderBy('created_at', 'desc')
        .limit(5)

      return ctx.inertia.render('home', {
        cultures: cultures.map((c) => c.serialize()),
        myths: myths.map((m) => m.serialize())
      })
    } catch (error) {
      console.error('renderHome error:', error)
      return ctx.inertia.render('errors/server_error', { error: error?.message || "Something went wrong" })
    }
  }

  public static async renderMythDetail(ctx: HttpContext) {
    try {
      const { id } = ctx.params
      const myth = await Myth.query()
        .where('id', id)
        .preload('culture')
        .firstOrFail()

      // Query up to 3 related myths from the same culture (excluding this one)
      const relatedMyths = await Myth.query()
        .where('cultureId', myth.cultureId)
        .whereNot('id', myth.id)
        .limit(3)

      return ctx.inertia.render('myths/detail', {
        myth: myth.serialize(),
        relatedMyths: relatedMyths.map((m) => m.serialize())
      })
    } catch (error) {
      console.error('renderMythDetail error:', error)
      return ctx.inertia.render('errors/server_error', { error: error?.message || "Something went wrong" })
    }
  }

  public static async renderCultureDetail(ctx: HttpContext) {
    try {
      const { id } = ctx.params
      const culture = await Culture.query()
        .where('id', id)
        .preload('ethnicGroup', (eg) => {
          eg.preload('language')
          eg.preload('ethnicGroupCountries', (egc) => {
            egc.preload('country')
          })
        })
        .firstOrFail()

      const myths = await Myth.query()
        .where('cultureId', culture.id)
        .where('status', 'published')
        .orderBy('created_at', 'desc')

      return ctx.inertia.render('cultures/detail', {
        culture: culture.serialize(),
        myths: myths.map((m) => m.serialize())
      })
    } catch (error) {
      console.error('renderCultureDetail error:', error)
      return ctx.inertia.render('errors/server_error', { error: error?.message || "Something went wrong" })
    }
  }
}
