import { EditorRendererService } from '#services/editor/editor_renderer'
import { CultureService } from '#services/culture/culture_service'
import { MythService } from '#services/myth/myth_service'
import { EthicGroupService } from '#services/ethic_group/ethic_group_service'
import { HttpContext } from '@adonisjs/core/http'

export default class EditorController {
  async renderDashboard(ctx: HttpContext) {
    return EditorRendererService.renderDashboard(ctx)
  }

  // Ethnic groups

  async renderEthnicGroups(ctx: HttpContext) {
    return EthicGroupService.renderList(ctx, 'editor/ethnic-groups')
  }

  async renderEthnicGroupDetail(ctx: HttpContext) {
    return EthicGroupService.renderDetail(ctx, 'editor/ethnic-group-detail')
  }

  async createEthnicGroup(ctx: HttpContext) {
    const result = await EthicGroupService.createEthnicGroup(ctx)
    if (result) {
      return ctx.response.redirect().toPath('/editor/ethnic-groups')
    }
    return ctx.response.redirect().back()
  }

  async updateEthnicGroup(ctx: HttpContext) {
    const result = await EthicGroupService.updateEthnicGroup(ctx)
    if (result) {
      return ctx.response.redirect().toPath('/editor/ethnic-groups/' + ctx.params.id)
    }
    return ctx.response.redirect().back()
  }

  async createSubEthnicGroup(ctx: HttpContext) {
    const result = await EthicGroupService.createSubEthnicGroup(ctx)
    if (result) {
      return ctx.response.redirect().toPath('/editor/ethnic-groups/' + ctx.params.ethnicGroupId)
    }
    return ctx.response.redirect().back()
  }

  async updateSubEthnicGroup(ctx: HttpContext) {
    await EthicGroupService.updateSubEthnicGroup(ctx)
    return ctx.response.redirect().back()
  }

  // Cultures

  async renderCultures(ctx: HttpContext) {
    return CultureService.renderList(ctx, 'editor/cultures')
  }

  async renderCultureOverview(ctx: HttpContext) {
    return CultureService.renderOverview(ctx, 'editor/culture-overview')
  }

  async renderCultureEdit(ctx: HttpContext) {
    return CultureService.renderEdit(ctx, 'editor/culture-edit')
  }

  async createCulture(ctx: HttpContext) {
    const culture = await CultureService.create(ctx)
    if (culture) {
      return ctx.response.redirect().toPath('/editor/cultures')
    }
    return ctx.response.redirect().back()
  }

  async updateCulture(ctx: HttpContext) {
    await CultureService.update(ctx)
    return ctx.response.redirect().back()
  }

  // Myths

  async renderMyths(ctx: HttpContext) {
    return MythService.renderList(ctx, 'editor/myths')
  }

  async renderMythCreate(ctx: HttpContext) {
    return MythService.renderCreate(ctx, 'editor/myth-create')
  }

  async renderMythEdit(ctx: HttpContext) {
    return MythService.renderEdit(ctx, 'editor/myth-create')
  }

  async createMyth(ctx: HttpContext) {
    const myth = await MythService.create(ctx)
    if (myth) {
      return ctx.response.redirect().toPath(`/editor/cultures/${myth.cultureId}/myths`)
    }
    return ctx.response.redirect().back()
  }

  async updateMyth(ctx: HttpContext) {
    const myth = await MythService.update(ctx)
    if (myth) {
      return ctx.response.redirect().toPath(`/editor/cultures/${myth.cultureId}/myths`)
    }
    return ctx.response.redirect().back()
  }
}
