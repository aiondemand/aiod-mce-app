import { Skeleton } from "@/components/ui/skeleton";
import { AssetList } from "./asset-list";

interface AssetListLoaderProps {
    assetType: string;
}

export const AssetListLoader: React.FC<AssetListLoaderProps> = async ({ assetType }) => {
    await new Promise(resolve => setTimeout(resolve, 4000));

    // TODO: fetch assets

    // TODO: show error if loading fails

    return <AssetList assetType={assetType} />
}

export const AssetListLoaderSkeleton = () => {
    return <div>
        <div className="flex gap-4 justify-end">
            <Skeleton className="w-1/2 h-10" />
            <Skeleton className="w-12 h-10" />
            <Skeleton className="size-10" />
        </div>
        <div className="space-y-2 py-2">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
        </div>
    </div>;
}