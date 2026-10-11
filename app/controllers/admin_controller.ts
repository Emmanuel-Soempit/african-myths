import { AdminRendererService } from '#services/admin/admin_renderer'
import { AdminService } from '#services/admin/admin_service'
import { CultureService } from '#services/culture/culture_service'
import { MythService } from '#services/myth/myth_service'
import { WritingService } from '#services/writing/writing_service'
import { EthicGroupService } from '#services/ethic_group/ethic_group_service'
import { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
  /* Renderer */

  async renderDashboard(ctx: HttpContext) {
    return AdminRendererService.renderDashboard(ctx)
  }

  async renderEthnicGroups(ctx: HttpContext) {
    return AdminRendererService.renderEthnicGroups(ctx)
  }

  async renderEthnicGroupDetail(ctx: HttpContext) {
    return AdminRendererService.renderEthnicGroupDetail(ctx)
  }

  async renderUsers(ctx: HttpContext) {
    return AdminRendererService.renderUsers(ctx)
  }

  // Invitation
  async inviteUser(ctx: HttpContext) {
    return AdminService.createInvitation(ctx)
  }

  // Ethinic Grops
  async createEthnicGroup(ctx: HttpContext) {
    const result = await EthicGroupService.createEthnicGroup(ctx)
    if (result) {
      return ctx.response.redirect().toPath('/admin/ethnic-groups')
    } else {
      return ctx.response.redirect().back()
    }
    // return ctx.response.redirect().back()
  }

  async updateEthnicGroup(ctx: HttpContext) {
    const result = await EthicGroupService.updateEthnicGroup(ctx)
    if (result) {
      return ctx.response.redirect().toPath('/admin/ethnic-groups/' + ctx.params.id)
    } else {
      return ctx.response.redirect().back()
    }
  }

  async createSubEthnicGroup(ctx: HttpContext) {
    const result = await EthicGroupService.createSubEthnicGroup(ctx)
    if (result) {
      return ctx.response.redirect().toPath('/admin/ethnic-groups/' + ctx.params.ethnicGroupId)
    } else {
      return ctx.response.redirect().back()
    }
  }

  async updateSubEthnicGroup(ctx: HttpContext) {
    const result = await EthicGroupService.updateSubEthnicGroup(ctx)
    if (result) {
      return ctx.response.redirect().back()
    } else {
      return ctx.response.redirect().back()
    }
  }

  async deleteSubEthnicGroup(ctx: HttpContext) {
    const result = await EthicGroupService.deleteSubEthnicGroup(ctx)
    if (result) {
      return ctx.response.redirect().toPath('/admin/ethnic-groups/' + ctx.params.ethnicGroupId)
    } else {
      return ctx.response.redirect().back()
    }
  }

  async deleteEthnicGroup(ctx: HttpContext) {
    const success = await EthicGroupService.deleteEthnicGroup(ctx)

    if (success) {
      return ctx.response.redirect().toPath('/admin/ethnic-groups')
    } else {
      return ctx.response.redirect().back()
    }
  }

  async renderCultures(ctx: HttpContext) {
    return AdminRendererService.renderCultures(ctx)
  }

  async renderMyths(ctx: HttpContext) {
    return AdminRendererService.renderMyths(ctx)
  }

  async renderCultureEdit(ctx: HttpContext) {
    return AdminRendererService.renderCultureEdit(ctx)
  }

  async renderCultureOverview(ctx: HttpContext) {
    return AdminRendererService.renderCultureOverview(ctx)
  }

  async createCulture(ctx: HttpContext) {
    const culture = await CultureService.create(ctx)
    if (culture) {
      return ctx.response.redirect().toPath('/admin/cultures')
    }
    return ctx.response.redirect().back()
  }

  async updateCulture(ctx: HttpContext) {
    const culture = await CultureService.update(ctx)
    if (culture) {
      return ctx.response.redirect().back()
    }
    return ctx.response.redirect().back()
  }

  async deleteCulture(ctx: HttpContext) {
    await CultureService.delete(ctx)
    return ctx.response.redirect().toPath('/admin/cultures')
  }

  async renderMythCreate(ctx: HttpContext) {
    return AdminRendererService.renderMythCreate(ctx)
  }

  async createMyth(ctx: HttpContext) {
    const myth = await MythService.create(ctx)
    if (myth) {
      return ctx.response.redirect().toPath(`/admin/cultures/${myth.cultureId}/myths`)
    }
    return ctx.response.redirect().back()
  }

  async renderMythEdit(ctx: HttpContext) {
    return AdminRendererService.renderMythEdit(ctx)
  }

  async updateMyth(ctx: HttpContext) {
    const myth = await MythService.update(ctx)
    if (myth) {
      return ctx.response.redirect().toPath(`/admin/cultures/${myth.cultureId}/myths`)
    }
    return ctx.response.redirect().back()
  }

  // Writings (moderation)

  async renderWritings(ctx: HttpContext) {
    return AdminRendererService.renderWritings(ctx)
  }

  async renderWritingReview(ctx: HttpContext) {
    return AdminRendererService.renderWritingReview(ctx)
  }

  async reviewWriting(ctx: HttpContext) {
    const result = await WritingService.review(ctx)
    if (result) {
      return ctx.response.redirect().toPath('/admin/writings')
    }
    return ctx.response.redirect().back()
  }

  async deleteWriting(ctx: HttpContext) {
    await WritingService.delete(ctx)
    return ctx.response.redirect().toPath('/admin/writings')
  }
}
