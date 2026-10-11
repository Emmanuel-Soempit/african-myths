import Role from '#models/role'
import type { HttpContext } from '@adonisjs/core/http'
import type { RoleName } from './content_status.js'

const ROLE_ROUTES: Record<RoleName, string> = {
  admin: '/admin/dashboard',
  editor: '/editor/dashboard',
  author: '/author/dashboard',
  reader: '/',
}

export default class AuthUtil {
  public static roleBasedRedirectRoute(role: Role) {
    return ROLE_ROUTES[role.name] ?? '/'
  }

  public static async activeRoleName(ctx: HttpContext): Promise<RoleName> {
    const user = ctx.auth.user
    if (!user) return 'reader'
    await user.load('metadata', (query) => query.preload('role'))
    return (user.metadata?.role?.name as RoleName | undefined) ?? 'reader'
  }
}
