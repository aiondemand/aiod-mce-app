'use client'


import React from 'react'
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { ErrorAlert } from '@/components/error-alert';

const MyAssets = () => {
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
        <div>
            MyAssets
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}

export default MyAssets