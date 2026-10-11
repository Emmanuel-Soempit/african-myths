// nav-bar.tsx
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Logo from '~/shared/ui/logo';
import { SearchBar } from '~/shared/ui/search-bar';
import Button from '~/shared/ui/button';
import { usePage } from '@inertiajs/react'
import User from '#models/user';


export default function NavBar() {
    const { props } = usePage()
    const user = props.user as User
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    console.log('User', user)


    return (
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 lg:px-8 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-8">
                <Logo />
                <nav className="hidden md:flex items-center gap-5">
                    <Link href="#" className="nav-link-primary">Cultures</Link>
                    <Link href="#" className="nav-link-primary">Stories</Link>
                    <Link href="#" className="nav-link-primary">About Us</Link>
                    <Link href="#" className="nav-link-primary">Contribute</Link>
                </nav>
            </div>
            <div className="flex flex-1 justify-end gap-4 md:gap-6 items-center">
                <div className="hidden sm:flex min-w-40 !h-10 max-w-64">
                    <SearchBar placeholder='Search' />
                </div>
                {!user && <Button
                    onClick={() => {
                        router.visit('auth/sign-up')
                    }}
                    variant='green-light' className='max-w-fit h-10'>
                    <span className="truncate">Sign Up</span>
                </Button>}

                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    style={{
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC77a1T9mrno9VGtuEcIN1PVi-8JpM60cs653MdbSzdU8ubne1vScANWdNL0K61ZbuU4IymD0tCyvd_ufS4hXgLaZ-iZneJ6c4IqmBvNlObkYs9JolelM8XODCu2pZh-KQ_UJFjj2TRC-7hRBG7LB4A6xLj4ayWYmVUkrH4jES_w0LnS-1obUjNaZajTMbG-jQzzIJ82GHfoGg79rpQsFP_qM3HBwxWfwfvP9AFp4DtaohzgBBND1EWMvkDUAL8Ij638MSmaS3eSj8")'
                    }}
                />
            </div>
        </header>
    );
}