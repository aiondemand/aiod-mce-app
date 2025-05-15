import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import React from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";
import { ChevronRight, LogOutIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import UserButton from "./user-button";

const AppSidebar: React.FC = () => {
    const navItems = [
        {
            label: "Core Research",
            items: [
                {
                    label: "Data Sets",
                    url: "/"
                },
                {
                    label: "ML Models",
                    url: "/"
                },
                {
                    label: "Software / Service",
                    url: "/"
                },
                {
                    label: "Experiments",
                    url: "/"
                },
                {
                    label: "Publications",
                    url: "/"
                },
                {
                    label: "Case Studies",
                    url: "/"
                }
            ]
        },
        {
            label: "News & Events",
            url: "/"
        },
        {
            label: "Educational Resources",
            url: "/"
        },
        {
            label: "Supporting Context",
            items: [
                {
                    label: "Organisations",
                    url: "/"
                },
                {
                    label: "Persons",
                    url: "/"
                },
                {
                    label: "Projects",
                    url: "/"
                },
                {
                    label: "Platforms",
                    url: "/"
                }
            ]
        }
    ]


    return <Sidebar>
        <SidebarHeader>
            <Link href="/"
                className="flex items-center gap-2 justify-between"
            >
                <span className="w-[150px]">
                    <AspectRatio
                        ratio={3508 / 2241}
                    >
                        <Image
                            src="/logo-white.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />

                    </AspectRatio>
                </span>
                <span className="pe-4 ">
                    <LogOutIcon className="size-4 text-secondary-foreground rotate-180" />
                </span>
            </Link>
        </SidebarHeader>
        <SidebarContent className="gap-0">
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
                                    className="text-base h-auto px-6 py-4 font-jura text-sidebar-foreground bg-secondary rounded-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                >
                                    <Link
                                        href={item.url}
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
                                                    className="mt-[2px] text-sm h-auto px-6 py-4 font-sans text-sidebar-foreground rounded-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground opacity-80"
                                                >
                                                    <Link href={item.url}>
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
            })}

        </SidebarContent>

        <SidebarFooter>
            <UserButton />
        </SidebarFooter>
    </Sidebar>;
};

export default AppSidebar;
