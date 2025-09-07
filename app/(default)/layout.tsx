import AppBar from "./_components/app-bar";

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex flex-col min-h-screen">
            <AppBar />
            <main className="grow px-6">
                {children}
            </main>
        </div>
    )

    /* return (
        <SidebarProvider>

            <AppSidebar />
            <SidebarInset>
       <div className="flex flex-col min-h-screen">
                    <AppBar />
                    <main className="grow">
                        {children}
                    </main>
                </div>
            </SidebarInset>
            <Toaster />
        </SidebarProvider>
    ); */
}
