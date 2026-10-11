import Role from '#models/role'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    roles: ('reader' | 'author' | 'admin' | 'editor')[]
  ) {
    /**
     * Middleware logic goes here (before the next call)
     */

    if (!ctx.auth.user) {
      // console.log('User not found')
      return ctx.response.redirect('/auth/sign-in')
    }
    await ctx.auth.user?.load('metadata')
    const allowedRoles = await Role.query().whereIn('name', roles).select('id').exec()
    // console.log(
    //   'Allowed roles',
    //   allowedRoles.flatMap((r) => r.id)
    // )
    if (ctx.auth.user.metadata.activeRoleId) {
      await ctx.auth.user.metadata.load('role')
      // console.log('User role', ctx.auth.user.metadata.role.name)
      // console.log('User found', ctx.auth.user.metadata)
      if (allowedRoles.find((role) => role.id === ctx.auth.user?.metadata.activeRoleId)) {
        return next()
      }
    }
    // Todo: navigate to unauthorized page
    // console.log('Failed role check')
    return ctx.response.redirect('/auth/sign-in')
  }
}
