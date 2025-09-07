import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, LogOut } from "lucide-react";
import LoginButton from "./login-button";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/login";
import logger from "@/lib/logger";

export default async function UserButton() {
    const session = await auth()
    //console.log(session)

    if (!session?.user) {
        return <LoginButton />
    }

    const user = {
        avatar: session.user.image,
        name: session.user.name,
        email: session.user.email
    }

    return (

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="lg"
                    variant="outline"
                    className="h-auto py-2 rounded-full "
                >
                    <Avatar className="h-8 w-8 rounded-full">
                        <AvatarImage src={user.avatar ?? ""} alt={user.name ?? ""} />
                        <AvatarFallback className="rounded-full">
                            {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user.name}</span>
                        <span className="truncate text-xs">{user.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                //side={"right"}
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-full">
                            <AvatarImage src={user.avatar ?? ""} alt={user.name ?? ""} />
                            <AvatarFallback className="rounded-full">
                                {user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name}</span>
                            <span className="truncate text-xs">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <form
                    action={async () => {
                        "use server"
                        logger.info("signing out")
                        await logout()
                    }}
                >
                    <DropdownMenuItem asChild>
                        <Button type="submit"
                            className="w-full"
                        >
                            <LogOut />
                            Log out
                        </Button>
                    </DropdownMenuItem>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}