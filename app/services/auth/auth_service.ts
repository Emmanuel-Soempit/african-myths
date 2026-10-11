import { emailRegistrationValidator, emailSignInValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Role from '#models/role'
import AuthUtil from '../../util/auth_util.js'
import { DateTime } from 'luxon'

export class AuthService {
  // Sign Ups
  public static async emailRegistration({ request, auth, session, response }: HttpContext) {
    const { email, password, firstName, lastName } = await request.validateUsing(
      emailRegistrationValidator
    )
    try {
      await db.transaction(async (client) => {
        // Created user
        const user = await User.create(
          {
            email,
            password,
          },
          { client }
        )

        // Create profile
        await user.related('profile').create(
          {
            firstName,
            lastName,
          },
          { client }
        )

        const readerRole = await Role.findBy('name', 'reader')
        if (!readerRole) {
          session.flashErrors({
            error: 'Could not find reader role',
          })
          return response.redirect().back()
        }

        await user.related('roles').attach([readerRole!.id])
        await user.related('metadata').create({
          signUpMethod: 'email',
          signUpType: 'organic',
        })
        await user.related('metadata').query().update({
          activeRoleId: readerRole!.id,
        })
        await user.load('metadata', async (query) => {
          await query.preload('role')
        })
        await auth.use('web').login(user)

        session.flash({
          success: 'User registered successfully',
        })
      })

      return response.redirect().toPath('/auth/roles')
    } catch (error) {
      console.log('Reg error: ', error)
      session.flashErrors({
        error: 'Something went wrong during registration',
      })
      return response.redirect().back()
    }
  }

  public static async googleSignIn({ ally }: HttpContext) {
    // console.log('Google sign in')
    return ally.use('google').redirect()
  }

  public static async googleCallback({ ally, response, session, auth }: HttpContext) {
    const google = ally.use('google')
    const oauthError = google.accessDenied()
      ? 'Google sign in was cancelled'
      : google.stateMisMatch()
        ? 'Your Google sign in session expired, please try again'
        : google.hasError()
          ? 'Something went wrong during Google sign in'
          : null
    if (oauthError) {
      session.flashErrors({ error: oauthError })
      return response.redirect().toPath('/auth/sign-up')
    }

    const googleUser = await google.user()

    const readerRole = await Role.findBy('name', 'reader')
    if (!readerRole) {
      session.flashErrors({
        error: 'Could not find reader role',
      })
      return response.redirect().toPath('/auth/sign-up')
    }

    const exsitingUser = await User.findBy('email', googleUser.email)
    if (exsitingUser) {
      await exsitingUser.load('metadata', async (query) => {
        await query.preload('role')
      })
      if (!exsitingUser.metadata?.role) {
        await db.transaction(async (client) => {
          exsitingUser.useTransaction(client)
          await exsitingUser.related('roles').sync([readerRole.id], false)
          if (exsitingUser.metadata) {
            exsitingUser.metadata.useTransaction(client)
            exsitingUser.metadata.activeRoleId = readerRole.id
            await exsitingUser.metadata.save()
          } else {
            await exsitingUser.related('metadata').create({
              signUpMethod: 'google',
              signUpType: 'organic',
              emailVerifiedAt: DateTime.now(),
              activeRoleId: readerRole.id,
            })
          }
        })
        await exsitingUser.load('metadata', async (query) => {
          await query.preload('role')
        })
      }
      await auth.use('web').login(exsitingUser)
      // console.log('User', exsitingUser.metadata.role.name)
      const routePath = AuthUtil.roleBasedRedirectRoute(exsitingUser.metadata.role)
      return response.redirect().toPath(routePath)
    }

    try {
      return await db.transaction(async (client) => {
        const user = await User.create(
          {
            email: googleUser.email,
            password: googleUser.id,
          },
          { client }
        )

        await user.related('roles').attach([readerRole.id])
        await user.related('metadata').create({
          signUpMethod: 'google',
          signUpType: 'organic',
          emailVerifiedAt: DateTime.now(),
        })
        await user.related('metadata').query().update({
          activeRoleId: readerRole!.id,
        })
        const firstName = googleUser.name.split(' ')[0]
        const lastName = googleUser.name.split(' ')[googleUser.name.split(' ').length - 1]
        await user.related('profile').create({
          firstName,
          lastName,
        })
        await user.load('metadata', async (query) => {
          await query.preload('role')
        })
        await auth.use('web').login(user)

        session.flash({
          success: 'User registered successfully',
        })

        // console.log('User', user)
        return response.redirect().toPath('/auth/roles')
      })
    } catch (error) {
      console.log('Google callback error: ', error)
      session.flashErrors({
        error: 'Something went wrong during sign up',
      })
      return response.redirect().toPath('/auth/sign-up')
    }
  }

  // Sign Ins
  public static async emailSignIn({ request, auth, session, response }: HttpContext) {
    const { email, password } = await request.validateUsing(emailSignInValidator)
    const user = await User.verifyCredentials(email, password)
    // console.log('User', user)

    try {
      await user.load('metadata', (query) => {
        query.preload('role')
      })
      await auth.use('web').login(user)
      session.flash({
        success: 'User signed in successfully',
      })
      const routePath = user.metadata?.role
        ? AuthUtil.roleBasedRedirectRoute(user.metadata.role)
        : '/'
      return response.redirect().toPath(routePath)
    } catch (error) {
      console.log('Sign in error: ', error)
      session.flashErrors({
        error: 'Something went wrong during sign in',
      })
      return response.redirect().back()
    }
  }

  public static async signOut({ auth, session, response }: HttpContext) {
    await auth.use('web').logout()
    session.flash({
      success: 'User signed out successfully',
    })
    return response.redirect().toPath('/')
  }

  // app/services/auth/auth_service.ts
  public static async assignRole({ request, auth, session, response }: HttpContext) {
    const { roleId } = request.all() // Get the role ID sent from frontend
    const user = auth.user! // Get the currently logged in user
    // console.log('User', user)

    try {
      const role = await Role.findBy('id', roleId)
      if (!role) {
        session.flashErrors({
          error: 'Role not found',
        })
        return response.redirect().back()
      }
      if (role.name === 'reader') {
        return response.redirect().toPath('/')
      }
      // 1. Attach the new role to the user (if they don't have it already)
      await user.related('roles').attach([role.id])

      // 2. Update their active role in metadata
      await user.related('metadata').query().update({
        activeRoleId: role.id,
      })

      // 3. Flash success message
      session.flash({
        success: 'Role updated successfully',
      })

      // 4. Redirect to home
      const routePath = AuthUtil.roleBasedRedirectRoute(role)
      return response.redirect().toPath(routePath)
    } catch (error) {
      console.log('Assign role error: ', error)
      session.flashErrors({
        error: 'Failed to update role',
      })
      return response.redirect().back()
    }
  }
}
