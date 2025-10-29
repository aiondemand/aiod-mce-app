import AppBar from "./_components/app-bar";

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex flex-col min-h-screen">
            <AppBar />
            <main className="px-6 flex flex-col grow">
                {children}
            </main>
        </div>
    )
}
