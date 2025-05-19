import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import React from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";
import { LogOutIcon } from "lucide-react";
import UserButton from "./user-button";
import { NavLinks } from "./nav-links";

export const navItems = [
    {
        label: "Core Research",
        items: [
            {
                label: "Data Sets",
                url: "/my-assets/datasets"
            },
            {
                label: "ML Models",
                url: "/my-assets/ml_models"
            },
            {
                label: "Computational Assets",
                url: "/my-assets/computational_assets"
            },
            {
                label: "Service",
                url: "/my-assets/services"
            },
            {
                label: "Experiments",
                url: "/my-assets/experiments"
            },
            {
                label: "Publications",
                url: "/my-assets/publications"
            },
            {
                label: "Case Studies",
                url: "/my-assets/case_studies"
            }
        ]
    },
    {
        label: "News & Events",
        items: [
            {
                label: "News",
                url: "/my-assets/news"
            },
            {
                label: "Events",
                url: "/my-assets/events"
            }
        ]
    },
    {
        label: "Educational Resources",
        url: "/my-assets/educational_resources"
    },
    {
        label: "Supporting Context",
        items: [
            {
                label: "Organisations",
                url: "/my-assets/organisations"
            },
            {
                label: "Persons",
                url: "/my-assets/persons"
            },
            {
                label: "Projects",
                url: "/my-assets/projects"
            },
            {
                label: "Platforms",
                url: "/my-assets/platforms"
            }
        ]
    }
]

const AppSidebar: React.FC = () => {

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
                            src={`${process.env.BASEPATH}/logo-white.png`}
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
            <NavLinks
                navItems={navItems}
            />
        </SidebarContent>

        <SidebarFooter>
            <UserButton />
        </SidebarFooter>
    </Sidebar>;
};

export default AppSidebar;
