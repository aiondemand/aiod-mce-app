import { router, procedure } from '../init';
import { taxonomyRouter } from './taxonomy';
import { resourceRouter } from './resource';
import { geocodingRouter } from './geocoding';


export const appRouter = router({
  taxonomies: taxonomyRouter,
  resources: resourceRouter,
  geocoding: geocodingRouter,

  // Example health check
  health: procedure.query(async () => {
    return { status: 'ok', timestamp: new Date() };
  }),
});

export type AppRouter = typeof appRouter;
