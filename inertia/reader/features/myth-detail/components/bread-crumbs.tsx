export default function BreadCrumbs({ myth }: { myth: any }) {

    return <nav className="flex flex-wrap gap-2 mb-8 font-sans">
        <a className="text-gray-500 dark:text-gray-400 hover:text-[#D4A373] dark:hover:text-[#D4A373] text-sm font-medium transition-colors" href="/">Home</a>
        <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">/</span>
        <a className="text-gray-500 dark:text-gray-400 hover:text-[#D4A373] dark:hover:text-[#D4A373] text-sm font-medium transition-colors" href={`/cultures/${myth?.culture?.id}`}>{myth?.culture?.name}</a>
        <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">/</span>
        <span className="text-[#2D2D2D] dark:text-white text-sm font-medium">{myth?.title}</span>
    </nav>
}