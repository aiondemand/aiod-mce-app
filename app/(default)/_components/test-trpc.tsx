'use client';

import { TaxonomyType } from '@/lib/server/types';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

const TestTRPC = () => {
    const trpc = useTRPC();
    const { data, isLoading, error } = useQuery(
        trpc.taxonomies.get.queryOptions({ taxonomyType: TaxonomyType.INDUSTRIAL_SECTORS }),
    );


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <div>TestTRPC:
        <pre>{JSON.stringify(data, null, 2)}</pre>
        {data?.length}</div>;
}

export default TestTRPC;