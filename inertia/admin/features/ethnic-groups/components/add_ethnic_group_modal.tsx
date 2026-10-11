import { useEffect, useState } from 'react'
import Button from '~/shared/ui/button'
import Input from '~/shared/ui/input'
import TextArea from '~/shared/ui/textarea'
import Select from '~/shared/ui/select'
import { Form } from '@inertiajs/react'
import { toast } from 'react-hot-toast'
import { SelectorOption } from '~/types'
import useUtils from '~/shared/hooks/use_utils'
import useDashboardContext from '~/shared/hooks/use_dashboard_context'

interface AddEthnicGroupModalProps {
    isOpen: boolean
    onClose: () => void
}

interface NameAlias {
    id: string
    nameVariant: string
    language: string
    source: string
}

interface Country {
    id: string
    countryId: string
    populationEstimate: string
    isPrimaryHome: boolean
    source: string
}

export default function AddEthnicGroupModal({
    isOpen,
    onClose,
}: AddEthnicGroupModalProps) {
    const [nameAliases, setNameAliases] = useState<NameAlias[]>([
        { id: '1', nameVariant: '', language: '', source: '' }
    ])
    const [countries, setCountries] = useState<Country[]>([
        { id: '1', countryId: '', populationEstimate: '', isPrimaryHome: false, source: '' }
    ])

    const [languageList, setLanguageList] = useState<SelectorOption[]>([])
    const [countryList, setCountryList] = useState<SelectorOption[]>([])

    const { apiBase } = useDashboardContext()
    const { loadLanguageOptions, loadCountryOptions } = useUtils()


    useEffect(() => {
        const initUtils = async () => {
            const languageOptions = await loadLanguageOptions('')
            const countryOptions = await loadCountryOptions('')
            setLanguageList(languageOptions)
            setCountryList(countryOptions)
        }
        initUtils()
    }, [])

    // loadCountryOptions('')
    if (!isOpen) return null

    const addNameAlias = () => {
        setNameAliases([
            ...nameAliases,
            { id: Date.now().toString(), nameVariant: '', language: '', source: '' }
        ])
    }

    const removeNameAlias = (id: string) => {
        setNameAliases(nameAliases.filter(alias => alias.id !== id))
    }

    const updateNameAlias = (id: string, field: keyof NameAlias, value: string) => {
        setNameAliases(nameAliases.map(alias =>
            alias.id === id ? { ...alias, [field]: value } : alias
        ))
    }

    const addCountry = () => {
        setCountries([
            ...countries,
            { id: Date.now().toString(), countryId: '', populationEstimate: '', isPrimaryHome: false, source: '' }
        ])
    }

    const removeCountry = (id: string) => {
        setCountries(countries.filter(country => country.id !== id))
    }

    const updateCountry = (id: string, field: keyof Country, value: string | boolean) => {
        setCountries(countries.map(country =>
            country.id === id ? { ...country, [field]: value } : country
        ))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-xl h-[90%] border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 shadow-2xl dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-display text-2xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            Add Ethnic Group
                        </h2>
                        <p className="text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                            Enter the details for the new ethnic group.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:text-[var(--color-admin-text-primary-dark)]"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <Form
                    showProgress
                    disableWhileProcessing
                    onSuccess={() => {
                        toast.success('Ethnic group added successfully!')
                        onClose()
                    }}
                    onError={(errors: any) => {
                        if (errors.error) {
                            toast.error(errors.error)
                        } else {
                            toast.error('Failed to add ethnic group')
                        }
                    }}
                    action={`${apiBase}/ethnic-groups`}
                    className="mt-6 space-y-5 overflow-y-auto max-h-[80%] thin-scrollbar px-5"
                    method="POST"
                >
                    {({ errors, setError, processing }) => (
                        <>
                            <Input
                                label="Name"
                                id="name"
                                name="name"
                                placeholder="e.g., Yoruba"
                                type="text"
                                variant="admin-primary"
                                errors={errors}
                                setError={setError}
                            />

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
                                onChange={(e) => {
                                    // Handle primary language change if needed
                                    console.log('Primary language changed:', e.target.value)
                                }}
                                options={languageList}
                            />

                            <TextArea
                                label="Description"
                                id="description"
                                name="description"
                                placeholder="A brief description of the ethnic group..."
                                variant="admin-primary"
                                errors={errors}
                                setError={setError}
                                rows={3}
                            />

                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]"
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
                                                        options={countryList}
                                                        value={country.countryId}
                                                        onChange={(e) => updateCountry(country.id, 'countryId', e.target.value)}
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
                                            </div>

                                            {/* Second row: Source and Primary Country */}
                                            <div className="flex gap-2">
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
                                        className="flex items-center gap-1 text-sm font-medium text-[var(--color-admin-primary)] hover:text-[var(--color-admin-primary)]/80"
                                    >
                                        <span className="material-symbols-outlined text-base">add_circle</span>
                                        Add another country
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

                            {errors.error && (
                                <p className="text-sm text-red-400">{errors.error}</p>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-admin-border-light)]/50 dark:border-[var(--color-admin-border-dark)]/50">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--color-admin-border-light)] bg-transparent px-4 text-sm font-bold text-[var(--color-admin-text-secondary-light)] hover:bg-gray-100 dark:border-[var(--color-admin-border-dark)] dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:bg-white/5"
                                >
                                    <span>Cancel</span>
                                </button>
                                <Button
                                    variant="admin-primary"
                                    type="submit"
                                    disabled={processing}
                                    loading={processing}
                                    className="gap-2"
                                >
                                    <span className="material-symbols-outlined text-base">add</span>
                                    <span>Add Ethnic Group</span>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    )
}