import { useState } from 'react'

interface MythMetadataProps {
    initialStatus: string
    initialCulture: string
    initialAuthor: string
    initialReadingTime: number
    initialTags: string[]
}

export default function MythMetadata({
    initialStatus,
    initialCulture,
    initialAuthor,
    initialReadingTime,
    initialTags,
}: MythMetadataProps) {
    const [status, setStatus] = useState(initialStatus)
    const [culture, setCulture] = useState(initialCulture)
    const [author, setAuthor] = useState(initialAuthor)
    const [readingTime, setReadingTime] = useState(initialReadingTime)
    const [tags, setTags] = useState(initialTags)
    const [newTag, setNewTag] = useState('')

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newTag.trim()) {
            setTags([...tags, newTag.trim()])
            setNewTag('')
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }

    return (
        <div className="space-y-8 lg:col-span-1">
            <div className="space-y-2">
                <label
                    className="text-sm font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]"
                    htmlFor="myth-status"
                >
                    Status
                </label>
                <select
                    className="form-select w-full rounded-lg border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-3 py-2 text-[var(--color-admin-text-primary-light)] transition-colors focus:border-[var(--color-admin-primary)] focus:ring-2 focus:ring-[var(--color-admin-primary)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-primary-dark)]"
                    id="myth-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="pending">Pending Review</option>
                </select>
            </div>
            <div className="space-y-2">
                <label
                    className="text-sm font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]"
                    htmlFor="myth-culture"
                >
                    Culture
                </label>
                <select
                    className="form-select w-full rounded-lg border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-3 py-2 text-[var(--color-admin-text-primary-light)] transition-colors focus:border-[var(--color-admin-primary)] focus:ring-2 focus:ring-[var(--color-admin-primary)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-primary-dark)]"
                    id="myth-culture"
                    value={culture}
                    onChange={(e) => setCulture(e.target.value)}
                >
                    <option value="akan">Akan</option>
                    <option value="yoruba">Yoruba</option>
                    <option value="igbo">Igbo</option>
                    <option value="zulu">Zulu</option>
                </select>
            </div>
            <div className="space-y-2">
                <label
                    className="text-sm font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]"
                    htmlFor="myth-author"
                >
                    Author / Origin
                </label>
                <input
                    className="form-input w-full rounded-lg border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-3 py-2 text-[var(--color-admin-text-primary-light)] placeholder-gray-500 transition-colors focus:border-[var(--color-admin-primary)] focus:ring-2 focus:ring-[var(--color-admin-primary)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-primary-dark)]"
                    id="myth-author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label
                    className="text-sm font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]"
                    htmlFor="myth-reading-time"
                >
                    Estimated Reading Time (minutes)
                </label>
                <input
                    className="form-input w-full rounded-lg border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-3 py-2 text-[var(--color-admin-text-primary-light)] placeholder-gray-500 transition-colors focus:border-[var(--color-admin-primary)] focus:ring-2 focus:ring-[var(--color-admin-primary)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-primary-dark)]"
                    id="myth-reading-time"
                    type="number"
                    value={readingTime}
                    onChange={(e) => setReadingTime(Number(e.target.value))}
                />
            </div>
            <div className="space-y-2">
                <label
                    className="text-sm font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]"
                    htmlFor="myth-tags"
                >
                    Tags
                </label>
                <div className="flex flex-wrap gap-2 rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-2 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                    {tags.map((tag) => (
                        <div
                            key={tag}
                            className="flex items-center justify-center gap-1 rounded px-2 text-sm font-medium text-[var(--color-admin-primary)]"
                            style={{
                                backgroundColor:
                                    'color-mix(in srgb, var(--color-admin-primary) 20%, transparent)',
                            }}
                        >
                            <span>{tag}</span>
                            <button
                                onClick={() => handleRemoveTag(tag)}
                                className="text-[var(--color-admin-primary)]/70 hover:text-[var(--color-admin-primary)]"
                            >
                                <span className="material-symbols-outlined !text-base">
                                    close
                                </span>
                            </button>
                        </div>
                    ))}
                    <input
                        className="min-w-[100px] flex-1 border-0 bg-transparent p-1 text-[var(--color-admin-text-primary-light)] placeholder-gray-500 focus:ring-0 dark:text-[var(--color-admin-text-primary-dark)]"
                        id="myth-tags"
                        placeholder="Add a tag..."
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={handleAddTag}
                    />
                </div>
            </div>
        </div>
    )
}
