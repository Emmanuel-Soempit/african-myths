import { useState } from 'react'
import { Form, router } from '@inertiajs/react'
import Button from '~/shared/ui/button'
import Input from '~/shared/ui/input'
import TextArea from '~/shared/ui/textarea'
import Select from '~/shared/ui/select'
import useUtils from '~/shared/hooks/use_utils'
import EthnicGroup from '#models/ethnic_group'
import { CountryItem } from './types'
import toast from 'react-hot-toast'
import AddSubEthnicGroupModal from './components/add_sub_ethnic_group_modal'
import { DataTable } from '~/shared/ui/data-table'
import SubEthnicGroup from '#models/sub_ethnic_group'
import { TableData } from '~/types'
import ViewSubEthnicGroupModal from './components/view_sub_ethnic_group_modal'
import UpdateSubEthnicGroupModal from './components/update_sub_ethnic_group_modal'
import { ConfirmDeleteModal } from '~/shared/ui'

interface NameAlias {
    id: string
    nameVariant: string
    language: string
    source: string
}

interface AdminEthnicGroupDetailPageProps {
    ethnicGroup: EthnicGroup
    subEthnicGroups: TableData<SubEthnicGroup[]>
}


export default function AdminEthnicGroupDetailPage({ ethnicGroup, subEthnicGroups }: AdminEthnicGroupDetailPageProps) {
    const { loadLanguageOptions, loadCountryOptions, loadDefaultCountryOption, loadDefaultLanguageOption } = useUtils()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeletingSubGroup, setIsDeletingSubGroup] = useState(false)
    const [selectedSubGroup, setSelectedSubGroup] = useState<SubEthnicGroup | null>(null)
    const [subGroupToDelete, setSubGroupToDelete] = useState<SubEthnicGroup | null>(null)

    const [countries, setCountries] = useState<CountryItem[]>(ethnicGroup.ethnicGroupCountries.map((c, i) => ({ id: i.toString(), countryId: c.countryId, populationEstimate: c.populationEstimate, isPrimaryHome: c.isPrimaryHome, source: c.source })))

    const [nameAliases, setNameAliases] = useState<NameAlias[]>(ethnicGroup.ethnicNameAliases.map((n, i) => ({ id: i.toString(), nameVariant: n.nameVariant, language: n.langaugeOfNameVariant, source: n.source })))

    const addCountry = () => {
        const newCountry = {
            id: Date.now().toString(),
            countryId: '',
            populationEstimate: '',
            isPrimaryHome: false,
            source: ''
        }
        setCountries([...countries, newCountry])
    }

    const removeCountry = (id: string) => {
        setCountries(countries.filter(country => country.id !== id))
    }

    const updateCountry = (id: string, field: string, value: any) => {
        setCountries(countries.map(country =>
            country.id === id ? { ...country, [field]: value } : country
        ))
    }

    const addNameAlias = () => {
        const newNameAlias = {
            id: Date.now().toString(),
            nameVariant: '',
            language: '',
            source: ''
        }
        setNameAliases([...nameAliases, newNameAlias])
    }

    const removeNameAlias = (id: string) => {
        setNameAliases(nameAliases.filter(alias => alias.id !== id))
    }

    const updateNameAlias = (id: string, field: string, value: any) => {
        setNameAliases(nameAliases.map(alias =>
            alias.id === id ? { ...alias, [field]: value } : alias
        ))
    }

    console.log('Language Id on page', ethnicGroup.languageId)

    const handleViewSubGroup = (subGroup: SubEthnicGroup) => {
        setSelectedSubGroup(subGroup)
        setIsViewModalOpen(true)
    }

    const handleEditSubGroup = (subGroup: SubEthnicGroup) => {
        setSelectedSubGroup(subGroup)
        setIsUpdateModalOpen(true)
    }

    const handleDeleteSubGroup = (subGroup: SubEthnicGroup) => {
        setSubGroupToDelete(subGroup)
        setIsDeleteModalOpen(true)
    }

    const confirmDeleteSubGroup = () => {
        if (!subGroupToDelete) return

        setIsDeletingSubGroup(true)
        router.delete(`/api/v1/admin/sub-ethnic-groups/${subGroupToDelete.id}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success('Sub-ethnic group deleted')
                setIsDeleteModalOpen(false)
                setSubGroupToDelete(null)
            },
            onError: () => {
                toast.error('Failed to delete sub-ethnic group')
            },
            onFinish: () => {
                setIsDeletingSubGroup(false)
            },
        })
    }

    return (
        <>
            {/* Page Heading with Breadcrumbs */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        <a
                            className="hover:text-[var(--color-admin-primary)]"
                            href="/admin/cultures"
                        >
                            Cultures
                        </a>
                        <span>/</span>
                        <a
                            className="hover:text-[var(--color-admin-primary)]"
                            href="/admin/ethnic-groups"
                        >
                            Ethnic Groups
                        </a>
                        <span>/</span>
                        <span className="text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            Yoruba
                        </span>
                    </div>
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Yoruba Ethnic Group
                    </h1>
                    <p className="text-base font-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        View and manage the details for this ethnic group.
                    </p>
                </div>
            </div>

            <div className="mt-8 flex flex-col gap-8">
                {/* Ethnic Group Details Form */}
                <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                    <div className="border-b border-[var(--color-admin-border-light)] p-6 dark:border-[var(--color-admin-border-dark)]">
                        <h2 className="font-display text-xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            Ethnic Group Details
                        </h2>
                    </div>
                    <div className="p-6">
                        <Form
                            action={`/api/v1/admin/ethnic-groups/${ethnicGroup.id}`}
                            method="PUT"
                            className="flex flex-col w-full gap-5"
                            onSuccess={() => {
                                toast.success('Updated succesfully!')
                            }}
                        >
                            {({ errors, setError, processing }) => (
                                <>
                                    <div className="">
                                        <Input
                                            label="Name"
                                            id="name"
                                            name="name"
                                            type="text"
                                            defaultValue={ethnicGroup.canonicalName}
                                            variant="admin-primary"
                                            errors={errors}
                                            setError={setError}
                                        />
                                    </div>

                                    <div className="">
                                        <Select
                                            label="Primary Language"
                                            id="primaryLanguage"
                                            name="primaryLanguage"
                                            variant="admin-primary"
                                            placeholder='Start typing to search...'
                                            errors={errors}
                                            setError={setError}
                                            isAsync={true}
                                            loadOptions={loadLanguageOptions}

                                            defaultValue={ethnicGroup.languageId}
                                            loadDefaultOption={loadDefaultLanguageOption}

                                            onChange={(e) => {
                                                // Handle primary language change if needed
                                                console.log('Primary language changed:', e.target.value)
                                            }}
                                        />
                                    </div>

                                    <div className="">
                                        <TextArea
                                            label="Description"
                                            id="description"
                                            name="description"
                                            defaultValue={ethnicGroup.note}
                                            variant="admin-primary"
                                            errors={errors}
                                            setError={setError}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="2">
                                        <label
                                            className="mb-2 block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]"
                                            htmlFor="countries"
                                        >
                                            Countries
                                        </label>

                                        <div className="space-y-3">
                                            {countries.map((country, index) => (
                                                <div key={country.id} className="space-y-3 border-b-[0.5px] pb-3 border-[var(--color-admin-border-light)]">
                                                    {/* First row: Country and Population */}
                                                    <div className="flex gap-2">
                                                        <div className="flex-1">
                                                            <Select
                                                                name={`countries[${index}][countryId]`}
                                                                variant="admin-primary"
                                                                errors={errors}
                                                                setError={setError}
                                                                isAsync={true}
                                                                placeholder='Start typing to search...'
                                                                loadOptions={loadCountryOptions}
                                                                value={country.countryId}
                                                                onChange={(e) => updateCountry(country.id, 'countryId', e.target.value)}
                                                                defaultValue={country.countryId}
                                                                loadDefaultOption={loadDefaultCountryOption}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <Input
                                                                placeholder="e.g., 7 million"
                                                                name={`countries[${index}][populationEstimate]`}
                                                                type="text"
                                                                variant="admin-primary"
                                                                errors={errors}
                                                                setError={setError}
                                                                value={country.populationEstimate}
                                                                onChange={(e) => updateCountry(country.id, 'populationEstimate', e.target.value)}
                                                            />
                                                        </div>

                                                    {/* Second row: Source and Primary Country */}
                                                        <div className="flex-1">
                                                            <Input
                                                                placeholder="Source"
                                                                name={`countries[${index}][source]`}
                                                                type="text"
                                                                variant="admin-primary"
                                                                errors={errors}
                                                                setError={setError}
                                                                value={country.source}
                                                                onChange={(e) => updateCountry(country.id, 'source', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="flex-1 flex items-center gap-2">
                                                            <div className="flex items-center gap-2 h-11">
                                                                <input
                                                                    type="checkbox"
                                                                    name={`countries[${index}][isPrimaryHome]`}
                                                                    checked={country.isPrimaryHome}
                                                                    onChange={(e) => updateCountry(country.id, 'isPrimaryHome', e.target.checked)}
                                                                    className="rounded border-[var(--color-admin-border-light)] bg-[var(--color-admin-background-light)] text-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-background-dark)]"
                                                                />
                                                                <label
                                                                    className="text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]"
                                                                    htmlFor={`countries[${index}][isPrimaryHome]`}
                                                                >
                                                                    Primary Country
                                                                </label>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeCountry(country.id)}
                                                                className="text-[var(--color-admin-text-secondary-light)] hover:text-red-500 dark:text-[var(--color-admin-text-secondary-dark)]"
                                                            >
                                                                <span className="material-symbols-outlined text-xl">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={addCountry}
                                                className="mt-2 text-[var(--color-admin-primary)] hover:text-[var(--color-admin-primary-hover)] dark:text-[var(--color-admin-primary)] dark:hover:text-[var(--color-admin-primary-hover)]"
                                            >
                                                <span className="material-symbols-outlined">add</span>
                                                Add Country
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            className="mb-2 block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]"
                                        >
                                            Name Aliases
                                        </label>
                                        <div className="space-y-3">
                                            {nameAliases.map((alias, index) => (
                                                <div key={alias.id} className="flex gap-2 items-start">
                                                    <div className="flex-1">
                                                        <Input
                                                            placeholder="Name Variant"
                                                            name={`nameAliases[${index}][nameVariant]`}
                                                            type="text"
                                                            variant="admin-primary"
                                                            errors={errors}
                                                            setError={setError}
                                                            value={alias.nameVariant}
                                                            onChange={(e) => updateNameAlias(alias.id, 'nameVariant', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="w-1/4">
                                                        <Input
                                                            placeholder="Language"
                                                            name={`nameAliases[${index}][language]`}
                                                            type="text"
                                                            variant="admin-primary"
                                                            errors={errors}
                                                            setError={setError}
                                                            value={alias.language}
                                                            onChange={(e) => updateNameAlias(alias.id, 'language', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Input
                                                            placeholder="Source"
                                                            name={`nameAliases[${index}][source]`}
                                                            type="text"
                                                            variant="admin-primary"
                                                            errors={errors}
                                                            setError={setError}
                                                            value={alias.source}
                                                            onChange={(e) => updateNameAlias(alias.id, 'source', e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNameAlias(alias.id)}
                                                        className="mt-2 text-[var(--color-admin-text-secondary-light)] hover:text-red-500 dark:text-[var(--color-admin-text-secondary-dark)]"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={addNameAlias}
                                                className="flex items-center gap-1 text-sm font-medium text-[var(--color-admin-primary)] hover:text-[var(--color-admin-primary)]/80"
                                            >
                                                <span className="material-symbols-outlined text-base">add_circle</span>
                                                Add another alias
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <Button
                                            variant="admin-primary"
                                            type="submit"
                                            className="h-11 min-w-[84px] max-w-[480px] px-6 shadow-sm"
                                            disabled={processing}
                                        >
                                            <span className="material-symbols-outlined text-base">
                                                save
                                            </span>
                                            <span>Update Ethnic Group Details</span>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>

                {/* Sub-Ethnic Groups Table */}
                <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-admin-border-light)] p-6 dark:border-[var(--color-admin-border-dark)]">
                        <h2 className="font-display text-xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            Sub-Ethnic Groups
                        </h2>
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            variant="admin-primary"
                            className="h-10 min-w-[84px] max-w-[480px] px-4"
                        >
                            <span className="material-symbols-outlined text-base">
                                add
                            </span>
                            <span className="truncate text-sm font-bold">
                                Add Sub-Ethnic Group
                            </span>
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <DataTable<SubEthnicGroup>
                            columns={[
                                {
                                    key: 'canonicalName',
                                    header: 'Name',
                                    accessor: (item) => item.canonicalName,
                                    sortable: true
                                },
                                {
                                    key: 'note',
                                    header: 'Description',
                                    accessor: (item) => item.note,
                                    sortable: false
                                },
                                {
                                    key: 'actions',
                                    header: 'Actions',
                                    accessor: (item) => item.id,
                                    sortable: false,
                                    render: (_value, item) => (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewSubGroup(item)}
                                                className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]"
                                            >
                                                <span className="material-symbols-outlined text-xl">
                                                    visibility
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleEditSubGroup(item)}
                                                className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]"
                                            >
                                                <span className="material-symbols-outlined text-xl">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSubGroup(item)}
                                                className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-red-500 dark:text-[var(--color-admin-text-secondary-dark)]"
                                            >
                                                <span className="material-symbols-outlined text-xl">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    )
                                }
                            ]}
                            data={subEthnicGroups.data}
                            meta={subEthnicGroups.meta}
                            title={`Sub-Ethnic Groups`}
                            totalLabel="sub-groups"
                            getRowKey={(subGroup) => subGroup.id}
                        />
                    </div>
                </div>
            </div>

            {/* Add Sub-Ethnic Group Modal */}
            <AddSubEthnicGroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ethnicGroupId={ethnicGroup.id}
            />

            <ViewSubEthnicGroupModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                subGroup={selectedSubGroup}
            />

            <UpdateSubEthnicGroupModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                subGroup={selectedSubGroup}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                name={subGroupToDelete?.canonicalName || ''}
                onNo={() => {
                    if (isDeletingSubGroup) return
                    setIsDeleteModalOpen(false)
                    setSubGroupToDelete(null)
                }}
                onYes={confirmDeleteSubGroup}
                loading={isDeletingSubGroup}
            />
        </>
    )
}
