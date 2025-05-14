import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import React from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";
import { LogOutIcon } from "lucide-react";

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
        <SidebarContent>
            Nav items
        </SidebarContent>

        <SidebarFooter>
            user button
        </SidebarFooter>
    </Sidebar>;
};

export default AppSidebar;
