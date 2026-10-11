import { Link } from "@inertiajs/react";
import FadeIn from "~/shared/ui/animations/fade_in";
import { StaggerContainer } from "~/shared/ui/animations/stagger_container";

interface RelatedWriting {
    id: string
    type: string
    title: string
    excerpt: string | null
    thumbnail: string | null
    minutesToRead: number
    publishedAt: string | null
}

interface WritingDetailPageProps {
    writing: {
        id: string
        type: 'poem' | 'story' | 'article'
        title: string
        excerpt: string | null
        content: string
        thumbnail: string | null
        status: string
        minutesToRead: number
        publishedAt: string | null
        culture: { id: string; name: string } | null
        author: { name: string } | null
    }
    related: RelatedWriting[]
}

function formatDate(value?: string | null) {
    if (!value) return '—'
    return new Date(value).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    })
}

const TYPE_LABELS: Record<string, string> = {
    poem: 'Poem',
    story: 'Story',
    article: 'Article',
}

export default function WritingDetailPage({ writing, related }: WritingDetailPageProps) {
    const isPoem = writing.type === 'poem'

    return (
        <main className="container mx-auto flex h-full grow flex-col justify-center px-4 sm:px-6 lg:px-8 py-10 md:py-16">
            <FadeIn>
                <div className={`mx-auto flex ${isPoem ? 'max-w-2xl' : 'max-w-3xl'} w-full flex-col flex-1`}>
                    {/* Breadcrumbs */}
                    <nav className="flex flex-wrap gap-2 mb-8 font-sans">
                        <a className="text-gray-500 dark:text-gray-400 hover:text-[#D4A373] dark:hover:text-[#D4A373] text-sm font-medium transition-colors" href="/">Home</a>
                        <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">/</span>
                        {writing.culture && (
                            <>
                                <a className="text-gray-500 dark:text-gray-400 hover:text-[#D4A373] dark:hover:text-[#D4A373] text-sm font-medium transition-colors" href={`/cultures/${writing.culture.id}`}>{writing.culture.name}</a>
                                <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">/</span>
                            </>
                        )}
                        <span className="text-[#2D2D2D] dark:text-white text-sm font-medium">{writing.title}</span>
                    </nav>

                    {/* Heading */}
                    <div className={`flex flex-col gap-4 mb-8 ${isPoem ? 'items-center text-center' : ''}`}>
                        <div className="flex items-center gap-3">
                            <span className="font-sans inline-block w-fit rounded-full bg-[#BC6C25]/20 px-4 py-1 text-sm font-medium text-[#BC6C25] capitalize">
                                {TYPE_LABELS[writing.type] ?? writing.type}
                            </span>
                            {writing.culture && (
                                <Link className="font-sans inline-block w-fit rounded-full bg-[#3A5A40]/10 dark:bg-[#3A5A40]/20 px-4 py-1 text-sm font-medium text-[#3A5A40] dark:text-green-200 hover:bg-[#3A5A40]/20 transition-colors"
                                    href={`/cultures/${writing.culture.id}`}>{writing.culture.name}</Link>
                            )}
                        </div>
                        <h1 className="font-sans text-[#2D2D2D] dark:text-white text-4xl md:text-5xl font-bold tracking-tighter">{writing.title}</h1>
                    </div>

                    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-gray-200 dark:border-gray-800 py-4 mb-12 font-sans ${isPoem ? 'justify-center' : ''}`}>
                        {writing.author?.name && (
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                <span className="material-symbols-outlined text-base">person</span>
                                <span>{writing.author.name}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                            <span className="material-symbols-outlined text-base">schedule</span>
                            <span>{writing.minutesToRead} min read</span>
                        </div>
                        {writing.publishedAt && (
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                <span className="material-symbols-outlined text-base">calendar_month</span>
                                <span>{formatDate(writing.publishedAt)}</span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    {writing.thumbnail && !writing.content?.includes(writing.thumbnail) && (
                        <figure className="my-8">
                            <img className="w-full rounded-xl object-cover max-h-[450px]" src={writing.thumbnail} alt={writing.title} />
                        </figure>
                    )}
                    <div
                        className={isPoem
                            ? 'text-center font-display text-lg leading-loose whitespace-pre-wrap text-[#2D2D2D] dark:text-stone-200'
                            : 'text-[#2D2D2D] dark:text-stone-200'}
                        dangerouslySetInnerHTML={{ __html: writing.content }}
                    />

                    {/* Related */}
                    {related && related.length > 0 && (
                        <section className="mt-16">
                            <h2 className="text-stone-900 dark:text-white text-2xl font-bold font-display leading-tight pb-4 border-b border-stone-200 dark:border-stone-800 mb-6">
                                More from this culture
                            </h2>
                            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {related.map((w) => (
                                    <FadeIn key={w.id}>
                                        <Link
                                            href={`/writings/${w.id}`}
                                            className="flex flex-col rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 group h-full"
                                        >
                                            {w.thumbnail && (
                                                <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url("${w.thumbnail}")` }}></div>
                                            )}
                                            <div className="p-5 flex flex-col flex-1">
                                                <span className="text-xs font-semibold uppercase tracking-wide text-[#BC6C25] mb-1 capitalize">
                                                    {w.type}
                                                </span>
                                                <h3 className="text-lg font-bold font-display text-stone-900 dark:text-white mb-2">{w.title}</h3>
                                                <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed flex-1 line-clamp-2">
                                                    {(w.excerpt || '').replace(/<[^>]*>/g, '')}
                                                </p>
                                            </div>
                                        </Link>
                                    </FadeIn>
                                ))}
                            </StaggerContainer>
                        </section>
                    )}
                </div>
            </FadeIn>
        </main>
    )
}
