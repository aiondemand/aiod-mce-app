'use client'


import React, { useState } from 'react'
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Info, AlertTriangle, ExternalLink } from 'lucide-react';
import { ErrorAlert } from '@/components/error-alert';
import { removePlural, supportedAssetTypes } from './utils';
import AssetTypeSection from './asset-type-section';
import { Input } from '@/components/ui/input';
import LogoutClient from '@/components/logout-client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const MyAssets = () => {
    const [search, setSearch] = useState("");

    const trpc = useTRPC();
    const { data, isLoading, error } = useQuery(
        trpc.resources.get.queryOptions(),
    );


    if (isLoading) return <div className="flex items-center justify-center grow">
        <Loader2 className="size-6 animate-spin me-4" />
        Loading resources...
    </div>


    if (error) {
        if (error?.message === 'UNAUTHORIZED') {
            return <LogoutClient />
        }
        return <div className="flex items-center justify-center grow">
            <ErrorAlert
                title="Error loading resources"
                description={error?.message ?? 'Unknown error'}
            />
        </div>
    }

    const hasSearchResults = () => {
        for (const key in data?.assets) {
            if (data?.assets[key].filter((asset) => asset.name?.toLowerCase().includes(search.toLowerCase())).length > 0) {
                return true;
            }
        }
        return false;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 mt-4">
                <h1 className="text-2xl font-bold font-jura">
                    My Assets
                </h1>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="rounded-full hover:bg-muted"
                            aria-label="Information about this app"
                        >
                            <Info className="h-4 w-4" />
                            Information about this app
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[480px] p-4 bg-muted" align="end">
                        <div className="space-y-3 text-sm">
                            <div>
                                <h3 className="font-semibold mb-2">About This App</h3>
                                <p className="leading-relaxed">
                                    This app provides a user-friendly interface for interacting with the AI on Demand Metadata Catalogue API.
                                    It is designed to make it easier to manage assets without requiring any coding or technical expertise.
                                </p>
                            </div>

                            <div>
                                <p className="leading-relaxed">
                                    Please note that the app does not support all API features. Its purpose is to let you view, create, edit, and delete assets that you own in the metadata catalogue.
                                </p>
                            </div>

                            <div>
                                <p className="leading-relaxed">
                                    Before creating a new asset, please check whether it already exists in{' '}
                                    <a
                                        href="https://mylibrary.aiod.eu"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:underline inline-flex items-center gap-1"
                                    >
                                        myLibrary
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                    . Some assets (e.g. from Hugging Face) may have been automatically imported into the catalogue, or may have been added by other contributors.
                                </p>
                            </div>

                            <div className="flex gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-900">
                                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                                <p className="text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
                                    <strong>Note:</strong> You cannot upload assets like datasets directly here. This app only manages metadata and allows you to link existing resources.
                                </p>
                            </div>

                            <div className="pt-2 border-t">
                                <p className="text-xs text-muted-foreground">
                                    For more information, see the{' '}
                                    <a
                                        href="https://aiondemand.github.io/AIOD-rest-api/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:underline inline-flex items-center gap-1"
                                    >
                                        AIOD REST API documentation
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </p>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

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

            {search.length > 0 && (
                <>
                    <p className="text-sm text-muted-foreground">
                        Search results for: {search}
                    </p>
                    {!hasSearchResults() && (
                        <p className="text-lg text-center text-muted-foreground my-4 ">
                            No search results found.
                        </p>
                    )}
                </>
            )}


            <div className="space-y-8 pb-12">
                {supportedAssetTypes.map((assetType) => (
                    <AssetTypeSection
                        key={assetType}
                        assets={
                            search ? data?.assets?.[removePlural(assetType)]?.filter((asset) => asset.name.toLowerCase().includes(search.toLowerCase())) || [] :
                                data?.assets?.[removePlural(assetType)] || []}

                        assetType={assetType}
                        hideIfEmpty={search.length > 0}
                    />
                ))}
            </div>
        </div>
    )
}

export default MyAssets