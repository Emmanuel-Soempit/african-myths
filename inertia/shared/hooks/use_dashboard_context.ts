import { usePage } from '@inertiajs/react'

export type DashboardRole = 'admin' | 'editor' | 'author' | 'reader'

export default function useDashboardContext() {
  const { url, props } = usePage()
  const basePath = url.startsWith('/editor') ? '/editor' : '/admin'
  const apiBase = `/api/v1${basePath}`
  const role = ((props as any).user?.metadata?.role?.name ?? 'reader') as DashboardRole

  return {
    basePath,
    apiBase,
    role,
    can: {
      delete: role === 'admin',
      publish: role === 'admin',
    },
  }
}
