import MythContentEditor from './components/myth_content_editor'
import MythEditHeader from './components/myth_edit_header'
import MythImages from './components/myth_images'
import MythMetadata from './components/myth_metadata'

// Dummy data
const DEFAULT_MYTH = {
    title: 'How Anansi Became the Keeper of Stories',
    content:
        '<p>In the beginning, there were no stories in the world. The Sky-God, Nyame, had them all, kept safe in a golden box beside his throne. Anansi the Spider, a clever and cunning trickster, yearned for these stories. He wanted to bring them down to the people of the earth. So, he spun a long, silver thread and climbed up to the sky to speak with Nyame.</p><p>"Nyame," Anansi said with a bow, "I wish to buy your stories."</p>',
    images: [
        {
            id: '1',
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL9h38O00ep8N8mL1V_jZYJD91Cb2w1Wlfm_Wz3KZtwjJaPhH42NaJQsZzDX-8on-oQIMjp79T0Q0HlF9vYy3Vfu1rJWYM9_Xp0vLaXQpDjQGd9f8ZwtKDuOVKctJnoXztGcUF2oWA68AkhPFw5M389TAqDdxKY2qRJURFzI0BCiPimEnj2_GLVvUeSP_agnUOhYRr2-3G8q62ORqN37dYtiqEiAXsFlEqNudYkYDsUi1u9dDdcr12ZRHtaHO5QIwMVgmUFP6tZWM',
            alt: 'An artistic illustration of a golden spiderweb against a dark, cosmic background.',
        },
        {
            id: '2',
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY92RK4GdGwjHAdZEA6Knn7CFLv2Y7XkT0uOfkqQ7qAheQAvAIrcqRkHs8rWU81_cRau3Mtr6TbvcnELJ7fQ_ttHFC8J2Pr6kQ6BHTir98xYAP_FAooytEbUfz5M4bJi849T8xRkagI94LMo7kQBC3-WY5xwYPEBTqNB0sfATB1ioZMx98Qb6_P6J4caXfdmB1XiVDdPtAkOdas6Izdb6WPyKXREeoKGj6N2VSUVL9Cj0wowhXuWDusnN3QW5LQA3BaXQZ9Xi8Me0',
            alt: 'A powerful warrior queen standing before a desert city.',
        },
    ],
    status: 'published',
    culture: 'akan',
    author: 'Akan Folktale',
    readingTime: 7,
    tags: ['Trickery', 'Wisdom', 'Creation'],
}

export default function MythEditView() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-[var(--color-admin-background-light)] dark:bg-[var(--color-admin-background-dark)]">
            <MythEditHeader />
            <div className="grid grid-cols-1 gap-8 p-6 px-10 lg:grid-cols-3 lg:p-8">
                <div className="space-y-8 lg:col-span-2">
                    <MythContentEditor
                        initialTitle={DEFAULT_MYTH.title}
                        initialContent={DEFAULT_MYTH.content}
                    />
                    <MythImages images={DEFAULT_MYTH.images} />
                </div>
                <MythMetadata
                    initialStatus={DEFAULT_MYTH.status}
                    initialCulture={DEFAULT_MYTH.culture}
                    initialAuthor={DEFAULT_MYTH.author}
                    initialReadingTime={DEFAULT_MYTH.readingTime}
                    initialTags={DEFAULT_MYTH.tags}
                />
            </div>
        </div>
    )
}
