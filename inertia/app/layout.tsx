import { Toaster } from "react-hot-toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return <>
        <Toaster
            position="top-center"
            reverseOrder={false}
        />
        {children}</>
}