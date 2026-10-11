import SubEthnicGroup from '#models/sub_ethnic_group'

interface ViewSubEthnicGroupModalProps {
    isOpen: boolean
    onClose: () => void
    subGroup: SubEthnicGroup | null
}

export default function ViewSubEthnicGroupModal({
    isOpen,
    onClose,
    subGroup,
}: ViewSubEthnicGroupModalProps) {
    if (!isOpen || !subGroup) return null

    const countries = (subGroup as any).subEthnicGroupCountries || []

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-xl h-[90%] border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 shadow-2xl dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-display text-2xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            View Sub-Ethnic Group
                        </h2>
                        <p className="text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                            Viewing details for the {subGroup.canonicalName} sub-ethnic group.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:text-[var(--color-admin-text-primary-dark)]"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="mt-6 flex flex-col gap-5 overflow-y-auto max-h-[80%] px-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            Name
                        </label>
                        <div className="h-11 flex items-center rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-background-light)] px-4 text-[var(--color-admin-text-primary-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-background-dark)] dark:text-[var(--color-admin-text-primary-dark)]">
                            {subGroup.canonicalName}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            Description
                        </label>
                        <div className="min-h-[88px] whitespace-pre-wrap rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-background-light)] px-4 py-2 text-[var(--color-admin-text-primary-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-background-dark)] dark:text-[var(--color-admin-text-primary-dark)]">
                            {subGroup.note || ''}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            Countries
                        </label>

                        {countries.length === 0 ? (
                            <div className="rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-background-light)] px-4 py-3 text-sm text-[var(--color-admin-text-secondary-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-background-dark)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                No countries added.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {countries.map((country: any) => (
                                    <div
                                        key={country.id}
                                        className="space-y-3 border-b-[0.5px] pb-3 border-[var(--color-admin-border-light)]"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-1">
                                                <label className="mb-2 block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                                    Country
                                                </label>
                                                <div className="h-11 flex items-center rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-background-light)] px-4 text-[var(--color-admin-text-primary-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-background-dark)] dark:text-[var(--color-admin-text-primary-dark)]">
                                                    {country.country?.name || country.countryId}
                                                </div>
                                            </div>
                                            <div className="col-span-1">
                                                <label className="mb-2 block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                                    Population Estimate
                                                </label>
                                                <div className="h-11 flex items-center rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-background-light)] px-4 text-[var(--color-admin-text-primary-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-background-dark)] dark:text-[var(--color-admin-text-primary-dark)]">
                                                    {country.populationEstimate || ''}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label className="mb-2 block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                                    Source
                                                </label>
                                                <div className="h-11 flex items-center rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-background-light)] px-4 text-[var(--color-admin-text-primary-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-background-dark)] dark:text-[var(--color-admin-text-primary-dark)]">
                                                    {country.source || ''}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="mb-2 block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                                    Primary Country
                                                </label>
                                                <div className="h-11 flex items-center rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-background-light)] px-4 text-[var(--color-admin-text-primary-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-background-dark)] dark:text-[var(--color-admin-text-primary-dark)]">
                                                    {country.isPrimaryHome ? 'Yes' : 'No'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-admin-border-light)]/50 dark:border-[var(--color-admin-border-dark)]/50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--color-admin-border-light)] bg-transparent px-4 text-sm font-bold text-[var(--color-admin-text-secondary-light)] hover:bg-gray-100 dark:border-[var(--color-admin-border-dark)] dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:bg-white/5"
                        >
                            <span>Close</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
