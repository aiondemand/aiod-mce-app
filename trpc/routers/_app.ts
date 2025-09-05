import { router, procedure } from '../init';
import { taxonomyRouter } from './taxonomy';
import { resourceRouter } from './resource';


export const appRouter = router({
  taxonomies: taxonomyRouter,
  resources: resourceRouter,

  // Example health check
  health: procedure.query(async () => {
    return { status: 'ok', timestamp: new Date() };
  }),
});

export type AppRouter = typeof appRouter;
