import { useState } from 'react'
import { Form, router } from '@inertiajs/react'
import { toast } from 'react-hot-toast'
import Button from '~/shared/ui/button'
import Input from '~/shared/ui/input'
import Select from '~/shared/ui/select'
import EditorSection from '~/shared/ui/editor-section'

interface MythCreateViewProps {
    subEthnicGroups: Array<{ value: string; label: string }>
    cultureId: string
    myth?: any
}

export default function MythCreateView({ subEthnicGroups, cultureId, myth }: MythCreateViewProps) {
    const [content, setContent] = useState(myth?.content || '')
    const [status, setStatus] = useState(myth?.status || 'draft')
    const [subEthinicGroupId, setSubEthinicGroupId] = useState(myth?.subEthnicGroupId || '')
    const [thumbnailMode, setThumbnailMode] = useState<'upload' | 'url'>(myth?.thumbnail?.startsWith('http') ? 'url' : 'upload')
    const [previewUrl, setPreviewUrl] = useState<string | null>(myth?.thumbnail || null)
    const [fileName, setFileName] = useState<string>('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setFileName('')
            setPreviewUrl(null)
        }
    }

    const handleContentSave = (newContent: string) => {
        setContent(newContent)
        toast.success('Content editor draft saved successfully!', {
            icon: '✍️',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        })
    }

    const statusOptions = [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'pending', label: 'Pending Review' },
        { value: 'rejected', label: 'Rejected' },
    ]

    const isEdit = !!myth
    const action = isEdit ? `/api/v1/admin/myths/${myth.id}` : '/api/v1/admin/myths'
    const method = isEdit ? 'PUT' : 'POST'

    return (
        <div className="flex min-h-screen w-full flex-col bg-[var(--color-admin-background-light)] dark:bg-[var(--color-admin-background-dark)]">
            <Form
                showProgress
                disableWhileProcessing
                onSuccess={() => {
                    toast.success(isEdit ? 'Myth updated successfully!' : 'Myth created successfully!')
                    router.visit(`/admin/cultures/${cultureId}/myths`)
                }}
                onError={(errors: any) => {
                    if (errors.error) {
                        toast.error(errors.error)
                    } else {
                        toast.error(isEdit ? 'Failed to update myth. Please check all fields.' : 'Failed to create myth. Please check all fields.')
                    }
                }}
                action={action}
                method={method}
            >
                {({ errors, setError, processing }) => (
                    <>
                        {/* Hidden inputs to capture custom state */}
                        <input type="hidden" name="content" value={content} />
                        <input type="hidden" name="status" value={status} />
                        <input type="hidden" name="cultureId" value={cultureId} />
                        <input type="hidden" name="subEthnicGroupId" value={subEthinicGroupId} />

                        {/* Top Sticky Header */}
                        <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)] bg-[var(--color-admin-background-light)]/85 dark:bg-[var(--color-admin-background-dark)]/85 px-10 py-4 backdrop-blur-md">
                            <div className="flex flex-col gap-1">
                                <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                    {isEdit ? 'Edit Myth' : 'Create New Myth'}
                                </h1>
                                <p className="text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                    {isEdit ? 'Update details and edit rich-text content for the myth.' : 'Enter details and compose rich-text content for the new myth.'}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.visit(`/admin/cultures/${cultureId}/myths`)}
                                    className="rounded-lg border border-[var(--color-admin-border-light)] bg-transparent px-5 py-2.5 text-sm font-semibold text-[var(--color-admin-text-primary-light)] transition-colors hover:bg-[var(--color-admin-surface-light)] dark:border-[var(--color-admin-border-dark)] dark:text-[var(--color-admin-text-primary-dark)] dark:hover:bg-[var(--color-admin-surface-dark)]"
                                >
                                    Cancel
                                </button>
                                <Button
                                    variant="admin-primary"
                                    type="submit"
                                    disabled={processing}
                                    loading={processing}
                                    className="h-auto px-5 py-2.5 text-sm font-semibold shadow-md"
                                >
                                    <span className="material-symbols-outlined text-base mr-1">
                                        {isEdit ? 'save' : 'add_circle'}
                                    </span>
                                    {isEdit ? 'Save Changes' : 'Create Myth'}
                                </Button>
                            </div>
                        </header>

                        {/* Two Column Layout Grid */}
                        <div className="grid grid-cols-1 gap-8 p-6 px-10 lg:grid-cols-3 lg:p-8">
                            {/* Editor & Content Column */}
                            <div className="space-y-8 lg:col-span-2">
                                <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 shadow-sm dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] space-y-6">
                                    <Input
                                        label="Myth Title / Name"
                                        id="name"
                                        name="name"
                                        placeholder="e.g., How Anansi Became the Keeper of Stories"
                                        type="text"
                                        variant="admin-primary"
                                        errors={errors}
                                        setError={setError}
                                        required
                                        defaultValue={myth?.name}
                                    />

                                    {/* Switchable Thumbnail Field */}
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <p className="text-sm font-semibold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                                Thumbnail Image
                                            </p>
                                            <div className="flex gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
                                                <button
                                                    type="button"
                                                    onClick={() => setThumbnailMode('upload')}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${thumbnailMode === 'upload'
                                                        ? 'bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-white'
                                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                                        }`}
                                                >
                                                    Upload File
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setThumbnailMode('url')}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${thumbnailMode === 'url'
                                                        ? 'bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-white'
                                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                                        }`}
                                                >
                                                    Image URL
                                                </button>
                                            </div>
                                        </div>

                                        {thumbnailMode === 'upload' ? (
                                            <div className="space-y-3">
                                                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[var(--color-admin-primary)] dark:hover:border-[var(--color-admin-primary)] transition-all rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 dark:bg-gray-900/20 group">
                                                    <input
                                                        type="file"
                                                        id="thumbnailFile"
                                                        name="thumbnailFile"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    <span className="material-symbols-outlined text-4xl text-gray-400 group-hover:text-[var(--color-admin-primary)] transition-colors">
                                                        cloud_upload
                                                    </span>
                                                    <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        {fileName || 'Click or drag file to upload'}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        PNG, JPG, JPEG, WEBP or GIF (Max 5MB)
                                                    </p>
                                                </div>

                                                {previewUrl && (
                                                    <div className="relative w-full max-w-[200px] aspect-[4/3] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                                                        <img
                                                            src={previewUrl}
                                                            alt="Upload preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setPreviewUrl(null)
                                                                setFileName('')
                                                                const input = document.getElementById('thumbnailFile') as HTMLInputElement
                                                                if (input) input.value = ''
                                                            }}
                                                            className="absolute top-1 right-1 size-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">close</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <Input
                                                label="Thumbnail Image URL"
                                                id="thumbnail"
                                                name="thumbnail"
                                                placeholder="https://example.com/image.jpg"
                                                type="url"
                                                variant="admin-primary"
                                                errors={errors}
                                                setError={setError}
                                                defaultValue={myth?.thumbnail}
                                            />
                                        )}
                                    </div>

                                    <Input
                                        label="Source / Origin / Reference"
                                        id="source"
                                        name="source"
                                        placeholder="e.g., Akan Folktale Oral Tradition"
                                        type="text"
                                        variant="admin-primary"
                                        errors={errors}
                                        setError={setError}
                                        defaultValue={myth?.source}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <EditorSection
                                        title="Myth Narrative & Content"
                                        content={content}
                                        onSave={handleContentSave}
                                        variant="admin"
                                    />
                                    {errors.content && (
                                        <p className="text-red-400 text-sm mt-1">{errors.content}</p>
                                    )}
                                </div>
                            </div>

                            {/* Metadata & Relationship Column */}
                            <div className="space-y-8 lg:col-span-1">
                                <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 shadow-sm dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] space-y-6">
                                    <h3 className="text-lg font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)] border-b border-[var(--color-admin-border-light)]/50 pb-3 dark:border-[var(--color-admin-border-dark)]/50">
                                        Metadata Settings
                                    </h3>

                                    <div className="space-y-2">
                                        <Select
                                            label="Associated Sub Ethinic Group"
                                            id="subEthinicGroupSelect"
                                            name="subEthinicGroupSelect"
                                            variant="admin-primary"
                                            placeholder="Choose a sub ethnic gropu.."
                                            errors={errors}
                                            setError={setError}
                                            options={subEthnicGroups}
                                            value={subEthinicGroupId}
                                            onChange={(e) => {
                                                setSubEthinicGroupId(e.target.value)
                                            }}
                                        />
                                        {errors.cultureId && (
                                            <p className="text-red-400 text-xs mt-1">{errors.cultureId}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Select
                                            label="Publication Status"
                                            id="statusSelect"
                                            name="statusSelect"
                                            variant="admin-primary"
                                            placeholder="Select status..."
                                            errors={errors}
                                            setError={setError}
                                            options={statusOptions}
                                            value={status}
                                            onChange={(e) => {
                                                setStatus(e.target.value)
                                            }}
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-[var(--color-admin-border-light)]/50 dark:border-[var(--color-admin-border-dark)]/50 text-xs text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)] space-y-2">
                                        <div className="flex justify-between">
                                            <span>Author:</span>
                                            <span className="font-semibold">Logged-in Administrator</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Reading Time:</span>
                                            <span className="font-semibold italic">Auto-calculated based on content</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Form>
        </div>
    )
}
