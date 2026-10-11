import CollapsibleSection from './collapsible_section'

interface HistorySectionProps {
    history: string
    imageUrl: string
}

export default function HistorySection({
    history,
    imageUrl,
}: HistorySectionProps) {
    return (
        <CollapsibleSection
            title="History & Origins"
            id="history"
            defaultOpen={true}
            onEdit={() => console.log('Edit history')}
        >
            <div dangerouslySetInnerHTML={{ __html: history }} />
            <div className="my-6">
                <img
                    alt="Embedded image of culture history"
                    className="rounded-lg"
                    src={imageUrl}
                />
            </div>
            {/* Additional paragraphs would go here if part of the data structure */}
        </CollapsibleSection>
    )
}
