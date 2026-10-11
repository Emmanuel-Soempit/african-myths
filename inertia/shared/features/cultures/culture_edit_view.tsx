import { useState, useEffect, useRef } from 'react'
import MythsSection from './components/myths_section'
import CultureEditHeader from './components/culture_edit_header'
import { SimpleEditor } from '~/components/tiptap-templates/simple/simple-editor'
import Button from '~/shared/ui/button'
import { getCsrfToken } from '~/lib/tiptap-utils'
import { router } from '@inertiajs/react'
import { toast } from 'react-hot-toast'
import Culture from '#models/culture'
import useDashboardContext from '~/shared/hooks/use_dashboard_context'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function patchCulture(apiBase: string, id: string, payload: Record<string, string>) {
    return new Promise<void>((resolve, reject) => {
        router.put(
            `${apiBase}/cultures/${id}`,
            payload,
            {
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: (errors) => reject(new Error(JSON.stringify(errors))),
            }
        )
    })
}

// ─── EditableSectionCard ─────────────────────────────────────────────────────

interface EditableSectionCardProps {
    id: string
    title: string
    content: string
    onSave: (content: string) => Promise<void> | void
}

function EditableSectionCard({ id, title, content, onSave }: EditableSectionCardProps) {
    const [data, setData] = useState(content)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setData(content)
    }, [content])

    const handleSave = async () => {
        setSaving(true)
        try {
            await onSave(data)
            toast.success('Saved!')
        } catch {
            toast.error('Failed to save')
        } finally {
            setSaving(false)
        }
    }

    return (
        <section className="mb-12 scroll-mt-24" id={id}>
            <h2 className="text-stone-900 dark:text-white text-3xl font-bold font-display leading-tight tracking-[-0.015em] pb-4 border-b border-stone-200 dark:border-stone-800 mb-6">
                {title}
            </h2>
            <div className="culture-inline-editor border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden flex flex-col mb-4 bg-white dark:bg-stone-900">
                <SimpleEditor content={data} onChange={setData} />
            </div>
            <div className="flex justify-end">
                <Button
                    variant="admin-primary"
                    onClick={handleSave}
                    loading={saving}
                    disabled={saving}
                    style={{ width: 'auto', minWidth: '120px' }}
                >
                    Save
                </Button>
            </div>
        </section>
    )
}

// ─── EditableHero ─────────────────────────────────────────────────────────────

interface EditableHeroProps {
    title: string
    summary: string
    imageUrl: string
    onImageUpload: (newUrl: string) => void
}

function EditableHero({ title, summary, imageUrl, onImageUpload }: EditableHeroProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleUploadClick = () => {
        if (isUploading) return
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('image', file)
            formData.append('folder', 'cultures')

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
                onImageUpload(data.url)
            } else {
                throw new Error('Upload succeeded but no URL was returned.')
            }
        } catch (error) {
            console.error('Error uploading cover image:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to upload cover image')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="@container mb-12">
            <div
                className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 rounded-xl items-center justify-center p-4 relative"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(17, 33, 17, 0.8) 100%), url("${imageUrl}")`
                }}
            >
                <div className="flex flex-col gap-4 text-center max-w-2xl z-10">
                    <h1 className="text-white text-4xl font-black font-display leading-tight tracking-[-0.033em] @[480px]:text-6xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                        {title}
                    </h1>
                    <h2 className="text-stone-200 text-base font-normal leading-relaxed @[480px]:text-lg @[480px]:font-normal @[480px]:leading-relaxed">
                        {summary}
                    </h2>
                </div>

                <div className="z-10">
                    <Button
                        variant="admin-primary"
                        onClick={handleUploadClick}
                        loading={isUploading}
                        disabled={isUploading}
                        style={{ width: 'auto', minWidth: '220px' }}
                        className="gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined !text-xl">upload</span>
                        <span className="truncate">Upload Cover Picture</span>
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
            </div>
        </div>
    )
}

// ─── CultureEditView ─────────────────────────────────────────────────────────

interface CultureEditViewProps {
    culture: Culture
}

export default function CultureEditView({ culture }: CultureEditViewProps) {
    const { apiBase } = useDashboardContext()
    const [activeSection, setActiveSection] = useState('history')

    // Local thumbnail state so the hero updates immediately on upload
    const [thumbnailUrl, setThumbnailUrl] = useState<string>(
        (culture as any).thumbnail ?? ''
    )

    useEffect(() => {
        const sections = ['history', 'language', 'myths']
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -55% 0px',
            threshold: 0,
        }

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id)
                }
            })
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions)

        sections.forEach(id => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        return () => {
            sections.forEach(id => {
                const el = document.getElementById(id)
                if (el) observer.unobserve(el)
            })
        }
    }, [])

    const handleSaveField = async (field: string, content: string) => {
        await patchCulture(apiBase, culture.id, { [field]: content })
    }

    const handleImageUpload = async (newUrl: string) => {
        setThumbnailUrl(newUrl)
        try {
            await patchCulture(apiBase, culture.id, { thumbnail: newUrl })
            toast.success('Cover image saved!')
        } catch {
            toast.error('Image uploaded but failed to save URL')
        }
    }

    const cultureName = (culture as any).name ?? ''
    const ethnicGroupName = (culture as any).ethnicGroup?.canonicalName ?? ''

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-clip bg-[var(--color-admin-background-light)] font-sans text-[var(--color-admin-text-primary-light)] dark:bg-[var(--color-admin-background-dark)] dark:text-[var(--color-admin-text-primary-dark)]">
            <CultureEditHeader />
            <div className="flex h-full grow flex-col">
                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-10 lg:flex-row">
                        {/* Sidebar */}
                        <aside className="top-24 w-full self-start lg:sticky lg:w-64">
                            <div className="flex h-full flex-col justify-between rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-4 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="aspect-square size-10 rounded-full bg-cover bg-center bg-no-repeat shrink-0"
                                            style={{
                                                backgroundImage: thumbnailUrl ? `url('${thumbnailUrl}')` : undefined,
                                                backgroundColor: thumbnailUrl ? undefined : 'var(--color-admin-border-light)',
                                            }}
                                        />
                                        <div className="flex flex-col">
                                            <h1 className="font-display text-base font-bold leading-normal text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                                {cultureName}
                                            </h1>
                                            <p className="text-sm font-normal leading-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                                {ethnicGroupName || 'Management View'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {(['history', 'language', 'myths'] as const).map((section) => {
                                            const meta: Record<string, { icon: string; label: string }> = {
                                                history: { icon: 'history_edu', label: 'History & Origins' },
                                                language: { icon: 'translate', label: 'Language' },
                                                myths: { icon: 'auto_stories', label: 'Myths' },
                                            }
                                            const { icon, label } = meta[section]
                                            const isActive = activeSection === section
                                            return (
                                                <a
                                                    key={section}
                                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive
                                                        ? 'bg-[var(--color-admin-primary)]/20 text-[var(--color-admin-primary)]'
                                                        : 'text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)] hover:bg-[var(--color-admin-border-light)]/50 dark:hover:bg-[var(--color-admin-border-dark)]/50'
                                                        }`}
                                                    href={`#${section}`}
                                                    onClick={() => setActiveSection(section)}
                                                >
                                                    <span className={`material-symbols-outlined !text-xl ${isActive ? 'text-[var(--color-admin-primary)]' : 'text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]'}`}>
                                                        {icon}
                                                    </span>
                                                    <p className="text-sm font-medium leading-normal">{label}</p>
                                                </a>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main content */}
                        <div className="min-w-0 flex-1 flex flex-col gap-10">
                            <EditableHero
                                title={cultureName}
                                summary={ethnicGroupName}
                                imageUrl={thumbnailUrl}
                                onImageUpload={handleImageUpload}
                            />

                            <EditableSectionCard
                                id="history"
                                title="History & Origins"
                                content={(culture as any).history ?? ''}
                                onSave={(content) => handleSaveField('history', content)}
                            />

                            <EditableSectionCard
                                id="language"
                                title="Language"
                                content={(culture as any).language ?? ''}
                                onSave={(content) => handleSaveField('language', content)}
                            />

                            <MythsSection stats={{ totalMyths: 0, deityStories: 0, creationMyths: 0 }} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
