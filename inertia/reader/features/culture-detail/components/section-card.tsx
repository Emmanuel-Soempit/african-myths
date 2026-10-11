import { SectionItem } from "../types";

export default function SectionCard({section}: {section:SectionItem}) {
    return <section className="mb-12 scroll-mt-24" id={section.slug}>
        <h2 className="text-stone-900 dark:text-white text-3xl font-bold font-display leading-tight tracking-[-0.015em] pb-4 border-b border-stone-200 dark:border-stone-800 mb-6">{section.title}</h2>
        <div className="prose prose-lg dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 font-sans" dangerouslySetInnerHTML={{__html: section.content}}/>
    </section>
}