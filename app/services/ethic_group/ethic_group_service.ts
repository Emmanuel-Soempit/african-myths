import EthnicGroup from '#models/ethnic_group'
import SubEthnicGroup from '#models/sub_ethnic_group'
import Language from '#models/language'
import { createEthnicGroupValidator, createSubEthnicGroupValidator } from '#validators/ethnic_group'
import { canDelete } from '../../util/content_status.js'
import AuthUtil from '../../util/auth_util.js'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export class EthicGroupService {
  // Renderers shared by the admin and editor dashboards

  public static async renderList(ctx: HttpContext, view: string) {
    const page = ctx.request.input('page', 1)
    const limit = 10
    const sortBy = ctx.request.input('sortBy', 'createdAt')
    const sortOrder = ctx.request.input('sortOrder', 'desc') as 'asc' | 'desc'

    let query = EthnicGroup.query().withCount('subEthnicGroups')

    if (sortBy === 'name') {
      query = query.orderBy('canonicalName', sortOrder)
    } else if (sortBy === 'subEthnicGroups') {
      query = query.orderBy('sub_ethnic_groups_count', sortOrder)
    }

    const ethnicGroups = await query.paginate(page, limit)

    return ctx.inertia.render(view, {
      ethnicGroups,
      sortBy,
      sortOrder,
    })
  }

  public static async renderDetail(ctx: HttpContext, view: string) {
    const { id } = ctx.params
    const page = ctx.request.input('page', 1)
    const limit = 10

    try {
      const ethnicGroup = await EthnicGroup.find(id)
      if (!ethnicGroup) {
        return ctx.inertia.render('errors/not_found')
      }
      await ethnicGroup.load('ethnicNameAliases')
      await ethnicGroup.load('ethnicGroupCountries', (q) => {
        q.preload('country')
      })

      const subEthnicGroups = await ethnicGroup
        .related('subEthnicGroups')
        .query()
        .preload('subEthnicGroupCountries', (q) => {
          q.preload('country')
        })
        .paginate(page, limit)

      return ctx.inertia.render(view, {
        ethnicGroup,
        subEthnicGroups,
      })
    } catch (error) {
      console.error('renderEthnicGroupDetail error:', error)
      return ctx.inertia.render('errors/server_error', {
        error: error?.message || 'Something went wrong',
      })
    }
  }

  public static async createEthnicGroup({ request, session }: HttpContext) {
    const { name, countries, nameAliases, primaryLanguage, description } =
      await request.validateUsing(createEthnicGroupValidator)

    // console.log('Ethnic group body', { name, countries, nameAliases, primaryLanguage, description })

    try {
      const language = await Language.find(primaryLanguage)

      if (!language) {
        session.flashErrors({
          error: 'Language not found',
        })
        return false
      }

      await db.transaction(async (client) => {
        const ethnicGroup = await EthnicGroup.create(
          { canonicalName: name, note: description || '', languageId: language.id },
          { client }
        )

        await ethnicGroup.related('ethnicGroupCountries').createMany(
          countries.map((country) => ({
            countryId: country.countryId,
            populationEstimate: country.populationEstimate,
            source: country.source,
            isPrimaryHome: country.isPrimaryHome === 'on' || country.isPrimaryHome === true,
          }))
        )

        await ethnicGroup.related('ethnicNameAliases').createMany(
          nameAliases.map((nameAlias) => ({
            nameVariant: nameAlias.nameVariant,
            langaugeOfNameVariant: nameAlias.language,
            source: nameAlias.source,
          }))
        )

        return ethnicGroup
      })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  public static async updateEthnicGroup({ request, session, params }: HttpContext) {
    const { name, countries, nameAliases, primaryLanguage, description } =
      await request.validateUsing(createEthnicGroupValidator)
    const { id } = params

    try {
      const ethnicGroup = await EthnicGroup.find(id)
      if (!ethnicGroup) {
        session.flashErrors({
          error: 'Ethnic group not found',
        })
        return false
      }
      await ethnicGroup.load('ethnicGroupCountries')
      await ethnicGroup.load('ethnicNameAliases')

      const language = await Language.find(primaryLanguage)
      if (!language) {
        session.flashErrors({
          error: 'Language not found',
        })
        return false
      }

      await db.transaction(async (client) => {
        // Update ethnic group basic info
        ethnicGroup.canonicalName = name
        ethnicGroup.note = description || ''
        ethnicGroup.languageId = language.id
        await ethnicGroup.save()

        // Delete existing related records
        const newEthnicGroupCountries = countries.filter(
          (c) => !ethnicGroup.ethnicGroupCountries.find((e) => e.countryId === c.countryId)
        )
        const newEthnicNameAliases = nameAliases.filter(
          (n) => !ethnicGroup.ethnicNameAliases.find((e) => e.nameVariant === n.nameVariant)
        )

        // Create new related records
        await ethnicGroup.related('ethnicGroupCountries').createMany(
          newEthnicGroupCountries.map((country) => ({
            countryId: country.countryId,
            populationEstimate: country.populationEstimate,
            source: country.source,
            isPrimaryHome: country.isPrimaryHome === 'on' || country.isPrimaryHome === true,
          })),
          { client }
        )

        await ethnicGroup.related('ethnicNameAliases').createMany(
          newEthnicNameAliases.map((nameAlias) => ({
            nameVariant: nameAlias.nameVariant,
            langaugeOfNameVariant: nameAlias.language,
            source: nameAlias.source,
          })),
          { client }
        )

        return ethnicGroup
      })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  public static async createSubEthnicGroup({ request, session, params }: HttpContext) {
    const { name, description, countries } = await request.validateUsing(
      createSubEthnicGroupValidator
    )
    const { ethnicGroupId } = params

    try {
      const ethnicGroup = await EthnicGroup.find(ethnicGroupId)
      if (!ethnicGroup) {
        session.flashErrors({
          error: 'Ethnic group not found',
        })
        return false
      }

      await db.transaction(async (client) => {
        const subEthnicGroup = await SubEthnicGroup.create(
          {
            ethnicGroupId: ethnicGroup.id,
            canonicalName: name,
            note: description || '',
          },
          { client }
        )

        await subEthnicGroup.related('subEthnicGroupCountries').createMany(
          countries.map((country) => ({
            countryId: country.countryId,
            populationEstimate: country.populationEstimate,
            source: country.source,
            isPrimaryHome: country.isPrimaryHome === 'on' || country.isPrimaryHome === true,
          })),
          { client }
        )

        return subEthnicGroup
      })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  public static async updateSubEthnicGroup({ request, session, params }: HttpContext) {
    const { name, description, countries } = await request.validateUsing(
      createSubEthnicGroupValidator
    )
    const { id } = params

    try {
      const subEthnicGroup = await SubEthnicGroup.find(id)
      if (!subEthnicGroup) {
        session.flashErrors({
          error: 'Sub ethnic group not found',
        })
        return false
      }

      await db.transaction(async (client) => {
        subEthnicGroup.canonicalName = name
        subEthnicGroup.note = description || ''
        await subEthnicGroup.save()

        await subEthnicGroup.related('subEthnicGroupCountries').query().delete()

        await subEthnicGroup.related('subEthnicGroupCountries').createMany(
          countries.map((country) => ({
            countryId: country.countryId,
            populationEstimate: country.populationEstimate,
            source: country.source,
            isPrimaryHome: country.isPrimaryHome === 'on' || country.isPrimaryHome === true,
          })),
          { client }
        )

        return subEthnicGroup
      })

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  public static async deleteSubEthnicGroup(ctx: HttpContext) {
    const { params, session } = ctx
    const role = await AuthUtil.activeRoleName(ctx)
    if (!canDelete(role)) {
      session.flashErrors({ error: 'You are not allowed to delete sub-ethnic groups' })
      return false
    }

    const { id } = params

    try {
      const subEthnicGroup = await SubEthnicGroup.find(id)
      if (!subEthnicGroup) {
        session.flashErrors({
          error: 'Sub ethnic group not found',
        })
        return false
      }

      // expose for redirect in controller
      ;(params as any).ethnicGroupId = subEthnicGroup.ethnicGroupId

      await subEthnicGroup.related('subEthnicGroupCountries').query().delete()
      await subEthnicGroup.delete()

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  public static async deleteEthnicGroup(ctx: HttpContext) {
    const { params, session } = ctx
    const role = await AuthUtil.activeRoleName(ctx)
    if (!canDelete(role)) {
      session.flashErrors({ error: 'You are not allowed to delete ethnic groups' })
      return false
    }

    const { id } = params

    const ethnicGroup = await EthnicGroup.find(id)

    if (!ethnicGroup) {
      return false
    }

    try {
      // Delete related sub-ethnic groups and their countries
      const subEthnicGroups = await ethnicGroup.related('subEthnicGroups').query()

      for (const subEthnicGroup of subEthnicGroups) {
        await subEthnicGroup.related('subEthnicGroupCountries').query().delete()
      }

      // Delete all sub-ethnic groups
      await ethnicGroup.related('subEthnicGroups').query().delete()

      // Delete ethnic group countries
      await ethnicGroup.related('ethnicGroupCountries').query().delete()

      // Delete the ethnic group
      await ethnicGroup.delete()

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
}
