"use client"

import { Button } from "@/components/ui/button";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginButton() {
    return <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <Button onClick={() => signIn("keycloak")}>
                    <LogIn />
                    Log in
                </Button>
            </SidebarMenuButton>
        </SidebarMenuItem>
    </SidebarMenu>
}