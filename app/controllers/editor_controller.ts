import { EditorRendererService } from '#services/editor/editor_renderer'
import { HttpContext } from '@adonisjs/core/http'

export default class EditorController {
  async renderDashboard(ctx: HttpContext) {
    return EditorRendererService.renderDashboard(ctx)
  }
}
