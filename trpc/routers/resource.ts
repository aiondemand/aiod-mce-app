import { protectedProcedure, router } from '../init';

import logger from '@/lib/logger';
import { TRPCError } from '@trpc/server';
import { getMyAssets } from '@/lib/server/assets';



export const resourceRouter = router({
    get: protectedProcedure.query(async ({ ctx }) => {
        try {
            return await getMyAssets();
        } catch (error) {
            logger.error((error as Error).message);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch data from AIOD API',
            });
        }
    }),
});
