import AdminDashboardLayout from '~/admin/layout/admin-dashboard'
import AdminCulturesPage from '~/admin/features/cultures/page'
import { ReactNode } from 'react'
import { TableData } from '~/types'
import Culture from '#models/culture'

interface AdminCulturesProps {
    cultures: TableData<Culture[]>
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export default function AdminCultures({ cultures, sortBy, sortOrder }: AdminCulturesProps) {
    return <AdminCulturesPage cultures={cultures} sortBy={sortBy} sortOrder={sortOrder} />
}

AdminCultures.layout = (page: ReactNode) => {
    return <AdminDashboardLayout title="Cultures">{page}</AdminDashboardLayout>
}
