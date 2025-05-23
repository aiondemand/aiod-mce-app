import { cn } from "@/lib/utils";
import { GenericAsset } from "./utils";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

interface AssetCardProps {
    asset: GenericAsset;
    assetType: string;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, assetType }) => {

    return <Link
        href={`/my-assets/${assetType}/editor/${asset.identifier}`}
        className="relative cursor-pointer flex items-center justify-between px-4 py-2 border border-border rounded-full group hover:bg-secondary transition-colors">
        {asset.name}
        <div className={cn(
            "text-xs px-4 py-1 rounded-full",
            asset.aiod_entry?.status === "draft" && "bg-gray-700",
            asset.aiod_entry?.status === "published" && "bg-green-800",
            asset.aiod_entry?.status === "rejected" && "bg-red-800"
        )}>
            {asset.aiod_entry?.status}
        </div>
        <div className="hidden group-hover:flex absolute -left-6 top-0 items-center h-full">
            <PencilIcon className="size-4 text-muted-foreground" />
        </div>
    </Link>

}