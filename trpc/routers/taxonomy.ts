import { protectedProcedure, router } from '../init';
import { z } from 'zod';
import { AiodAPI } from '@/lib/server/common';
import logger from '@/lib/logger';
import { TRPCError } from '@trpc/server';


const fetchSurveyDefinitionSchema = z.object({
    surveyKey: z.string(),
});

export const taxonomyRouter = router({
    get: protectedProcedure.input(fetchSurveyDefinitionSchema).query(async ({ input, ctx }) => {
        return { hello: 'world' };
        /* const url = `/v1/studies/${studyKey}/surveys/${input.surveyKey}`;

        try {
            const response = await CaseAPI.fetch<{
                survey: Survey | null;
            }>(url, ctx.token);
            return response;
        } catch (error) {
            logger.error((error as Error).message);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch data from CASE API',
            });
        } */
    }),
});
