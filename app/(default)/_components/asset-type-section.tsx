import { Resource } from "@/lib/server/types";
import { assetTypeToLabel, ensurePlural } from "./utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, PlusIcon } from "lucide-react";
import { AssetCard } from "./asset-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AssetTypeSectionProps {
    assetType: string;
    assets: Resource[];
    hideIfEmpty?: boolean;
}

const AssetTypeSection = ({ assetType, assets, hideIfEmpty = false }: AssetTypeSectionProps) => {

    if (hideIfEmpty && assets.length === 0) {
        return null;
    }

    return (
        <div>
            <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                    <button className="bg-secondary text-jura font-bold group flex w-full items-center justify-between gap-2 rounded-full px-4 py-1 text-left outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <h2 className="text-lg font-semibold">
                            {assetTypeToLabel(assetType)}
                        </h2>
                        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                            {assets.length}
                            <ChevronDown className="transition-transform duration-200 ease-out group-data-[state=open]:rotate-180 motion-reduce:transform-none motion-reduce:transition-none" />
                        </span>
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-2">
                    <div className="min-h-24">
                        <ul className="px-2 py-2">
                            {assets.map((asset, index) => (
                                <li key={asset.identifier}
                                    className="flex items-center gap-2 w-full"
                                >
                                    <Badge variant="secondary">
                                        {index + 1}
                                    </Badge>

                                    <div className="grow">
                                        <AssetCard
                                            assetType={assetType}
                                            asset={asset}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {
                            assets.length === 0 && (
                                <p className="text-sm text-muted-foreground mb-2 text-center py-6">
                                    No {assetTypeToLabel(assetType)} found
                                </p>
                            )
                        }
                    </div>

                    <div className="flex justify-center">
                        <Button
                            className="rounded-full"
                            asChild
                            variant="outline"
                        >
                            <Link href={`/my-assets/${ensurePlural(assetType)}/editor/new`}>
                                <PlusIcon className="size-4 text-accent" />
                                Add a new entry for {assetTypeToLabel(assetType)}
                            </Link>
                        </Button>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}

export default AssetTypeSection;