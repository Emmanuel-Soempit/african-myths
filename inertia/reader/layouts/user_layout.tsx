import { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import NavBar from '../shared/nav-bar';
import { Footer } from '../shared';

interface Props {
    children: ReactNode;
    title?: string;
    bgColor?: string
}

export default function UserLayout({ children, title = 'Kólà - African Myths & Stories', bgColor }: Props) {
    return (
        <>
            <Head title={title} />
            <div className="relative flex min-h-screen w-full flex-col  overflow-x-hidden">
                <div className="r flex h-full grow flex-col">
                    <div className="flex flex-1 justify-center py-1">
                        <main className={`layout-content-container flex flex-col w-full flex-1 bg-[var(--color-green-dark)]`}>
                            <NavBar />
                            {children}
                            <Footer />
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}