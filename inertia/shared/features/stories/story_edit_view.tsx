// Mirrors myth_edit_view.tsx — swap in real story components when ready
import MythContentEditor from '~/shared/features/myths/components/myth_content_editor'
import MythEditHeader from '~/shared/features/myths/components/myth_edit_header'
import MythImages from '~/shared/features/myths/components/myth_images'
import MythMetadata from '~/shared/features/myths/components/myth_metadata'

const DEFAULT_STORY = {
    title: 'The River and the Tortoise',
    content:
        '<p>Long ago, when the rivers still spoke and the animals gathered at the water\'s edge to drink and share wisdom, there lived a tortoise whose shell bore the marks of a thousand seasons...</p>',
    images: [
        {
            id: '1',
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL9h38O00ep8N8mL1V_jZYJD91Cb2w1Wlfm_Wz3KZtwjJaPhH42NaJQsZzDX-8on-oQIMjp79T0Q0HlF9vYy3Vfu1rJWYM9_Xp0vLaXQpDjQGd9f8ZwtKDuOVKctJnoXztGcUF2oWA68AkhPFw5M389TAqDdxKY2qRJURFzI0BCiPimEnj2_GLVvUeSP_agnUOhYRr2-3G8q62ORqN37dYtiqEiAXsFlEqNudYkYDsUi1u9dDdcr12ZRHtaHO5QIwMVgmUFP6tZWM',
            alt: 'A tortoise resting by a moonlit river.',
        },
    ],
    status: 'published',
    culture: 'yoruba',
    author: 'Yoruba Folktale',
    readingTime: 5,
    tags: ['Animals', 'Wisdom', 'River'],
}

export default function StoryEditView() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-[var(--color-admin-background-light)] dark:bg-[var(--color-admin-background-dark)]">
            <MythEditHeader />
            <div className="grid grid-cols-1 gap-8 p-6 px-10 lg:grid-cols-3 lg:p-8">
                <div className="space-y-8 lg:col-span-2">
                    <MythContentEditor
                        initialTitle={DEFAULT_STORY.title}
                        initialContent={DEFAULT_STORY.content}
                    />
                    <MythImages images={DEFAULT_STORY.images} />
                </div>
                <MythMetadata
                    initialStatus={DEFAULT_STORY.status}
                    initialCulture={DEFAULT_STORY.culture}
                    initialAuthor={DEFAULT_STORY.author}
                    initialReadingTime={DEFAULT_STORY.readingTime}
                    initialTags={DEFAULT_STORY.tags}
                />
            </div>
        </div>
    )
}
