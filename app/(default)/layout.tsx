import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./_components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <main className="min-h-screen">
                    {children}
                </main>
            </SidebarInset>
            <Toaster />
        </SidebarProvider>
    );
}
