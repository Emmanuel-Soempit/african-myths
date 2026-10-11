import { SidebarItem } from '~/admin/layout/types'

export const AUTHOR_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    href: '/author/dashboard',
  },
  {
    label: 'Poems',
    icon: 'edit_note',
    href: '/author/writings?type=poem',
  },
  {
    label: 'Stories',
    icon: 'auto_stories',
    href: '/author/writings?type=story',
  },
  {
    label: 'Articles',
    icon: 'article',
    href: '/author/writings?type=article',
  },
  {
    label: 'All Writings',
    icon: 'library_books',
    href: '/author/writings',
  },
]
