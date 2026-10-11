import { Role } from '../types'

export const ROLES: Role[] = [
    {
        id: 'reader',
        icon: 'auto_stories',
        title: 'Reader',
        description: 'Discover, explore, and enjoy stories from across the continent.',
    },
    {
        id: 'author',
        icon: 'edit',
        title: 'Author',
        description: 'Create and share new myths and tales to contribute to the collection.',
    },
    {
        id: 'editor',
        icon: 'verified',
        title: 'Editor',
        description: 'Curate and maintain the quality of our stories. Application may be required.',
    },
]
