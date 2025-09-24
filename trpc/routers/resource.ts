import { protectedProcedure, router } from '../init';

import logger from '@/lib/logger';
import { TRPCError } from '@trpc/server';
import { getMyAssets } from '@/lib/server/assets';
import z from 'zod';
import { Contact, contactSchema } from '@/lib/server/types';
import { AiodAPI } from '@/lib/server/common';



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

    createContact: protectedProcedure.input(z.object({
        contact: contactSchema,
    })).mutation(async ({ input, ctx }) => {
        try {
            return await AiodAPI.fetch<Contact>(`/contacts`, ctx.token, {
                method: 'POST',
                body: JSON.stringify(input.contact),
            });
        } catch (error) {
            logger.error((error as Error).message);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch data from AIOD API',
            });
        }
    }),

    updateContact: protectedProcedure.input(z.object({
        contactId: z.string(),
        contact: contactSchema,
    })).mutation(async ({ input, ctx }) => {
        try {
            return await AiodAPI.fetch<Contact>(`/contacts/${input.contactId}`, ctx.token, {
                method: 'PUT',
                body: JSON.stringify(input.contact),
            });
        } catch (error) {
            logger.error((error as Error).message);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch data from AIOD API',
            });
        }
    }),

});
