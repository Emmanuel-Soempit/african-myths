import FadeIn from "~/shared/ui/animations/fade_in";
import { StaggerContainer } from "~/shared/ui/animations/stagger_container";
import { Resource } from "../types";


const ResourceCard = ({ resource }: { resource: Resource }) => {
    return <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">

        <div className="w-16 h-20 bg-stone-300 dark:bg-stone-700 rounded-lg flex-shrink-0 bg-cover bg-center" data-alt="Abstract representation of a creation myth"
            style={{ backgroundImage: `url("${resource.image}")` }}></div>
        <div className="flex-1">
            <h3 className="font-bold text-stone-900 dark:text-white">{resource.title}</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400">{resource.author}</p>
            <p className="text-xs text-stone-500 dark:text-stone-500 mt-1">{resource.format} / {resource.size}</p>
        </div>
        <button className="flex items-center justify-center gap-2 min-w-[84px] cursor-pointer overflow-hidden rounded-lg h-10 px-4 bg-primary/20 text-primary text-sm font-bold leading-normal">
            <span className="material-symbols-outlined !text-xl">download</span>
            <span className="truncate hidden sm:inline">Download</span>
        </button>
    </div>
}

export default function ResourcessSection({ resources }: { resources: Resource[] }) {
    return (<section className="scroll-mt-24" id="resources">
        <h2 className="text-stone-900 dark:text-white text-3xl font-bold font-display leading-tight tracking-[-0.015em] pb-4 border-b border-stone-200 dark:border-stone-800 mb-6">Resources &amp; Downloads</h2>
        <StaggerContainer className="space-y-4">
            {resources.map(r => (
                <FadeIn key={r.id}>
                    <ResourceCard resource={r} />
                </FadeIn>
            ))}
        </StaggerContainer>
    </section >)
}