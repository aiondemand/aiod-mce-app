"use client";

import { createAsset, updateAsset } from "@/lib/server/assets";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Resource } from "@/lib/server/types";
import { AssetEditorForm } from "./asset-editor-form";
import { Enums } from "@/lib/server/enums";
interface AssetEditorProps {
    assetType: string,
    assetId: string
    isNewAsset: boolean
    asset?: Resource
    enums: Enums
}

const AssetEditor: React.FC<AssetEditorProps> = (props) => {
    const router = useRouter();


    const [isPending, startTransition] = useTransition();

    const handleCreate = (asset: Resource) => {
        startTransition(async () => {
            const resp = await createAsset(props.assetType, asset);
            if (resp?.error) {
                toast.error(resp.error);
            } else {
                toast.success('Asset created successfully');
                router.replace(`/my-assets/${props.assetType}/editor/${resp.asset.identifier}`);
            }
        });
    }

    const handleUpdate = (asset: Resource) => {
        startTransition(async () => {
            const resp = await updateAsset(props.assetType, props.assetId, asset);
            if (resp?.error) {
                toast.error(resp.error);
            } else {
                toast.success('Asset updated successfully');
            }
        });
    }

    return <div
        className="mt-4"
    >
        <AssetEditorForm
            isPending={isPending}
            assetType={props.assetType}
            buttonText={props.isNewAsset ? 'Create' : 'Update'}
            onChange={props.isNewAsset ? handleCreate : handleUpdate}
            asset={props.asset}
            enums={props.enums}
        />
    </div>
};

export default AssetEditor;