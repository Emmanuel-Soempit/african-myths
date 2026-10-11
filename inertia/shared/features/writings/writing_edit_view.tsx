import { useRef, useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import { toast } from 'react-hot-toast'
import Button from '~/shared/ui/button'
import Input from '~/shared/ui/input'
import Select from '~/shared/ui/select'
import TextArea from '~/shared/ui/textarea'
import { SimpleEditor } from '~/components/tiptap-templates/simple/simple-editor'
import { getCsrfToken } from '~/lib/tiptap-utils'
import useUtils from '~/shared/hooks/use_utils'
import { Writing, WritingType } from '~/types/writing'

const TYPE_OPTIONS: Array<{ value: WritingType; label: string; icon: string }> = [
    { value: 'poem', label: 'Poem', icon: 'edit_note' },
    { value: 'story', label: 'Story', icon: 'auto_stories' },
    { value: 'article', label: 'Article', icon: 'article' },
]

interface WritingEditViewProps {
    writing?: Writing | null
    type?: WritingType
    readOnly?: boolean
    mode?: 'author' | 'admin-review'
}

export default function WritingEditView({ writing, type, readOnly = false, mode = 'author' }: WritingEditViewProps) {
    const { props } = usePage()
    const { loadCultureOptions } = useUtils()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const isEdit = !!writing
    const isReview = mode === 'admin-review'
    const disabled = readOnly || isReview

    const [writingType, setWritingType] = useState<WritingType>(writing?.type ?? type ?? 'story')
    const [cultureId, setCultureId] = useState(writing?.cultureId ?? '')
    const [content, setContent] = useState(writing?.content ?? '')
    const [excerpt, setExcerpt] = useState(writing?.excerpt ?? '')
    const [thumbnail, setThumbnail] = useState(writing?.thumbnail ?? '')
    const [isUploading, setIsUploading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [processing, setProcessing] = useState(false)

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('image', file)
            formData.append('folder', 'writings')

            const token = getCsrfToken()
            const headers: Record<string, string> = {}
            if (token) {
                if (token.startsWith('e:') || token.startsWith('e%3A')) {
                    headers['x-xsrf-token'] = token
                } else {
                    headers['x-csrf-token'] = token
                }
            }

            const response = await fetch('/api/v1/upload', {
                method: 'POST',
                headers,
                body: formData,
            })

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(errData.error || `Upload failed with status ${response.status}`)
            }

            const data = await response.json()
            if (data.url) {
                setThumbnail(data.url)
                toast.success('Thumbnail uploaded')
            } else {
                throw new Error('Upload succeeded but no URL was returned.')
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to upload thumbnail')
        } finally {
            setIsUploading(false)
        }
    }

    const save = (intent: 'draft' | 'submit') => {
        const payload = {
            type: writingType,
            title: (document.getElementById('title') as HTMLInputElement | null)?.value ?? '',
            cultureId,
            excerpt,
            content,
            thumbnail,
            intent,
        }

        setProcessing(true)
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(intent === 'submit' ? 'Submitted for review!' : 'Draft saved!')
            },
            onError: (errs: any) => {
                setErrors(errs || {})
                const first = errs && typeof errs === 'object' ? Object.values(errs)[0] : null
                toast.error(typeof first === 'string' ? first : 'Failed to save. Please check the fields.')
            },
            onFinish: () => setProcessing(false),
        }

        if (isEdit) {
            router.put(`/api/v1/author/writings/${writing.id}`, payload, options)
        } else {
            router.post('/api/v1/author/writings', payload, options)
        }
    }

    const withdraw = () => {
        router.post(`/api/v1/author/writings/${writing!.id}/withdraw`, {}, {
            preserveScroll: true,
            onError: () => toast.error('Failed to withdraw writing'),
        })
    }

    const statusBadge = writing && (
        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset capitalize ${{
            published: 'bg-green-100 text-green-800 ring-green-200 dark:bg-green-950/30 dark:text-green-300',
            pending: 'bg-yellow-100 text-yellow-800 ring-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-300',
            rejected: 'bg-red-100 text-red-800 ring-red-200 dark:bg-red-950/30 dark:text-red-300',
            draft: 'bg-gray-100 text-gray-800 ring-gray-200 dark:bg-gray-800 dark:text-gray-300',
        }[writing.status]}`}>
            {writing.status === 'pending' ? 'In review' : writing.status}
        </span>
    )

    return (
        <div className="flex min-h-screen w-full flex-col bg-[var(--color-admin-background-light)] dark:bg-[var(--color-admin-background-dark)]">
            {/* Top Sticky Header */}
            <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)] bg-[var(--color-admin-background-light)]/85 dark:bg-[var(--color-admin-background-dark)]/85 px-10 py-4 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                {isReview ? 'Review Writing' : isEdit ? 'Edit Writing' : 'New Writing'}
                            </h1>
                            {statusBadge}
                        </div>
                        <p className="text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                            {disabled
                                ? 'This writing is read-only.'
                                : 'Compose your piece, attach it to a culture, then save or submit it.'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => router.visit(isReview ? '/admin/writings' : '/author/writings')}
                        className="rounded-lg border border-[var(--color-admin-border-light)] bg-transparent px-5 py-2.5 text-sm font-semibold text-[var(--color-admin-text-primary-light)] transition-colors hover:bg-[var(--color-admin-surface-light)] dark:border-[var(--color-admin-border-dark)] dark:text-[var(--color-admin-text-primary-dark)] dark:hover:bg-[var(--color-admin-surface-dark)]"
                    >
                        {disabled ? 'Back' : 'Cancel'}
                    </button>
                    {!disabled && (
                        <>
                            <Button
                                variant="admin-primary"
                                type="button"
                                disabled={processing}
                                loading={processing}
                                onClick={() => save('draft')}
                                className="h-auto px-5 py-2.5 text-sm font-semibold shadow-md"
                            >
                                <span className="material-symbols-outlined text-base mr-1">save</span>
                                Save draft
                            </Button>
                            <Button
                                variant="admin-primary"
                                type="button"
                                disabled={processing}
                                loading={processing}
                                onClick={() => save('submit')}
                                className="h-auto px-5 py-2.5 text-sm font-semibold shadow-md"
                            >
                                <span className="material-symbols-outlined text-base mr-1">send</span>
                                Submit for review
                            </Button>
                        </>
                    )}
                    {writing?.status === 'pending' && !isReview && (
                        <Button
                            variant="admin-primary"
                            type="button"
                            onClick={withdraw}
                            className="h-auto px-5 py-2.5 text-sm font-semibold shadow-md"
                        >
                            <span className="material-symbols-outlined text-base mr-1">undo</span>
                            Withdraw
                        </Button>
                    )}
                    {writing?.status === 'published' && !isReview && (
                        <a
                            href={`/writings/${writing.id}`}
                            className="rounded-lg border border-[var(--color-admin-border-light)] px-5 py-2.5 text-sm font-semibold text-[var(--color-admin-text-primary-light)] transition-colors hover:bg-[var(--color-admin-surface-light)] dark:border-[var(--color-admin-border-dark)] dark:text-[var(--color-admin-text-primary-dark)] dark:hover:bg-[var(--color-admin-surface-dark)]"
                        >
                            View public page
                        </a>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8 p-6 px-10 lg:grid-cols-3 lg:p-8">
                {/* Editor & Content Column */}
                <div className="space-y-8 lg:col-span-2">
                    {writing?.status === 'rejected' && writing.reviewNote && (
                        <div className="rounded-xl border border-red-200 bg-red-50/60 p-5 dark:border-red-900/50 dark:bg-red-950/20">
                            <p className="text-sm font-bold text-red-800 dark:text-red-300">
                                Rejected by reviewer
                            </p>
                            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                {writing.reviewNote}
                            </p>
                        </div>
                    )}

                    <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 shadow-sm dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] space-y-6">
                        {/* Type segmented control */}
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                Type
                            </p>
                            <div className="flex gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
                                {TYPE_OPTIONS.map((t) => (
                                    <button
                                        key={t.value}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => setWritingType(t.value)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all disabled:opacity-60 ${writingType === t.value
                                            ? 'bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-white'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-sm">{t.icon}</span>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Input
                            label="Title"
                            id="title"
                            name="title"
                            placeholder="e.g., The Drums of Oyo"
                            type="text"
                            variant="admin-primary"
                            errors={errors}
                            setError={(name, error) => setErrors((e) => ({ ...e, [name]: error }))}
                            defaultValue={writing?.title}
                            disabled={disabled}
                            required
                        />

                        <TextArea
                            label="Excerpt (optional)"
                            id="excerpt"
                            name="excerpt"
                            placeholder="A short summary shown in listings..."
                            variant="admin-primary"
                            errors={errors}
                            setError={(name, error) => setErrors((e) => ({ ...e, [name]: error }))}
                            rows={3}
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            disabled={disabled}
                        />

                        {/* Thumbnail */}
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                Thumbnail Image
                            </p>
                            {!disabled && (
                                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[var(--color-admin-primary)] dark:hover:border-[var(--color-admin-primary)] transition-all rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 dark:bg-gray-900/20 group">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleThumbnailUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <span className="material-symbols-outlined text-4xl text-gray-400 group-hover:text-[var(--color-admin-primary)] transition-colors">
                                        cloud_upload
                                    </span>
                                    <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {isUploading ? 'Uploading...' : 'Click or drag file to upload'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        PNG, JPG, JPEG, WEBP or GIF (Max 5MB)
                                    </p>
                                </div>
                            )}
                            {thumbnail && (
                                <div className="relative w-full max-w-[240px] aspect-[4/3] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                                    <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                    {!disabled && (
                                        <button
                                            type="button"
                                            onClick={() => setThumbnail('')}
                                            className="absolute top-1 right-1 size-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                Content
                            </p>
                            {disabled ? (
                                <div
                                    className="prose dark:prose-invert max-w-none rounded-lg border border-[var(--color-admin-border-light)] p-6 text-[var(--color-admin-text-primary-light)] dark:border-[var(--color-admin-border-dark)] dark:text-[var(--color-admin-text-primary-dark)]"
                                    dangerouslySetInnerHTML={{ __html: content || '<p><em>No content.</em></p>' }}
                                />
                            ) : (
                                <div className="border border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)] rounded-lg overflow-hidden flex flex-col bg-transparent">
                                    <SimpleEditor content={content} onChange={setContent} />
                                </div>
                            )}
                            {errors.content && (
                                <p className="text-red-400 text-sm mt-1">{errors.content}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Metadata & Relationship Column */}
                <div className="space-y-8 lg:col-span-1">
                    <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 shadow-sm dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] space-y-6">
                        <h3 className="text-lg font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)] border-b border-[var(--color-admin-border-light)]/50 pb-3 dark:border-[var(--color-admin-border-dark)]/50">
                            Details
                        </h3>

                        <div className="space-y-2">
                            <Select
                                label="Culture"
                                id="cultureId"
                                name="cultureId"
                                variant="admin-primary"
                                placeholder="Start typing to search..."
                                errors={errors}
                                setError={(name, error) => setErrors((e) => ({ ...e, [name]: error }))}
                                isAsync={true}
                                loadOptions={loadCultureOptions}
                                defaultValue={writing?.cultureId}
                                loadDefaultOption={async () =>
                                    writing?.culture
                                        ? [{ value: writing.culture.id, label: writing.culture.name }]
                                        : []
                                }
                                disabled={disabled}
                                onChange={(e) => setCultureId(e.target.value)}
                            />
                            <p className="text-xs text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                Only published cultures are listed.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-[var(--color-admin-border-light)]/50 dark:border-[var(--color-admin-border-dark)]/50 text-xs text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)] space-y-2">
                            <div className="flex justify-between">
                                <span>Reading Time:</span>
                                <span className="font-semibold italic">
                                    {writing?.minutesToRead ? `${writing.minutesToRead} min` : 'Auto-calculated'}
                                </span>
                            </div>
                            {writing?.publishedAt && (
                                <div className="flex justify-between">
                                    <span>Published:</span>
                                    <span className="font-semibold">
                                        {new Date(writing.publishedAt).toLocaleDateString('en-GB')}
                                    </span>
                                </div>
                            )}
                            {(props as any).flash?.error && (
                                <p className="text-red-400">{(props as any).flash.error}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
