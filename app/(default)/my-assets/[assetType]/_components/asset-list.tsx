"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { AssetCard } from "./asset-card";
import { GenericAsset } from "./utils";
import { useState } from "react";
import { assetTypeToLabel } from "./utils";

interface AssetListProps {
    assetType: string;
    assets: Array<GenericAsset>;
}

export const AssetList: React.FC<AssetListProps> = ({ assetType, assets }) => {
    const [search, setSearch] = useState("");

    console.debug('assets', assets);

    const filteredAssets = assets.filter((asset) => {
        return asset.name.toLowerCase().includes(search.toLowerCase());
    });

    return <div>
        <div className="flex items-center justify-end gap-8">
            <Input
                placeholder="Search"
                className="rounded-full"
                disabled={assets.length < 1}
                value={search}
                onChange={(e) => {
                    const value = e.target.value.trim();
                    setSearch(value)
                }}
            />

            <Button
                className="rounded-full"
                asChild
            >
                <Link href={`/my-assets/${assetType}/editor/new`}>
                    <PlusIcon className="size-4 text-accent" />
                    Add {assetTypeToLabel(assetType)}
                </Link>
            </Button>
        </div>

        <div className="mt-8">
            {filteredAssets.length < 1 &&
                <div>
                    <div className="flex flex-col gap-8 justify-center items-center h-full py-8">
                        <p className="text-sm text-muted-foreground">No assets found in this with the current search.</p>
                        <Button
                            className="rounded-full"
                            asChild
                            variant="outline"
                        >
                            <Link href={`/my-assets/${assetType}/editor/new`}>
                                <PlusIcon className="size-4 text-accent" />
                                Add your first {assetTypeToLabel(assetType)}
                            </Link>
                        </Button>
                    </div>
                    <div className="flex justify-center items-center h-full py-8">

                    </div>
                </div>
            }

            <ul className="space-y-2">
                {filteredAssets.map((asset) => (
                    <li key={asset.identifier}>
                        <AssetCard
                            assetType={assetType}
                            asset={asset}
                        />
                    </li>
                ))}
            </ul>
        </div>


    </div>;
}