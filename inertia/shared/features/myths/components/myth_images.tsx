interface MythImage {
    id: string
    url: string
    alt: string
}

interface MythImagesProps {
    images: MythImage[]
}

export default function MythImages({ images }: MythImagesProps) {
    return (
        <div className="space-y-4 lg:col-span-2">
            <h3 className="text-lg font-semibold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                Associated Images
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className="group relative aspect-square"
                    >
                        <img
                            alt={image.alt}
                            className="h-full w-full rounded-lg object-cover"
                            src={image.url}
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                            <button className="rounded-full bg-red-600/80 p-2 text-white hover:bg-red-500">
                                <span className="material-symbols-outlined">
                                    delete
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
                <div className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[var(--color-admin-border-light)] text-[var(--color-admin-text-secondary-light)] transition-colors hover:border-[var(--color-admin-primary)] hover:bg-[var(--color-admin-surface-light)] hover:text-[var(--color-admin-primary)] dark:border-[var(--color-admin-border-dark)] dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:bg-[var(--color-admin-surface-dark)]">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-4xl">
                            add_photo_alternate
                        </span>
                        <p className="mt-1 text-xs">Add Image</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
