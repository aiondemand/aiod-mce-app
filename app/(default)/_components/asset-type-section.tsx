import { Resource } from "@/lib/server/types";
import { assetTypeToLabel } from "./utils";

interface AssetTypeSectionProps {
    assetType: string;
    assets: Resource[];
}

const AssetTypeSection = ({ assetType, assets }: AssetTypeSectionProps) => {

    return (
        <div>
            <h2>Asset Type Section</h2>

            <p>{assets.length} {assetTypeToLabel(assetType)}</p>
            <pre>{JSON.stringify(assets, null, 2)}</pre>

        </div>
    )
}

export default AssetTypeSection;