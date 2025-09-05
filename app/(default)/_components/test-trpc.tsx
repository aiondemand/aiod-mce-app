'use client';

import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

const TestTRPC = () => {
    const trpc = useTRPC();
    const { data, isLoading, error } = useQuery(
        trpc.taxonomies.get.queryOptions({ surveyKey: '123' }),
    );


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <div>TestTRPC: {data?.hello}</div>;
}

export default TestTRPC;