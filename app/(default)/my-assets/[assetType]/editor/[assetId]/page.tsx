import { fetchAllEnums } from "@/lib/server/enums";
import { assetTypeToLabel } from "../../_components/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import AssetEditor from "./_components/asset-editor";
import DeleteAssetBtn from "./_components/delete-asset-btn";

interface PageProps {
    params: Promise<{ assetType: string, assetId: string }>
}

export default async function Page({ params }: PageProps) {
    const { assetType, assetId } = await params;

    const enums = await fetchAllEnums();
    console.log(enums);

    const isNew = assetId === "new";

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
            <DeleteAssetBtn assetType={assetType} assetId={assetId} />
        </div>
        {!isNew && <p className="text-xs text-muted-foreground font-jura px-4 bg-muted rounded-full w-fit mt-2">
            ID: <span className="font-bold">{assetId}</span>
        </p>}

        <AssetEditor assetType={assetType} assetId={assetId} />
    </>
}