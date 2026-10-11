import AuthorDashboardLayout from '~/author/layout/author-dashboard'
import AuthorWritingsPage from '~/author/features/writings/page'
import { ReactNode } from 'react'
import { TableData } from '~/types'
import { Writing } from '~/types/writing'

interface AuthorWritingsProps {
    writings: TableData<Writing[]>
    filters: { type: string; status: string }
}

export default function AuthorWritings({ writings, filters }: AuthorWritingsProps) {
    return <AuthorWritingsPage writings={writings} filters={filters} />
}

AuthorWritings.layout = (page: ReactNode) => {
    return <AuthorDashboardLayout title="My Writings">{page}</AuthorDashboardLayout>
}
