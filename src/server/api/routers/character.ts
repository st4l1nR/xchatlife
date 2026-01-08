import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

// Input schema matching frontend form with Prisma enum values
const createCharacterSchema = z.object({
  characterType: z.enum(["girl", "men", "trans"]),
  style: z.enum(["realistic", "anime"]),
  ethnicity: z.enum(["caucasian", "asian", "black", "latina", "arab"]),
  age: z.number().min(18).max(55),
  hairStyle: z.enum(["straight", "bangs", "curly", "bun", "short", "ponytail"]),
  hairColor: z.enum([
    "brunette",
    "blonde",
    "black",
    "redhead",
    "pink",
    "blue",
    "purple",
    "white",
    "multicolor",
  ]),
  eyeColor: z.enum(["brown", "blue", "green", "red", "yellow"]),
  bodyType: z.enum(["skinny", "athletic", "average", "curvy", "bbw"]),
  breastSize: z.enum(["small", "medium", "large", "extra_large"]),
  name: z.string().min(2).max(20),
  personality: z.enum([
    "nympho",
    "lover",
    "submissive",
    "dominant",
    "temptress",
    "innocent",
    "caregiver",
    "experimenter",
    "mean",
    "confidant",
    "shy",
    "queen",
  ]),
  relationship: z.enum([
    "stranger",
    "girlfriend",
    "sex_friend",
    "school_mate",
    "work_colleague",
    "wife",
    "mistress",
    "friend",
    "step_sister",
    "step_mom",
  ]),
  occupation: z.enum([
    "student",
    "dancer",
    "model",
    "stripper",
    "maid",
    "cam_girl",
    "boss",
    "babysitter",
    "pornstar",
    "streamer",
    "bartender",
    "tech_engineer",
    "lifeguard",
    "cashier",
    "massage_therapist",
    "teacher",
    "nurse",
    "secretary",
    "yoga_instructor",
    "fitness_coach",
  ]),
  kinks: z
    .array(
      z.enum([
        "daddy_dominance",
        "bondage",
        "spanking",
        "collar_leash",
        "punishment",
        "humiliation",
        "public_play",
        "roleplay",
        "anal_play",
        "oral_play",
        "cum_play",
        "creampie",
        "squirting",
        "dirty_talk",
        "breeding",
        "edging",
        "obedience",
        "control",
        "inexperienced",
        "shy_flirting",
        "playful_teasing",
        "cuddling",
        "slow_sensual",
        "hair_pulling",
      ]),
    )
    .min(1)
    .max(3),
  voice: z.string(),
  // Media URLs (R2 URLs)
  posterUrl: z.string().url(),
  videoUrl: z.string().url(),
});

// Helper to get mime type from URL
function getMimeTypeFromUrl(url: string): string {
  const extension = url.split(".").pop()?.toLowerCase().split("?")[0];
  const mimeTypes: Record<string, string> = {
    webp: "image/webp",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
  };
  return mimeTypes[extension ?? ""] ?? "application/octet-stream";
}

// Helper to extract key from R2 URL
function getKeyFromR2Url(url: string): string {
  const urlObj = new URL(url);
  // Remove leading slash and decode URL encoding
  return decodeURIComponent(urlObj.pathname.slice(1));
}

export const characterRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCharacterSchema)
    .mutation(async ({ ctx, input }) => {
      // Extract keys from R2 URLs
      const posterKey = getKeyFromR2Url(input.posterUrl);
      const videoKey = getKeyFromR2Url(input.videoUrl);

      // Create media records and character in a transaction
      const character = await ctx.db.$transaction(async (tx) => {
        // Create poster media record
        const posterMedia = await tx.media.create({
          data: {
            type: "image",
            key: posterKey,
            url: input.posterUrl,
            mimeType: getMimeTypeFromUrl(input.posterUrl),
          },
        });

        // Create video media record
        const videoMedia = await tx.media.create({
          data: {
            type: "video",
            key: videoKey,
            url: input.videoUrl,
            mimeType: getMimeTypeFromUrl(input.videoUrl),
          },
        });

        // Create the character with media relations
        const newCharacter = await tx.character.create({
          data: {
            name: input.name,
            gender: input.characterType,
            style: input.style,
            ethnicity: input.ethnicity,
            age: input.age,
            hairStyle: input.hairStyle,
            hairColor: input.hairColor,
            eyeColor: input.eyeColor,
            bodyType: input.bodyType,
            breastSize: input.breastSize,
            personality: input.personality,
            relationship: input.relationship,
            occupation: input.occupation,
            voice: input.voice,
            posterId: posterMedia.id,
            videoId: videoMedia.id,
            createdById: ctx.session.user.id,
            kinks: {
              create: input.kinks.map((kink) => ({ kink })),
            },
          },
        });

        return newCharacter;
      });

      return { success: true, characterId: character.id };
    }),
});
