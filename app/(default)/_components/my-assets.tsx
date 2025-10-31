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
                                    This is a web interface for creating and editing AIoD resources via the AIoD Metadata Catalogue API.
                                </p>
                            </div>

                            <div>
                                <p className="leading-relaxed">
                                    Before adding new resources, please check whether they already exist in the{' '}
                                    <a
                                        href="https://mylibrary.aiod.eu"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:underline inline-flex items-center gap-1"
                                    >
                                        AI Catalogue
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                    . AIoD automatically indexes datasets from Hugging Face, Zenodo, and OpenML, and models from OpenML, so your resources may already be present.
                                </p>
                            </div>

                            <div className="flex gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-900">
                                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                                <p className="text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
                                    You cannot upload resources like datasets or models here, only register datasets hosted elsewhere, but you can use this app to manage metadata and link them to EU projects.
                                </p>
                            </div>

                            <div className="pt-2 border-t">
                                <p className="text-xs text-muted-foreground">
                                    <strong>Note:</strong> The AIoD API offers many more features than this app can support. If you want to automatically upload resources or provide more detailed information on them, please see the{' '}
                                    <a
                                        href="https://aiod.eu/metadata-catalogue-rest-api/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:underline inline-flex items-center gap-1"
                                    >
                                        AIOD API documentation
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
