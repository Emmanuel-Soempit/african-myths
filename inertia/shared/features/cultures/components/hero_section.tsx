import { useState } from 'react'

interface HeroSectionProps {
    culture: {
        title: string
        description: string
        imageUrl: string
        thumbnailUrl: string
    }
}

export default function HeroSection({ culture }: HeroSectionProps) {
    const [title, setTitle] = useState(culture.title)
    const [description, setDescription] = useState(culture.description)

    return (
        <>
            <div className="mb-12">
                <div className="flex flex-col items-center gap-6 rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] md:flex-row">
                    <div className="relative h-48 w-full flex-shrink-0 md:w-48">
                        <div
                            className="h-full w-full rounded-lg bg-cover bg-center"
                            data-alt="Culture cover image"
                            style={{
                                backgroundImage: `url('${culture.imageUrl}')`,
                            }}
                        ></div>
                        <button className="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-full bg-[var(--color-admin-primary)] text-white transition-colors hover:bg-[var(--color-admin-primary)]/80">
                            <span className="material-symbols-outlined !text-2xl">
                                edit
                            </span>
                        </button>
                    </div>
                    <div className="flex w-full flex-col gap-4">
                        <input
                            className="form-input w-full border-0 bg-transparent p-0 font-display text-4xl font-black leading-tight tracking-[-0.033em] text-[var(--color-admin-text-primary-light)] focus:ring-0 dark:text-[var(--color-admin-text-primary-dark)]"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            className="form-textarea h-24 w-full resize-none border-0 bg-transparent p-0 text-base font-normal leading-relaxed text-[var(--color-admin-text-secondary-light)] focus:ring-0 dark:text-[var(--color-admin-text-secondary-dark)]"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="mb-12 flex flex-wrap gap-4">
                <button className="flex h-12 w-full min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-6 text-base font-bold leading-normal tracking-[-0.01em] text-[var(--color-admin-text-primary-light)] hover:bg-[var(--color-admin-border-light)]/50 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-primary-dark)] dark:hover:bg-[var(--color-admin-border-dark)]/50">
                    <span className="material-symbols-outlined !text-2xl">
                        groups
                    </span>
                    <span className="truncate">Manage Ethnicities</span>
                </button>
            </div>
        </>
    )
}
