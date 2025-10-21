import { protectedProcedure, router } from '../init';

import logger from '@/lib/logger';
import { TRPCError } from '@trpc/server';
import { getAssets, getMyAssets } from '@/lib/server/assets';
import z from 'zod';
import { Contact, contactSchema } from '@/lib/server/types';
import { AiodAPI } from '@/lib/server/common';



export const resourceRouter = router({
    get: protectedProcedure.query(async () => {
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


    getContact: protectedProcedure.input(z.object({
        contactId: z.string(),
    })).query(async ({ input, ctx }) => {
        try {
            return await AiodAPI.fetch<Contact>(`/contacts/${input.contactId}`, ctx.token);
        } catch (error) {
            logger.error((error as Error).message);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch data from AIOD API',
            });
        }
    }),

    saveContact: protectedProcedure.input(z.object({
        contactId: z.string().optional(),
        contact: contactSchema,
    })).mutation(async ({ input, ctx }) => {
        let url = '/contacts';
        if (input.contactId) url = `/contacts/${input.contactId}`;

        try {
            return await AiodAPI.fetch<{
                identifier?: string
            }>(url, ctx.token, {
                method: input.contactId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input.contact),
            });
        } catch (error) {
            logger.error((error as Error).message);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to save contact',
            });
        }
    }),

    getProjects: protectedProcedure
        .input(z.object({ limit: z.number().int().optional() }).optional())
        .query(async ({ input }) => {
            try {
                return await getAssets('projects', input?.limit ?? 1000, 0);
            }
            catch (error) {
                logger.error((error as Error).message);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to fetch projects from AIOD API',
                });
            }
        }),

    submitForReview: protectedProcedure.input(z.object({
        comment: z.string(),
        asset_identifiers: z.array(z.string()),
    })).mutation(async ({ input, ctx }) => {
        try {
            return await AiodAPI.fetch<{
                identifier?: string
            }>('/submissions', ctx.token, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            });
        } catch (error) {
            logger.error((error as Error).message);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to submit for review',
            });
        }
    }),
});
