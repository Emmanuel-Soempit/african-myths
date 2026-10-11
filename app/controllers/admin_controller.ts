// import type { HttpContext } from '@adonisjs/core/http'

import { AdminRendererService } from '#services/admin/admin_renderer'
import { AdminService } from '#services/admin/admin_service'
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
      return ctx.response.redirect().toRoute('/admin/ethnic-groups')
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
    const { name, ethnicGroupId } = ctx.request.only(['name', 'ethnicGroupId'])

    if (!name || !ethnicGroupId) {
      ctx.session.flashErrors({ error: 'Name and Ethnic Group are required' })
      return ctx.response.redirect().back()
    }

    try {
      const authorId = ctx.auth.user!.id
      const { default: Culture } = await import('#models/culture')
      await Culture.create({ name, ethnicGroupId, authorId, status: 'draft' })
      return ctx.response.redirect().toPath('/admin/cultures')
    } catch (error) {
      console.error('createCulture error:', error)
      ctx.session.flashErrors({ error: 'Failed to create culture. Please try again.' })
      return ctx.response.redirect().back()
    }
  }

  async updateCulture(ctx: HttpContext) {
    const { id } = ctx.params
    const { name, ethnicGroupId, history, language, thumbnail, status } = ctx.request.only([
      'name',
      'ethnicGroupId',
      'history',
      'language',
      'thumbnail',
      'status',
    ])

    const { default: Culture } = await import('#models/culture')
    const culture = await Culture.findOrFail(id)

    if (name !== undefined) culture.name = name
    if (ethnicGroupId !== undefined) culture.ethnicGroupId = ethnicGroupId
    if (history !== undefined) culture.history = history
    if (language !== undefined) culture.language = language
    if (thumbnail !== undefined) culture.thumbnail = thumbnail
    if (status !== undefined) culture.status = status


    await culture.save()

    return ctx.response.redirect().back()
  }

  async deleteCulture(ctx: HttpContext) {
    const { id } = ctx.params

    const { default: Culture } = await import('#models/culture')
    const culture = await Culture.findOrFail(id)
    await culture.delete()

    return ctx.response.redirect().toPath('/admin/cultures')
  }

  async renderMythCreate(ctx: HttpContext) {
    return AdminRendererService.renderMythCreate(ctx)
  }

  async createMyth(ctx: HttpContext) {
    const { name, content, status, source, cultureId, subEthnicGroupId } = ctx.request.only([
      'name',
      'content',
      'status',
      'source',
      'cultureId',
      "subEthnicGroupId"
    ])

    const thumbnailFile = ctx.request.file('thumbnailFile', {
      size: '5mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
    })

    if (!name || !cultureId) {
      ctx.session.flashErrors({ error: 'Name/Title and Culture are required' })
      return ctx.response.redirect().back()
    }

    try {
      const authorId = ctx.auth.user!.id

      let thumbnailUrl = ''
      if (thumbnailFile) {
        if (!thumbnailFile.isValid) {
          ctx.session.flashErrors({ error: 'Invalid thumbnail file. Please upload a valid image (max 5mb).' })
          return ctx.response.redirect().back()
        }
        const { cuid } = await import('@adonisjs/core/helpers')
        const app = (await import('@adonisjs/core/services/app')).default
        const fileName = `${cuid()}.${thumbnailFile.extname}`
        await thumbnailFile.move(app.makePath('public/myths'), {
          name: fileName,
          overwrite: true,
        })
        thumbnailUrl = `/myths/${fileName}`
      } else {
        thumbnailUrl = ctx.request.input('thumbnail', '')
      }

      // Calculate minutes to read based on word count of content
      let minutesToRead = 1
      if (content) {
        // Strip HTML tags to get raw text
        const plainText = content.replace(/<[^>]*>/g, ' ')
        const words = plainText.trim().split(/\s+/)
        const wordCount = words.length
        minutesToRead = Math.max(1, Math.ceil(wordCount / 200))
      }

      const { default: Myth } = await import('#models/myth')
      await Myth.create({
        name,
        thumbnail: thumbnailUrl || '',
        content: content || '',
        status: status || 'draft',
        source: source || '',
        cultureId,
        authorId,
        subEthnicGroupId,
        minutesToRead,
      })

      return ctx.response.redirect().toPath(`/admin/cultures/${cultureId}/myths`)
    } catch (error) {
      console.error('createMyth error:', error)
      ctx.session.flashErrors({ error: 'Failed to create myth. Please try again.' })
      return ctx.response.redirect().back()
    }
  }

  async renderMythEdit(ctx: HttpContext) {
    return AdminRendererService.renderMythEdit(ctx)
  }

  async updateMyth(ctx: HttpContext) {
    const { id } = ctx.params
    const { name, content, status, source, cultureId, subEthnicGroupId } = ctx.request.only([
      'name',
      'content',
      'status',
      'source',
      'cultureId',
      'subEthnicGroupId',
    ])

    const thumbnailFile = ctx.request.file('thumbnailFile', {
      size: '5mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
    })

    if (!name || !cultureId) {
      ctx.session.flashErrors({ error: 'Name/Title and Culture are required' })
      return ctx.response.redirect().back()
    }

    try {
      const { default: Myth } = await import('#models/myth')
      const myth = await Myth.findOrFail(id)

      let thumbnailUrl = myth.thumbnail
      if (thumbnailFile) {
        if (!thumbnailFile.isValid) {
          ctx.session.flashErrors({ error: 'Invalid thumbnail file. Please upload a valid image (max 5mb).' })
          return ctx.response.redirect().back()
        }
        const { cuid } = await import('@adonisjs/core/helpers')
        const app = (await import('@adonisjs/core/services/app')).default
        const fileName = `${cuid()}.${thumbnailFile.extname}`
        await thumbnailFile.move(app.makePath('public/myths'), {
          name: fileName,
          overwrite: true,
        })
        thumbnailUrl = `/myths/${fileName}`
      } else {
        const textUrl = ctx.request.input('thumbnail')
        if (textUrl !== undefined) {
          thumbnailUrl = textUrl
        }
      }

      // Calculate minutes to read based on word count of content
      let minutesToRead = myth.minutesToRead
      if (content !== undefined) {
        // Strip HTML tags to get raw text
        const plainText = content.replace(/<[^>]*>/g, ' ')
        const words = plainText.trim().split(/\s+/)
        const wordCount = words.length
        minutesToRead = Math.max(1, Math.ceil(wordCount / 200))
      }

      myth.name = name
      if (thumbnailUrl !== undefined) myth.thumbnail = thumbnailUrl
      if (content !== undefined) myth.content = content
      if (status !== undefined) myth.status = status
      if (source !== undefined) myth.source = source
      if (subEthnicGroupId !== undefined) myth.subEthnicGroupId = subEthnicGroupId
      myth.minutesToRead = minutesToRead

      await myth.save()

      return ctx.response.redirect().toPath(`/admin/cultures/${cultureId}/myths`)
    } catch (error) {
      console.error('updateMyth error:', error)
      ctx.session.flashErrors({ error: 'Failed to update myth. Please try again.' })
      return ctx.response.redirect().back()
    }
  }
}
