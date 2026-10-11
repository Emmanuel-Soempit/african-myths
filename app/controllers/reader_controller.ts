import { ReaderRendererService } from '#services/reader/reader_renderer'
import { HttpContext } from '@adonisjs/core/http'

export default class ReaderController {
  async renderHome(ctx: HttpContext) {
    return ReaderRendererService.renderHome(ctx)
  }

  async renderMythDetail(ctx: HttpContext) {
    return ReaderRendererService.renderMythDetail(ctx)
  }

  async renderCultureDetail(ctx: HttpContext) {
    return ReaderRendererService.renderCultureDetail(ctx)
  }
}
