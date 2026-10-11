import Culture from '#models/culture'
import Myth from '#models/myth'
import SubEthnicGroup from '#models/sub_ethnic_group'
import { mythValidator } from '#validators/myth'
import { resolveStatus } from '../../util/content_status.js'
import { calculateReadingTime } from '../../util/reading_time.js'
import AuthUtil from '../../util/auth_util.js'
import type { HttpContext } from '@adonisjs/core/http'
import { UploadService } from '#services/upload/upload_service'

export class MythService {
  public static async create(ctx: HttpContext): Promise<Myth | null> {
    const { name, content, status, source, cultureId, subEthnicGroupId } =
      await ctx.request.validateUsing(mythValidator)

    try {
      if (!(await MythService.validateRelations(ctx, cultureId, subEthnicGroupId))) {
        return null
      }

      const thumbnailUrl = await MythService.resolveThumbnail(ctx)
      if (thumbnailUrl === null) return null

      const role = await AuthUtil.activeRoleName(ctx)

      const myth = await Myth.create({
        name,
        thumbnail: thumbnailUrl,
        content: content || '',
        status: resolveStatus(status, role),
        source: source || '',
        cultureId,
        authorId: ctx.auth.user!.id,
        subEthnicGroupId,
        minutesToRead: calculateReadingTime(content),
      })

      return myth
    } catch (error) {
      console.error('createMyth error:', error)
      ctx.session.flashErrors({ error: 'Failed to create myth. Please try again.' })
      return null
    }
  }

  public static async update(ctx: HttpContext): Promise<Myth | null> {
    const { id } = ctx.params
    const { name, content, status, source, cultureId, subEthnicGroupId } =
      await ctx.request.validateUsing(mythValidator)

    try {
      const myth = await Myth.find(id)
      if (!myth) {
        ctx.session.flashErrors({ error: 'Myth not found' })
        return null
      }

      if (!(await MythService.validateRelations(ctx, cultureId, subEthnicGroupId))) {
        return null
      }

      const thumbnailUrl = await MythService.resolveThumbnail(ctx, myth.thumbnail)
      if (thumbnailUrl === null) return null

      const role = await AuthUtil.activeRoleName(ctx)

      myth.name = name
      if (thumbnailUrl !== undefined) myth.thumbnail = thumbnailUrl
      if (content !== undefined) {
        myth.content = content
        myth.minutesToRead = calculateReadingTime(content)
      }
      if (source !== undefined) myth.source = source
      if (subEthnicGroupId !== undefined) myth.subEthnicGroupId = subEthnicGroupId
      myth.status = resolveStatus(status, role, myth.status)

      await myth.save()
      return myth
    } catch (error) {
      console.error('updateMyth error:', error)
      ctx.session.flashErrors({ error: 'Failed to update myth. Please try again.' })
      return null
    }
  }

  private static async validateRelations(
    ctx: HttpContext,
    cultureId: string,
    subEthnicGroupId?: string
  ): Promise<boolean> {
    const culture = await Culture.find(cultureId)
    if (!culture) {
      ctx.session.flashErrors({ error: 'Culture not found' })
      return false
    }

    if (subEthnicGroupId) {
      const subEthnicGroup = await SubEthnicGroup.find(subEthnicGroupId)
      if (!subEthnicGroup || subEthnicGroup.ethnicGroupId !== culture.ethnicGroupId) {
        ctx.session.flashErrors({
          error: 'Sub-ethnic group does not belong to this culture',
        })
        return false
      }
    }

    return true
  }

  /** shared by create/update: handles thumbnailFile upload or text fallback. null = invalid file, error flashed */
  private static async resolveThumbnail(
    ctx: HttpContext,
    current?: string
  ): Promise<string | null | undefined> {
    const thumbnailFile = ctx.request.file('thumbnailFile', {
      size: '5mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
    })

    if (thumbnailFile) {
      if (!thumbnailFile.isValid) {
        ctx.session.flashErrors({
          error: 'Invalid thumbnail file. Please upload a valid image (max 5mb).',
        })
        return null
      }
      const { url } = await UploadService.uploadImage(thumbnailFile, 'myths')
      await UploadService.destroyByUrl(current)
      return url
    }

    const textUrl = ctx.request.input('thumbnail')
    if (textUrl !== undefined) return textUrl

    return current
  }

  // Renderers shared by the admin and editor dashboards

  public static async renderList(ctx: HttpContext, view: string) {
    try {
      const cultureId = ctx.params.cultureId || ctx.request.input('cultureId')

      if (!cultureId) {
        throw new Error('No culture appended to this request')
      }

      const page = ctx.request.input('page', 1)
      const limit = 10
      const sortBy = ctx.request.input('sortBy', 'createdAt')
      const sortOrder = ctx.request.input('sortOrder', 'desc') as 'asc' | 'desc'

      const myths = await Myth.query()
        .where('cultureId', cultureId)
        .preload('culture')
        .preload('author', (q) => q.preload('profile'))
        .orderBy(sortBy === 'title' ? 'title' : 'created_at', sortOrder)
        .paginate(page, limit)

      return ctx.inertia.render(view, { myths, sortBy, sortOrder, cultureId })
    } catch (error) {
      console.error('renderMyths error:', error)
      return ctx.inertia.render('errors/server_error', {
        error: error?.message || 'Something went wrong',
      })
    }
  }

  public static async renderCreate(ctx: HttpContext, view: string) {
    try {
      const cultureId = ctx.params.cultureId || ctx.request.input('cultureId')
      const culture = await Culture.query()
        .where('id', cultureId)
        .preload('ethnicGroup')
        .firstOrFail()
      const subEthnicGroups = await SubEthnicGroup.query().where(
        'ethnicGroupId',
        culture.ethnicGroupId
      )

      return ctx.inertia.render(view, {
        subEthnicGroups: subEthnicGroups.map((c) => ({ value: c.id, label: c.canonicalName })),
        cultureId,
      })
    } catch (error) {
      return ctx.inertia.render('errors/server_error', {
        error: error?.message || 'Something went wrong',
      })
    }
  }

  public static async renderEdit(ctx: HttpContext, view: string) {
    try {
      const { id, cultureId } = ctx.params
      const myth = await Myth.findOrFail(id)

      const culture = await Culture.query()
        .where('id', cultureId)
        .preload('ethnicGroup')
        .firstOrFail()
      const subEthnicGroups = await SubEthnicGroup.query().where(
        'ethnicGroupId',
        culture.ethnicGroupId
      )

      return ctx.inertia.render(view, {
        subEthnicGroups: subEthnicGroups.map((c) => ({ value: c.id, label: c.canonicalName })),
        cultureId,
        myth: myth.serialize(),
      })
    } catch (error) {
      return ctx.inertia.render('errors/server_error', {
        error: error?.message || 'Something went wrong',
      })
    }
  }
}
