import { useEffect, useState } from 'react'
import Button from '~/shared/ui/button'
import Input from '~/shared/ui/input'
import Select from '~/shared/ui/select'
import { Form } from '@inertiajs/react'
import { toast } from 'react-hot-toast'
import { SelectorOption } from '~/types'
import useUtils from '~/shared/hooks/use_utils'

interface AddCultureModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function AddCultureModal({ isOpen, onClose }: AddCultureModalProps) {
    const [ethnicGroupList, setEthnicGroupList] = useState<SelectorOption[]>([])
    const { loadEthnicGroupOptions } = useUtils()

    useEffect(() => {
        if (!isOpen) return
        loadEthnicGroupOptions('').then(setEthnicGroupList)
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 shadow-2xl dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-display text-2xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            Add New Culture
                        </h2>
                        <p className="text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                            Enter the details for the new culture entry.
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
                        toast.success('Culture added successfully!')
                        onClose()
                    }}
                    onError={(errors: any) => {
                        if (errors.error) {
                            toast.error(errors.error)
                        } else {
                            toast.error('Failed to add culture')
                        }
                    }}
                    action="/api/v1/admin/cultures"
                    className="mt-6 space-y-5"
                    method="POST"
                >
                    {({ errors, setError, processing }) => (
                        <>
                            <Input
                                label="Culture Name"
                                id="name"
                                name="name"
                                placeholder="e.g., Yoruba"
                                type="text"
                                variant="admin-primary"
                                errors={errors}
                                setError={setError}
                            />

                            <Select
                                label="Ethnic Group"
                                id="ethnicGroupId"
                                name="ethnicGroupId"
                                variant="admin-primary"
                                placeholder="Start typing to search..."
                                errors={errors}

                                setError={setError}
                                isAsync={true}
                                loadOptions={loadEthnicGroupOptions}
                                options={ethnicGroupList}
                            />

                            {errors.error && (
                                <p className="text-sm text-red-400">{errors.error}</p>
                            )}

                            <div className="flex items-center justify-end gap-3 border-t border-[var(--color-admin-border-light)]/50 pt-4 dark:border-[var(--color-admin-border-dark)]/50">
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
                                    <span>Add Culture</span>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    )
}
