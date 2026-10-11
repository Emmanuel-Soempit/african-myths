import { useState } from 'react'
import { router } from '@inertiajs/react'
import { DataTable, Column } from '~/shared/ui/data-table'
import { TableData } from '~/types'
import EthnicGroup from '#models/ethnic_group'
import Button from '~/shared/ui/button'
import AddEthnicGroupModal from './components/add_ethnic_group_modal'
import { ConfirmDeleteModal } from '~/shared/ui'
    
interface AdminEthnicGroupsPageProps {
    ethnicGroups: TableData<EthnicGroup[]>
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export default function AdminEthnicGroupsPage({ 
    ethnicGroups, 
    sortBy, 
    sortOrder,
}: AdminEthnicGroupsPageProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState<EthnicGroup | null>(null)

    // Handle sorting
    const handleSort = (columnKey: string) => {
        const newSortOrder =
            sortBy === columnKey && sortOrder === 'asc' ? 'desc' : 'asc'

        router.visit('/admin/ethnic-groups', {
            data: {
                sortBy: columnKey,
                sortOrder: newSortOrder,
                page: ethnicGroups.meta?.currentPage || 1,
            },
            preserveState: true,
            preserveScroll: true,
        })
    }

    // Define table columns
    const columns: Column<EthnicGroup>[] = [
        {
            key: 'name',
            header: 'Name',
            accessor: (group) => group.canonicalName,
            sortable: true,
        },
        {
            key: 'description',
            header: 'Description',
            accessor: (group) => group.note,
            className: 'max-w-xs truncate text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]',
        },
        {
            key: 'subEthnicGroups',
            header: 'Sub-Ethnic Groups',
            accessor: (group) => group.$extras?.sub_ethnic_groups_count,
            render: (value) => (
                <span className="text-center">{value}</span>
            ),
            align: 'center',
            className: 'text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]',
        },
    ]

    const renderActions = (group: EthnicGroup) => (
        <div className="flex justify-end gap-1">
            <button
                onClick={() => {
                    router.visit(`/admin/ethnic-groups/${group.id}`)
                }}
                className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]"
            >
                <span className="material-symbols-outlined text-xl">
                    edit
                </span>
            </button>
            <button 
                onClick={() => {
                    setSelectedGroup(group)
                    setIsDeleteModalOpen(true)
                }}
                className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-red-500 dark:text-[var(--color-admin-text-secondary-dark)]"
            >
                <span className="material-symbols-outlined text-xl">
                    delete
                </span>
            </button>
        </div>
    )
    return (
        <>
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Ethnic Groups Management
                    </h1>
                    <p className="text-base font-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Manage all ethnic groups and their information on the
                        Kólà platform.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="admin-primary" 
                        className="h-10 min-w-[84px] max-w-[480px] px-4"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <span className="material-symbols-outlined text-base">
                            add
                        </span>
                        <span className="truncate text-sm font-bold">
                            Add Ethnic Group
                        </span>
                    </Button>
                </div>
            </div>

            {/* Ethnic Groups Table */}
            <div className="mt-8">
                <DataTable<EthnicGroup>
                    columns={columns}
                    data={ethnicGroups.data}
                    meta={ethnicGroups.meta}
                    title={`All Ethnic Groups`}
                    totalLabel="groups"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    renderActions={renderActions}
                    getRowKey={(group) => group.id}
                />
            </div>

            {/* Add Ethnic Group Modal */}
            <AddEthnicGroupModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                name={selectedGroup?.canonicalName || ''}
                onNo={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedGroup(null)
                }}
                onYes={() => {
                    if (selectedGroup) {
                        router.delete(`/api/v1/admin/ethnic-groups/${selectedGroup.id}`, {
                            onSuccess: () => {
                                setIsDeleteModalOpen(false)
                                setSelectedGroup(null)
                            },
                            onError: (errors) => {
                                console.error('Delete failed:', errors)
                                setIsDeleteModalOpen(false)
                                setSelectedGroup(null)
                            }
                        })
                    }
                }}
            />
        </>
    )
}
