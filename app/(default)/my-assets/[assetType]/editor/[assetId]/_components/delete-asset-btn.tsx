'use client'

import { TrashIcon } from "lucide-react";
import LoadingButton from "@/components/loading-button";
import { useTransition } from "react";

interface DeleteAssetBtnProps {
    assetType: string,
    assetId: string
}

const DeleteAssetBtn: React.FC<DeleteAssetBtnProps> = (props) => {
    console.log('DeleteAssetBtn', props);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this asset?")) {
            return;
        }
        startTransition(async () => {
            alert('TODO: Delete asset');
            // await deleteAsset(props.assetType, props.assetId);
        });
    }

    return <LoadingButton
        variant="destructive"
        size="sm"
        isLoading={isPending}
        onClick={handleDelete}
    >
        <TrashIcon className="w-4 h-4" />
        Delete
    </LoadingButton>
};

export default DeleteAssetBtn;