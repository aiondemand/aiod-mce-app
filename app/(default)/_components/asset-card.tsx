import { cn } from "@/lib/utils";
import { GenericAsset } from "../my-assets/[assetType]/_components/utils";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { ensurePlural } from "@/app/(default)/_components/utils";

interface AssetCardProps {
    asset: GenericAsset;
    assetType: string;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, ...props }) => {
    const assetType = ensurePlural(props.assetType);

    return <Link
        href={`/my-assets/${assetType}/editor/${asset.identifier}`}
        className="relative cursor-pointer flex items-center justify-between px-4 py-2 border border-border rounded-full group hover:bg-secondary transition-colors flex-wrap">
        <span className="flex-1">
            {asset.name}
        </span>
        <div className={cn(
            "text-xs px-4 py-1 rounded-full ",
            asset.aiod_entry?.status === "draft" && "bg-gray-700",
            asset.aiod_entry?.status === "submitted" && "bg-sky-700",
            asset.aiod_entry?.status === "published" && "bg-green-800",
            asset.aiod_entry?.status === "rejected" && "bg-red-800"
        )}>
            <span className="hidden sm:inline">
                {asset.aiod_entry?.status}
            </span>
            <span className="inline sm:hidden">
                {asset.aiod_entry?.status.slice(0, 1).toUpperCase()}
            </span>
        </div>
        <div className="hidden group-hover:flex absolute -right-6 top-0 items-center h-full">
            <PencilIcon className="size-4 text-muted-foreground" />
        </div>
    </Link>

}