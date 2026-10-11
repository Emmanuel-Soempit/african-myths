import { Link } from "@inertiajs/react";
import FadeIn from "~/shared/ui/animations/fade_in";
import { StaggerContainer } from "~/shared/ui/animations/stagger_container";
import { Writing } from "~/types/writing";

interface WritingsSectionProps {
    writings: {
        poems: Writing[]
        stories: Writing[]
        articles: Writing[]
    }
}

const TYPE_LABELS: Array<{ key: keyof WritingsSectionProps['writings']; label: string; singular: string }> = [
    { key: 'poems', label: 'Poems', singular: 'Poem' },
    { key: 'stories', label: 'Stories', singular: 'Story' },
    { key: 'articles', label: 'Articles', singular: 'Article' },
]

const WritingCard = ({ writing }: { writing: Writing }) => {
    const excerpt = (writing.excerpt || '').replace(/<[^>]*>/g, '')

    return (
        <div className="flex flex-col rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 group">
            {writing.thumbnail && (
                <div className="aspect-video bg-cover bg-center" data-alt={`Illustration of ${writing.title}`}
                    style={{ backgroundImage: `url("${writing.thumbnail}")` }}></div>
            )}
            <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#BC6C25] mb-1 capitalize">
                    {writing.type}
                </span>
                <h3 className="text-lg font-bold font-display text-stone-900 dark:text-white mb-2">{writing.title}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {excerpt}
                </p>
                <Link className="text-primary font-bold text-sm group-hover:underline" href={`/writings/${writing.id}`}>
                    Read {writing.type} <span aria-hidden="true">→</span>
                </Link>
            </div>
        </div>
    );
}

export default function WritingsSection({ writings }: WritingsSectionProps) {
    const nonEmpty = TYPE_LABELS.filter((t) => (writings?.[t.key] ?? []).length > 0)
    if (nonEmpty.length === 0) return null

    return (
        <section className="mb-12 scroll-mt-24" id="writings">
            <h2 className="text-stone-900 dark:text-white text-3xl font-bold font-display leading-tight tracking-[-0.015em] pb-4 border-b border-stone-200 dark:border-stone-800 mb-6">
                Poems, Stories &amp; Articles
            </h2>
            {nonEmpty.map((t) => (
                <div key={t.key} className="mb-8 last:mb-0">
                    <h3 className="text-stone-800 dark:text-stone-200 text-xl font-bold font-display mb-4">
                        {t.label}
                    </h3>
                    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {writings[t.key].map((w) => (
                            <FadeIn key={w.id}>
                                <WritingCard writing={w} />
                            </FadeIn>
                        ))}
                    </StaggerContainer>
                </div>
            ))}
        </section>
    )
}
