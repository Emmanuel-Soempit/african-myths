import AdminDashboardLayout from '~/admin/layout/admin-dashboard'
import WritingEditView from '~/shared/features/writings/writing_edit_view'
import { ReactNode, useState } from 'react'
import { router } from '@inertiajs/react'
import toast from 'react-hot-toast'
import { Writing } from '~/types/writing'

interface AdminWritingReviewProps {
    writing: Writing
}

export default function AdminWritingReview({ writing }: AdminWritingReviewProps) {
    const [note, setNote] = useState('')
    const [processing, setProcessing] = useState(false)

    const review = (decision: 'approve' | 'reject') => {
        if (decision === 'reject' && !note.trim()) {
            toast.error('A note is required when rejecting')
            return
        }
        setProcessing(true)
        router.put(
            `/api/v1/admin/writings/${writing.id}/review`,
            { decision, note: note.trim() || undefined },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(decision === 'approve' ? 'Writing published' : 'Writing rejected')
                },
                onError: (errors: any) => {
                    const first = errors && typeof errors === 'object' ? Object.values(errors)[0] : null
                    toast.error(typeof first === 'string' ? first : 'Review failed')
                },
                onFinish: () => setProcessing(false),
            }
        )
    }

    const reviewerName = (writing as any).reviewer?.profile
        ? `${(writing as any).reviewer.profile.firstName ?? ''} ${(writing as any).reviewer.profile.lastName ?? ''}`.trim()
        : null

    return (
        <div className="relative">
            <WritingEditView writing={writing} mode="admin-review" readOnly />

            {/* Review panel */}
            <div className="mx-10 mb-10 lg:mx-8">
                {writing.status === 'pending' ? (
                    <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 shadow-sm dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] space-y-4">
                        <h3 className="text-lg font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            Review decision
                        </h3>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            placeholder="Note for the author (required when rejecting)"
                            className="w-full rounded-lg border border-[var(--color-admin-border-light)] bg-transparent px-3 py-2 text-sm text-[var(--color-admin-text-primary-light)] placeholder:text-[var(--color-admin-text-secondary-light)] focus:border-[var(--color-admin-primary)] focus:outline-none dark:border-[var(--color-admin-border-dark)] dark:text-[var(--color-admin-text-primary-dark)]"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => review('approve')}
                                disabled={processing}
                                className="flex h-10 items-center gap-2 rounded-lg bg-green-600 px-5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                            >
                                <span className="material-symbols-outlined text-base">check_circle</span>
                                Approve & publish
                            </button>
                            <button
                                onClick={() => review('reject')}
                                disabled={processing}
                                className="flex h-10 items-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                            >
                                <span className="material-symbols-outlined text-base">cancel</span>
                                Reject
                            </button>
                        </div>
                    </div>
                ) : (
                    (writing.reviewNote || reviewerName) && (
                        <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 shadow-sm dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                            <h3 className="text-lg font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                Previous review
                            </h3>
                            {reviewerName && (
                                <p className="mt-1 text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                    Reviewed by {reviewerName}
                                </p>
                            )}
                            {writing.reviewNote && (
                                <p className="mt-2 text-sm text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                    {writing.reviewNote}
                                </p>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

AdminWritingReview.layout = (page: ReactNode) => {
    return (
        <AdminDashboardLayout title="Review Writing" hideHeader>
            {page}
        </AdminDashboardLayout>
    )
}
