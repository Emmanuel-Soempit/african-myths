import { useState } from 'react'
import Button from '~/shared/ui/button'
import AddUserModal from './components/add_user_modal'
import { router } from '@inertiajs/react'
import User from '#models/user'
import { TableData } from '~/types'
import { DataTable, Column } from '~/shared/ui/data-table'

interface AdminUsersPageProps {
    users: TableData<User[]>
    roles: Array<{ id: string; name: string }>
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export default function AdminUsersPage({ users, roles, sortBy, sortOrder }: AdminUsersPageProps) {
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)

    const defaultProfilePic =
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBdrZL6vsyyX6xlmdP7dF9zlNNaWL774IOXMvTgpkvUrKNceBolUktZ9cVkUGhpKWwy8NmdNKxrJ2l2MSOGKdO7V1j5V46EYepXeoH4jp6-9ICS7H8oWR9Vt0c711yIk0pNxxSeGSZrc0fJ_VRmokcUO3wVoffZhPTysZviQiVeNgpIrj9fLRdlhbHV14rVXVIiOGzpelrSujAUlItCLJrrjN52EPjtTLZu_bjJ7Km7_RTM_Uztgix-him3YaBRx9PoBXO4zbS2-gM'

    // Handle sorting
    const handleSort = (columnKey: string) => {
        const newSortOrder =
            sortBy === columnKey && sortOrder === 'asc' ? 'desc' : 'asc'

        router.visit('/admin/users', {
            data: {
                sortBy: columnKey,
                sortOrder: newSortOrder,
                page: users.meta.currentPage,
            },
            preserveState: true,
            preserveScroll: true,
        })
    }

    // Define table columns
    const userColumns: Column<User>[] = [
        {
            key: 'user',
            header: 'User',
            accessor: (user) => user.profile,
            render: (profile) => (
                <div className="flex items-center gap-3">
                    <div
                        className="aspect-square size-10 rounded-full bg-cover bg-center bg-no-repeat"
                        data-alt="User avatar"
                        style={{
                            backgroundImage: `url('${profile.profilePicture || defaultProfilePic}')`,
                        }}
                    />
                    <span className="font-medium">
                        {profile.firstName} {profile.lastName}
                    </span>
                </div>
            ),
        },
        {
            key: 'email',
            header: 'Email',
            accessor: (user) => user.email,
            className:
                'text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]',
        },
        {
            key: 'role',
            header: 'Role',
            accessor: (user) => user.metadata.role.name,
        },
        {
            key: 'joinDate',
            header: 'Join Date',
            accessor: (user) => new Date(user.createdAt.toLocaleString()).toLocaleDateString(),
            className:
                'text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]',
        },
        {
            key: 'status',
            header: 'Status',
            accessor: (user) => user.metadata.status,
            render: (status) => (
                <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : status === 'suspended'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}
                >
                    {status}
                </span>
            ),
        },
    ]

    return (
        <>
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        User Management
                    </h1>
                    <p className="text-base font-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Manage all registered users and their roles on the Kólà platform.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="admin-primary"
                        className="h-10 min-w-[84px] max-w-[480px] gap-2 px-4 text-sm"
                        onClick={() => setIsAddUserModalOpen(true)}
                    >
                        <span className="material-symbols-outlined text-base">add</span>
                        <span className="truncate">Add New User</span>
                    </Button>
                </div>
            </div>

            {/* Users Table */}
            <div className="mt-8">
                <DataTable
                    columns={userColumns}
                    data={users.data}
                    meta={users.meta}
                    title="All Users"
                    totalLabel="users"
                    getRowKey={(user) => user.id}
                    onSort={handleSort}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    renderActions={(user) => (
                        <>
                            <button
                                onClick={() => {
                                    router.visit(`/admin/users/${user.id}`)
                                }}
                                className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]"
                            >
                                <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                            <button className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-red-500 dark:text-[var(--color-admin-text-secondary-dark)]">
                                <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                        </>
                    )}
                />
            </div>

            <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                roles={roles}
            />
        </>
    )
}
