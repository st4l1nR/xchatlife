import { PrismaClient, MediaType, FinancialType } from "../generated/prisma";
import * as dotenv from "dotenv";
import { hashPassword } from "better-auth/crypto";

// Load environment variables from .env file
dotenv.config();

const prisma = new PrismaClient();

// Admin user credentials
const ADMIN_EMAIL = "admin@xchatlife.com";
const ADMIN_PASSWORD = "1234567890aA";

// Target user email
const TARGET_USER_EMAIL = "stalinramosbw@gmail.com";

// Total characters to create
const TOTAL_CHARACTERS = 21;
const LIVE_CHARACTERS = 5;

// All permissions set to true for SUPERADMIN (CRUD order)
const ALL_PERMISSIONS = {
  user: { create: true, read: true, update: true, delete: true },
  character: { create: true, read: true, update: true, delete: true },
  chat: { create: true, read: true, update: true, delete: true },
  media: { create: true, read: true, update: true, delete: true },
  content: { create: true, read: true, update: true, delete: true },
  visual_novel: { create: true, read: true, update: true, delete: true },
  ticket: { create: true, read: true, update: true, delete: true },
  subscription: { create: true, read: true, update: true, delete: true },
  affiliate: { create: true, read: true, update: true, delete: true },
  auth: { create: true, read: true, update: true, delete: true },
};

// Limited permissions for regular customers
const CUSTOMER_PERMISSIONS = {
  user: { create: false, read: true, update: true, delete: false },
  character: { create: true, read: true, update: true, delete: true },
  chat: { create: true, read: true, update: true, delete: true },
  media: { create: true, read: true, update: true, delete: true },
  content: { create: true, read: true, update: true, delete: true },
  visual_novel: { create: true, read: true, update: true, delete: true },
  ticket: { create: true, read: true, update: false, delete: false },
  subscription: { create: false, read: true, update: true, delete: false },
  affiliate: { create: false, read: true, update: false, delete: false },
  auth: { create: false, read: false, update: false, delete: false },
};

// Minimal permissions for affiliates
const AFFILIATE_PERMISSIONS = {
  user: { create: false, read: false, update: false, delete: false },
  character: { create: false, read: false, update: false, delete: false },
  chat: { create: false, read: false, update: false, delete: false },
  media: { create: false, read: false, update: false, delete: false },
  content: { create: false, read: false, update: false, delete: false },
  visual_novel: { create: false, read: false, update: false, delete: false },
  ticket: { create: true, read: true, update: false, delete: false },
  subscription: { create: false, read: false, update: false, delete: false },
  affiliate: { create: false, read: true, update: false, delete: false },
  auth: { create: false, read: false, update: false, delete: false },
};

// ============================================================================
// R2 Base URL - Hardcoded production URL (public assets for seed)
// ============================================================================

const R2_BASE_URL = "https://pub-5085e00501634df38e5783f95d3fc3a8.r2.dev";

// ============================================================================
// Character Gender & Style Option Data
// ============================================================================

const CHARACTER_GENDER_DATA = [
  { name: "girl", label: "Girl", emoji: "👩" },
  { name: "men", label: "Men", emoji: "👨" },
  { name: "trans", label: "Transexual", emoji: "⚧️" },
];

const CHARACTER_STYLE_DATA = [
  {
    name: "realistic",
    label: "Realistic",
    imageKey: "seed/variants/girl-realistic.webp",
    videoKey: "seed/variants/girl-realistic.mp4",
  },
  {
    name: "anime",
    label: "Anime",
    imageKey: "seed/variants/girl-anime.webp",
    videoKey: "seed/variants/girl-anime.mp4",
  },
];

// ============================================================================
// Variant Definitions (intersection of gender + style)
// ============================================================================

const VARIANT_DEFINITIONS = [
  {
    genderName: "girl",
    styleName: "realistic",
    name: "girl-realistic",
    label: "Realistic Girl",
    emoji: "👩",
    imageKey: "seed/variants/girl-realistic.webp",
    videoKey: "seed/variants/girl-realistic.mp4",
    isActive: true,
  },
  {
    genderName: "girl",
    styleName: "anime",
    name: "girl-anime",
    label: "Anime Girl",
    emoji: "👧",
    imageKey: "seed/variants/girl-anime.webp",
    videoKey: "seed/variants/girl-anime.mp4",
    isActive: true,
  },
  {
    genderName: "men",
    styleName: "realistic",
    name: "men-realistic",
    label: "Realistic Men",
    emoji: "👨",
    imageKey: "seed/variants/girl-realistic.webp", // Using girl-realistic as placeholder
    videoKey: "seed/variants/girl-realistic.mp4",
    isActive: true,
  },
  {
    genderName: "men",
    styleName: "anime",
    name: "men-anime",
    label: "Anime Men",
    emoji: "👦",
    imageKey: "seed/variants/girl-anime.webp", // Using girl-anime as placeholder
    videoKey: "seed/variants/girl-anime.mp4",
    isActive: true,
  },
  {
    genderName: "trans",
    styleName: "realistic",
    name: "trans-realistic",
    label: "Realistic Trans",
    emoji: "⚧️",
    imageKey: "seed/variants/trans-realistic.jpg",
    videoKey: "seed/variants/trans-realistic.mp4",
    isActive: true,
  },
  {
    genderName: "trans",
    styleName: "anime",
    name: "trans-anime",
    label: "Anime Trans",
    emoji: "⚧️",
    imageKey: "seed/variants/trans-anime.jpg",
    videoKey: "seed/variants/trans-anime.mp4",
    isActive: false, // Coming soon
  },
] as const;

// ============================================================================
// Helper function to get or create Media record
// ============================================================================

async function getOrCreateMedia(
  key: string,
  url: string,
  type: MediaType,
  mimeType: string,
): Promise<string> {
  const media = await prisma.media.upsert({
    where: { key },
    update: { url, mimeType },
    create: { type, key, url, mimeType },
  });
  return media.id;
}

// Helper to determine mime type from URL
function getMimeType(url: string): string {
  if (url.endsWith(".png")) return "image/png";
  if (url.endsWith(".jpg") || url.endsWith(".jpeg")) return "image/jpeg";
  if (url.endsWith(".webp")) return "image/webp";
  if (url.endsWith(".mp4")) return "video/mp4";
  if (url.endsWith(".webm")) return "video/webm";
  return "application/octet-stream";
}

// Helper to extract key from URL
function getKeyFromUrl(url: string): string {
  const match = url.match(/\/(seed\/.+)$/);
  return match?.[1] ?? url;
}

// ============================================================================
// Universal Options - Using R2 URLs (now with genderName and styleName)
// ============================================================================

// Personality options - with images from R2
const PERSONALITY_DATA = [
  {
    name: "nympho",
    label: "Nympho",
    imageUrl: `${R2_BASE_URL}/seed/options/personality/nympho.png`,
  },
  {
    name: "lover",
    label: "Lover",
    imageUrl: `${R2_BASE_URL}/seed/options/personality/lover.png`,
  },
  {
    name: "submissive",
    label: "Submissive",
    imageUrl: `${R2_BASE_URL}/seed/options/personality/submissive.png`,
  },
  {
    name: "dominant",
    label: "Dominant",
    imageUrl: `${R2_BASE_URL}/seed/options/personality/dominant.png`,
  },
  {
    name: "temptress",
    label: "Temptress",
    imageUrl: `${R2_BASE_URL}/seed/options/personality/temptress.png`,
  },
  {
    name: "innocent",
    label: "Innocent",
    imageUrl: `${R2_BASE_URL}/seed/options/personality/innocent.png`,
  },
  {
    name: "caregiver",
    label: "Caregiver",
    imageUrl: `${R2_BASE_URL}/seed/options/personality/caregiver.png`,
  },
  {
    name: "experimenter",
    label: "Experimenter",
    imageUrl: `${R2_BASE_URL}/seed/options/personality/experimenter.png`,
  },
  {
    name: "mean",
    label: "Mean",
    imageUrl: `${R2_BASE_URL}/seed/options/personality/mean.png`,
  },
  {
    name: "confidant",
    label: "Confidant",
    imageUrl: `${R2_BASE_URL}/seed/options/personality/confidant.png`,
  },
  {
    name: "shy",
    label: "Shy",
    imageUrl: `${R2_BASE_URL}/seed/options/personality/shy.png`,
  },
  {
    name: "queen",
    label: "Queen",
    imageUrl: `${R2_BASE_URL}/seed/options/personality/queen.png`,
  },
];

// Relationship options - with images from R2
const RELATIONSHIP_DATA = [
  {
    name: "stranger",
    label: "Stranger",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/stranger.png`,
  },
  {
    name: "girlfriend",
    label: "Girlfriend",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/girlfriend.png`,
  },
  {
    name: "sex_friend",
    label: "Sex Friend",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/sex_friend.png`,
  },
  {
    name: "school_mate",
    label: "School Mate",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/school_mate.png`,
  },
  {
    name: "work_colleague",
    label: "Work Colleague",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/work_colleague.png`,
  },
  {
    name: "wife",
    label: "Wife",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/wife.png`,
  },
  {
    name: "mistress",
    label: "Mistress",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/mistress.png`,
  },
  {
    name: "friend",
    label: "Friend",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/friend.png`,
  },
  {
    name: "step_sister",
    label: "Step Sister",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/step_sister.png`,
  },
  {
    name: "step_mom",
    label: "Step Mom",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/step_mom.png`,
  },
  {
    name: "step_daughter",
    label: "Step Daughter",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/step_daughter.png`,
  },
  {
    name: "landlord",
    label: "Landlord",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/landlord.png`,
  },
  {
    name: "sugar_baby",
    label: "Sugar Baby",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/sugar_baby.png`,
  },
  {
    name: "boss",
    label: "Boss",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/boss.png`,
  },
  {
    name: "teacher",
    label: "Teacher",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/teacher.png`,
  },
  {
    name: "student",
    label: "Student",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/student.png`,
  },
  {
    name: "neighbour",
    label: "Neighbour",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/neighbour.png`,
  },
  {
    name: "mother_in_law",
    label: "Mother-In-Law",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/mother_in_law.png`,
  },
  {
    name: "sister_in_law",
    label: "Sister-In-Law",
    imageUrl: `${R2_BASE_URL}/seed/options/relationship/sister_in_law.png`,
  },
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

// ============================================================================
// Variant-Specific Options (using genderName and styleName)
// ============================================================================

type OptionData = {
  name: string;
  label: string;
  genderName: string;
  styleName: string;
  imageUrl: string;
  videoUrl?: string;
};

// Ethnicity options per gender+style
const ETHNICITY_DATA: OptionData[] = [
  // girl-realistic
  {
    name: "caucasian",
    label: "Caucasian",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/caucasian.png`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/caucasian.mp4`,
  },
  {
    name: "asian",
    label: "Asian",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/asian.png`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/asian.mp4`,
  },
  {
    name: "black",
    label: "Black / Afro",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/black.png`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/black.mp4`,
  },
  {
    name: "latina",
    label: "Latina",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/latina.png`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/latina.mp4`,
  },
  {
    name: "arab",
    label: "Arab",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/arab.jpg`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/arab.mp4`,
  },
  // girl-anime
  {
    name: "caucasian",
    label: "Caucasian",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/ethnicity/caucasian.webp`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/ethnicity/caucasian.mp4`,
  },
  {
    name: "asian",
    label: "Asian",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/ethnicity/asian.webp`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/ethnicity/asian.mp4`,
  },
  {
    name: "latina",
    label: "Latina",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/ethnicity/latina.webp`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/ethnicity/latina.mp4`,
  },
  // men-realistic (using girl-realistic images as placeholder)
  {
    name: "caucasian",
    label: "Caucasian",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/caucasian.png`,
  },
  {
    name: "asian",
    label: "Asian",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/asian.png`,
  },
  {
    name: "black",
    label: "Black / Afro",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/black.png`,
  },
  {
    name: "latina",
    label: "Latino",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/ethnicity/latina.png`,
  },
  // men-anime (using girl-anime images as placeholder)
  {
    name: "caucasian",
    label: "Caucasian",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/ethnicity/caucasian.webp`,
  },
  {
    name: "asian",
    label: "Asian",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/ethnicity/asian.webp`,
  },
  {
    name: "latina",
    label: "Latino",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/ethnicity/latina.webp`,
  },
  // trans-realistic
  {
    name: "caucasian",
    label: "Caucasian",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/ethnicity/caucasian.png`,
  },
  {
    name: "asian",
    label: "Asian",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/ethnicity/asian.png`,
  },
  {
    name: "latina",
    label: "Latina",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/ethnicity/latina.png`,
  },
];

// Hair Style options per gender+style
const HAIR_STYLE_DATA: OptionData[] = [
  // girl-realistic
  {
    name: "straight",
    label: "Straight",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/straight.png`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/straight.mp4`,
  },
  {
    name: "bangs",
    label: "Bangs",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/bangs.png`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/bangs.mp4`,
  },
  {
    name: "curly",
    label: "Curly",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/curly.png`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/curly.mp4`,
  },
  {
    name: "bun",
    label: "Bun",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/bun.png`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/bun.mp4`,
  },
  {
    name: "short",
    label: "Short",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/short.png`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/short.mp4`,
  },
  {
    name: "ponytail",
    label: "Ponytail",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/ponytail.png`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/ponytail.mp4`,
  },
  // girl-anime
  {
    name: "straight",
    label: "Straight",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/straight.webp`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/straight.mp4`,
  },
  {
    name: "bangs",
    label: "Bangs",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/bangs.webp`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/bangs.mp4`,
  },
  {
    name: "curly",
    label: "Curly",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/curly.webp`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/curly.mp4`,
  },
  {
    name: "bun",
    label: "Bun",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/bun.webp`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/bun.mp4`,
  },
  {
    name: "short",
    label: "Short",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/short.webp`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/short.mp4`,
  },
  {
    name: "ponytail",
    label: "Ponytail",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/ponytail.webp`,
    videoUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/ponytail.mp4`,
  },
  // men-realistic (reusing girl-realistic)
  {
    name: "straight",
    label: "Straight",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/straight.png`,
  },
  {
    name: "curly",
    label: "Curly",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/curly.png`,
  },
  {
    name: "short",
    label: "Short",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/short.png`,
  },
  // men-anime (reusing girl-anime)
  {
    name: "straight",
    label: "Straight",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/straight.webp`,
  },
  {
    name: "curly",
    label: "Curly",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/curly.webp`,
  },
  {
    name: "short",
    label: "Short",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-style/short.webp`,
  },
  // trans-realistic (reuses girl-realistic)
  {
    name: "straight",
    label: "Straight",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/straight.png`,
  },
  {
    name: "bangs",
    label: "Bangs",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/bangs.png`,
  },
  {
    name: "curly",
    label: "Curly",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/curly.png`,
  },
  {
    name: "bun",
    label: "Bun",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/bun.png`,
  },
  {
    name: "short",
    label: "Short",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/short.png`,
  },
  {
    name: "ponytail",
    label: "Ponytail",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-style/ponytail.png`,
  },
];

// Hair Color options per gender+style
const HAIR_COLOR_DATA: OptionData[] = [
  // girl-realistic
  {
    name: "brunette",
    label: "Brunette",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/brunette.png`,
  },
  {
    name: "blonde",
    label: "Blonde",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/blonde.png`,
  },
  {
    name: "black",
    label: "Black",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/black.png`,
  },
  {
    name: "redhead",
    label: "Redhead",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/redhead.png`,
  },
  {
    name: "pink",
    label: "Pink",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/pink.png`,
  },
  // girl-anime
  {
    name: "black",
    label: "Black",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/black.webp`,
  },
  {
    name: "blonde",
    label: "Blonde",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/blonde.webp`,
  },
  {
    name: "blue",
    label: "Blue",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/blue.webp`,
  },
  {
    name: "multicolor",
    label: "Multicolor",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/multicolor.webp`,
  },
  {
    name: "pink",
    label: "Pink",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/pink.webp`,
  },
  {
    name: "purple",
    label: "Purple",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/purple.webp`,
  },
  {
    name: "redhead",
    label: "Redhead",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/redhead.webp`,
  },
  {
    name: "white",
    label: "White",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/white.webp`,
  },
  // men-realistic (reusing girl-realistic)
  {
    name: "brunette",
    label: "Brunette",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/brunette.png`,
  },
  {
    name: "blonde",
    label: "Blonde",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/blonde.png`,
  },
  {
    name: "black",
    label: "Black",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/black.png`,
  },
  {
    name: "redhead",
    label: "Redhead",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/redhead.png`,
  },
  // men-anime (reusing girl-anime)
  {
    name: "black",
    label: "Black",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/black.webp`,
  },
  {
    name: "blonde",
    label: "Blonde",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/blonde.webp`,
  },
  {
    name: "blue",
    label: "Blue",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/blue.webp`,
  },
  {
    name: "white",
    label: "White",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/hair-color/white.webp`,
  },
  // trans-realistic (reuses girl-realistic)
  {
    name: "brunette",
    label: "Brunette",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/brunette.png`,
  },
  {
    name: "blonde",
    label: "Blonde",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/blonde.png`,
  },
  {
    name: "black",
    label: "Black",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/black.png`,
  },
  {
    name: "redhead",
    label: "Redhead",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/redhead.png`,
  },
  {
    name: "pink",
    label: "Pink",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/hair-color/pink.png`,
  },
];

// Eye Color options per gender+style
const EYE_COLOR_DATA: OptionData[] = [
  // girl-realistic
  {
    name: "brown",
    label: "Brown",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/eye-color/brown.png`,
  },
  {
    name: "blue",
    label: "Blue",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/eye-color/blue.png`,
  },
  {
    name: "green",
    label: "Green",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/eye-color/green.png`,
  },
  // girl-anime
  {
    name: "brown",
    label: "Brown",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/eye-color/brown.webp`,
  },
  {
    name: "blue",
    label: "Blue",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/eye-color/blue.webp`,
  },
  {
    name: "green",
    label: "Green",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/eye-color/green.webp`,
  },
  {
    name: "red",
    label: "Red",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/eye-color/red.webp`,
  },
  {
    name: "yellow",
    label: "Yellow",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/eye-color/yellow.webp`,
  },
  // men-realistic (reusing girl-realistic)
  {
    name: "brown",
    label: "Brown",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/eye-color/brown.png`,
  },
  {
    name: "blue",
    label: "Blue",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/eye-color/blue.png`,
  },
  {
    name: "green",
    label: "Green",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/eye-color/green.png`,
  },
  // men-anime (reusing girl-anime)
  {
    name: "brown",
    label: "Brown",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/eye-color/brown.webp`,
  },
  {
    name: "blue",
    label: "Blue",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/eye-color/blue.webp`,
  },
  {
    name: "green",
    label: "Green",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/eye-color/green.webp`,
  },
  {
    name: "red",
    label: "Red",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/eye-color/red.webp`,
  },
  // trans-realistic (reuses girl-realistic)
  {
    name: "brown",
    label: "Brown",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/eye-color/brown.png`,
  },
  {
    name: "blue",
    label: "Blue",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/eye-color/blue.png`,
  },
  {
    name: "green",
    label: "Green",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/eye-color/green.png`,
  },
];

// Body Type options per gender+style
const BODY_TYPE_DATA: OptionData[] = [
  // girl-realistic
  {
    name: "skinny",
    label: "Skinny",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/body-type/skinny.png`,
  },
  {
    name: "athletic",
    label: "Athletic",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/body-type/athletic.png`,
  },
  {
    name: "average",
    label: "Average",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/body-type/average.png`,
  },
  {
    name: "curvy",
    label: "Curvy",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/body-type/curvy.png`,
  },
  {
    name: "bbw",
    label: "BBW",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/body-type/bbw.png`,
  },
  // girl-anime (no BBW)
  {
    name: "skinny",
    label: "Skinny",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/body-type/skinny.webp`,
  },
  {
    name: "athletic",
    label: "Athletic",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/body-type/athletic.webp`,
  },
  {
    name: "average",
    label: "Average",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/body-type/average.webp`,
  },
  {
    name: "curvy",
    label: "Curvy",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/body-type/curvy.webp`,
  },
  // men-realistic
  {
    name: "skinny",
    label: "Skinny",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/body-type/skinny.png`,
  },
  {
    name: "athletic",
    label: "Athletic",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/body-type/athletic.png`,
  },
  {
    name: "average",
    label: "Average",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/body-type/average.png`,
  },
  // men-anime
  {
    name: "skinny",
    label: "Skinny",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/body-type/skinny.webp`,
  },
  {
    name: "athletic",
    label: "Athletic",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/body-type/athletic.webp`,
  },
  {
    name: "average",
    label: "Average",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/body-type/average.webp`,
  },
  // trans-realistic
  {
    name: "skinny",
    label: "Skinny",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/body-type/skinny.png`,
  },
  {
    name: "athletic",
    label: "Athletic",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/body-type/athletic.png`,
  },
  {
    name: "average",
    label: "Average",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/body-type/average.png`,
  },
  {
    name: "curvy",
    label: "Curvy",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/body-type/curvy.png`,
  },
  {
    name: "bbw",
    label: "BBW",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/trans-realistic/body-type/bbw.png`,
  },
];

// Breast Size options per gender+style (only for girl and trans)
const BREAST_SIZE_DATA: OptionData[] = [
  // girl-realistic
  {
    name: "small",
    label: "Small",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/small.png`,
  },
  {
    name: "medium",
    label: "Medium",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/medium.png`,
  },
  {
    name: "large",
    label: "Large",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/large.png`,
  },
  {
    name: "extra_large",
    label: "Extra Large",
    genderName: "girl",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/extra_large.png`,
  },
  // girl-anime
  {
    name: "small",
    label: "Small",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/breast-size/small.webp`,
  },
  {
    name: "medium",
    label: "Medium",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/breast-size/medium.webp`,
  },
  {
    name: "large",
    label: "Large",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/breast-size/large.webp`,
  },
  {
    name: "extra_large",
    label: "Extra Large",
    genderName: "girl",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/breast-size/extra_large.webp`,
  },
  // men-realistic (placeholder - N/A)
  {
    name: "none",
    label: "N/A",
    genderName: "men",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/small.png`,
  },
  // men-anime (placeholder - N/A)
  {
    name: "none",
    label: "N/A",
    genderName: "men",
    styleName: "anime",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-anime/breast-size/small.webp`,
  },
  // trans-realistic (reuses girl-realistic)
  {
    name: "small",
    label: "Small",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/small.png`,
  },
  {
    name: "medium",
    label: "Medium",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/medium.png`,
  },
  {
    name: "large",
    label: "Large",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/large.png`,
  },
  {
    name: "extra_large",
    label: "Extra Large",
    genderName: "trans",
    styleName: "realistic",
    imageUrl: `${R2_BASE_URL}/seed/options/girl-realistic/breast-size/extra_large.png`,
  },
];

// ============================================================================
// FINANCIAL CATEGORIES
// ============================================================================

const FINANCIAL_CATEGORY_DATA: {
  name: string;
  label: string;
  type: FinancialType;
  group: string;
  description: string;
}[] = [
  // ========== REVENUE ==========
  {
    name: "subscription",
    label: "Subscription",
    type: FinancialType.income,
    group: "revenue",
    description: "Pagos de suscripción de usuarios",
  },
  {
    name: "token_purchase",
    label: "Token Purchase",
    type: FinancialType.income,
    group: "revenue",
    description: "Compra de tokens adicionales",
  },

  // ========== AFFILIATES ==========
  {
    name: "affiliate_payout",
    label: "Affiliate Payout",
    type: FinancialType.expense,
    group: "affiliates",
    description: "Pago realizado a afiliado",
  },
  {
    name: "affiliate_commission",
    label: "Affiliate Commission",
    type: FinancialType.expense,
    group: "affiliates",
    description: "Comisión pendiente registrada",
  },

  // ========== INFRASTRUCTURE ==========
  {
    name: "hosting",
    label: "Hosting",
    type: FinancialType.expense,
    group: "infrastructure",
    description: "Vercel, Railway, servidores",
  },
  {
    name: "database",
    label: "Database",
    type: FinancialType.expense,
    group: "infrastructure",
    description: "Prisma, Planetscale, Supabase",
  },
  {
    name: "storage",
    label: "Storage",
    type: FinancialType.expense,
    group: "infrastructure",
    description: "S3, Cloudflare R2, almacenamiento",
  },
  {
    name: "domain",
    label: "Domain",
    type: FinancialType.expense,
    group: "infrastructure",
    description: "Dominios y DNS",
  },

  // ========== AI / APIs ==========
  {
    name: "ai_chat",
    label: "AI Chat",
    type: FinancialType.expense,
    group: "ai",
    description: "LLM para chat (OpenAI, Anthropic)",
  },
  {
    name: "ai_image",
    label: "AI Image",
    type: FinancialType.expense,
    group: "ai",
    description: "Generación de imágenes (Runpod, Replicate)",
  },
  {
    name: "ai_video",
    label: "AI Video",
    type: FinancialType.expense,
    group: "ai",
    description: "Generación de video",
  },
  {
    name: "ai_voice",
    label: "AI Voice",
    type: FinancialType.expense,
    group: "ai",
    description: "TTS, voz (ElevenLabs)",
  },

  // ========== PAYMENTS ==========
  {
    name: "payment_fee",
    label: "Payment Fee",
    type: FinancialType.expense,
    group: "payments",
    description: "Fees de CoinGate, Stripe, procesadores",
  },
  {
    name: "refund",
    label: "Refund",
    type: FinancialType.expense,
    group: "payments",
    description: "Reembolsos a usuarios",
  },

  // ========== MARKETING ==========
  {
    name: "marketing",
    label: "Marketing",
    type: FinancialType.expense,
    group: "marketing",
    description: "Ads, promociones, influencers",
  },

  // ========== OTHER ==========
  {
    name: "software",
    label: "Software",
    type: FinancialType.expense,
    group: "other",
    description: "Licencias, herramientas (Figma, etc.)",
  },
  {
    name: "other_income",
    label: "Other Income",
    type: FinancialType.income,
    group: "other",
    description: "Otros ingresos",
  },
  {
    name: "other_expense",
    label: "Other Expense",
    type: FinancialType.expense,
    group: "other",
    description: "Otros gastos",
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

function getRandomItem<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);
  const item = array[index];
  if (item === undefined) {
    throw new Error("Array is empty or index out of bounds");
  }
  return item;
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
// Seed Functions
// ============================================================================

type OptionMap = Map<string, string>;

async function seedGendersAndStyles(): Promise<{
  genders: OptionMap;
  styles: OptionMap;
}> {
  console.log("Seeding character genders and styles...");

  // Seed genders with emoji
  const genders = new Map<string, string>();
  for (let i = 0; i < CHARACTER_GENDER_DATA.length; i++) {
    const data = CHARACTER_GENDER_DATA[i]!;
    const option = await prisma.character_gender.upsert({
      where: { name: data.name },
      update: { label: data.label, emoji: data.emoji, sortOrder: i },
      create: {
        name: data.name,
        label: data.label,
        emoji: data.emoji,
        sortOrder: i,
      },
    });
    genders.set(data.name, option.id);
  }
  console.log(`  - Created ${genders.size} gender options`);

  // Seed styles with images/videos
  const styles = new Map<string, string>();
  for (let i = 0; i < CHARACTER_STYLE_DATA.length; i++) {
    const data = CHARACTER_STYLE_DATA[i]!;

    // Create media for style image and video
    const imageId = await getOrCreateMedia(
      data.imageKey,
      `${R2_BASE_URL}/${data.imageKey}`,
      MediaType.image,
      getMimeType(data.imageKey),
    );
    const videoId = await getOrCreateMedia(
      data.videoKey,
      `${R2_BASE_URL}/${data.videoKey}`,
      MediaType.video,
      getMimeType(data.videoKey),
    );

    const option = await prisma.character_style.upsert({
      where: { name: data.name },
      update: { label: data.label, imageId, videoId, sortOrder: i },
      create: {
        name: data.name,
        label: data.label,
        imageId,
        videoId,
        sortOrder: i,
      },
    });
    styles.set(data.name, option.id);
  }
  console.log(`  - Created ${styles.size} style options`);

  return { genders, styles };
}

async function seedVariants(
  genders: OptionMap,
  styles: OptionMap,
): Promise<Map<string, string>> {
  console.log("Seeding character variants...");
  const variantMap = new Map<string, string>();

  for (let i = 0; i < VARIANT_DEFINITIONS.length; i++) {
    const v = VARIANT_DEFINITIONS[i]!;

    const genderId = genders.get(v.genderName);
    const styleId = styles.get(v.styleName);

    if (!genderId || !styleId) {
      console.warn(`  - Skipping variant ${v.name}: gender or style not found`);
      continue;
    }

    // Create media for variant image and video
    const imageId = await getOrCreateMedia(
      v.imageKey,
      `${R2_BASE_URL}/${v.imageKey}`,
      MediaType.image,
      getMimeType(v.imageKey),
    );
    const videoId = await getOrCreateMedia(
      v.videoKey,
      `${R2_BASE_URL}/${v.videoKey}`,
      MediaType.video,
      getMimeType(v.videoKey),
    );

    const variant = await prisma.character_variant.upsert({
      where: { name: v.name },
      update: {
        genderId,
        styleId,
        label: v.label,
        emoji: v.emoji,
        imageId,
        videoId,
        isActive: v.isActive,
        sortOrder: i,
      },
      create: {
        name: v.name,
        genderId,
        styleId,
        label: v.label,
        emoji: v.emoji,
        imageId,
        videoId,
        isActive: v.isActive,
        sortOrder: i,
      },
    });
    variantMap.set(v.name, variant.id);
    console.log(`  - Created variant ${v.name}`);
  }

  console.log(`  - Created ${variantMap.size} character variants`);
  return variantMap;
}

async function seedOptionTables(
  genders: OptionMap,
  styles: OptionMap,
): Promise<{
  ethnicities: OptionMap;
  hairStyles: OptionMap;
  hairColors: OptionMap;
  eyeColors: OptionMap;
  bodyTypes: OptionMap;
  breastSizes: OptionMap;
  personalities: OptionMap;
  relationships: OptionMap;
  occupations: OptionMap;
}> {
  console.log("Seeding option tables...");

  // Helper to seed options with gender/style
  async function seedOptionWithGenderStyle<T extends OptionData>(
    data: T[],
    tableName: string,
    createFn: (
      item: T,
      genderId: string,
      styleId: string,
      imageId: string | undefined,
      videoId: string | undefined,
      sortOrder: number,
    ) => Promise<{ id: string }>,
  ): Promise<OptionMap> {
    const map = new Map<string, string>();
    for (let i = 0; i < data.length; i++) {
      const item = data[i]!;
      const genderId = genders.get(item.genderName);
      const styleId = styles.get(item.styleName);

      if (!genderId || !styleId) {
        console.warn(
          `  - Skipping ${tableName} ${item.name}: gender or style not found`,
        );
        continue;
      }

      const imageId = await getOrCreateMedia(
        getKeyFromUrl(item.imageUrl),
        item.imageUrl,
        MediaType.image,
        getMimeType(item.imageUrl),
      );
      const videoId = item.videoUrl
        ? await getOrCreateMedia(
            getKeyFromUrl(item.videoUrl),
            item.videoUrl,
            MediaType.video,
            getMimeType(item.videoUrl),
          )
        : undefined;

      const option = await createFn(
        item,
        genderId,
        styleId,
        imageId,
        videoId,
        i,
      );
      map.set(`${item.genderName}:${item.styleName}:${item.name}`, option.id);
    }
    return map;
  }

  // Seed ethnicities
  const ethnicities = await seedOptionWithGenderStyle(
    ETHNICITY_DATA,
    "ethnicity",
    async (item, genderId, styleId, imageId, videoId, sortOrder) => {
      return prisma.character_ethnicity.upsert({
        where: {
          name_genderId_styleId: { name: item.name, genderId, styleId },
        },
        update: { label: item.label, imageId, videoId, sortOrder },
        create: {
          name: item.name,
          label: item.label,
          genderId,
          styleId,
          imageId,
          videoId,
          sortOrder,
        },
      });
    },
  );
  console.log(`  - Created ${ethnicities.size} ethnicity options`);

  // Seed hair styles
  const hairStyles = await seedOptionWithGenderStyle(
    HAIR_STYLE_DATA,
    "hair_style",
    async (item, genderId, styleId, imageId, videoId, sortOrder) => {
      return prisma.character_hair_style.upsert({
        where: {
          name_genderId_styleId: { name: item.name, genderId, styleId },
        },
        update: { label: item.label, imageId, videoId, sortOrder },
        create: {
          name: item.name,
          label: item.label,
          genderId,
          styleId,
          imageId,
          videoId,
          sortOrder,
        },
      });
    },
  );
  console.log(`  - Created ${hairStyles.size} hair style options`);

  // Seed hair colors
  const hairColors = await seedOptionWithGenderStyle(
    HAIR_COLOR_DATA,
    "hair_color",
    async (item, genderId, styleId, imageId, videoId, sortOrder) => {
      return prisma.character_hair_color.upsert({
        where: {
          name_genderId_styleId: { name: item.name, genderId, styleId },
        },
        update: { label: item.label, imageId, videoId, sortOrder },
        create: {
          name: item.name,
          label: item.label,
          genderId,
          styleId,
          imageId,
          videoId,
          sortOrder,
        },
      });
    },
  );
  console.log(`  - Created ${hairColors.size} hair color options`);

  // Seed eye colors
  const eyeColors = await seedOptionWithGenderStyle(
    EYE_COLOR_DATA,
    "eye_color",
    async (item, genderId, styleId, imageId, videoId, sortOrder) => {
      return prisma.character_eye_color.upsert({
        where: {
          name_genderId_styleId: { name: item.name, genderId, styleId },
        },
        update: { label: item.label, imageId, videoId, sortOrder },
        create: {
          name: item.name,
          label: item.label,
          genderId,
          styleId,
          imageId,
          videoId,
          sortOrder,
        },
      });
    },
  );
  console.log(`  - Created ${eyeColors.size} eye color options`);

  // Seed body types
  const bodyTypes = await seedOptionWithGenderStyle(
    BODY_TYPE_DATA,
    "body_type",
    async (item, genderId, styleId, imageId, videoId, sortOrder) => {
      return prisma.character_body_type.upsert({
        where: {
          name_genderId_styleId: { name: item.name, genderId, styleId },
        },
        update: { label: item.label, imageId, videoId, sortOrder },
        create: {
          name: item.name,
          label: item.label,
          genderId,
          styleId,
          imageId,
          videoId,
          sortOrder,
        },
      });
    },
  );
  console.log(`  - Created ${bodyTypes.size} body type options`);

  // Seed breast sizes
  const breastSizes = await seedOptionWithGenderStyle(
    BREAST_SIZE_DATA,
    "breast_size",
    async (item, genderId, styleId, imageId, videoId, sortOrder) => {
      return prisma.character_breast_size.upsert({
        where: {
          name_genderId_styleId: { name: item.name, genderId, styleId },
        },
        update: { label: item.label, imageId, videoId, sortOrder },
        create: {
          name: item.name,
          label: item.label,
          genderId,
          styleId,
          imageId,
          videoId,
          sortOrder,
        },
      });
    },
  );
  console.log(`  - Created ${breastSizes.size} breast size options`);

  // Seed personalities (now with gender/style)
  const personalities = new Map<string, string>();
  for (const genderData of CHARACTER_GENDER_DATA) {
    for (const styleData of CHARACTER_STYLE_DATA) {
      const genderId = genders.get(genderData.name)!;
      const styleId = styles.get(styleData.name)!;

      for (let i = 0; i < PERSONALITY_DATA.length; i++) {
        const data = PERSONALITY_DATA[i]!;
        const imageId = await getOrCreateMedia(
          getKeyFromUrl(data.imageUrl),
          data.imageUrl,
          MediaType.image,
          getMimeType(data.imageUrl),
        );
        const option = await prisma.character_personality.upsert({
          where: {
            name_genderId_styleId: { name: data.name, genderId, styleId },
          },
          update: { label: data.label, imageId, sortOrder: i },
          create: {
            name: data.name,
            label: data.label,
            genderId,
            styleId,
            imageId,
            sortOrder: i,
          },
        });
        personalities.set(
          `${genderData.name}:${styleData.name}:${data.name}`,
          option.id,
        );
      }
    }
  }
  console.log(`  - Created ${personalities.size} personality options`);

  // Seed relationships (now with gender/style)
  const relationships = new Map<string, string>();
  for (const genderData of CHARACTER_GENDER_DATA) {
    for (const styleData of CHARACTER_STYLE_DATA) {
      const genderId = genders.get(genderData.name)!;
      const styleId = styles.get(styleData.name)!;

      for (let i = 0; i < RELATIONSHIP_DATA.length; i++) {
        const data = RELATIONSHIP_DATA[i]!;
        const imageId = await getOrCreateMedia(
          getKeyFromUrl(data.imageUrl),
          data.imageUrl,
          MediaType.image,
          getMimeType(data.imageUrl),
        );
        const option = await prisma.character_relationship.upsert({
          where: {
            name_genderId_styleId: { name: data.name, genderId, styleId },
          },
          update: { label: data.label, imageId, sortOrder: i },
          create: {
            name: data.name,
            label: data.label,
            genderId,
            styleId,
            imageId,
            sortOrder: i,
          },
        });
        relationships.set(
          `${genderData.name}:${styleData.name}:${data.name}`,
          option.id,
        );
      }
    }
  }
  console.log(`  - Created ${relationships.size} relationship options`);

  // Seed occupations (now with gender/style)
  const occupations = new Map<string, string>();
  for (const genderData of CHARACTER_GENDER_DATA) {
    for (const styleData of CHARACTER_STYLE_DATA) {
      const genderId = genders.get(genderData.name)!;
      const styleId = styles.get(styleData.name)!;

      for (let i = 0; i < OCCUPATION_DATA.length; i++) {
        const data = OCCUPATION_DATA[i]!;
        const option = await prisma.character_occupation.upsert({
          where: {
            name_genderId_styleId: { name: data.name, genderId, styleId },
          },
          update: { label: data.label, emoji: data.emoji, sortOrder: i },
          create: {
            name: data.name,
            label: data.label,
            genderId,
            styleId,
            emoji: data.emoji,
            sortOrder: i,
          },
        });
        occupations.set(
          `${genderData.name}:${styleData.name}:${data.name}`,
          option.id,
        );
      }
    }
  }
  console.log(`  - Created ${occupations.size} occupation options`);

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
  };
}

async function seedFinancialCategories(): Promise<void> {
  console.log("Seeding financial categories...");

  for (let i = 0; i < FINANCIAL_CATEGORY_DATA.length; i++) {
    const data = FINANCIAL_CATEGORY_DATA[i]!;
    await prisma.financial_category.upsert({
      where: { name: data.name },
      update: {
        label: data.label,
        type: data.type,
        group: data.group,
        description: data.description,
        sortOrder: i,
      },
      create: {
        name: data.name,
        label: data.label,
        type: data.type,
        group: data.group,
        description: data.description,
        sortOrder: i,
      },
    });
  }

  console.log(
    `✓ Seeded ${FINANCIAL_CATEGORY_DATA.length} financial categories`,
  );
}

// ============================================================================
// Main Seed Function
// ============================================================================

async function main() {
  console.log("Starting character seed script...");

  // ==========================================
  // Step 0: Create SUPERADMIN role and admin user
  // ==========================================
  console.log("\n=== Creating SUPERADMIN role ===");

  let superAdminRole = await prisma.role_custom.findUnique({
    where: { name: "SUPERADMIN" },
  });

  if (!superAdminRole) {
    superAdminRole = await prisma.role_custom.create({
      data: {
        name: "SUPERADMIN",
        permissions: ALL_PERMISSIONS,
      },
    });
    console.log(`Created SUPERADMIN role (${superAdminRole.id})`);
  } else {
    superAdminRole = await prisma.role_custom.update({
      where: { id: superAdminRole.id },
      data: { permissions: ALL_PERMISSIONS },
    });
    console.log(`Found existing SUPERADMIN role (${superAdminRole.id})`);
  }

  // Create ADMIN role (same permissions as SUPERADMIN for flexibility)
  console.log("\n=== Creating ADMIN role ===");

  let adminRole = await prisma.role_custom.findUnique({
    where: { name: "ADMIN" },
  });

  if (!adminRole) {
    adminRole = await prisma.role_custom.create({
      data: {
        name: "ADMIN",
        permissions: ALL_PERMISSIONS,
      },
    });
    console.log(`Created ADMIN role (${adminRole.id})`);
  } else {
    adminRole = await prisma.role_custom.update({
      where: { id: adminRole.id },
      data: { permissions: ALL_PERMISSIONS },
    });
    console.log(`Found existing ADMIN role (${adminRole.id})`);
  }

  // Create CUSTOMER role for regular users
  console.log("\n=== Creating CUSTOMER role ===");

  let customerRole = await prisma.role_custom.findUnique({
    where: { name: "CUSTOMER" },
  });

  if (!customerRole) {
    customerRole = await prisma.role_custom.create({
      data: {
        name: "CUSTOMER",
        permissions: CUSTOMER_PERMISSIONS,
      },
    });
    console.log(`Created CUSTOMER role (${customerRole.id})`);
  } else {
    customerRole = await prisma.role_custom.update({
      where: { id: customerRole.id },
      data: { permissions: CUSTOMER_PERMISSIONS },
    });
    console.log(`Found existing CUSTOMER role (${customerRole.id})`);
  }

  // Create AFFILIATE role for affiliate users
  console.log("\n=== Creating AFFILIATE role ===");

  let affiliateRole = await prisma.role_custom.findUnique({
    where: { name: "AFFILIATE" },
  });

  if (!affiliateRole) {
    affiliateRole = await prisma.role_custom.create({
      data: {
        name: "AFFILIATE",
        permissions: AFFILIATE_PERMISSIONS,
      },
    });
    console.log(`Created AFFILIATE role (${affiliateRole.id})`);
  } else {
    affiliateRole = await prisma.role_custom.update({
      where: { id: affiliateRole.id },
      data: { permissions: AFFILIATE_PERMISSIONS },
    });
    console.log(`Found existing AFFILIATE role (${affiliateRole.id})`);
  }

  // Create Admin user with SUPERADMIN role
  console.log("\n=== Creating Admin user ===");

  let adminUser = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (!adminUser) {
    const hashedPassword = await hashPassword(ADMIN_PASSWORD);

    adminUser = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: ADMIN_EMAIL,
        emailVerified: true,
        customRoleId: superAdminRole.id,
      },
    });

    await prisma.account.create({
      data: {
        accountId: adminUser.id,
        providerId: "credential",
        userId: adminUser.id,
        password: hashedPassword,
      },
    });

    console.log(`Created admin user: ${adminUser.email} (${adminUser.id})`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
  } else {
    adminUser = await prisma.user.update({
      where: { id: adminUser.id },
      data: { customRoleId: superAdminRole.id },
    });
    console.log(
      `Found existing admin user: ${adminUser.email} (${adminUser.id})`,
    );
  }

  // Step 0.5: Seed financial categories
  await seedFinancialCategories();

  // Step 1: Seed genders and styles first
  const { genders, styles } = await seedGendersAndStyles();

  // Step 2: Seed variants (needs gender and style IDs)
  await seedVariants(genders, styles);

  // Step 3: Seed option tables (needs gender and style IDs)
  const optionMaps = await seedOptionTables(genders, styles);

  // Step 4: Find or create target user
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
        customRoleId: customerRole.id,
      },
    });

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

  // Step 5: Create Media records using pre-uploaded R2 assets
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

  // Step 6: Generate and create characters
  console.log(`Creating ${TOTAL_CHARACTERS} characters...`);

  // Only use variants that have seeded options (excluding trans-anime which is not active)
  const availableVariants = [
    "girl-realistic",
    "girl-anime",
    "men-realistic",
    "men-anime",
    "trans-realistic",
  ];

  const characters = [];

  for (let i = 0; i < TOTAL_CHARACTERS; i++) {
    const isLive = i < LIVE_CHARACTERS;
    const name = generateCharacterName();

    const age = Math.floor(Math.random() * (35 - 18 + 1)) + 18;

    // Pick a random variant for this character
    const variantName = getRandomItem(availableVariants);
    const [genderStr, styleStr] = variantName.split("-") as [string, string];
    const genderId = genders.get(genderStr);
    const styleId = styles.get(styleStr);

    if (!genderId || !styleId) {
      console.warn(
        `Skipping character: gender or style not found for ${variantName}`,
      );
      continue;
    }

    // Get available options for this gender+style combination
    const optionKey = `${genderStr}:${styleStr}`;

    const variantEthnicities = ETHNICITY_DATA.filter(
      (e) => e.genderName === genderStr && e.styleName === styleStr,
    );
    const variantHairStyles = HAIR_STYLE_DATA.filter(
      (h) => h.genderName === genderStr && h.styleName === styleStr,
    );
    const variantHairColors = HAIR_COLOR_DATA.filter(
      (h) => h.genderName === genderStr && h.styleName === styleStr,
    );
    const variantEyeColors = EYE_COLOR_DATA.filter(
      (e) => e.genderName === genderStr && e.styleName === styleStr,
    );
    const variantBodyTypes = BODY_TYPE_DATA.filter(
      (b) => b.genderName === genderStr && b.styleName === styleStr,
    );
    const variantBreastSizes = BREAST_SIZE_DATA.filter(
      (b) => b.genderName === genderStr && b.styleName === styleStr,
    );

    // Get random option values
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

    const characterData = {
      name,
      posterId: posterMedia.id,
      videoId: videoMedia.id,
      genderId,
      styleId,
      age,
      voice: getRandomItem(voiceOptions),
      isPublic: true,
      isActive: true,
      isLive,
      createdById: user.id,
      // Foreign keys to option tables (use "gender:style:name" key format)
      ethnicityId: optionMaps.ethnicities.get(
        `${optionKey}:${ethnicity.name}`,
      )!,
      hairStyleId: optionMaps.hairStyles.get(`${optionKey}:${hairStyle.name}`)!,
      hairColorId: optionMaps.hairColors.get(`${optionKey}:${hairColor.name}`)!,
      eyeColorId: optionMaps.eyeColors.get(`${optionKey}:${eyeColor.name}`)!,
      bodyTypeId: optionMaps.bodyTypes.get(`${optionKey}:${bodyType.name}`)!,
      breastSizeId: optionMaps.breastSizes.get(
        `${optionKey}:${breastSize.name}`,
      )!,
      personalityId: optionMaps.personalities.get(
        `${optionKey}:${personality.name}`,
      )!,
      relationshipId: optionMaps.relationships.get(
        `${optionKey}:${relationship.name}`,
      )!,
      occupationId: optionMaps.occupations.get(
        `${optionKey}:${occupation.name}`,
      )!,
    };

    const character = await prisma.character.create({
      data: characterData,
    });

    characters.push(character);
    console.log(
      `Created character ${i + 1}/${TOTAL_CHARACTERS}: ${character.name} (${variantName}, isLive: ${character.isLive})`,
    );
  }

  // Step 7: Create Stories for each character
  console.log("Creating stories for characters...");
  let totalStories = 0;

  for (const character of characters) {
    const numStories = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numStories; j++) {
      await prisma.story.create({
        data: {
          characterId: character.id,
          mediaId: posterMedia.id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          isActive: true,
        },
      });
      totalStories++;
    }
  }
  console.log(`Created ${totalStories} stories`);

  // Step 8: Create Reels for each character
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
    const numReels = Math.floor(Math.random() * 2) + 1;
    for (let j = 0; j < numReels; j++) {
      await prisma.reel.create({
        data: {
          characterId: character.id,
          videoId: videoMedia.id,
          thumbnailId: posterMedia.id,
          title: getRandomItem(reelTitles),
          description: getRandomItem(reelDescriptions),
          viewCount: Math.floor(Math.random() * 9900) + 100,
          isActive: true,
        },
      });
      totalReels++;
    }
  }
  console.log(`Created ${totalReels} reels`);

  // Summary
  console.log("\n========================================");
  console.log("=== Seed Summary ===");
  console.log("========================================");
  console.log(`SUPERADMIN Role ID: ${superAdminRole.id}`);
  console.log(`ADMIN Role ID: ${adminRole.id}`);
  console.log(`CUSTOMER Role ID: ${customerRole.id}`);
  console.log(`AFFILIATE Role ID: ${affiliateRole.id}`);
  console.log(`Admin User: ${adminUser.email} (Password: ${ADMIN_PASSWORD})`);
  console.log(`Total characters created: ${characters.length}`);
  console.log(`Live characters: ${characters.filter((c) => c.isLive).length}`);
  console.log(
    `Not live characters: ${characters.filter((c) => !c.isLive).length}`,
  );
  console.log(`Total stories created: ${totalStories}`);
  console.log(`Total reels created: ${totalReels}`);
  console.log(`Poster Media ID: ${posterMedia.id}`);
  console.log(`Video Media ID: ${videoMedia.id}`);
  console.log("========================================");
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
