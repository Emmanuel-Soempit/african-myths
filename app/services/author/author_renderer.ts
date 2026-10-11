import Writing from '#models/writing'
import type { WritingType } from '#models/writing'
import { WritingService } from '#services/writing/writing_service'
import AuthUtil from '../../util/auth_util.js'
import type { HttpContext } from '@adonisjs/core/http'

export class AuthorRendererService {
  public static async renderDashboard(ctx: HttpContext) {
    try {
      const userId = ctx.auth.user!.id
      const [stats, recent, rejected] = await Promise.all([
        WritingService.statsForAuthor(userId),
        Writing.query().where('authorId', userId).orderBy('updated_at', 'desc').limit(5),
        Writing.query().where('authorId', userId).where('status', 'rejected').orderBy('updated_at', 'desc'),
      ])

      return ctx.inertia.render('author/dashboard', {
        stats,
        recent: recent.map((w) => w.serialize()),
        rejected: rejected.map((w) => w.serialize()),
      })
    } catch (error) {
      console.error('renderDashboard error:', error)
      return ctx.inertia.render('errors/server_error', {
        error: error?.message || 'Something went wrong',
      })
    }
  }

  public static async renderWritings(ctx: HttpContext) {
    try {
      const filters = {
        type: ctx.request.input('type') as WritingType | undefined,
        status: ctx.request.input('status') as
          | 'draft'
          | 'pending'
          | 'published'
          | 'rejected'
          | undefined,
        page: Number(ctx.request.input('page', 1)),
        limit: 10,
      }

      const writings = await WritingService.listForAuthor(ctx.auth.user!.id, filters)

      return ctx.inertia.render('author/writings', {
        writings: writings.serialize(),
        filters: {
          type: filters.type ?? '',
          status: filters.status ?? '',
        },
      })
    } catch (error) {
      console.error('renderWritings error:', error)
      return ctx.inertia.render('errors/server_error', {
        error: error?.message || 'Something went wrong',
      })
    }
  }

  public static async renderWritingCreate(ctx: HttpContext) {
    const type = (ctx.request.input('type', 'story') || 'story') as WritingType

    return ctx.inertia.render('author/writing-edit', {
      writing: null,
      type: ['poem', 'story', 'article'].includes(type) ? type : 'story',
    })
  }

  public static async renderWritingEdit(ctx: HttpContext) {
    try {
      const role = await AuthUtil.activeRoleName(ctx)
      const writing = await Writing.query()
        .where('id', ctx.params.id)
        .preload('culture')
        .first()

      // Only the author (or an admin) can view this page; report anything else as not found
      if (!writing || (role !== 'admin' && writing.authorId !== ctx.auth.user!.id)) {
        return ctx.inertia.render('errors/not_found')
      }

      return ctx.inertia.render('author/writing-edit', {
        writing: writing.serialize(),
        readOnly: ['pending', 'published'].includes(writing.status),
      })
    } catch (error) {
      console.error('renderWritingEdit error:', error)
      return ctx.inertia.render('errors/server_error', {
        error: error?.message || 'Something went wrong',
      })
    }
  }
}
