import EthnicGroup from '#models/ethnic_group'
import SubEthnicGroup from '#models/sub_ethnic_group'
import Language from '#models/language'
import { createEthnicGroupValidator, createSubEthnicGroupValidator } from '#validators/ethnic_group'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export class EthicGroupService {
  // Your code here

  public static async createEthnicGroup({ request, session }: HttpContext) {
    const { name, countries, nameAliases, primaryLanguage, description } = await request.validateUsing(createEthnicGroupValidator)

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
        const ethnicGroup = await EthnicGroup.create({ canonicalName: name, note: description, languageId: language.id }, { client })


        await ethnicGroup.related('ethnicGroupCountries').createMany(
          countries.map(
            (country) => (
              { countryId: country.countryId, populationEstimate: country.populationEstimate, source: country.source, isPrimaryHome: (country.isPrimaryHome === 'on' || country.isPrimaryHome === true) })))

        await ethnicGroup.related('ethnicNameAliases').createMany(
          nameAliases.map(
            (nameAlias) => (
              { nameVariant: nameAlias.nameVariant, langaugeOfNameVariant: nameAlias.language, source: nameAlias.source })))

        return ethnicGroup
      })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  public static async updateEthnicGroup({ request, session, params }: HttpContext) {
    const { name, countries, nameAliases, primaryLanguage, description } = await request.validateUsing(createEthnicGroupValidator)
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
        const newEthnicGroupCountries = countries.filter((c) => !ethnicGroup.ethnicGroupCountries.find((e) => e.countryId === c.countryId))
        const newEthnicNameAliases = nameAliases.filter((n) => !ethnicGroup.ethnicNameAliases.find((e) => e.nameVariant === n.nameVariant))

        // Create new related records
        await ethnicGroup.related('ethnicGroupCountries').createMany(
          newEthnicGroupCountries.map(
            (country) => (
              { countryId: country.countryId, populationEstimate: country.populationEstimate, source: country.source, isPrimaryHome: (country.isPrimaryHome === 'on' || country.isPrimaryHome === true) })), { client })

        await ethnicGroup.related('ethnicNameAliases').createMany(
          newEthnicNameAliases.map(
            (nameAlias) => (
              { nameVariant: nameAlias.nameVariant, langaugeOfNameVariant: nameAlias.language, source: nameAlias.source })), { client })

        return ethnicGroup
      })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  public static async createSubEthnicGroup({ request, session, params }: HttpContext) {
    const { name, description, countries } = await request.validateUsing(createSubEthnicGroupValidator)
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
        const subEthnicGroup = await SubEthnicGroup.create({
          ethnicGroupId: ethnicGroup.id,
          canonicalName: name,
          note: description || ''
        }, { client })

        await subEthnicGroup.related('subEthnicGroupCountries').createMany(countries.map((country) => ({ countryId: country.countryId, populationEstimate: country.populationEstimate, source: country.source, isPrimaryHome: (country.isPrimaryHome === 'on' || country.isPrimaryHome === true) })), { client })

        return subEthnicGroup
      })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  public static async updateSubEthnicGroup({ request, session, params }: HttpContext) {
    const { name, description, countries } = await request.validateUsing(createSubEthnicGroupValidator)
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

  public static async deleteSubEthnicGroup({ params, session }: HttpContext) {
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
      ; (params as any).ethnicGroupId = subEthnicGroup.ethnicGroupId


      await subEthnicGroup.related('subEthnicGroupCountries').query().delete()
      await subEthnicGroup.delete()


      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  public static async deleteEthnicGroup({ params }: HttpContext) {
    const { id } = params

    const ethnicGroup = await EthnicGroup.find(id)

    if (!ethnicGroup) {
      return false
    }

    try {
        // Delete related sub-ethnic groups and their countries
        const subEthnicGroups = await ethnicGroup
          .related('subEthnicGroups')
          .query()

        for (const subEthnicGroup of subEthnicGroups) {
          await subEthnicGroup
            .related('subEthnicGroupCountries')
            .query()
            .delete()
        }

        // Delete all sub-ethnic groups
        await ethnicGroup
          .related('subEthnicGroups')
          .query()
          .delete()

        // Delete ethnic group countries
        await ethnicGroup
          .related('ethnicGroupCountries')
          .query()
          .delete()

        // Delete the ethnic group
        await ethnicGroup.delete()


      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
}