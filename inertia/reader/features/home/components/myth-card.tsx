import { Link } from "@inertiajs/react";

export default function MythCard({ myth }: { myth: any }) {
    const imageUrl = myth.thumbnail || myth.image || ''
    const title = myth.name || myth.title || ''
    const subtitle = myth?.culture?.name || ''

    return (
        <Link href={`/myths/${myth.id}`} className="flex cursor-pointer flex-col gap-4 rounded-lg group">
            <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex flex-col overflow-hidden"
                style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' }}
                data-alt={`Illustration of ${title}`}
            />
            <div>
                <p className="text-text-primary-dark text-lg font-medium leading-normal">
                    {title}
                </p>
                <p className="text-text-secondary-dark text-sm font-normal leading-normal">
                    {subtitle}
                </p>
            </div>
        </Link>
    );
}