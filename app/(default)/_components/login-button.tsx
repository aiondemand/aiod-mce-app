"use client"

import { login } from "@/actions/login";
import LoadingButton from "@/components/loading-button";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LogIn } from "lucide-react";
import { useTransition } from "react";

export default function LoginButton() {
    const [isPending, startTransition] = useTransition()

    const performLogin = () => {
        startTransition(async () => {
            await login()
        })
    }

    return <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <LoadingButton onClick={performLogin} isLoading={isPending}>
                    <LogIn />
                    Log in
                </LoadingButton>
            </SidebarMenuButton>
        </SidebarMenuItem>
    </SidebarMenu>
}