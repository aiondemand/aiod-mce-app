import { protectedProcedure, router } from '../init';
import { z } from 'zod';

import logger from '@/lib/logger';
import { TRPCError } from '@trpc/server';
import { TaxonomyType } from '@/lib/server/types';
import { fetchTaxonomy } from '@/lib/server/taxonomies';



export const taxonomyRouter = router({
    get: protectedProcedure.input(z.object({
        taxonomyType: z.nativeEnum(TaxonomyType),
    })).query(async ({ input, ctx }) => {
        try {
            return await fetchTaxonomy(input.taxonomyType);
        } catch (error) {
            logger.error((error as Error).message);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch data from AIOD API',
            });
        }
    }),
});
