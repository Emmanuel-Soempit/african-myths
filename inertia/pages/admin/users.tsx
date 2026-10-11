import AdminDashboardLayout from '~/admin/layout/admin-dashboard'
import AdminUsersPage from '~/admin/features/users/page'
import { ReactNode } from 'react'
import User from '#models/user'
import { TableData } from '~/types'

interface AdminUsersProps {
    users: TableData<User[]>
    roles: Array<{ id: string; name: string }>
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export default function AdminUsers({ users, roles, sortBy, sortOrder }: AdminUsersProps) {
    return <AdminUsersPage users={users} roles={roles} sortBy={sortBy} sortOrder={sortOrder} />
}

AdminUsers.layout = (page: ReactNode) => {
    return <AdminDashboardLayout title="Users">{page}</AdminDashboardLayout>
}
