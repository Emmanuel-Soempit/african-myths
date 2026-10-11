import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'
import EthnicGroup from '#models/ethnic_group'
import Culture from '#models/culture'
import Myth from '#models/myth'
import Writing from '#models/writing'
import { DateTime } from 'luxon'
import { CultureService } from '#services/culture/culture_service'
import { MythService } from '#services/myth/myth_service'
import { EthicGroupService } from '#services/ethic_group/ethic_group_service'
import { WritingService } from '#services/writing/writing_service'

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

      const pendingCulturesResult = await Culture.query()
        .where('status', 'pending')
        .count('* as total')
      const pendingCultures = Number(pendingCulturesResult[0].$extras.total || 0)

      const pendingMythsResult = await Myth.query().where('status', 'pending').count('* as total')
      const pendingMyths = Number(pendingMythsResult[0].$extras.total || 0)

      const pendingWritingsResult = await Writing.query()
        .where('status', 'pending')
        .count('* as total')
      const pendingWritings = Number(pendingWritingsResult[0].$extras.total || 0)

      const pendingApprovals = pendingCultures + pendingMyths + pendingWritings

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
          pendingWritings,
        },
        newUsers: newUsers.map((u) => u.serialize()),
        recentMyths: recentMyths.map((m) => m.serialize()),
      })
    } catch (error) {
      console.error('renderDashboard error:', error)
      return ctx.inertia.render('errors/server_error', {
        error: error?.message || 'Something went wrong',
      })
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
    return EthicGroupService.renderList(ctx, 'admin/ethnic-groups')
  }

  public static async renderEthnicGroupDetail(ctx: HttpContext) {
    return EthicGroupService.renderDetail(ctx, 'admin/ethnic-group-detail')
  }

  public static async renderCultures(ctx: HttpContext) {
    return CultureService.renderList(ctx, 'admin/cultures')
  }

  public static async renderCultureEdit(ctx: HttpContext) {
    return CultureService.renderEdit(ctx, 'cultures/edit')
  }

  public static async renderCultureOverview(ctx: HttpContext) {
    return CultureService.renderOverview(ctx, 'admin/culture-overview')
  }

  public static async renderMyths(ctx: HttpContext) {
    return MythService.renderList(ctx, 'admin/myths')
  }

  public static async renderMythCreate(ctx: HttpContext) {
    return MythService.renderCreate(ctx, 'admin/myths/create')
  }

  public static async renderMythEdit(ctx: HttpContext) {
    return MythService.renderEdit(ctx, 'admin/myths/create')
  }

  public static async renderWritings(ctx: HttpContext) {
    try {
      const page = Number(ctx.request.input('page', 1))
      const filters = {
        type: ctx.request.input('type') as 'poem' | 'story' | 'article' | undefined,
        status: ctx.request.input('status') as
          | 'draft'
          | 'pending'
          | 'published'
          | 'rejected'
          | undefined,
        cultureId: ctx.request.input('cultureId') as string | undefined,
        page,
        limit: 10,
      }
      const writings = await WritingService.listForAdmin(filters)

      return ctx.inertia.render('admin/writings', {
        writings: writings.serialize(),
        filters: {
          type: filters.type ?? '',
          status: filters.status ?? 'pending',
          cultureId: filters.cultureId ?? '',
        },
      })
    } catch (error) {
      console.error('renderWritings error:', error)
      return ctx.inertia.render('errors/server_error', {
        error: error?.message || 'Something went wrong',
      })
    }
  }

  public static async renderWritingReview(ctx: HttpContext) {
    try {
      const writing = await Writing.query()
        .where('id', ctx.params.id)
        .preload('culture')
        .preload('author', (q) => q.preload('profile'))
        .preload('reviewer', (q) => q.preload('profile'))
        .first()

      if (!writing) {
        return ctx.inertia.render('errors/not_found')
      }

      return ctx.inertia.render('admin/writing-review', {
        writing: writing.serialize(),
      })
    } catch (error) {
      console.error('renderWritingReview error:', error)
      return ctx.inertia.render('errors/server_error', {
        error: error?.message || 'Something went wrong',
      })
    }
  }
}
