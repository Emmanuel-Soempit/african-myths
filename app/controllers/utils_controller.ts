import type { HttpContext } from '@adonisjs/core/http'
import { UploadService } from '#services/upload/upload_service'

import Language from '#models/language'
import Country from '#models/country'
import Culture from '#models/culture'
import EthnicGroup from '#models/ethnic_group'
import SubEthnicGroup from '#models/sub_ethnic_group'

export default class UtilsController {
  async searchLanguages(ctx: HttpContext) {
    const search = ctx.request.input('search', '')
    const page = ctx.request.input('page', 1)
    const limit = 50

    const languages = await Language.query()
      .where('name', 'ilike', `%${search}%`)
      .paginate(page, limit)

    return languages.toJSON()
  }

  async getLanguageById(ctx: HttpContext) {
    const { id } = ctx.params

    if (!id) {
      return ctx.response.badRequest({ error: 'Language id is required' })
    }

    const language = await Language.query().where('id', id).first()
    if (!language) {
      return null
    }
    return language.toJSON()
  }

  async searchCountry(ctx: HttpContext) {
    const search = ctx.request.input('search', '')
    const page = ctx.request.input('page', 1)
    const limit = 50

    const countries = await Country.query()
      .where('name', 'ilike', `%${search}%`)
      .paginate(page, limit)

    return countries.toJSON()
  }

  async getCountryById(ctx: HttpContext) {
    const { id } = ctx.params

    if (!id) {
      return ctx.response.badRequest({ error: 'Country id is required' })
    }

    const country = await Country.query().where('id', id).first()
    if (!country) {
      return null
    }
    return country.toJSON()
  }

  async uploadFile(ctx: HttpContext) {
    const image = ctx.request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
    })

    if (!image) {
      return ctx.response.badRequest({ error: 'Image file is required' })
    }

    if (!image.isValid) {
      return ctx.response.badRequest({ error: image.errors })
    }

    const folder = ctx.request.input('folder', 'cultures')
    if (!UploadService.isValidFolder(folder)) {
      return ctx.response.badRequest({ error: 'Invalid upload folder' })
    }

    try {
      const { url } = await UploadService.uploadImage(image, folder)
      return { url }
    } catch (error) {
      return ctx.response.badRequest({
        error: error instanceof Error ? error.message : 'Upload failed',
      })
    }
  }

  async searchEthnicGroups(ctx: HttpContext) {
    const search = ctx.request.input('search', '')
    const limit = 100

    const ethnicGroups = await EthnicGroup.query()
      .select('id', 'canonical_name')
      .where('canonical_name', 'ilike', `%${search}%`)
      .orderBy('canonical_name', 'asc')
      .limit(limit)

    return ethnicGroups.map((group) => ({
      id: group.id,
      canonicalName: group.canonicalName,
    }))
  }

  async searchSubEthnicGroups(ctx: HttpContext) {
    const search = ctx.request.input('search', '')
    const ethnicGroupId = ctx.request.input('ethnicGroupId', '')
    const limit = 100

    const subEthnicGroups = await SubEthnicGroup.query()
      .select('id', 'canonical_name')
      .where('canonical_name', 'ilike', `%${search}%`)
      .if(ethnicGroupId, (q) => q.where('ethnic_group_id', ethnicGroupId))
      .orderBy('canonical_name', 'asc')
      .limit(limit)

    return subEthnicGroups.map((group) => ({
      id: group.id,
      canonicalName: group.canonicalName,
    }))
  }

  async searchCultures(ctx: HttpContext) {
    const search = ctx.request.input('search', '')
    const limit = Math.min(Number(ctx.request.input('limit', 50)) || 50, 50)

    const cultures = await Culture.query()
      .where('status', 'published')
      .where('name', 'ilike', `%${search}%`)
      .preload('ethnicGroup')
      .orderBy('name', 'asc')
      .limit(limit)

    return cultures.map((culture) => ({
      id: culture.id,
      name: culture.name,
      ethnicGroupName: culture.ethnicGroup?.canonicalName ?? null,
    }))
  }
}
