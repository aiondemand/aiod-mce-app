import { assetTypeToLabel } from "../../_components/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import AssetEditor from "./_components/asset-editor";
import DeleteAssetBtn from "./_components/delete-asset-btn";
import { getAsset } from "@/lib/server/assets";
import { ErrorAlert } from "@/components/error-alert";

interface PageProps {
    params: Promise<{ assetType: string, assetId: string }>
}

export default async function Page({ params }: PageProps) {
    const { assetType, assetId } = await params;

    const isNew = assetId === "new";

    let content: React.ReactNode;
    if (!isNew) {
        const assetResp = await getAsset(assetType, assetId);
        if (assetResp.error) {
            content = <div className="flex flex-col gap-2 items-center justify-center h-full mt-8">
                <ErrorAlert
                    title="Error loading asset"
                    description={assetResp.error}
                />
            </div>
        } else {
            content = <AssetEditor
                assetType={assetType}
                assetId={assetId}
                isNewAsset={isNew}
                asset={assetResp.asset}
            />
        }
    } else {
        content = <AssetEditor
            assetType={assetType}
            assetId={assetId}
            isNewAsset={isNew}
        />
    }

    return <>
        <Button variant="ghost"
            asChild>
            <Link href={`/my-assets/${assetType}`}>
                <ArrowLeftIcon className="w-4 h-4" />
                Back to asset list
            </Link>
        </Button>

        <div className="flex items-center gap-2 justify-between">
            <h1 className="text-2xl font-bold font-jura mt-4">
                {isNew ? "New " : "Edit "}
                <span className="text-secondary-foreground">
                    {assetTypeToLabel(assetType)}
                </span>
            </h1>
            {!isNew && <DeleteAssetBtn assetType={assetType} assetId={assetId} />}
        </div>
        {!isNew && <p className="text-xs text-muted-foreground font-jura px-4 bg-muted rounded-full w-fit mt-2">
            ID: <span className="font-bold">{assetId}</span>
        </p>}

        {content}
    </>
}