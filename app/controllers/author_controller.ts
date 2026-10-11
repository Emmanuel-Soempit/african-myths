import { AuthorRendererService } from '#services/author/author_renderer'
import { WritingService } from '#services/writing/writing_service'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthorController {
  async renderDashboard(ctx: HttpContext) {
    return AuthorRendererService.renderDashboard(ctx)
  }

  async renderWritings(ctx: HttpContext) {
    return AuthorRendererService.renderWritings(ctx)
  }

  async renderWritingCreate(ctx: HttpContext) {
    return AuthorRendererService.renderWritingCreate(ctx)
  }

  async renderWritingEdit(ctx: HttpContext) {
    return AuthorRendererService.renderWritingEdit(ctx)
  }

  async createWriting(ctx: HttpContext) {
    const writing = await WritingService.create(ctx)
    if (writing) {
      if (writing.status === 'pending') {
        return ctx.response.redirect().toPath('/author/writings')
      }
      return ctx.response.redirect().toPath(`/author/writings/${writing.id}/edit`)
    }
    return ctx.response.redirect().back()
  }

  async updateWriting(ctx: HttpContext) {
    await WritingService.update(ctx)
    return ctx.response.redirect().back()
  }

  async submitWriting(ctx: HttpContext) {
    await WritingService.submit(ctx)
    return ctx.response.redirect().toPath('/author/writings')
  }

  async withdrawWriting(ctx: HttpContext) {
    await WritingService.withdraw(ctx)
    return ctx.response.redirect().toPath('/author/writings')
  }

  async deleteWriting(ctx: HttpContext) {
    await WritingService.delete(ctx)
    return ctx.response.redirect().toPath('/author/writings')
  }
}
