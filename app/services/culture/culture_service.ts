import Culture from '#models/culture'
import { createCultureValidator, updateCultureValidator } from '#validators/culture'
import { canDelete, resolveStatus } from '../../util/content_status.js'
import AuthUtil from '../../util/auth_util.js'
import type { HttpContext } from '@adonisjs/core/http'

export class CultureService {
  /** returns created Culture or null (errors flashed) */
  public static async create(ctx: HttpContext): Promise<Culture | null> {
    const { name, ethnicGroupId } = await ctx.request.validateUsing(createCultureValidator)

    try {
      const role = await AuthUtil.activeRoleName(ctx)
      const culture = await Culture.create({
        name,
        ethnicGroupId,
        authorId: ctx.auth.user!.id,
        status: resolveStatus(ctx.request.input('status'), role),
      })
      return culture
    } catch (error) {
      console.error('createCulture error:', error)
      ctx.session.flashErrors({ error: 'Failed to create culture. Please try again.' })
      return null
    }
  }

  /** returns updated Culture or null */
  public static async update(ctx: HttpContext): Promise<Culture | null> {
    const { id } = ctx.params
    const payload = await ctx.request.validateUsing(updateCultureValidator)

    try {
      const culture = await Culture.find(id)
      if (!culture) {
        ctx.session.flashErrors({ error: 'Culture not found' })
        return null
      }

      const role = await AuthUtil.activeRoleName(ctx)

      if (payload.name !== undefined) culture.name = payload.name
      if (payload.ethnicGroupId !== undefined) culture.ethnicGroupId = payload.ethnicGroupId
      if (payload.history !== undefined) culture.history = payload.history
      if (payload.language !== undefined) culture.language = payload.language
      if (payload.thumbnail !== undefined) culture.thumbnail = payload.thumbnail
      culture.status = resolveStatus(payload.status, role, culture.status)

      await culture.save()
      return culture
    } catch (error) {
      console.error('updateCulture error:', error)
      ctx.session.flashErrors({ error: 'Failed to update culture. Please try again.' })
      return null
    }
  }

  /** admin only; returns boolean */
  public static async delete(ctx: HttpContext): Promise<boolean> {
    const role = await AuthUtil.activeRoleName(ctx)
    if (!canDelete(role)) {
      ctx.session.flashErrors({ error: 'You are not allowed to delete cultures' })
      return false
    }

    try {
      const culture = await Culture.find(ctx.params.id)
      if (!culture) {
        ctx.session.flashErrors({ error: 'Culture not found' })
        return false
      }
      await culture.delete()
      return true
    } catch (error) {
      console.error('deleteCulture error:', error)
      ctx.session.flashErrors({ error: 'Failed to delete culture. Please try again.' })
      return false
    }
  }

  // Renderers shared by the admin and editor dashboards

  public static async renderList(ctx: HttpContext, view: string) {
    const page = ctx.request.input('page', 1)
    const limit = 10
    const sortBy = ctx.request.input('sortBy', 'createdAt')
    const sortOrder = ctx.request.input('sortOrder', 'desc') as 'asc' | 'desc'

    let query = Culture.query()

    if (sortBy === 'name') {
      query = query.orderBy('name', sortOrder)
    }

    const cultures = await query.preload('ethnicGroup').paginate(page, limit)

    return ctx.inertia.render(view, {
      cultures,
      sortBy,
      sortOrder,
    })
  }

  public static async renderEdit(ctx: HttpContext, view: string) {
    const { id } = ctx.params
    const culture = await Culture.query().where('id', id).preload('ethnicGroup').firstOrFail()

    return ctx.inertia.render(view, { culture })
  }

  public static async renderOverview(ctx: HttpContext, view: string) {
    const { id } = ctx.params
    const culture = await Culture.query().where('id', id).preload('ethnicGroup').firstOrFail()

    return ctx.inertia.render(view, { culture })
  }
}
