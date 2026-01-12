import {
  PrismaClient,
  CharacterGender,
  CharacterStyle,
  MediaType,
} from "../generated/prisma";
import * as crypto from "crypto";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Password hashing function compatible with Better Auth (uses scrypt)
async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

const prisma = new PrismaClient();

// Target user email
const TARGET_USER_EMAIL = "stalinramosbw@gmail.com";

// Total characters to create
const TOTAL_CHARACTERS = 21;
const LIVE_CHARACTERS = 5;

// ============================================================================
// R2 Base URL - All assets are stored in R2
// ============================================================================

const R2_BASE_URL = process.env.R2_PUBLIC_URL;
if (!R2_BASE_URL) {
  throw new Error("R2_PUBLIC_URL environment variable is required for seeding");
}

// ============================================================================
// Variant Definitions
// ============================================================================

const VARIANT_DEFINITIONS = [
  {
    gender: CharacterGender.girl,
    style: CharacterStyle.realistic,
    name: "girl-realistic",
    label: "Realistic",
    imageKey: "seed/variants/girl-realistic.webp",
    imageUrl: `${R2_BASE_URL}/seed/variants/girl-realistic.webp`,
    imageMimeType: "image/webp",
    videoKey: "seed/variants/girl-realistic.mp4",
    videoUrl: `${R2_BASE_URL}/seed/variants/girl-realistic.mp4`,
    videoMimeType: "video/mp4",
    isActive: true,
  },
  {
    gender: CharacterGender.girl,
    style: CharacterStyle.anime,
    name: "girl-anime",
    label: "Anime",
    imageKey: "seed/variants/girl-anime.webp",
    imageUrl: `${R2_BASE_URL}/seed/variants/girl-anime.webp`,
    imageMimeType: "image/webp",
    videoKey: "seed/variants/girl-anime.mp4",
    videoUrl: `${R2_BASE_URL}/seed/variants/girl-anime.mp4`,
    videoMimeType: "video/mp4",
    isActive: true,
  },
  {
    gender: CharacterGender.trans,
    style: CharacterStyle.realistic,
    name: "trans-realistic",
    label: "Realistic",
    imageKey: "seed/variants/trans-realistic.jpg",
    imageUrl: `${R2_BASE_URL}/seed/variants/trans-realistic.jpg`,
    imageMimeType: "image/jpeg",
    videoKey: "seed/variants/trans-realistic.mp4",
    videoUrl: `${R2_BASE_URL}/seed/variants/trans-realistic.mp4`,
    videoMimeType: "video/mp4",
    isActive: true,
  },
  {
    gender: CharacterGender.trans,
    style: CharacterStyle.anime,
    name: "trans-anime",
    label: "Anime",
    imageKey: "seed/variants/trans-anime.jpg",
    imageUrl: `${R2_BASE_URL}/seed/variants/trans-anime.jpg`,
    imageMimeType: "image/jpeg",
    videoKey: "seed/variants/trans-anime.mp4",
    videoUrl: `${R2_BASE_URL}/seed/variants/trans-anime.mp4`,
    videoMimeType: "video/mp4",
    isActive: false, // Coming soon
  },
] as const;

// ============================================================================
// Helper function to get or create Media record
// ============================================================================

async function getOrCreateMedia(key: string, url: string, type: MediaType, mimeType: string): Promise<string> {
  const media = await prisma.media.upsert({
    where: { key },
    update: { url, mimeType },
    create: { type, key, url, mimeType },
  });
  return media.id;
}

// Helper to determine mime type from URL
function getMimeType(url: string): string {
  if (url.endsWith('.png')) return 'image/png';
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
  if (url.endsWith('.webp')) return 'image/webp';
  if (url.endsWith('.mp4')) return 'video/mp4';
  if (url.endsWith('.webm')) return 'video/webm';
  return 'application/octet-stream';
}

// Helper to extract key from URL
function getKeyFromUrl(url: string): string {
  // URL format: https://domain.com/seed/options/personality/nympho.png
  // Key format: seed/options/personality/nympho.png
  const match = url.match(/\/(seed\/.+)$/);
  return match?.[1] ?? url;
}

// ============================================================================
// Universal Options (same for all variants) - Using R2 URLs
// ============================================================================

// Personality options - with images from R2
const PERSONALITY_DATA = [
  { name: "nympho", label: "Nympho", imageUrl: `${R2_BASE_URL}/seed/options/personality/nympho.png` },
  { name: "lover", label: "Lover", imageUrl: `${R2_BASE_URL}/seed/options/personality/lover.png` },
  { name: "submissive", label: "Submissive", imageUrl: `${R2_BASE_URL}/seed/options/personality/submissive.png` },
  { name: "dominant", label: "Dominant", imageUrl: `${R2_BASE_URL}/seed/options/personality/dominant.png` },
  { name: "temptress", label: "Temptress", imageUrl: `${R2_BASE_URL}/seed/options/personality/temptress.png` },
  { name: "innocent", label: "Innocent", imageUrl: `${R2_BASE_URL}/seed/options/personality/innocent.png` },
  { name: "caregiver", label: "Caregiver", imageUrl: `${R2_BASE_URL}/seed/options/personality/caregiver.png` },
  { name: "experimenter", label: "Experimenter", imageUrl: `${R2_BASE_URL}/seed/options/personality/experimenter.png` },
  { name: "mean", label: "Mean", imageUrl: `${R2_BASE_URL}/seed/options/personality/mean.png` },
  { name: "confidant", label: "Confidant", imageUrl: `${R2_BASE_URL}/seed/options/personality/confidant.png` },
  { name: "shy", label: "Shy", imageUrl: `${R2_BASE_URL}/seed/options/personality/shy.png` },
  { name: "queen", label: "Queen", imageUrl: `${R2_BASE_URL}/seed/options/personality/queen.png` },
];

// Relationship options - with images from R2
const RELATIONSHIP_DATA = [
  { name: "stranger", label: "Stranger", imageUrl: `${R2_BASE_URL}/seed/options/relationship/stranger.png` },
  { name: "girlfriend", label: "Girlfriend", imageUrl: `${R2_BASE_URL}/seed/options/relationship/girlfriend.png` },
  { name: "sex_friend", label: "Sex Friend", imageUrl: `${R2_BASE_URL}/seed/options/relationship/sex_friend.png` },
  { name: "school_mate", label: "School Mate", imageUrl: `${R2_BASE_URL}/seed/options/relationship/school_mate.png` },
  { name: "work_colleague", label: "Work Colleague", imageUrl: `${R2_BASE_URL}/seed/options/relationship/work_colleague.png` },
  { name: "wife", label: "Wife", imageUrl: `${R2_BASE_URL}/seed/options/relationship/wife.png` },
  { name: "mistress", label: "Mistress", imageUrl: `${R2_BASE_URL}/seed/options/relationship/mistress.png` },
  { name: "friend", label: "Friend", imageUrl: `${R2_BASE_URL}/seed/options/relationship/friend.png` },
  { name: "step_sister", label: "Step Sister", imageUrl: `${R2_BASE_URL}/seed/options/relationship/step_sister.png` },
  { name: "step_mom", label: "Step Mom", imageUrl: `${R2_BASE_URL}/seed/options/relationship/step_mom.png` },
  { name: "step_daughter", label: "Step Daughter", imageUrl: `${R2_BASE_URL}/seed/options/relationship/step_daughter.png` },
  { name: "landlord", label: "Landlord", imageUrl: `${R2_BASE_URL}/seed/options/relationship/landlord.png` },
  { name: "sugar_baby", label: "Sugar Baby", imageUrl: `${R2_BASE_URL}/seed/options/relationship/sugar_baby.png` },
  { name: "boss", label: "Boss", imageUrl: `${R2_BASE_URL}/seed/options/relationship/boss.png` },
  { name: "teacher", label: "Teacher", imageUrl: `${R2_BASE_URL}/seed/options/relationship/teacher.png` },
  { name: "student", label: "Student", imageUrl: `${R2_BASE_URL}/seed/options/relationship/student.png` },
  { name: "neighbour", label: "Neighbour", imageUrl: `${R2_BASE_URL}/seed/options/relationship/neighbour.png` },
  { name: "mother_in_law", label: "Mother-In-Law", imageUrl: `${R2_BASE_URL}/seed/options/relationship/mother_in_law.png` },
  { name: "sister_in_law", label: "Sister-In-Law", imageUrl: `${R2_BASE_URL}/seed/options/relationship/sister_in_law.png` },
];

// Occupation options - with emojis
const OCCUPATION_DATA = [
  { name: "student", label: "Student", emoji: "🎓" },
  { name: "dancer", label: "Dancer", emoji: "💃" },
  { name: "model", label: "Model", emoji: "👗" },
  { name: "stripper", label: "Stripper", emoji: "🩲" },
  { name: "maid", label: "Maid", emoji: "🧹" },
  { name: "cam_girl", label: "Cam Girl", emoji: "📷" },
  { name: "boss", label: "Boss / CEO", emoji: "🏢" },
  { name: "babysitter", label: "Babysitter / Au Pair", emoji: "🍼" },
  { name: "pornstar", label: "Pornstar", emoji: "🎥" },
  { name: "streamer", label: "Streamer", emoji: "🎮" },
  { name: "bartender", label: "Bartender", emoji: "🍸" },
  { name: "tech_engineer", label: "Tech Engineer", emoji: "💻" },
  { name: "lifeguard", label: "Lifeguard", emoji: "🏖️" },
  { name: "cashier", label: "Cashier", emoji: "💵" },
  { name: "massage_therapist", label: "Massage Therapist", emoji: "💆" },
  { name: "teacher", label: "Teacher", emoji: "👩‍🏫" },
  { name: "nurse", label: "Nurse", emoji: "💉" },
  { name: "secretary", label: "Secretary", emoji: "📋" },
  { name: "yoga_instructor", label: "Yoga Instructor", emoji: "🧘" },
  { name: "fitness_coach", label: "Fitness Coach", emoji: "🏋️" },
];

// Kinks options - text only
const KINK_DATA = [
  { name: "daddy_dominance", label: "Daddy Dominance" },
  { name: "bondage", label: "Bondage" },
  { name: "spanking", label: "Spanking" },
  { name: "collar_leash", label: "Collar & Leash" },
  { name: "punishment", label: "Punishment" },
  { name: "humiliation", label: "Humiliation" },
  { name: "public_play", label: "Public Play" },
  { name: "roleplay", label: "Roleplay" },
  { name: "anal_play", label: "Anal Play" },
  { name: "oral_play", label: "Oral Play" },
  { name: "cum_play", label: "Cum Play" },
  { name: "creampie", label: "Creampie" },
  { name: "squirting", label: "Squirting" },
  { name: "dirty_talk", label: "Dirty Talk" },
  { name: "breeding", label: "Breeding" },
  { name: "edging", label: "Edging" },
  { name: "obedience", label: "Obedience" },
  { name: "control", label: "Control" },
  { name: "inexperienced", label: "Inexperienced" },
  { name: "shy_flirting", label: "Shy Flirting" },
  { name: "playful_teasing", label: "Playful Teasing" },
  { name: "cuddling", label: "Cuddling" },
  { name: "slow_sensual", label: "Slow & Sensual" },
  { name: "hair_pulling", label: "Hair Pulling" },
];

// ============================================================================
// Variant-Specific Options (different images per variant) - Using R2 URLs
// ============================================================================

// Ethnicity options per variant
const ETHNICITY_DATA: { name: string; label: string; variantName: string; imageUrl: string; videoUrl?: string }[] = [
  // girl-realistic
  { name: "caucasian", label: "Caucasian", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/caucasian.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/caucasian.mp4` },
  { name: "asian", label: "Asian", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/asian.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/asian.mp4` },
  { name: "black", label: "Black / Afro", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/black.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/black.mp4` },
  { name: "latina", label: "Latina", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/latina.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/latina.mp4` },
  { name: "arab", label: "Arab", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/arab.jpg`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/arab.mp4` },
  // girl-anime
  { name: "caucasian", label: "Caucasian", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/ethnicity/caucasian.webp`, videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/ethnicity/caucasian.mp4` },
  { name: "asian", label: "Asian", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/ethnicity/asian.webp`, videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/ethnicity/asian.mp4` },
  { name: "latina", label: "Latina", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/ethnicity/latina.webp`, videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/ethnicity/latina.mp4` },
  // trans-realistic
  { name: "caucasian", label: "Caucasian", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/ethnicity/caucasian.png` },
  { name: "asian", label: "Asian", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/ethnicity/asian.png` },
  { name: "latina", label: "Latina", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/ethnicity/latina.png` },
];

// Hair Style options per variant
const HAIR_STYLE_DATA: { name: string; label: string; variantName: string; imageUrl: string; videoUrl?: string }[] = [
  // girl-realistic
  { name: "straight", label: "Straight", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/straight.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/straight.mp4` },
  { name: "bangs", label: "Bangs", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/bangs.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/bangs.mp4` },
  { name: "curly", label: "Curly", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/curly.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/curly.mp4` },
  { name: "bun", label: "Bun", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/bun.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/bun.mp4` },
  { name: "short", label: "Short", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/short.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/short.mp4` },
  { name: "ponytail", label: "Ponytail", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/ponytail.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/ponytail.mp4` },
  // girl-anime
  { name: "straight", label: "Straight", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/straight.webp`, videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/straight.mp4` },
  { name: "bangs", label: "Bangs", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/bangs.webp`, videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/bangs.mp4` },
  { name: "curly", label: "Curly", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/curly.webp`, videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/curly.mp4` },
  { name: "bun", label: "Bun", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/bun.webp`, videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/bun.mp4` },
  { name: "short", label: "Short", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/short.webp`, videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/short.mp4` },
  { name: "ponytail", label: "Ponytail", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/ponytail.webp`, videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/ponytail.mp4` },
  // trans-realistic (reuses girl-realistic URLs)
  { name: "straight", label: "Straight", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/straight.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/straight.mp4` },
  { name: "bangs", label: "Bangs", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/bangs.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/bangs.mp4` },
  { name: "curly", label: "Curly", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/curly.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/curly.mp4` },
  { name: "bun", label: "Bun", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/bun.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/bun.mp4` },
  { name: "short", label: "Short", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/short.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/short.mp4` },
  { name: "ponytail", label: "Ponytail", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/ponytail.png`, videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/ponytail.mp4` },
];

// Hair Color options per variant
const HAIR_COLOR_DATA: { name: string; label: string; variantName: string; imageUrl: string; videoUrl?: string }[] = [
  // girl-realistic
  { name: "brunette", label: "Brunette", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/brunette.png` },
  { name: "blonde", label: "Blonde", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/blonde.png` },
  { name: "black", label: "Black", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/black.png` },
  { name: "redhead", label: "Redhead", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/redhead.png` },
  { name: "pink", label: "Pink", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/pink.png` },
  // girl-anime
  { name: "black", label: "Black", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/black.webp` },
  { name: "blonde", label: "Blonde", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/blonde.webp` },
  { name: "blue", label: "Blue", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/blue.webp` },
  { name: "multicolor", label: "Multicolor", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/multicolor.webp` },
  { name: "pink", label: "Pink", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/pink.webp` },
  { name: "purple", label: "Purple", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/purple.webp` },
  { name: "redhead", label: "Redhead", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/redhead.webp` },
  { name: "white", label: "White", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/white.webp` },
  // trans-realistic (reuses girl-realistic URLs)
  { name: "brunette", label: "Brunette", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/brunette.png` },
  { name: "blonde", label: "Blonde", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/blonde.png` },
  { name: "black", label: "Black", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/black.png` },
  { name: "redhead", label: "Redhead", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/redhead.png` },
  { name: "pink", label: "Pink", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/pink.png` },
];

// Eye Color options per variant
const EYE_COLOR_DATA: { name: string; label: string; variantName: string; imageUrl: string; videoUrl?: string }[] = [
  // girl-realistic
  { name: "brown", label: "Brown", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/eye-color/brown.png` },
  { name: "blue", label: "Blue", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/eye-color/blue.png` },
  { name: "green", label: "Green", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/eye-color/green.png` },
  // girl-anime
  { name: "brown", label: "Brown", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/eye-color/brown.webp` },
  { name: "blue", label: "Blue", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/eye-color/blue.webp` },
  { name: "green", label: "Green", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/eye-color/green.webp` },
  { name: "red", label: "Red", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/eye-color/red.webp` },
  { name: "yellow", label: "Yellow", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/eye-color/yellow.webp` },
  // trans-realistic (reuses girl-realistic URLs)
  { name: "brown", label: "Brown", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/eye-color/brown.png` },
  { name: "blue", label: "Blue", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/eye-color/blue.png` },
  { name: "green", label: "Green", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/eye-color/green.png` },
];

// Body Type options per variant
const BODY_TYPE_DATA: { name: string; label: string; variantName: string; imageUrl: string; videoUrl?: string }[] = [
  // girl-realistic
  { name: "skinny", label: "Skinny", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/body-type/skinny.png` },
  { name: "athletic", label: "Athletic", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/body-type/athletic.png` },
  { name: "average", label: "Average", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/body-type/average.png` },
  { name: "curvy", label: "Curvy", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/body-type/curvy.png` },
  { name: "bbw", label: "BBW", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/body-type/bbw.png` },
  // girl-anime (no BBW)
  { name: "skinny", label: "Skinny", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/body-type/skinny.webp` },
  { name: "athletic", label: "Athletic", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/body-type/athletic.webp` },
  { name: "average", label: "Average", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/body-type/average.webp` },
  { name: "curvy", label: "Curvy", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/body-type/curvy.webp` },
  // trans-realistic
  { name: "skinny", label: "Skinny", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/body-type/skinny.png` },
  { name: "athletic", label: "Athletic", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/body-type/athletic.png` },
  { name: "average", label: "Average", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/body-type/average.png` },
  { name: "curvy", label: "Curvy", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/body-type/curvy.png` },
  { name: "bbw", label: "BBW", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/body-type/bbw.png` },
];

// Breast Size options per variant
const BREAST_SIZE_DATA: { name: string; label: string; variantName: string; imageUrl: string; videoUrl?: string }[] = [
  // girl-realistic
  { name: "small", label: "Small", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/small.png` },
  { name: "medium", label: "Medium", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/medium.png` },
  { name: "large", label: "Large", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/large.png` },
  { name: "extra_large", label: "Extra Large", variantName: "girl-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/extra_large.png` },
  // girl-anime
  { name: "small", label: "Small", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/breast-size/small.webp` },
  { name: "medium", label: "Medium", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/breast-size/medium.webp` },
  { name: "large", label: "Large", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/breast-size/large.webp` },
  { name: "extra_large", label: "Extra Large", variantName: "girl-anime", imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/breast-size/extra_large.webp` },
  // trans-realistic (reuses girl-realistic URLs)
  { name: "small", label: "Small", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/small.png` },
  { name: "medium", label: "Medium", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/medium.png` },
  { name: "large", label: "Large", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/large.png` },
  { name: "extra_large", label: "Extra Large", variantName: "trans-realistic", imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/extra_large.png` },
];

// ============================================================================
// Helper Functions
// ============================================================================

// Helper to get random item from array
function getRandomItem<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);
  const item = array[index];
  if (item === undefined) {
    throw new Error("Array is empty or index out of bounds");
  }
  return item;
}

// Helper to get random items from array (for kinks)
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Character name generator
const firstNames = [
  "Luna",
  "Aria",
  "Mia",
  "Sophia",
  "Emma",
  "Olivia",
  "Ava",
  "Isabella",
  "Chloe",
  "Lily",
  "Zoe",
  "Emily",
  "Scarlett",
  "Madison",
  "Layla",
  "Victoria",
  "Penelope",
  "Riley",
  "Nora",
  "Stella",
  "Hazel",
];

function generateCharacterName(): string {
  return getRandomItem(firstNames);
}

// Voice options
const voiceOptions = [
  "soft",
  "sultry",
  "playful",
  "confident",
  "shy",
  "cheerful",
  "mysterious",
];

// ============================================================================
// Seed Option Tables
// ============================================================================

// Map key format: "variantName:optionName" -> id (for variant-specific options)
// Map key format: "optionName" -> id (for universal options)
type OptionMap = Map<string, string>;

async function seedVariants(): Promise<Map<string, string>> {
  console.log("Seeding character variants...");
  const variantMap = new Map<string, string>();

  for (let i = 0; i < VARIANT_DEFINITIONS.length; i++) {
    const v = VARIANT_DEFINITIONS[i]!;

    // Create or find Media record for image
    const imageMedia = await prisma.media.upsert({
      where: { key: v.imageKey },
      update: {
        url: v.imageUrl,
        mimeType: v.imageMimeType,
      },
      create: {
        type: MediaType.image,
        key: v.imageKey,
        url: v.imageUrl,
        mimeType: v.imageMimeType,
      },
    });

    // Create or find Media record for video
    const videoMedia = await prisma.media.upsert({
      where: { key: v.videoKey },
      update: {
        url: v.videoUrl,
        mimeType: v.videoMimeType,
      },
      create: {
        type: MediaType.video,
        key: v.videoKey,
        url: v.videoUrl,
        mimeType: v.videoMimeType,
      },
    });

    // Create or update variant with Media relations
    const variant = await prisma.character_variant.upsert({
      where: { name: v.name },
      update: {
        gender: v.gender,
        style: v.style,
        label: v.label,
        imageId: imageMedia.id,
        videoId: videoMedia.id,
        isActive: v.isActive,
        sortOrder: i,
      },
      create: {
        name: v.name,
        gender: v.gender,
        style: v.style,
        label: v.label,
        imageId: imageMedia.id,
        videoId: videoMedia.id,
        isActive: v.isActive,
        sortOrder: i,
      },
    });
    variantMap.set(v.name, variant.id);
    console.log(`  - Created variant ${v.name} with image (${imageMedia.id}) and video (${videoMedia.id})`);
  }

  console.log(`  - Created ${variantMap.size} character variants`);
  return variantMap;
}

async function seedOptionTables(variantMap: Map<string, string>): Promise<{
  ethnicities: OptionMap;
  hairStyles: OptionMap;
  hairColors: OptionMap;
  eyeColors: OptionMap;
  bodyTypes: OptionMap;
  breastSizes: OptionMap;
  personalities: OptionMap;
  relationships: OptionMap;
  occupations: OptionMap;
  kinks: OptionMap;
}> {
  console.log("Seeding option tables...");

  // ============================================================================
  // Universal Options (same for all variants)
  // ============================================================================

  // Seed personalities (with images)
  const personalities = new Map<string, string>();
  for (let i = 0; i < PERSONALITY_DATA.length; i++) {
    const data = PERSONALITY_DATA[i]!;
    // Create media record for image
    const imageId = await getOrCreateMedia(
      getKeyFromUrl(data.imageUrl),
      data.imageUrl,
      MediaType.image,
      getMimeType(data.imageUrl)
    );
    const option = await prisma.personality_option.upsert({
      where: { name: data.name },
      update: { label: data.label, imageId, sortOrder: i },
      create: { name: data.name, label: data.label, imageId, sortOrder: i },
    });
    personalities.set(data.name, option.id);
  }
  console.log(`  - Created ${personalities.size} personality options`);

  // Seed relationships (with images)
  const relationships = new Map<string, string>();
  for (let i = 0; i < RELATIONSHIP_DATA.length; i++) {
    const data = RELATIONSHIP_DATA[i]!;
    // Create media record for image
    const imageId = await getOrCreateMedia(
      getKeyFromUrl(data.imageUrl),
      data.imageUrl,
      MediaType.image,
      getMimeType(data.imageUrl)
    );
    const option = await prisma.relationship_option.upsert({
      where: { name: data.name },
      update: { label: data.label, imageId, sortOrder: i },
      create: { name: data.name, label: data.label, imageId, sortOrder: i },
    });
    relationships.set(data.name, option.id);
  }
  console.log(`  - Created ${relationships.size} relationship options`);

  // Seed occupations (with emojis)
  const occupations = new Map<string, string>();
  for (let i = 0; i < OCCUPATION_DATA.length; i++) {
    const data = OCCUPATION_DATA[i]!;
    const option = await prisma.occupation_option.upsert({
      where: { name: data.name },
      update: { label: data.label, emoji: data.emoji, sortOrder: i },
      create: { name: data.name, label: data.label, emoji: data.emoji, sortOrder: i },
    });
    occupations.set(data.name, option.id);
  }
  console.log(`  - Created ${occupations.size} occupation options`);

  // Seed kinks (text only)
  const kinks = new Map<string, string>();
  for (let i = 0; i < KINK_DATA.length; i++) {
    const data = KINK_DATA[i]!;
    const option = await prisma.kink_option.upsert({
      where: { name: data.name },
      update: { label: data.label, sortOrder: i },
      create: { name: data.name, label: data.label, sortOrder: i },
    });
    kinks.set(data.name, option.id);
  }
  console.log(`  - Created ${kinks.size} kink options`);

  // ============================================================================
  // Variant-Specific Options (different images per variant)
  // ============================================================================

  // Seed ethnicities (per variant)
  const ethnicities = new Map<string, string>();
  for (let i = 0; i < ETHNICITY_DATA.length; i++) {
    const data = ETHNICITY_DATA[i]!;
    const variantId = variantMap.get(data.variantName);
    if (!variantId) {
      console.warn(`  - Skipping ethnicity ${data.name} for unknown variant ${data.variantName}`);
      continue;
    }
    // Create media records for image and video
    const imageId = await getOrCreateMedia(
      getKeyFromUrl(data.imageUrl),
      data.imageUrl,
      MediaType.image,
      getMimeType(data.imageUrl)
    );
    const videoId = data.videoUrl
      ? await getOrCreateMedia(
          getKeyFromUrl(data.videoUrl),
          data.videoUrl,
          MediaType.video,
          getMimeType(data.videoUrl)
        )
      : undefined;
    const option = await prisma.ethnicity_option.upsert({
      where: { name_variantId: { name: data.name, variantId } },
      update: { label: data.label, imageId, videoId, sortOrder: i },
      create: { name: data.name, label: data.label, variantId, imageId, videoId, sortOrder: i },
    });
    // Store with variant prefix for lookup
    ethnicities.set(`${data.variantName}:${data.name}`, option.id);
  }
  console.log(`  - Created ${ethnicities.size} ethnicity options`);

  // Seed hair styles (per variant)
  const hairStyles = new Map<string, string>();
  for (let i = 0; i < HAIR_STYLE_DATA.length; i++) {
    const data = HAIR_STYLE_DATA[i]!;
    const variantId = variantMap.get(data.variantName);
    if (!variantId) {
      console.warn(`  - Skipping hair style ${data.name} for unknown variant ${data.variantName}`);
      continue;
    }
    // Create media records for image and video
    const imageId = await getOrCreateMedia(
      getKeyFromUrl(data.imageUrl),
      data.imageUrl,
      MediaType.image,
      getMimeType(data.imageUrl)
    );
    const videoId = data.videoUrl
      ? await getOrCreateMedia(
          getKeyFromUrl(data.videoUrl),
          data.videoUrl,
          MediaType.video,
          getMimeType(data.videoUrl)
        )
      : undefined;
    const option = await prisma.hair_style_option.upsert({
      where: { name_variantId: { name: data.name, variantId } },
      update: { label: data.label, imageId, videoId, sortOrder: i },
      create: { name: data.name, label: data.label, variantId, imageId, videoId, sortOrder: i },
    });
    hairStyles.set(`${data.variantName}:${data.name}`, option.id);
  }
  console.log(`  - Created ${hairStyles.size} hair style options`);

  // Seed hair colors (per variant)
  const hairColors = new Map<string, string>();
  for (let i = 0; i < HAIR_COLOR_DATA.length; i++) {
    const data = HAIR_COLOR_DATA[i]!;
    const variantId = variantMap.get(data.variantName);
    if (!variantId) {
      console.warn(`  - Skipping hair color ${data.name} for unknown variant ${data.variantName}`);
      continue;
    }
    // Create media records for image and video
    const imageId = await getOrCreateMedia(
      getKeyFromUrl(data.imageUrl),
      data.imageUrl,
      MediaType.image,
      getMimeType(data.imageUrl)
    );
    const videoId = data.videoUrl
      ? await getOrCreateMedia(
          getKeyFromUrl(data.videoUrl),
          data.videoUrl,
          MediaType.video,
          getMimeType(data.videoUrl)
        )
      : undefined;
    const option = await prisma.hair_color_option.upsert({
      where: { name_variantId: { name: data.name, variantId } },
      update: { label: data.label, imageId, videoId, sortOrder: i },
      create: { name: data.name, label: data.label, variantId, imageId, videoId, sortOrder: i },
    });
    hairColors.set(`${data.variantName}:${data.name}`, option.id);
  }
  console.log(`  - Created ${hairColors.size} hair color options`);

  // Seed eye colors (per variant)
  const eyeColors = new Map<string, string>();
  for (let i = 0; i < EYE_COLOR_DATA.length; i++) {
    const data = EYE_COLOR_DATA[i]!;
    const variantId = variantMap.get(data.variantName);
    if (!variantId) {
      console.warn(`  - Skipping eye color ${data.name} for unknown variant ${data.variantName}`);
      continue;
    }
    // Create media records for image and video
    const imageId = await getOrCreateMedia(
      getKeyFromUrl(data.imageUrl),
      data.imageUrl,
      MediaType.image,
      getMimeType(data.imageUrl)
    );
    const videoId = data.videoUrl
      ? await getOrCreateMedia(
          getKeyFromUrl(data.videoUrl),
          data.videoUrl,
          MediaType.video,
          getMimeType(data.videoUrl)
        )
      : undefined;
    const option = await prisma.eye_color_option.upsert({
      where: { name_variantId: { name: data.name, variantId } },
      update: { label: data.label, imageId, videoId, sortOrder: i },
      create: { name: data.name, label: data.label, variantId, imageId, videoId, sortOrder: i },
    });
    eyeColors.set(`${data.variantName}:${data.name}`, option.id);
  }
  console.log(`  - Created ${eyeColors.size} eye color options`);

  // Seed body types (per variant)
  const bodyTypes = new Map<string, string>();
  for (let i = 0; i < BODY_TYPE_DATA.length; i++) {
    const data = BODY_TYPE_DATA[i]!;
    const variantId = variantMap.get(data.variantName);
    if (!variantId) {
      console.warn(`  - Skipping body type ${data.name} for unknown variant ${data.variantName}`);
      continue;
    }
    // Create media records for image and video
    const imageId = await getOrCreateMedia(
      getKeyFromUrl(data.imageUrl),
      data.imageUrl,
      MediaType.image,
      getMimeType(data.imageUrl)
    );
    const videoId = data.videoUrl
      ? await getOrCreateMedia(
          getKeyFromUrl(data.videoUrl),
          data.videoUrl,
          MediaType.video,
          getMimeType(data.videoUrl)
        )
      : undefined;
    const option = await prisma.body_type_option.upsert({
      where: { name_variantId: { name: data.name, variantId } },
      update: { label: data.label, imageId, videoId, sortOrder: i },
      create: { name: data.name, label: data.label, variantId, imageId, videoId, sortOrder: i },
    });
    bodyTypes.set(`${data.variantName}:${data.name}`, option.id);
  }
  console.log(`  - Created ${bodyTypes.size} body type options`);

  // Seed breast sizes (per variant)
  const breastSizes = new Map<string, string>();
  for (let i = 0; i < BREAST_SIZE_DATA.length; i++) {
    const data = BREAST_SIZE_DATA[i]!;
    const variantId = variantMap.get(data.variantName);
    if (!variantId) {
      console.warn(`  - Skipping breast size ${data.name} for unknown variant ${data.variantName}`);
      continue;
    }
    // Create media records for image and video
    const imageId = await getOrCreateMedia(
      getKeyFromUrl(data.imageUrl),
      data.imageUrl,
      MediaType.image,
      getMimeType(data.imageUrl)
    );
    const videoId = data.videoUrl
      ? await getOrCreateMedia(
          getKeyFromUrl(data.videoUrl),
          data.videoUrl,
          MediaType.video,
          getMimeType(data.videoUrl)
        )
      : undefined;
    const option = await prisma.breast_size_option.upsert({
      where: { name_variantId: { name: data.name, variantId } },
      update: { label: data.label, imageId, videoId, sortOrder: i },
      create: { name: data.name, label: data.label, variantId, imageId, videoId, sortOrder: i },
    });
    breastSizes.set(`${data.variantName}:${data.name}`, option.id);
  }
  console.log(`  - Created ${breastSizes.size} breast size options`);

  return {
    ethnicities,
    hairStyles,
    hairColors,
    eyeColors,
    bodyTypes,
    breastSizes,
    personalities,
    relationships,
    occupations,
    kinks,
  };
}

// ============================================================================
// Main Seed Function
// ============================================================================

async function main() {
  console.log("Starting character seed script...");

  // Step 1: Seed variants first
  const variantMap = await seedVariants();

  // Step 2: Seed option tables (needs variant IDs)
  const optionMaps = await seedOptionTables(variantMap);

  // Step 3: Find or create target user
  console.log(`Looking for user with email: ${TARGET_USER_EMAIL}`);
  let user = await prisma.user.findUnique({
    where: { email: TARGET_USER_EMAIL },
  });

  if (!user) {
    console.log(`User not found. Creating new user...`);
    const password = "12345690";
    const hashedPassword = await hashPassword(password);

    user = await prisma.user.create({
      data: {
        name: "Seed User",
        email: TARGET_USER_EMAIL,
        emailVerified: true,
      },
    });

    // Create credential account with password
    await prisma.account.create({
      data: {
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: hashedPassword,
      },
    });

    console.log(
      `Created user: ${user.name} (${user.id}) with password: ${password}`,
    );
  } else {
    console.log(`Found existing user: ${user.name} (${user.id})`);
  }

  // Step 3: Create Media records using pre-uploaded R2 assets
  // NOTE: Run `npx tsx prisma/upload-seed-assets.ts` first to upload all assets to R2
  console.log("Creating Media records from R2 assets...");

  const posterKey = "seed/characters/poster.webp";
  const videoKey = "seed/characters/video.mp4";
  const posterUrl = `${R2_BASE_URL}/${posterKey}`;
  const videoUrl = `${R2_BASE_URL}/${videoKey}`;

  const posterMedia = await prisma.media.create({
    data: {
      type: MediaType.image,
      key: posterKey,
      url: posterUrl,
      mimeType: "image/webp",
    },
  });
  console.log(`Poster Media created: ${posterMedia.id} (${posterUrl})`);

  const videoMedia = await prisma.media.create({
    data: {
      type: MediaType.video,
      key: videoKey,
      url: videoUrl,
      mimeType: "video/mp4",
    },
  });
  console.log(`Video Media created: ${videoMedia.id} (${videoUrl})`);

  // Step 5: Generate and create characters
  console.log(`Creating ${TOTAL_CHARACTERS} characters...`);

  // Only use variants that have seeded options
  const availableVariants = ["girl-realistic", "girl-anime", "trans-realistic"];

  const characters = [];

  for (let i = 0; i < TOTAL_CHARACTERS; i++) {
    const isLive = i < LIVE_CHARACTERS;
    const name = generateCharacterName();

    // Generate random age between 18 and 35
    const age = Math.floor(Math.random() * (35 - 18 + 1)) + 18;

    // Pick a random variant for this character
    const variantName = getRandomItem(availableVariants);
    const [genderStr, styleStr] = variantName.split("-") as [string, string];
    const gender = genderStr === "girl" ? CharacterGender.girl : CharacterGender.trans;
    const style = styleStr === "realistic" ? CharacterStyle.realistic : CharacterStyle.anime;

    // Get available options for this variant
    const variantEthnicities = ETHNICITY_DATA.filter(e => e.variantName === variantName);
    const variantHairStyles = HAIR_STYLE_DATA.filter(h => h.variantName === variantName);
    const variantHairColors = HAIR_COLOR_DATA.filter(h => h.variantName === variantName);
    const variantEyeColors = EYE_COLOR_DATA.filter(e => e.variantName === variantName);
    const variantBodyTypes = BODY_TYPE_DATA.filter(b => b.variantName === variantName);
    const variantBreastSizes = BREAST_SIZE_DATA.filter(b => b.variantName === variantName);

    // Get random option values for variant-specific options
    const ethnicity = getRandomItem(variantEthnicities);
    const hairStyle = getRandomItem(variantHairStyles);
    const hairColor = getRandomItem(variantHairColors);
    const eyeColor = getRandomItem(variantEyeColors);
    const bodyType = getRandomItem(variantBodyTypes);
    const breastSize = getRandomItem(variantBreastSizes);

    // Get random universal options
    const personality = getRandomItem(PERSONALITY_DATA);
    const relationship = getRandomItem(RELATIONSHIP_DATA);
    const occupation = getRandomItem(OCCUPATION_DATA);

    // Generate random kinks (2-5 kinks per character)
    const numKinks = Math.floor(Math.random() * 4) + 2;
    const selectedKinks = getRandomItems(KINK_DATA, numKinks);

    const characterData = {
      name,
      posterId: posterMedia.id,
      videoId: videoMedia.id,
      gender,
      style,
      age,
      voice: getRandomItem(voiceOptions),
      isPublic: true,
      isActive: true,
      isLive,
      createdById: user.id,
      // Foreign keys to option tables (variant-specific use "variantName:optionName" key format)
      ethnicityId: optionMaps.ethnicities.get(`${variantName}:${ethnicity.name}`)!,
      hairStyleId: optionMaps.hairStyles.get(`${variantName}:${hairStyle.name}`)!,
      hairColorId: optionMaps.hairColors.get(`${variantName}:${hairColor.name}`)!,
      eyeColorId: optionMaps.eyeColors.get(`${variantName}:${eyeColor.name}`)!,
      bodyTypeId: optionMaps.bodyTypes.get(`${variantName}:${bodyType.name}`)!,
      breastSizeId: optionMaps.breastSizes.get(`${variantName}:${breastSize.name}`)!,
      // Universal options use just the name as key
      personalityId: optionMaps.personalities.get(personality.name)!,
      relationshipId: optionMaps.relationships.get(relationship.name)!,
      occupationId: optionMaps.occupations.get(occupation.name)!,
      character_kink: {
        create: selectedKinks.map((kink) => ({
          kinkId: optionMaps.kinks.get(kink.name)!,
        })),
      },
    };

    const character = await prisma.character.create({
      data: characterData,
      include: { character_kink: true },
    });

    characters.push(character);
    console.log(
      `Created character ${i + 1}/${TOTAL_CHARACTERS}: ${character.name} (${variantName}, isLive: ${character.isLive})`,
    );
  }

  // Step 6: Create Stories for each character
  console.log("Creating stories for characters...");
  let totalStories = 0;

  for (const character of characters) {
    const numStories = Math.floor(Math.random() * 3) + 1; // 1-3 stories
    for (let j = 0; j < numStories; j++) {
      await prisma.story.create({
        data: {
          characterId: character.id,
          mediaId: posterMedia.id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
          isActive: true,
        },
      });
      totalStories++;
    }
  }
  console.log(`Created ${totalStories} stories`);

  // Step 7: Create Reels for each character
  console.log("Creating reels for characters...");
  let totalReels = 0;

  const reelTitles = [
    "Watch me dance",
    "Good morning",
    "Feeling cute",
    "Behind the scenes",
    "Just vibing",
    "New look",
    "Day in my life",
  ];

  const reelDescriptions = [
    "Hope you enjoy!",
    "Let me know what you think",
    "More coming soon...",
    "Just for you",
    "Had so much fun making this",
  ];

  for (const character of characters) {
    const numReels = Math.floor(Math.random() * 2) + 1; // 1-2 reels
    for (let j = 0; j < numReels; j++) {
      await prisma.reel.create({
        data: {
          characterId: character.id,
          videoId: videoMedia.id,
          thumbnailId: posterMedia.id,
          title: getRandomItem(reelTitles),
          description: getRandomItem(reelDescriptions),
          viewCount: Math.floor(Math.random() * 9900) + 100, // 100-10000
          isActive: true,
        },
      });
      totalReels++;
    }
  }
  console.log(`Created ${totalReels} reels`);

  // Summary
  console.log("\n=== Seed Summary ===");
  console.log(`Total characters created: ${characters.length}`);
  console.log(`Live characters: ${characters.filter((c) => c.isLive).length}`);
  console.log(
    `Not live characters: ${characters.filter((c) => !c.isLive).length}`,
  );
  console.log(`Total stories created: ${totalStories}`);
  console.log(`Total reels created: ${totalReels}`);
  console.log(`Poster Media ID: ${posterMedia.id}`);
  console.log(`Video Media ID: ${videoMedia.id}`);
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
