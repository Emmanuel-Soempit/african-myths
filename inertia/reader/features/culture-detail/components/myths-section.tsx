import { Link } from "@inertiajs/react";
import FadeIn from "~/shared/ui/animations/fade_in";
import { StaggerContainer } from "~/shared/ui/animations/stagger_container";
import { Myth } from "../../home/types";


const MythCard = ({ myth }: { myth: Myth }) => {
    const title = myth.title || (myth as any).name || 'Untitled Myth';
    const image = myth.image || (myth as any).thumbnail || '';
    const rawContent = myth.description || (myth as any).content || '';
    const cleanDescription = rawContent.replace(/<[^>]*>/g, '');

    return (
        <div className="flex flex-col rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 group">
            {image && (
                <div className="aspect-video bg-cover bg-center" data-alt={`Illustration of ${title}`}
                    style={{ backgroundImage: `url("${image}")` }}></div>
            )}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold font-display text-stone-900 dark:text-white mb-2">{title}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {cleanDescription}
                </p>
                <Link className="text-primary font-bold text-sm group-hover:underline" href={`/myths/${myth.id}`}>
                    Read Story <span aria-hidden="true">→</span>
                </Link>
            </div>
        </div>
    );
}

export default function MythsSection({ myths }: { myths: Myth[] }) {
    return (<section className="mb-12 scroll-mt-24" id="myths">
        <h2 className="text-stone-900 dark:text-white text-3xl font-bold font-display leading-tight tracking-[-0.015em] pb-4 border-b border-stone-200 dark:border-stone-800 mb-6">Myths &amp; Legends</h2>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myths.map(m => (
                <FadeIn key={m.id}>
                    <MythCard myth={m} />
                </FadeIn>
            ))}
        </StaggerContainer>
    </section >)
}