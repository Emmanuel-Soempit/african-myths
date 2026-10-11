import { useEffect } from 'react'

interface ConfirmDeleteModalProps {
    isOpen: boolean
    name: string
    onYes: () => void
    onNo: () => void
    title?: string
    description?: string
    yesLabel?: string
    noLabel?: string
    loading?: boolean
}

export default function ConfirmDeleteModal({
    isOpen,
    name,
    onYes,
    onNo,
    title,
    description,
    yesLabel = 'Yes, delete',
    noLabel = 'No, cancel',
    loading = false,
}: ConfirmDeleteModalProps) {
    useEffect(() => {
        if (!isOpen) return

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onNo()
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [isOpen, onNo])

    if (!isOpen) return null

    const safeTitle = title || 'Delete confirmation'
    const safeDescription = description || `Are you sure you want to delete “${name}”? This action cannot be undone.`

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl ring-1 ring-black/10 dark:bg-zinc-900 dark:ring-white/10"
                role="dialog"
                aria-modal="true"
                aria-label={safeTitle}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                            {safeTitle}
                        </h2>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                            {safeDescription}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onNo}
                        className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-200"
                        aria-label="Close"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="mt-5 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onNo}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-white/10 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/10"
                        disabled={loading}
                    >
                        {noLabel}
                    </button>

                    <button
                        type="button"
                        onClick={onYes}
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        disabled={loading}
                    >
                        {yesLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
