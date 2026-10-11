import { inviteUserValidator } from '#validators/admin'
import type { HttpContext } from '@adonisjs/core/http'
import UserInvitation from '#models/user_invitation'
import { DateTime } from 'luxon'
import { randomBytes } from 'node:crypto'
import env from '#start/env'

export class AdminService {
  /**
   * Create a new user invitation
   */
  public static async createInvitation({ request, auth, session, response }: HttpContext) {
    const { email, firstName, lastName, roleId } = await request.validateUsing(inviteUserValidator)

    const inviter = auth.user!

    try {
      // Check for existing pending invitation
      const existingInvitation = await UserInvitation.query()
        .where('email', email)
        .whereIn('status', ['pending'])
        .first()

      if (existingInvitation) {
        session.flashErrors({
          error: 'An active invitation already exists for this email address',
        })
        return response.redirect().back()
      }

      // Generate unique token
      const token = randomBytes(32).toString('hex')

      // Create invitation
      const invitation = await UserInvitation.create({
        email,
        firstName,
        lastName,
        inviteToken: token,
        roleId,
        invitedBy: inviter.id,
        status: 'pending',
        expiresAt: DateTime.now().plus({ days: 7 }),
      })

      // Generate invitation URL
      const baseUrl = env.get('APP_URL', 'http://localhost:3333')
      const invitationUrl = `${baseUrl}/auth/accept-invitation?token=${token}`

      // Flash success with invitation data
      session.flash({
        success: 'Invitation created successfully',
        invitation: {
          id: invitation.id,
          email: invitation.email,
          url: invitationUrl,
          expiresAt: invitation.expiresAt.toISO(),
        },
      })

      return response.redirect().back()
    } catch (error) {
      console.error('Create invitation error:', error)
      session.flashErrors({
        error: 'Failed to create invitation',
      })
      return response.redirect().back()
    }
  }
}
