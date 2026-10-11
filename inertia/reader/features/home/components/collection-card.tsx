// collection-card.tsx
import { Collection } from "../types";

export default function CollectionCard({ collection }: { collection: Collection }) {
    return (
        <div className="flex flex-col gap-4 rounded-lg group bg-surface-dark/50 p-4">
            <div 
                className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg"
                style={{ backgroundImage: `url(${collection.image})` }}
                data-alt={`Book cover for ${collection.name} collection`}
            />
            <div>
                <p className="text-text-primary-dark text-lg font-medium leading-normal">
                    {collection.name}
                </p>
                <p className="text-text-secondary-dark text-sm font-normal leading-normal line-clamp-2">
                    {collection.description}
                </p>
            </div>
        </div>
    );
}