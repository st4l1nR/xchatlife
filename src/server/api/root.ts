import { authRouter } from "@/server/api/routers/auth";
import { postRouter } from "@/server/api/routers/post";
import { characterRouter } from "@/server/api/routers/character";
import { storyRouter } from "@/server/api/routers/story";
import { reelRouter } from "@/server/api/routers/reel";
import { userRouter } from "@/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  character: characterRouter,
  story: storyRouter,
  reel: reelRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
