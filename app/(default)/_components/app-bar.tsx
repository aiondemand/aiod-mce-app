import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";
import Image from "next/image";
import UserButton from "./user-button";


const AppBar = () => {
    return <div className="flex items-center justify-between pe-6">
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

        </Link>

        <UserButton />
    </div>
}

export default AppBar;