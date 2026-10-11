import { Link } from "@inertiajs/react";

export default function CultureCard({ culture }: { culture: any }) {
    const imageUrl = culture.thumbnail || culture.image || ''
    const subtitle = culture.ethnicGroup?.canonicalName || culture.region || ''

    return (
        <Link href={`/cultures/${culture.id}`} className="flex h-full culture-card flex-1 flex-col gap-4 rounded-lg min-w-60">
            <div className="w-full aspect-[3/4] rounded-lg flex flex-col overflow-hidden bg-center bg-no-repeat bg-cover">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={`Portrait of a person from the ${culture.name} culture`}
                        className="h-full w-full object-cover"
                    />
                )}
            </div>
            <div>
                <p className="text-text-primary-dark text-lg font-medium leading-normal">{culture.name}</p>
                <p className="text-text-secondary-dark text-sm font-normal leading-normal">{subtitle}</p>
            </div>
        </Link>
    );
}