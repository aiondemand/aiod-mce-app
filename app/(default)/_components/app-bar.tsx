import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";
import Image from "next/image";


const AppBar = () => {
    return <div>
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
    </div>
}

export default AppBar;