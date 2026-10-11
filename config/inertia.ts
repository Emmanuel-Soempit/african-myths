import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    user: async (ctx) => {
      await ctx.auth.check()
      const user = ctx.auth.user
      if (user) {
        await user.load('metadata', (query) => {
          query.preload('role')
        })
        await user.load('profile')
      }

      // Return the user (now with loaded data)
      return ctx.inertia.always(() => user)
    },
    flash: (ctx) => {
      return ctx.session.flashMessages.all()
    },
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    // SSR needs the Vite dev server or a built bundle, neither of which exists in tests
    enabled: process.env.NODE_ENV !== 'test',
    entrypoint: 'inertia/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
