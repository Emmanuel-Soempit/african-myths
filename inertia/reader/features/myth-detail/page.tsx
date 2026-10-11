import FadeIn from "~/shared/ui/animations/fade_in";
import { MythsSection } from "../culture-detail/components";
import { Breadcrumbs, Content, PageHeading } from "./components";
import { myth_detail_dummy } from "./utils/dummy";

interface MythDetailPageProps {
    myth: any
    relatedMyths: any[]
}

export default function MythDetailPage({ myth, relatedMyths }: MythDetailPageProps) {
    const mergedMyth = {
        ...myth_detail_dummy,
        ...myth,
        title: myth?.name || myth?.title || myth_detail_dummy.title,
        time: myth?.minutesToRead ? `${myth.minutesToRead} mins` : myth_detail_dummy.time,
        tags: myth?.tags || myth_detail_dummy.tags,
    }

    return (
        <main className="container mx-auto flex h-full grow flex-col justify-center px-4 sm:px-6 lg:px-8 py-10 md:py-16">
            <FadeIn>
                <div className="mx-auto flex max-w-3xl flex-col flex-1">
                    <Breadcrumbs myth={mergedMyth} />
                    <PageHeading myth={mergedMyth} />

                    <Content myth={mergedMyth} />

                    <MythsSection myths={relatedMyths && relatedMyths.length > 0 ? relatedMyths : myth_detail_dummy.myths} />
                </div>
            </FadeIn>
        </main>
    )
}