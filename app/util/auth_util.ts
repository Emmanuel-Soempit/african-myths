import Role from '#models/role'

export default class AuthUtil {
  public static roleBasedRedirectRoute(role: Role) {
    return role.name === 'admin' ? '/admin/dashboard' : '/'
  }
}
