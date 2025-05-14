import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./_components/app-sidebar";
export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="min-h-screen">
                TODO
                {children}
            </main>
        </SidebarProvider>
    );
}
