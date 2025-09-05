'use client'


import React, { useState } from 'react'
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { ErrorAlert } from '@/components/error-alert';
import { removePlural, supportedAssetTypes } from './utils';
import AssetTypeSection from './asset-type-section';
import { Input } from '@/components/ui/input';

const MyAssets = () => {
    const [search, setSearch] = useState("");

    const trpc = useTRPC();
    const { data, isLoading, error } = useQuery(
        trpc.resources.get.queryOptions(),
    );


    if (isLoading) return <div className="flex items-center justify-center h-screen">
        <Loader2 className="size-6 animate-spin me-4" />
        Loading resources...
    </div>



    if (error) return <div className="flex items-center justify-center h-screen">
        <ErrorAlert
            title="Error loading resources"
            description={error?.message ?? 'Unknown error'}
        />
    </div>

    return (
        <div className="space-y-4 p-6">
            <h1 className="text-2xl font-bold font-jura mt-4">
                My Assets
            </h1>

            <div className="flex items-center justify-end gap-8">
                <Input
                    placeholder="Search"
                    className="rounded-full"
                    value={search}
                    onChange={(e) => {
                        const value = e.target.value.trim();
                        setSearch(value)
                    }}
                />


            </div>
            {supportedAssetTypes.map((assetType) => (
                <AssetTypeSection
                    key={assetType}
                    assets={
                        search ? data?.assets?.[removePlural(assetType)]?.filter((asset) => asset.name.toLowerCase().includes(search.toLowerCase())) || [] :
                            data?.assets?.[removePlural(assetType)] || []}

                    assetType={assetType}
                />
            ))}
        </div>
    )
}

export default MyAssets