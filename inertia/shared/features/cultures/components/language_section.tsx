import CollapsibleSection from './collapsible_section'

interface LanguageSectionProps {
    language: string
}

export default function LanguageSection({ language }: LanguageSectionProps) {
    return (
        <CollapsibleSection
            title="Language"
            id="language"
            onEdit={() => console.log('Edit language')}
        >
            <div dangerouslySetInnerHTML={{ __html: language }} />
        </CollapsibleSection>
    )
}
