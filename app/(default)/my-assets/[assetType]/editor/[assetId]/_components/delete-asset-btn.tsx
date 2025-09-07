'use client'

import { TrashIcon } from "lucide-react";
import LoadingButton from "@/components/loading-button";
import { useTransition } from "react";
import { deleteAsset } from "@/lib/server/assets";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteAssetBtnProps {
    assetType: string,
    assetId: string
}

const DeleteAssetBtn: React.FC<DeleteAssetBtnProps> = (props) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this asset?")) {
            return;
        }
        startTransition(async () => {
            const resp = await deleteAsset(props.assetType, props.assetId);
            if (resp.error) {
                toast.error(resp.error);
            } else {
                toast.success('Asset deleted successfully');
                router.replace(`/`);
            }
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