import { z } from "zod";

// Step 1: Style
export const styleSchema = z.enum(["realistic", "anime"]);

// Step 2: Ethnicity & Age
export const ethnicitySchema = z.enum([
  "caucasian",
  "asian",
  "black",
  "latina",
  "arab",
]);

// Step 3: Hair & Eyes
export const hairStyleSchema = z.enum([
  "straight",
  "bangs",
  "curly",
  "bun",
  "short",
  "ponytail",
]);

export const hairColorSchema = z.enum([
  "brunette",
  "blonde",
  "black",
  "redhead",
  "pink",
]);

export const eyeColorSchema = z.enum(["brown", "blue", "green"]);

// Step 4: Body
export const bodyTypeSchema = z.enum([
  "skinny",
  "athletic",
  "average",
  "curvy",
  "bbw",
]);

export const breastSizeSchema = z.enum([
  "small",
  "medium",
  "large",
  "extra-large",
]);

// Step 5: Personality
export const personalitySchema = z.enum([
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
]);

export const relationshipSchema = z.enum([
  "stranger",
  "girlfriend",
  "sex-friend",
  "school-mate",
  "work-colleague",
  "wife",
  "mistress",
  "friend",
  "step-sister",
  "step-mom",
]);

export const occupationSchema = z.enum([
  "student",
  "dancer",
  "model",
  "stripper",
  "maid",
  "cam-girl",
  "boss-ceo",
  "babysitter",
  "pornstar",
  "streamer",
  "bartender",
  "tech-engineer",
  "lifeguard",
  "cashier",
  "massage-therapist",
  "teacher",
  "nurse",
  "secretary",
  "yoga-instructor",
  "fitness-coach",
]);

export const voiceSchema = z.enum([
  "voice-1",
  "voice-2",
  "voice-3",
  "voice-4",
  "voice-5",
  "voice-6",
  "voice-7",
  "voice-8",
  "voice-9",
]);

export const kinksSchema = z
  .array(z.string())
  .min(1, "Select at least 1 kink")
  .max(3, "Maximum 3 kinks");

// Full character form schema
export const characterFormSchema = z.object({
  // Step 1
  style: styleSchema,

  // Step 2
  ethnicity: ethnicitySchema,
  age: z.number().min(18, "Must be at least 18").max(55, "Maximum age is 55"),

  // Step 3
  hairStyle: hairStyleSchema,
  hairColor: hairColorSchema,
  eyeColor: eyeColorSchema,

  // Step 4
  bodyType: bodyTypeSchema,
  breastSize: breastSizeSchema,

  // Step 5
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be at most 20 characters"),
  personality: personalitySchema,
  relationship: relationshipSchema,
  occupation: occupationSchema,
  kinks: kinksSchema,
  voice: voiceSchema,
});

export type CharacterFormData = z.infer<typeof characterFormSchema>;

// Step-specific validation schemas
export const step1Schema = z.object({
  style: styleSchema,
});

export const step2Schema = z.object({
  ethnicity: ethnicitySchema,
  age: z.number().min(18).max(55),
});

export const step3Schema = z.object({
  hairStyle: hairStyleSchema,
  hairColor: hairColorSchema,
  eyeColor: eyeColorSchema,
});

export const step4Schema = z.object({
  bodyType: bodyTypeSchema,
  breastSize: breastSizeSchema,
});

export const step5Schema = z.object({
  name: z.string().min(2).max(20),
  personality: personalitySchema,
  relationship: relationshipSchema,
  occupation: occupationSchema,
  kinks: kinksSchema,
  voice: voiceSchema,
});

// Available kinks list
export const KINKS_LIST = [
  "Daddy Dominance",
  "Bondage",
  "Spanking",
  "Collar & Leash",
  "Punishment",
  "Humiliation",
  "Public Play",
  "Roleplay",
  "Anal Play",
  "Oral Play",
  "Cum Play",
  "Creampie",
  "Squirting",
  "Dirty Talk",
  "Breeding",
  "Edging",
  "Obedience",
  "Control",
  "Inexperienced",
  "Shy Flirting",
  "Playful Teasing",
  "Cuddling",
  "Slow & Sensual",
  "Hair Pulling",
] as const;

// Voice options with labels
export const VOICE_OPTIONS = [
  { value: "voice-1" as const, label: "Voice 1", description: "Confident" },
  { value: "voice-2" as const, label: "Voice 2", description: "Cheerful" },
  { value: "voice-3" as const, label: "Voice 3", description: "Dominant" },
  { value: "voice-4" as const, label: "Voice 4", description: "Innocent" },
  { value: "voice-5" as const, label: "Voice 5", description: "Sweet" },
  { value: "voice-6" as const, label: "Voice 6", description: "Sultry" },
  { value: "voice-7" as const, label: "Voice 7", description: "Calm" },
  { value: "voice-8" as const, label: "Voice 8", description: "Thoughtful" },
  { value: "voice-9" as const, label: "Voice 9", description: "Whimsical" },
] as const;

// Personality options with emojis
export const PERSONALITY_OPTIONS = [
  { value: "nympho" as const, label: "Nympho", emoji: "\uD83D\uDD25" },
  { value: "lover" as const, label: "Lover", emoji: "\uD83D\uDC96" },
  { value: "submissive" as const, label: "Submissive", emoji: "\uD83E\uDD70" },
  { value: "dominant" as const, label: "Dominant", emoji: "\uD83D\uDC60" },
  { value: "temptress" as const, label: "Temptress", emoji: "\uD83C\uDF39" },
  { value: "innocent" as const, label: "Innocent", emoji: "\uD83C\uDF1F" },
  { value: "caregiver" as const, label: "Caregiver", emoji: "\uD83D\uDC9A" },
  {
    value: "experimenter" as const,
    label: "Experimenter",
    emoji: "\uD83C\uDFB0",
  },
  { value: "mean" as const, label: "Mean", emoji: "\uD83D\uDC99" },
  { value: "confidant" as const, label: "Confidant", emoji: "\uD83E\uDD1D" },
  { value: "shy" as const, label: "Shy", emoji: "\uD83E\uDD7A" },
  { value: "queen" as const, label: "Queen", emoji: "\uD83D\uDC51" },
] as const;

// Relationship options with emojis
export const RELATIONSHIP_OPTIONS = [
  {
    value: "stranger" as const,
    label: "Stranger",
    emoji: "\uD83D\uDD76\uFE0F",
  },
  { value: "girlfriend" as const, label: "Girlfriend", emoji: "\uD83D\uDC96" },
  { value: "sex-friend" as const, label: "Sex Friend", emoji: "\u2640\uFE0F" },
  {
    value: "school-mate" as const,
    label: "School Mate",
    emoji: "\uD83D\uDCD6",
  },
  {
    value: "work-colleague" as const,
    label: "Work Colleague",
    emoji: "\uD83D\uDCBC",
  },
  { value: "wife" as const, label: "Wife", emoji: "\uD83D\uDC8D" },
  { value: "mistress" as const, label: "Mistress", emoji: "\uD83D\uDC51" },
  { value: "friend" as const, label: "Friend", emoji: "\uD83E\uDD1D" },
  {
    value: "step-sister" as const,
    label: "Step Sister",
    emoji: "\uD83D\uDC9B",
  },
  { value: "step-mom" as const, label: "Step Mom", emoji: "\uD83D\uDC9B" },
] as const;

// Occupation options with emojis
export const OCCUPATION_OPTIONS = [
  { value: "student" as const, label: "Student", emoji: "\uD83C\uDF93" },
  { value: "dancer" as const, label: "Dancer", emoji: "\uD83D\uDC83" },
  { value: "model" as const, label: "Model", emoji: "\uD83D\uDC57" },
  { value: "stripper" as const, label: "Stripper", emoji: "\uD83E\uDE72" },
  { value: "maid" as const, label: "Maid", emoji: "\uD83E\uDDF9" },
  { value: "cam-girl" as const, label: "Cam Girl", emoji: "\uD83D\uDCF7" },
  { value: "boss-ceo" as const, label: "Boss / CEO", emoji: "\uD83C\uDFE2" },
  {
    value: "babysitter" as const,
    label: "Babysitter / Au Pair",
    emoji: "\uD83C\uDF7C",
  },
  { value: "pornstar" as const, label: "Pornstar", emoji: "\uD83C\uDFA5" },
  { value: "streamer" as const, label: "Streamer", emoji: "\uD83C\uDFAE" },
  { value: "bartender" as const, label: "Bartender", emoji: "\uD83C\uDF78" },
  {
    value: "tech-engineer" as const,
    label: "Tech Engineer",
    emoji: "\uD83D\uDCBB",
  },
  {
    value: "lifeguard" as const,
    label: "Lifeguard",
    emoji: "\uD83C\uDFD6\uFE0F",
  },
  { value: "cashier" as const, label: "Cashier", emoji: "\uD83D\uDCB5" },
  {
    value: "massage-therapist" as const,
    label: "Massage Therapist",
    emoji: "\uD83D\uDC86",
  },
  {
    value: "teacher" as const,
    label: "Teacher",
    emoji: "\uD83D\uDC69\u200D\uD83C\uDFEB",
  },
  { value: "nurse" as const, label: "Nurse", emoji: "\uD83D\uDC89" },
  { value: "secretary" as const, label: "Secretary", emoji: "\uD83D\uDCCB" },
  {
    value: "yoga-instructor" as const,
    label: "Yoga Instructor",
    emoji: "\uD83E\uDDD8",
  },
  {
    value: "fitness-coach" as const,
    label: "Fitness Coach",
    emoji: "\uD83C\uDFCB\uFE0F",
  },
] as const;
