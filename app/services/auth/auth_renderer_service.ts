import Role from '#models/role'
import type { HttpContext } from '@adonisjs/core/http'

export class AuthRendererService {
  public static async renderRolesSelection(ctx: HttpContext) {
    const roles = await Role.query().orderBy('createdAt', 'asc').where('name', '!=', 'reader')
    return ctx.inertia.render('auth/roles-selection', { roles })
  }
}
