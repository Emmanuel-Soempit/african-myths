import { AuthRendererService } from '#services/auth/auth_renderer_service'
import { AuthService } from '#services/auth/auth_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  // Services
  async emailRegistration(ctx: HttpContext) {
    return AuthService.emailRegistration(ctx)
  }

  async googleSignIn(ctx: HttpContext) {
    return AuthService.googleSignIn(ctx)
  }

  async googleCallback(ctx: HttpContext) {
    return AuthService.googleCallback(ctx)
  }

  async emailSignIn(ctx: HttpContext) {
    return AuthService.emailSignIn(ctx)
  }

  async assignRole(ctx: HttpContext) {
    return AuthService.assignRole(ctx)
  }

  async signOut(ctx: HttpContext) {
    return AuthService.signOut(ctx)
  }

  // Renderers
  async renderRolesSelection(ctx: HttpContext) {
    return AuthRendererService.renderRolesSelection(ctx)
  }

  async renderHome(ctx: HttpContext) {
    return ctx.inertia.render('home')
  }
}
