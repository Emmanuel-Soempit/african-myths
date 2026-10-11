import { useState } from 'react'

interface MythContentEditorProps {
    initialTitle: string
    initialContent: string
}

export default function MythContentEditor({
    initialTitle,
    initialContent,
}: MythContentEditorProps) {
    const [title, setTitle] = useState(initialTitle)
    const [content, setContent] = useState(initialContent)

    return (
        <div className="space-y-8 lg:col-span-2">
            <div className="space-y-2">
                <label
                    className="text-sm font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]"
                    htmlFor="myth-title"
                >
                    Title
                </label>
                <input
                    className="form-input w-full rounded-lg border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-3 py-2 text-[var(--color-admin-text-primary-light)] placeholder-gray-500 transition-colors focus:border-[var(--color-admin-primary)] focus:ring-2 focus:ring-[var(--color-admin-primary)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-primary-dark)]"
                    id="myth-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label
                    className="text-sm font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]"
                    htmlFor="myth-content"
                >
                    Myth Content
                </label>
                <div className="overflow-hidden rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] focus-within:border-[var(--color-admin-primary)] focus-within:ring-2 focus-within:ring-[var(--color-admin-primary)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                    <div className="flex items-center gap-2 border-b border-[var(--color-admin-border-light)] p-2 dark:border-[var(--color-admin-border-dark)]">
                        <button className="rounded p-2 text-[var(--color-admin-text-secondary-light)] hover:bg-gray-100 dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:bg-white/10">
                            <span className="material-symbols-outlined !text-xl">
                                format_bold
                            </span>
                        </button>
                        <button className="rounded p-2 text-[var(--color-admin-text-secondary-light)] hover:bg-gray-100 dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:bg-white/10">
                            <span className="material-symbols-outlined !text-xl">
                                format_italic
                            </span>
                        </button>
                        <button className="rounded p-2 text-[var(--color-admin-text-secondary-light)] hover:bg-gray-100 dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:bg-white/10">
                            <span className="material-symbols-outlined !text-xl">
                                format_underlined
                            </span>
                        </button>
                        <div className="h-5 w-px bg-[var(--color-admin-border-light)] dark:bg-[var(--color-admin-border-dark)]"></div>
                        <button className="rounded p-2 text-[var(--color-admin-text-secondary-light)] hover:bg-gray-100 dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:bg-white/10">
                            <span className="material-symbols-outlined !text-xl">
                                format_list_bulleted
                            </span>
                        </button>
                        <button className="rounded p-2 text-[var(--color-admin-text-secondary-light)] hover:bg-gray-100 dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:bg-white/10">
                            <span className="material-symbols-outlined !text-xl">
                                format_list_numbered
                            </span>
                        </button>
                        <div className="h-5 w-px bg-[var(--color-admin-border-light)] dark:bg-[var(--color-admin-border-dark)]"></div>
                        <button className="rounded p-2 text-[var(--color-admin-text-secondary-light)] hover:bg-gray-100 dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:bg-white/10">
                            <span className="material-symbols-outlined !text-xl">
                                format_quote
                            </span>
                        </button>
                        <button className="rounded p-2 text-[var(--color-admin-text-secondary-light)] hover:bg-gray-100 dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:bg-white/10">
                            <span className="material-symbols-outlined !text-xl">
                                link
                            </span>
                        </button>
                    </div>
                    <div className="prose max-w-none p-4 font-sans text-[var(--color-admin-text-primary-light)] dark:prose-invert dark:text-[var(--color-admin-text-primary-dark)]">
                        <div
                            className="min-h-[400px] outline-none"
                            contentEditable
                            dangerouslySetInnerHTML={{ __html: content }}
                            onInput={(e) =>
                                setContent(e.currentTarget.innerHTML)
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
