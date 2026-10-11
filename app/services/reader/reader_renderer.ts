import type { HttpContext } from '@adonisjs/core/http'
import Myth from '#models/myth'
import Culture from '#models/culture'
import Writing from '#models/writing'
import { WritingService } from '#services/writing/writing_service'

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
        myths: myths.map((m) => m.serialize()),
      })
    } catch (error) {
      console.error('renderHome error:', error)
      return ctx.inertia.render('errors/server_error', {
        error: error?.message || 'Something went wrong',
      })
    }
  }

  public static async renderMythDetail(ctx: HttpContext) {
    try {
      const { id } = ctx.params
      const myth = await Myth.query()
        .where('id', id)
        .where('status', 'published')
        .preload('culture')
        .first()

      if (!myth) {
        return ctx.inertia.render('errors/not_found')
      }

      // Query up to 3 related published myths from the same culture (excluding this one)
      const relatedMyths = await Myth.query()
        .where('cultureId', myth.cultureId)
        .where('status', 'published')
        .whereNot('id', myth.id)
        .limit(3)

      return ctx.inertia.render('myths/detail', {
        myth: myth.serialize(),
        relatedMyths: relatedMyths.map((m) => m.serialize()),
      })
    } catch (error) {
      console.error('renderMythDetail error:', error)
      return ctx.inertia.render('errors/server_error', {
        error: error?.message || 'Something went wrong',
      })
    }
  }

  public static async renderCultureDetail(ctx: HttpContext) {
    try {
      const { id } = ctx.params
      const culture = await Culture.query()
        .where('id', id)
        .where('status', 'published')
        .preload('ethnicGroup', (eg) => {
          eg.preload('language')
          eg.preload('ethnicGroupCountries', (egc) => {
            egc.preload('country')
          })
        })
        .first()

      if (!culture) {
        return ctx.inertia.render('errors/not_found')
      }

      const myths = await Myth.query()
        .where('cultureId', culture.id)
        .where('status', 'published')
        .orderBy('created_at', 'desc')

      const writings = await WritingService.publishedForCulture(culture.id)

      return ctx.inertia.render('cultures/detail', {
        culture: culture.serialize(),
        myths: myths.map((m) => m.serialize()),
        writings: {
          poems: writings.poems.map((w) => w.serialize()),
          stories: writings.stories.map((w) => w.serialize()),
          articles: writings.articles.map((w) => w.serialize()),
        },
      })
    } catch (error) {
      console.error('renderCultureDetail error:', error)
      return ctx.inertia.render('errors/server_error', {
        error: error?.message || 'Something went wrong',
      })
    }
  }

  public static async renderWritingDetail(ctx: HttpContext) {
    try {
      const { id } = ctx.params
      const writing = await WritingService.findPublished(id)

      if (!writing) {
        return ctx.inertia.render('errors/not_found')
      }

      const related = await Writing.query()
        .where('cultureId', writing.cultureId)
        .where('status', 'published')
        .whereNot('id', writing.id)
        .orderBy('published_at', 'desc')
        .limit(3)

      const serialize = (w: Writing) => ({
        id: w.id,
        type: w.type,
        title: w.title,
        excerpt: w.excerpt,
        content: w.content,
        thumbnail: w.thumbnail,
        status: w.status,
        minutesToRead: w.minutesToRead,
        publishedAt: w.publishedAt?.toISO(),
        createdAt: w.createdAt?.toISO(),
        updatedAt: w.updatedAt?.toISO(),
        culture: w.culture ? { id: w.culture.id, name: w.culture.name } : null,
        author: w.author
          ? {
              name: [w.author.profile?.firstName, w.author.profile?.lastName]
                .filter(Boolean)
                .join(' '),
            }
          : null,
      })

      return ctx.inertia.render('writings/detail', {
        writing: serialize(writing),
        related: related.map((w) => ({
          id: w.id,
          type: w.type,
          title: w.title,
          excerpt: w.excerpt,
          thumbnail: w.thumbnail,
          minutesToRead: w.minutesToRead,
          publishedAt: w.publishedAt?.toISO(),
        })),
      })
    } catch (error) {
      console.error('renderWritingDetail error:', error)
      return ctx.inertia.render('errors/server_error', {
        error: error?.message || 'Something went wrong',
      })
    }
  }
}
