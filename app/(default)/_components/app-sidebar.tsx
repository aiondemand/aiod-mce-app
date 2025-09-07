import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import React from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";
import { LogOutIcon } from "lucide-react";
import UserButton from "./user-button";
import { NavLinks } from "./nav-links";
import { assetTypeToLabel } from "./utils";

const assetTypeToNavItem = (assetType: string) => {
    return {
        id: assetType,
        label: assetTypeToLabel(assetType),
        url: `/#${assetType}`
    }
}

export const navItems = [
    {
        id: "core_research",
        label: "Core Research",
        items: [
            assetTypeToNavItem("datasets"),
            assetTypeToNavItem("ml_models"),
            assetTypeToNavItem("computational_assets"),
            assetTypeToNavItem("services"),
            assetTypeToNavItem("experiments"),
            assetTypeToNavItem("publications"),
            assetTypeToNavItem("case_studies"),
        ]
    },
    {
        id: "news_and_events",
        label: "News & Events",
        items: [
            assetTypeToNavItem("news"),
            assetTypeToNavItem("events"),
        ]
    },
    {
        id: "educational_resources",
        label: assetTypeToLabel("educational_resources"),
        url: "/#educational_resources"
    },
    {
        id: "supporting_context",
        label: "Supporting Context",
        items: [
            assetTypeToNavItem("organisations"),
            assetTypeToNavItem("persons"),
            assetTypeToNavItem("projects"),
            assetTypeToNavItem("platforms"),
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
                            src={`${process.env.NEXT_PUBLIC_BASEPATH}/logo-white.png`}
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
