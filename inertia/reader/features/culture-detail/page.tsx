import FadeIn from "~/shared/ui/animations/fade_in";
import { StaggerContainer } from "~/shared/ui/animations/stagger_container";
import { ContentHero, MythsSection, ResourcesSection, SectionCard, StatCard, TableOfContent } from "./components";
import { culture_dummy } from "./utils/dummy";

export default function CultureDetailPage({ culture, myths }: { culture?: any, myths?: any[] }) {
    const hasCulture = !!culture;

    const title = culture?.name || culture_dummy.title;
    const thumbnail = culture?.thumbnail || culture_dummy.thumbnail;
    const summary = culture?.ethnicGroup?.note || "Explore the rich history, language, and mythology of this ancient culture.";

    // Geographical Region
    let region = 'Unknown';
    if (hasCulture) {
        const regions = culture?.ethnicGroup?.ethnicGroupCountries
            ?.map((egc: any) => egc.country?.sub_region_name || egc.country?.name)
            .filter((v: any, i: number, self: any[]) => v && self.indexOf(v) === i) || [];
        region = regions.join(', ') || 'Unknown';
    } else {
        region = culture_dummy.region;
    }

    // Language
    let language = 'Unknown';
    if (hasCulture) {
        language = culture?.ethnicGroup?.language?.name || 'Unknown';
    } else {
        language = culture_dummy.language;
    }

    // Population Estimate
    let population = 'Unknown';
    if (hasCulture) {
        const populations = culture?.ethnicGroup?.ethnicGroupCountries
            ?.map((egc: any) => egc.populationEstimate)
            .filter(Boolean) || [];
        population = populations.join(', ') || 'Unknown';
    } else {
        population = culture_dummy.population;
    }

    // Build sections dynamically from dynamic HTML values
    const sections = [];
    if (hasCulture) {
        if (culture.history) {
            sections.push({
                id: "history",
                title: "History & Origins",
                slug: "history",
                content: culture.history
            });
        }
        if (culture.language) {
            sections.push({
                id: "language",
                title: "Language & Linguistics",
                slug: "language",
                content: culture.language
            });
        }
    } else {
        sections.push(...culture_dummy.sections);
    }

    const displayMyths = hasCulture ? (myths || []) : culture_dummy.myths;

    const tocContents = sections.map(s => s.slug);
    if (displayMyths.length > 0) {
        tocContents.push('myths');
    }
    tocContents.push('resources');

    return (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <FadeIn>
                <div className="flex flex-col lg:flex-row gap-10">
                    <TableOfContent contents={tocContents} title={title} thumbnail={thumbnail} />
                    <div className="flex-1 min-w-0">
                        <ContentHero summary={summary} title={title} thumbnail={thumbnail} />

                        <StaggerContainer className="flex flex-wrap gap-4 mb-12">
                            <FadeIn>
                                <StatCard key={region} name="Geographical Region" value={region} />
                            </FadeIn>
                            <FadeIn>
                                <StatCard key={language} name="Primary language" value={language} />
                            </FadeIn>
                            <FadeIn>
                                <StatCard key={population} name="Population Estimate" value={population} />
                            </FadeIn>
                        </StaggerContainer>

                        <StaggerContainer>
                            {sections.map(s => (
                                <FadeIn key={s.id}>
                                    <SectionCard section={s} />
                                </FadeIn>
                            ))}
                        </StaggerContainer>

                        {displayMyths.length > 0 && <MythsSection myths={displayMyths} />}
                        <ResourcesSection resources={culture_dummy.resources} />
                    </div>
                </div>
            </FadeIn>
        </main>
    )
}