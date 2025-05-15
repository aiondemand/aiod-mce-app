import { Skeleton } from "@/components/ui/skeleton";
import { AssetList } from "./asset-list";
import { ErrorAlert } from "@/components/error-alert";
import { getAssets } from "@/lib/server/assets";

interface AssetListLoaderProps {
    assetType: string;
}

export const AssetListLoader: React.FC<AssetListLoaderProps> = async ({ assetType }) => {
    const { assets, error } = await getAssets(assetType);


    if (error) {
        return <div className="flex justify-center items-center h-full py-8">
            <ErrorAlert
                title="Error loading assets"
                description={error}
            />
        </div>
    }

    return <AssetList
        assetType={assetType}
        assets={assets ?? []}
    />
}

export const AssetListLoaderSkeleton = () => {
    return <div>
        <div className="flex gap-4 justify-end">
            <Skeleton className="w-1/2 h-10" />
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