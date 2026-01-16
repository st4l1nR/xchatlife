import { adminRouter } from "@/server/api/routers/admin";
import { affiliateRouter } from "@/server/api/routers/affiliate";
import { authRouter } from "@/server/api/routers/auth";
import { characterRouter } from "@/server/api/routers/character";
import { chatRouter } from "@/server/api/routers/chat";
import { optionsRouter } from "@/server/api/routers/options";
import { invitationRouter } from "@/server/api/routers/invitation";
import { imageRouter } from "@/server/api/routers/image";
import { mediaRouter } from "@/server/api/routers/media";
import { postRouter } from "@/server/api/routers/post";
import { privateContentRouter } from "@/server/api/routers/privateContent";
import { referralRouter } from "@/server/api/routers/referral";
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
  affiliate: affiliateRouter,
  auth: authRouter,
  character: characterRouter,
  chat: chatRouter,
  options: optionsRouter,
  invitation: invitationRouter,
  image: imageRouter,
  media: mediaRouter,
  post: postRouter,
  privateContent: privateContentRouter,
  referral: referralRouter,
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
