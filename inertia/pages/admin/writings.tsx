import AdminDashboardLayout from '~/admin/layout/admin-dashboard'
import AdminWritingsPage from '~/admin/features/writings/page'
import { ReactNode } from 'react'
import { TableData } from '~/types'
import { Writing } from '~/types/writing'

interface AdminWritingsProps {
    writings: TableData<Writing[]>
    filters: { type: string; status: string; cultureId: string }
}

export default function AdminWritings({ writings, filters }: AdminWritingsProps) {
    return <AdminWritingsPage writings={writings} filters={filters} />
}

AdminWritings.layout = (page: ReactNode) => {
    return <AdminDashboardLayout title="Writings">{page}</AdminDashboardLayout>
}
