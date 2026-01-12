import { adminRouter } from "@/server/api/routers/admin";
import { authRouter } from "@/server/api/routers/auth";
import { characterRouter } from "@/server/api/routers/character";
import { chatRouter } from "@/server/api/routers/chat";
import { invitationRouter } from "@/server/api/routers/invitation";
import { postRouter } from "@/server/api/routers/post";
import { storyRouter } from "@/server/api/routers/story";
import { reelRouter } from "@/server/api/routers/reel";
import { userRouter } from "@/server/api/routers/user";
import { roleRouter } from "@/server/api/routers/role";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  admin: adminRouter,
  auth: authRouter,
  character: characterRouter,
  chat: chatRouter,
  invitation: invitationRouter,
  post: postRouter,
  story: storyRouter,
  reel: reelRouter,
  user: userRouter,
  role: roleRouter,
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
