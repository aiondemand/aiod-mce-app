import { router, procedure } from '../init';
import { taxonomyRouter } from './taxonomy';

export const appRouter = router({
  taxonomies: taxonomyRouter,

  // Example health check
  health: procedure.query(async () => {
    return { status: 'ok', timestamp: new Date() };
  }),
});

export type AppRouter = typeof appRouter;
