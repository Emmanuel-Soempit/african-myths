

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-solid border-surface-dark/50 dark:border-surface-dark px-4 sm:px-10 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex flex-col gap-4 md:col-span-2">
                    <div className="flex items-center gap-4 text-text-primary-dark">
                        <div className="size-6 text-primary">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_6_319_footer)"><path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path></g>
                                <defs><clipPath id="clip0_6_319_footer"><rect fill="white" height="48" width="48"></rect></clipPath></defs>
                            </svg>
                        </div>
                        <h2 className="text-text-primary-dark text-xl font-bold leading-tight tracking-[-0.015em]">Kólà</h2>
                    </div>  
                    <p className="text-text-secondary-dark text-sm">Your portal to the enchanting world of African folklore and mythology.</p>
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="text-text-primary-dark font-semibold">Links</h3>
                    <a className="text-text-secondary-dark text-sm hover:text-primary" href="#">About Us</a>
                    <a className="text-text-secondary-dark text-sm hover:text-primary" href="#">Contact</a>
                    <a className="text-text-secondary-dark text-sm hover:text-primary" href="#">Terms of Service</a>
                    <a className="text-text-secondary-dark text-sm hover:text-primary" href="#">Privacy Policy</a>
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="text-text-primary-dark font-semibold">Newsletter</h3>
                    <p className="text-text-secondary-dark text-sm">Subscribe for the latest stories and collections.</p>
                    <form className="flex items-center">
                        <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-text-primary-dark focus:outline-0 focus:ring-0 border-none bg-surface-dark h-10 placeholder:text-text-secondary-dark px-4 text-sm" placeholder="Your email" type="email" />
                        <button className="flex items-center justify-center h-10 px-4 bg-primary rounded-r-lg text-background-dark font-bold text-sm" type="submit">
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
            <div className="mt-10 pt-6 border-t border-solid border-surface-dark/50 dark:border-surface-dark text-center text-text-secondary-dark text-xs">
                <p>© 2024 Kólà. All Rights Reserved.</p>
            </div>
        </footer>
    )
}