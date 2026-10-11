import type { HttpContext } from '@adonisjs/core/http'
import Culture from '#models/culture'
import Myth from '#models/myth'
import EthnicGroup from '#models/ethnic_group'

export class EditorRendererService {
  public static async renderDashboard(ctx: HttpContext) {
    try {
      const userId = ctx.auth.user!.id

      const ethnicGroupsResult = await EthnicGroup.query().count('* as total')
      const ethnicGroups = Number(ethnicGroupsResult[0].$extras.total || 0)

      const culturesResult = await Culture.query().count('* as total')
      const cultures = Number(culturesResult[0].$extras.total || 0)

      const mythsResult = await Myth.query().count('* as total')
      const myths = Number(mythsResult[0].$extras.total || 0)

      const pendingCulturesResult = await Culture.query()
        .where('authorId', userId)
        .where('status', 'pending')
        .count('* as total')
      const pendingMythsResult = await Myth.query()
        .where('authorId', userId)
        .where('status', 'pending')
        .count('* as total')
      const myPending =
        Number(pendingCulturesResult[0].$extras.total || 0) +
        Number(pendingMythsResult[0].$extras.total || 0)

      const myStatuses = ['draft', 'pending', 'rejected']

      const myCultures = await Culture.query()
        .where('authorId', userId)
        .whereIn('status', myStatuses)
        .orderBy('updated_at', 'desc')
        .limit(10)

      const myMyths = await Myth.query()
        .where('authorId', userId)
        .whereIn('status', myStatuses)
        .orderBy('updated_at', 'desc')
        .limit(10)

      const recentCultures = await Culture.query()
        .preload('ethnicGroup')
        .orderBy('updated_at', 'desc')
        .limit(5)

      const recentMyths = await Myth.query()
        .preload('culture')
        .orderBy('updated_at', 'desc')
        .limit(5)

      return ctx.inertia.render('editor/dashboard', {
        stats: { ethnicGroups, cultures, myths, myPending },
        mySubmissions: {
          cultures: myCultures.map((c) => ({
            id: c.id,
            name: c.name,
            status: c.status,
            updatedAt: c.updatedAt?.toISO(),
          })),
          myths: myMyths.map((m) => ({
            id: m.id,
            name: m.name,
            cultureId: m.cultureId,
            status: m.status,
            updatedAt: m.updatedAt?.toISO(),
          })),
        },
        recentlyUpdated: {
          cultures: recentCultures.map((c) => ({
            id: c.id,
            name: c.name,
            status: c.status,
            updatedAt: c.updatedAt?.toISO(),
            ethnicGroup: { canonicalName: c.ethnicGroup?.canonicalName },
          })),
          myths: recentMyths.map((m) => ({
            id: m.id,
            name: m.name,
            cultureId: m.cultureId,
            status: m.status,
            updatedAt: m.updatedAt?.toISO(),
            culture: { name: m.culture?.name },
          })),
        },
      })
    } catch (error) {
      console.error('renderDashboard error:', error)
      return ctx.inertia.render('errors/server_error', {
        error: error?.message || 'Something went wrong',
      })
    }
  }
}
