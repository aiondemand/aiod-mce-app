"use client"

import { SidebarGroupContent } from "@/components/ui/sidebar";

import { CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { Collapsible } from "@/components/ui/collapsible";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";


interface NavItem {
    label: string;
    url?: string;
    items?: NavItem[];
}

export const NavLinks: React.FC<{ navItems: NavItem[] }> = ({ navItems }) => {
    const pathname = usePathname();


    return (
        <>
            {navItems.map((item) => {
                if (!item.items) {
                    return (
                        <SidebarMenu className="mb-[1px]"
                            key={item.label}
                        >
                            <SidebarMenuItem
                                className=""
                            >
                                <SidebarMenuButton
                                    asChild
                                    className={cn("text-base h-auto px-6 py-4 font-jura text-sidebar-foreground bg-secondary rounded-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", pathname.startsWith(item.url!) && "font-medium text-secondary-foreground underline underline-offset-4")}
                                >
                                    <Link
                                        href={item.url!}
                                    >{item.label}</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    )
                }

                return (
                    <Collapsible
                        key={item.label}
                        title={item.label}
                        defaultOpen
                        className="group/collapsible"
                    >
                        <SidebarGroup key={item.label}
                            className="mb-[1px] p-0"
                        >
                            <SidebarGroupLabel
                                asChild
                                className="group/label h-auto px-6 py-4 font-jura text-sidebar-foreground bg-secondary rounded-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            >
                                <CollapsibleTrigger>
                                    <span className="font-jura text-base">
                                        {item.label}
                                    </span>
                                    <ChevronRight className="text-secondary-foreground ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent className="">
                                    <SidebarMenu className="gap-0">
                                        {item.items.map((item) => (
                                            <SidebarMenuItem key={item.label}>
                                                <SidebarMenuButton asChild
                                                    className={cn("mt-[2px] text-sm h-auto px-6 py-4 font-sans text-sidebar-foreground rounded-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground opacity-80", pathname.startsWith(item.url!) && "font-medium text-secondary-foreground underline underline-offset-4")}
                                                >
                                                    <Link href={item.url!}>
                                                        {item.label}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                )
            })
            }
        </>
    )
}