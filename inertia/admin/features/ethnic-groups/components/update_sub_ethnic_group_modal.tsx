import { useEffect, useState } from 'react'
import { Form } from '@inertiajs/react'
import SubEthnicGroup from '#models/sub_ethnic_group'
import Button from '~/shared/ui/button'
import Input from '~/shared/ui/input'
import Select from '~/shared/ui/select'
import TextArea from '~/shared/ui/textarea'
import toast from 'react-hot-toast'
import useUtils from '~/shared/hooks/use_utils'
import useDashboardContext from '~/shared/hooks/use_dashboard_context'

interface CountryItem {
    id: string
    countryId: string
    populationEstimate: string
    isPrimaryHome: boolean
    source: string
}

interface UpdateSubEthnicGroupModalProps {
    isOpen: boolean
    onClose: () => void
    subGroup: SubEthnicGroup | null
}

export default function UpdateSubEthnicGroupModal({
    isOpen,
    onClose,
    subGroup,
}: UpdateSubEthnicGroupModalProps) {
    const { apiBase } = useDashboardContext()
    const { loadCountryOptions, loadDefaultCountryOption } = useUtils()

    const [countries, setCountries] = useState<CountryItem[]>([])

    useEffect(() => {
        if (!subGroup) return

        const initialCountries = ((subGroup as any).subEthnicGroupCountries || []).map((c: any, i: number) => ({
            id: c.id || i.toString(),
            countryId: c.countryId,
            populationEstimate: c.populationEstimate || '',
            isPrimaryHome: !!c.isPrimaryHome,
            source: c.source || '',
        }))

        setCountries(initialCountries.length > 0 ? initialCountries : [{ id: '1', countryId: '', populationEstimate: '', isPrimaryHome: false, source: '' }])
    }, [subGroup])

    const addCountry = () => {
        const newCountry = {
            id: Date.now().toString(),
            countryId: '',
            populationEstimate: '',
            isPrimaryHome: false,
            source: '',
        }
        setCountries([...countries, newCountry])
    }

    const removeCountry = (id: string) => {
        setCountries(countries.filter((country) => country.id !== id))
    }

    const updateCountry = (id: string, field: string, value: any) => {
        setCountries(countries.map((country) => (country.id === id ? { ...country, [field]: value } : country)))
    }

    if (!isOpen || !subGroup) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-xl h-[90%] border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 shadow-2xl dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-display text-2xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            Update Sub-Ethnic Group
                        </h2>
                        <p className="text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                            Update the details for this sub-ethnic group.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:text-[var(--color-admin-text-primary-dark)]"
                        type="button"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <Form
                    action={`${apiBase}/sub-ethnic-groups/${subGroup.id}`}
                    method="PUT"
                    onSuccess={() => {
                        toast.success('Sub-ethnic group updated')
                        onClose()
                    }}
                    className="mt-6 flex flex-col gap-5 overflow-y-auto max-h-[80%] px-5"
                >
                    {({ errors, setError, processing }) => (
                        <>
                            <div>
                                <Input
                                    label="Name"
                                    id="name"
                                    name="name"
                                    placeholder="e.g., Oyo"
                                    type="text"
                                    defaultValue={subGroup.canonicalName}
                                    variant="admin-primary"
                                    errors={errors}
                                    setError={setError}
                                />
                            </div>

                            <div>
                                <TextArea
                                    label="Description"
                                    id="description"
                                    name="description"
                                    placeholder="A brief description of the sub-ethnic group..."
                                    defaultValue={subGroup.note}
                                    variant="admin-primary"
                                    errors={errors}
                                    setError={setError}
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label
                                    className="mb-2 block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]"
                                    htmlFor="countries"
                                >
                                    Countries
                                </label>

                                <div className="space-y-3">
                                    {countries.map((country, index) => (
                                        <div
                                            key={country.id}
                                            className="space-y-3 border-b-[0.5px] pb-3 border-[var(--color-admin-border-light)]"
                                        >
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <Select
                                                        name={`countries[${index}][countryId]`}
                                                        variant="admin-primary"
                                                        errors={errors}
                                                        setError={setError}
                                                        isAsync={true}
                                                        placeholder="Start typing to search..."
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
                                            </div>

                                            <div className="flex gap-2 items-start">
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
                                                        <label className="text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                                            Primary Country
                                                        </label>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeCountry(country.id)}
                                                        className="mt-2 text-[var(--color-admin-text-secondary-light)] hover:text-red-500 dark:text-[var(--color-admin-text-secondary-dark)]"
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

                            {errors.error && <p className="text-sm text-red-400">{errors.error}</p>}

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
                                    <span className="material-symbols-outlined text-base">save</span>
                                    <span>Update Sub-Ethnic Group</span>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    )
}
