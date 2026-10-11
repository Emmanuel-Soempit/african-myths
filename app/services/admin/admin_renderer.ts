import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'
import EthnicGroup from '#models/ethnic_group'
import Culture from '#models/culture'
import Myth from '#models/myth'
import SubEthnicGroup from '#models/sub_ethnic_group'
import { DateTime } from 'luxon'

export class AdminRendererService {
  public static async renderDashboard(ctx: HttpContext) {
    try {
      // Counts
      const totalCulturesResult = await Culture.query().count('* as total')
      const totalCultures = Number(totalCulturesResult[0].$extras.total || 0)

      const totalEthnicGroupsResult = await EthnicGroup.query().count('* as total')
      const totalEthnicGroups = Number(totalEthnicGroupsResult[0].$extras.total || 0)

      const totalUsersResult = await User.query().count('* as total')
      const totalUsers = Number(totalUsersResult[0].$extras.total || 0)

      const pendingCulturesResult = await Culture.query().where('status', 'pending').count('* as total')
      const pendingCultures = Number(pendingCulturesResult[0].$extras.total || 0)

      const pendingMythsResult = await Myth.query().where('status', 'pending').count('* as total')
      const pendingMyths = Number(pendingMythsResult[0].$extras.total || 0)

      const pendingApprovals = pendingCultures + pendingMyths

      // New users in the last month
      const oneMonthAgo = DateTime.local().minus({ months: 1 })
      const newUsers = await User.query()
        .where('createdAt', '>=', oneMonthAgo.toSQL())
        .preload('profile')
        .preload('metadata', (qs) => qs.preload('role'))
        .orderBy('createdAt', 'desc')

      // Recent 5 myths
      const recentMyths = await Myth.query()
        .preload('culture')
        .orderBy('createdAt', 'desc')
        .limit(5)

      return ctx.inertia.render('admin/dashboard', {
        stats: {
          totalCultures,
          totalEthnicGroups,
          totalUsers,
          pendingApprovals,
        },
        newUsers: newUsers.map((u) => u.serialize()),
        recentMyths: recentMyths.map((m) => m.serialize()),
      })
    } catch (error) {
      console.error('renderDashboard error:', error)
      return ctx.inertia.render('errors/server_error', { error: error?.message || "Something went wrong" })
    }
  }

  public static async renderUsers(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const limit = 10
    const sortBy = ctx.request.input('sortBy', 'createdAt')
    const sortOrder = ctx.request.input('sortOrder', 'desc') as 'asc' | 'desc'

    // Map frontend column keys to database fields
    const columnMapping: Record<string, string> = {
      user: 'firstName', // Will need to join with user_profiles table
      email: 'email',
      role: 'name', // Will need to join with role table
      joinDate: 'createdAt',
      status: 'status', // Will need to join with user_metadata table
    }

    const dbField = columnMapping[sortBy] || 'createdAt'

    let query = User.query()
      .preload('profile')
      .preload('metadata', (qs) => {
        qs.preload('role')
      })

    // Apply sorting based on the column
    if (sortBy === 'user') {
      // Sort by profile first name
      query = query
        .join('user_profiles', 'users.id', 'user_profiles.user_id')
        .orderBy('user_profiles.first_name', sortOrder)
        .select('users.*')
    } else if (sortBy === 'role') {
      // Sort by role name
      query = query
        .join('user_metadata', 'users.id', 'user_metadata.user_id')
        .join('roles', 'user_metadata.role_id', 'roles.id')
        .orderBy('roles.name', sortOrder)
        .select('users.*')
    } else if (sortBy === 'status') {
      // Sort by status
      query = query
        .join('user_metadata', 'users.id', 'user_metadata.user_id')
        .orderBy('user_metadata.status', sortOrder)
        .select('users.*')
    } else {
      // Sort by user table fields directly
      query = query.orderBy(dbField, sortOrder)
    }

    const users = await query.paginate(page, limit)

    console.log('Users', users)

    // Fetch all roles for the invitation modal
    const roles = await Role.all()

    return ctx.inertia.render('admin/users', {
      users: users.serialize(),
      roles: roles.map((role) => ({ id: role.id, name: role.name })),
      sortBy,
      sortOrder,
    })
  }

  public static async renderEthnicGroups(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const limit = 10
    const sortBy = ctx.request.input('sortBy', 'createdAt')
    const sortOrder = ctx.request.input('sortOrder', 'desc') as 'asc' | 'desc'

    let query = EthnicGroup.query()

    // Always load the count of sub-ethnic groups
    query = query.withCount('subEthnicGroups')

    // Apply sorting based on the column
    if (sortBy === 'name') {
      query = query.orderBy('canonicalName', sortOrder)
    } else if (sortBy === 'subEthnicGroups') {
      // Sort by count of sub-ethnic groups
      query = query.orderBy('sub_ethnic_groups_count', sortOrder)
    }

    const ethnicGroups = await query.paginate(page, limit)

    console.log('Ethic grops', ethnicGroups)

    return ctx.inertia.render('admin/ethnic-groups', {
      ethnicGroups: ethnicGroups,
      sortBy,
      sortOrder
    })
  }

  public static async renderEthnicGroupDetail(ctx: HttpContext) {
    const { id } = ctx.params
    const page = ctx.request.input('page', 1)
    const limit = 10

    try {
      const ethnicGroup = await EthnicGroup.find(id)
      if (!ethnicGroup) {
        // return 404
        return
      }
      await ethnicGroup.load('ethnicNameAliases')
      await ethnicGroup.load('ethnicGroupCountries', (q) => {
        q.preload('country')
      })

      // Paginate sub-ethnic groups
      const subEthnicGroupsQuery = ethnicGroup.related('subEthnicGroups').query().preload('subEthnicGroupCountries', (q) => {
        q.preload('country')
      })
      const subEthnicGroups = await subEthnicGroupsQuery.paginate(page, limit)
      console.log('Sub Ethnic Groups', subEthnicGroups)

      console.log('Language Id from ethnic group', ethnicGroup.languageId)
      return ctx.inertia.render('admin/ethnic-group-detail', {
        ethnicGroup,
        subEthnicGroups
      })
    } catch (error) {
      console.log(error)
      return
    }
  }

  public static async renderCultures(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const limit = 10
    const sortBy = ctx.request.input('sortBy', 'createdAt')
    const sortOrder = ctx.request.input('sortOrder', 'desc') as 'asc' | 'desc'

    let query = Culture.query()

    // Apply sorting based on the column
    if (sortBy === 'name') {
      query = query.orderBy('name', sortOrder)
    }

    const cultures = await query.preload('ethnicGroup').paginate(page, limit)
    console.log('Cultures', cultures)
    return ctx.inertia.render('admin/cultures', {
      cultures: cultures,
      sortBy,
      sortOrder
    })
  }

  public static async renderCultureEdit(ctx: HttpContext) {
    const { id } = ctx.params
    const culture = await Culture.query()
      .where('id', id)
      .preload('ethnicGroup')
      .firstOrFail()

    return ctx.inertia.render('cultures/edit', { culture })
  }

  public static async renderCultureOverview(ctx: HttpContext) {
    const { id } = ctx.params
    const culture = await Culture.query()
      .where('id', id)
      .preload('ethnicGroup')
      .firstOrFail()

    return ctx.inertia.render('admin/culture-overview', { culture })
  }

  public static async renderMyths(ctx: HttpContext) {

    try {
      const cultureId = ctx.params.cultureId || ctx.request.input('cultureId')

      console.log("Culute Id", cultureId)

      if (!cultureId) {
        throw new Error("No culture appended to this request")
      }


      const page = ctx.request.input('page', 1)
      const limit = 10
      const sortBy = ctx.request.input('sortBy', 'createdAt')
      const sortOrder = ctx.request.input('sortOrder', 'desc') as 'asc' | 'desc'

      const myths = await Myth.query().where("cultureId", cultureId)
        .preload('culture')
        .preload('author', (q) => q.preload('profile'))
        .orderBy(sortBy === 'title' ? 'title' : 'created_at', sortOrder)
        .paginate(page, limit)

      return ctx.inertia.render('admin/myths', { myths, sortBy, sortOrder, cultureId })
    } catch (error) {
      console.log("Parsm", error?.message)
      return ctx.inertia.render('errors/server_error', { error: error?.message || "Something went wrong" })
    }
  }

  public static async renderMythCreate(ctx: HttpContext) {
    try {

      const cultureId = ctx.params.cultureId || ctx.request.input('cultureId')
      const culture = (await Culture.query().where("id", cultureId).preload('ethnicGroup'))[0]
      const subEthnicGroups = await SubEthnicGroup.query().where("ethnicGroupId", culture?.ethnicGroupId)
      // const subEthnicGroups = await SubEthnicGroup.query().where().orderBy('name', 'asc')
      return ctx.inertia.render('admin/myths/create', {
        subEthnicGroups: subEthnicGroups.map((c) => ({ value: c.id, label: c.canonicalName })),
        cultureId: cultureId
      })
    } catch (error) {
      return ctx.inertia.render('errors/server_error', { error: error?.message || "Something went wrong" })
    }
  }

  public static async renderMythEdit(ctx: HttpContext) {
    try {
      const { id, cultureId } = ctx.params
      const { default: Myth } = await import('#models/myth')
      const myth = await Myth.findOrFail(id)

      const culture = (await Culture.query().where("id", cultureId).preload('ethnicGroup'))[0]
      const subEthnicGroups = await SubEthnicGroup.query().where("ethnicGroupId", culture?.ethnicGroupId)

      return ctx.inertia.render('admin/myths/create', {
        subEthnicGroups: subEthnicGroups.map((c) => ({ value: c.id, label: c.canonicalName })),
        cultureId: cultureId,
        myth: myth.serialize()
      })
    } catch (error) {
      return ctx.inertia.render('errors/server_error', { error: error?.message || "Something went wrong" })
    }
  }
}
