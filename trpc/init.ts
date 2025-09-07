import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { type Context } from './context'


const t = initTRPC.context<Context>().create({
  transformer: superjson,
});


export const router = t.router;
export const procedure = t.procedure;


// Auth middleware
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.token) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      ...ctx,
      token: ctx.token,
    },
  })
})

// Protected procedure
export const protectedProcedure = procedure.use(isAuthed)