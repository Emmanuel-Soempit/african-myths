export default function Content({ myth }: { myth: any }) {
    const showExplicitThumbnail = myth?.thumbnail && !myth.content?.includes(myth.thumbnail)

    return <>
        {showExplicitThumbnail && (
            <figure className="my-8">
                <img className="w-full rounded-xl object-cover max-h-[450px]" src={myth.thumbnail} alt={myth.title} />
            </figure>
        )}
        <div className="text-white" dangerouslySetInnerHTML={{ __html: myth?.content }} />

        {myth?.source && (
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 italic">
                <p>Source: {myth.source}</p>
            </div>
        )}

        <div className="flex items-center gap-4 mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
            <p className="font-sans text-sm font-medium text-gray-700 dark:text-gray-300">Share this story:</p>
            <div className="flex gap-2">
                <a className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    href="#">
                    <svg className="bi bi-twitter-x" fill="currentColor" height="16" viewBox="0 0 16 16" width="16"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-1.6 13.023h1.844L4.12 2.16h-1.98z">
                        </path>
                    </svg>
                </a>
                <a className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    href="#">
                    <svg className="bi bi-facebook" fill="currentColor" height="16" viewBox="0 0 16 16" width="16"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.582 0 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951">
                        </path>
                    </svg>
                </a>
                <a className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    href="#">
                    <span className="material-symbols-outlined text-base">link</span>
                </a>
            </div>
        </div>
    </>
}