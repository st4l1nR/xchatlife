import { adminRouter } from "@/server/api/routers/admin";
import { affiliateRouter } from "@/server/api/routers/affiliate";
import { authRouter } from "@/server/api/routers/auth";
import { characterRouter } from "@/server/api/routers/character";
import { characterGenderRouter } from "@/server/api/routers/characterGender";
import { characterStyleRouter } from "@/server/api/routers/characterStyle";
import { characterEthnicityRouter } from "@/server/api/routers/characterEthnicity";
import { characterHairStyleRouter } from "@/server/api/routers/characterHairStyle";
import { characterHairColorRouter } from "@/server/api/routers/characterHairColor";
import { characterEyeColorRouter } from "@/server/api/routers/characterEyeColor";
import { characterBodyTypeRouter } from "@/server/api/routers/characterBodyType";
import { characterBreastSizeRouter } from "@/server/api/routers/characterBreastSize";
import { characterPersonalityRouter } from "@/server/api/routers/characterPersonality";
import { characterRelationshipRouter } from "@/server/api/routers/characterRelationship";
import { characterOccupationRouter } from "@/server/api/routers/characterOccupation";
import { chatRouter } from "@/server/api/routers/chat";
import { optionsRouter } from "@/server/api/routers/options";
import { financialCategoryRouter } from "@/server/api/routers/financialCategory";
import { financialTransactionRouter } from "@/server/api/routers/financialTransaction";
import { invitationRouter } from "@/server/api/routers/invitation";
import { imageRouter } from "@/server/api/routers/image";
import { mediaRouter } from "@/server/api/routers/media";
import { postRouter } from "@/server/api/routers/post";
import { privateContentRouter } from "@/server/api/routers/privateContent";
import { referralRouter } from "@/server/api/routers/referral";
import { storyRouter } from "@/server/api/routers/story";
import { reelRouter } from "@/server/api/routers/reel";
import { subscriptionRouter } from "@/server/api/routers/subscription";
import { ticketRouter } from "@/server/api/routers/ticket";
import { userRouter } from "@/server/api/routers/user";
import { roleRouter } from "@/server/api/routers/role";
import { visualNovelRouter } from "@/server/api/routers/visualNovel";
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
  characterGender: characterGenderRouter,
  characterStyle: characterStyleRouter,
  characterEthnicity: characterEthnicityRouter,
  characterHairStyle: characterHairStyleRouter,
  characterHairColor: characterHairColorRouter,
  characterEyeColor: characterEyeColorRouter,
  characterBodyType: characterBodyTypeRouter,
  characterBreastSize: characterBreastSizeRouter,
  characterPersonality: characterPersonalityRouter,
  characterRelationship: characterRelationshipRouter,
  characterOccupation: characterOccupationRouter,
  chat: chatRouter,
  options: optionsRouter,
  financialCategory: financialCategoryRouter,
  financialTransaction: financialTransactionRouter,
  invitation: invitationRouter,
  image: imageRouter,
  media: mediaRouter,
  post: postRouter,
  privateContent: privateContentRouter,
  referral: referralRouter,
  story: storyRouter,
  reel: reelRouter,
  subscription: subscriptionRouter,
  ticket: ticketRouter,
  user: userRouter,
  role: roleRouter,
  visualNovel: visualNovelRouter,
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
