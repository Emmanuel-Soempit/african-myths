import Culture from '#models/culture'
import Writing from '#models/writing'
import type { WritingType } from '#models/writing'
import type { ContentStatus, RoleName } from '../../util/content_status.js'
import { canDelete, canPublish } from '../../util/content_status.js'
import { calculateReadingTime } from '../../util/reading_time.js'
import AuthUtil from '../../util/auth_util.js'
import {
  createWritingValidator,
  reviewWritingValidator,
  updateWritingValidator,
} from '#validators/writing'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

interface AuthorListFilters {
  type?: WritingType
  status?: ContentStatus
  page: number
  limit: number
}

interface AdminListFilters {
  type?: WritingType
  status?: ContentStatus
  cultureId?: string
  page: number
  limit: number
}

export class WritingService {
  /**
   * Loads a writing the acting user may act on. Non-admin users can only
   * touch their own writings; anything else is reported as not found so
   * other users' writings aren't revealed.
   */
  private static async loadWritable(
    ctx: HttpContext,
    role: RoleName
  ): Promise<Writing | null> {
    const writing = await Writing.find(ctx.params.id)
    if (!writing) return null
    if (role !== 'admin' && writing.authorId !== ctx.auth.user!.id) return null
    return writing
  }

  private static flashNotFound(ctx: HttpContext) {
    ctx.session.flashErrors({ error: 'Writing not found' })
  }

  private static plainExcerpt(content: string | undefined): string | null {
    if (!content) return null
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    return text ? text.slice(0, 200) : null
  }

  public static async create(ctx: HttpContext): Promise<Writing | null> {
    const payload = await ctx.request.validateUsing(createWritingValidator)

    try {
      const culture = await Culture.find(payload.cultureId)
      if (!culture || culture.status !== 'published') {
        ctx.session.flashErrors({ error: 'Culture not found' })
        return null
      }

      const writing = await Writing.create({
        type: payload.type,
        title: payload.title,
        cultureId: payload.cultureId,
        excerpt: payload.excerpt || WritingService.plainExcerpt(payload.content),
        content: payload.content || '',
        thumbnail: payload.thumbnail || null,
        authorId: ctx.auth.user!.id,
        status: payload.intent === 'submit' ? 'pending' : 'draft',
        minutesToRead: calculateReadingTime(payload.content),
      })

      ctx.session.flash({ success: 'Writing saved' })
      return writing
    } catch (error) {
      console.error('createWriting error:', error)
      ctx.session.flashErrors({ error: 'Failed to save writing. Please try again.' })
      return null
    }
  }

  public static async update(ctx: HttpContext): Promise<Writing | null> {
    const payload = await ctx.request.validateUsing(updateWritingValidator)

    try {
      const role = await AuthUtil.activeRoleName(ctx)
      const writing = await WritingService.loadWritable(ctx, role)
      if (!writing) {
        WritingService.flashNotFound(ctx)
        return null
      }

      // Authors can only edit drafts and rejected writings
      if (role !== 'admin' && !['draft', 'rejected'].includes(writing.status)) {
        ctx.session.flashErrors({
          error: 'This writing can no longer be edited',
        })
        return null
      }

      if (payload.cultureId !== undefined) {
        const culture = await Culture.find(payload.cultureId)
        if (!culture || (role !== 'admin' && culture.status !== 'published')) {
          ctx.session.flashErrors({ error: 'Culture not found' })
          return null
        }
        writing.cultureId = payload.cultureId
      }

      if (payload.type !== undefined) writing.type = payload.type
      if (payload.title !== undefined) writing.title = payload.title
      if (payload.excerpt !== undefined) writing.excerpt = payload.excerpt
      if (payload.content !== undefined) {
        writing.content = payload.content
        writing.minutesToRead = calculateReadingTime(payload.content)
        if (!payload.excerpt) {
          writing.excerpt = WritingService.plainExcerpt(payload.content)
        }
      }
      if (payload.thumbnail !== undefined) writing.thumbnail = payload.thumbnail

      if (role !== 'admin') {
        // Editing a rejected writing moves it back to draft; submitting sets pending
        writing.status = payload.intent === 'submit' ? 'pending' : 'draft'
      }

      await writing.save()
      ctx.session.flash({ success: 'Writing saved' })
      return writing
    } catch (error) {
      console.error('updateWriting error:', error)
      ctx.session.flashErrors({ error: 'Failed to save writing. Please try again.' })
      return null
    }
  }

  /** draft|rejected → pending */
  public static async submit(ctx: HttpContext): Promise<boolean> {
    const role = await AuthUtil.activeRoleName(ctx)
    const writing = await WritingService.loadWritable(ctx, role)
    if (!writing) {
      WritingService.flashNotFound(ctx)
      return false
    }

    if (!['draft', 'rejected'].includes(writing.status)) {
      ctx.session.flashErrors({ error: 'Only drafts or rejected writings can be submitted' })
      return false
    }

    writing.status = 'pending'
    await writing.save()
    ctx.session.flash({ success: 'Writing submitted for review' })
    return true
  }

  /** pending → draft */
  public static async withdraw(ctx: HttpContext): Promise<boolean> {
    const role = await AuthUtil.activeRoleName(ctx)
    const writing = await WritingService.loadWritable(ctx, role)
    if (!writing) {
      WritingService.flashNotFound(ctx)
      return false
    }

    if (writing.status !== 'pending') {
      ctx.session.flashErrors({ error: 'Only pending writings can be withdrawn' })
      return false
    }

    writing.status = 'draft'
    await writing.save()
    ctx.session.flash({ success: 'Writing withdrawn' })
    return true
  }

  public static async delete(ctx: HttpContext): Promise<boolean> {
    const role = await AuthUtil.activeRoleName(ctx)
    const writing = await WritingService.loadWritable(ctx, role)
    if (!writing) {
      WritingService.flashNotFound(ctx)
      return false
    }

    if (role !== 'admin') {
      if (writing.status !== 'draft') {
        ctx.session.flashErrors({ error: 'Only draft writings can be deleted' })
        return false
      }
    } else if (!canDelete(role)) {
      ctx.session.flashErrors({ error: 'You are not allowed to delete writings' })
      return false
    }

    await writing.delete()
    ctx.session.flash({ success: 'Writing deleted' })
    return true
  }

  /** admin: pending → published|rejected */
  public static async review(ctx: HttpContext): Promise<boolean> {
    const { decision, note } = await ctx.request.validateUsing(reviewWritingValidator)

    try {
      const role = await AuthUtil.activeRoleName(ctx)
      if (!canPublish(role)) {
        ctx.session.flashErrors({ error: 'You are not allowed to review writings' })
        return false
      }

      const writing = await Writing.find(ctx.params.id)
      if (!writing) {
        WritingService.flashNotFound(ctx)
        return false
      }

      if (writing.status !== 'pending') {
        ctx.session.flashErrors({ error: 'Only pending writings can be reviewed' })
        return false
      }

      if (decision === 'reject' && !note) {
        ctx.session.flashErrors({ error: 'A note is required when rejecting a writing' })
        return false
      }

      if (decision === 'approve') {
        writing.status = 'published'
        writing.publishedAt = DateTime.now()
        writing.reviewedBy = ctx.auth.user!.id
        writing.reviewNote = note ?? null
      } else {
        writing.status = 'rejected'
        writing.reviewedBy = ctx.auth.user!.id
        writing.reviewNote = note!
      }

      await writing.save()
      ctx.session.flash({
        success: decision === 'approve' ? 'Writing published' : 'Writing rejected',
      })
      return true
    } catch (error) {
      console.error('reviewWriting error:', error)
      ctx.session.flashErrors({ error: 'Failed to review writing. Please try again.' })
      return false
    }
  }

  // Queries used by renderers

  public static listForAuthor(userId: string, filters: AuthorListFilters) {
    return Writing.query()
      .where('authorId', userId)
      .if(filters.type, (q) => q.where('type', filters.type!))
      .if(filters.status, (q) => q.where('status', filters.status!))
      .preload('culture')
      .orderBy('updated_at', 'desc')
      .paginate(filters.page, filters.limit)
  }

  public static listForAdmin(filters: AdminListFilters) {
    return Writing.query()
      .if(filters.type, (q) => q.where('type', filters.type!))
      .if(filters.status, (q) => q.where('status', filters.status!))
      .if(filters.cultureId, (q) => q.where('culture_id', filters.cultureId!))
      .preload('culture')
      .preload('author', (q) => q.preload('profile'))
      // pending submissions surface first, then most recently updated
      .orderByRaw("case when status = 'pending' then 0 else 1 end")
      .orderBy('updated_at', 'desc')
      .paginate(filters.page, filters.limit)
  }

  public static async statsForAuthor(userId: string) {
    const rows = await Writing.query()
      .where('authorId', userId)
      .select('type', 'status')
      .count('* as total')
      .groupBy('type', 'status')

    const byType: Record<WritingType, number> = { poem: 0, story: 0, article: 0 }
    const byStatus: Record<ContentStatus, number> = {
      draft: 0,
      pending: 0,
      published: 0,
      rejected: 0,
    }

    for (const row of rows) {
      const total = Number(row.$extras.total || 0)
      byType[row.type as WritingType] += total
      byStatus[row.status as ContentStatus] += total
    }

    return { byType, byStatus }
  }

  public static async publishedForCulture(cultureId: string) {
    const writings = await Writing.query()
      .where('cultureId', cultureId)
      .where('status', 'published')
      .orderBy('published_at', 'desc')

    return {
      poems: writings.filter((w) => w.type === 'poem'),
      stories: writings.filter((w) => w.type === 'story'),
      articles: writings.filter((w) => w.type === 'article'),
    }
  }

  public static async findPublished(id: string) {
    return Writing.query()
      .where('id', id)
      .where('status', 'published')
      .preload('culture')
      .preload('author', (q) => q.preload('profile'))
      .first()
  }
}
