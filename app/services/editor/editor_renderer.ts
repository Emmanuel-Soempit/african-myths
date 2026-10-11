import type { HttpContext } from '@adonisjs/core/http'

export class EditorRendererService {
  public static async renderDashboard(ctx: HttpContext) {
    try {
      return ctx.inertia.render('editor/dashboard')
    } catch (error) {
      console.error('renderDashboard error:', error)
      return ctx.inertia.render('errors/server_error', { error: error?.message || "Something went wrong" })
    }
  }
}
