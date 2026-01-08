"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../atoms/button";
import CreateCharacterStep1 from "../organisms/CreateCharacterStep1";
import CreateCharacterStep2 from "../organisms/CreateCharacterStep2";
import CreateCharacterStep3 from "../organisms/CreateCharacterStep3";
import CreateCharacterStep4 from "../organisms/CreateCharacterStep4";
import CreateCharacterStep5 from "../organisms/CreateCharacterStep5";

// ============================================================================
// Schemas
// ============================================================================

// Character Type (variant)
export const characterTypeSchema = z.enum(["girls", "trans"]);

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
  // Anime-only colors
  "blue",
  "purple",
  "white",
  "multicolor",
]);

export const eyeColorSchema = z.enum([
  "brown",
  "blue",
  "green",
  // Anime-only colors
  "red",
  "yellow",
]);

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
  // Character type (variant)
  characterType: characterTypeSchema,

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
  characterType: characterTypeSchema,
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

// ============================================================================
// Option Constants
// ============================================================================

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
  { value: "experimenter" as const, label: "Experimenter", emoji: "\uD83C\uDFB0" },
  { value: "mean" as const, label: "Mean", emoji: "\uD83D\uDC99" },
  { value: "confidant" as const, label: "Confidant", emoji: "\uD83E\uDD1D" },
  { value: "shy" as const, label: "Shy", emoji: "\uD83E\uDD7A" },
  { value: "queen" as const, label: "Queen", emoji: "\uD83D\uDC51" },
] as const;

// Relationship options with emojis
export const RELATIONSHIP_OPTIONS = [
  { value: "stranger" as const, label: "Stranger", emoji: "🕶️" },
  { value: "girlfriend" as const, label: "Girlfriend", emoji: "💖" },
  { value: "sex-friend" as const, label: "Sex Friend", emoji: "♀️" },
  { value: "school-mate" as const, label: "School Mate", emoji: "📖" },
  { value: "work-colleague" as const, label: "Work Colleague", emoji: "💼" },
  { value: "wife" as const, label: "Wife", emoji: "💍" },
  { value: "mistress" as const, label: "Mistress", emoji: "👑" },
  { value: "friend" as const, label: "Friend", emoji: "🤝" },
  { value: "step-sister" as const, label: "Step Sister", emoji: "💛" },
  { value: "step-mom" as const, label: "Step Mom", emoji: "💛" },
  { value: "step-daughter" as const, label: "Step Daughter", emoji: "💛" },
  { value: "landlord" as const, label: "Landlord", emoji: "🔑" },
  { value: "sugar-baby" as const, label: "Sugar Baby", emoji: "💎" },
  { value: "boss" as const, label: "Boss", emoji: "👔" },
  { value: "teacher" as const, label: "Teacher", emoji: "📚" },
  { value: "student" as const, label: "Student", emoji: "🎓" },
  { value: "neighbour" as const, label: "Neighbour", emoji: "🏠" },
  { value: "mother-in-law" as const, label: "Mother-In-Law", emoji: "👩‍👧" },
  { value: "sister-in-law" as const, label: "Sister-In-Law", emoji: "👭" },
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
  { value: "tech-engineer" as const, label: "Tech Engineer", emoji: "\uD83D\uDCBB" },
  { value: "lifeguard" as const, label: "Lifeguard", emoji: "\uD83C\uDFD6\uFE0F" },
  { value: "cashier" as const, label: "Cashier", emoji: "\uD83D\uDCB5" },
  {
    value: "massage-therapist" as const,
    label: "Massage Therapist",
    emoji: "\uD83D\uDC86",
  },
  { value: "teacher" as const, label: "Teacher", emoji: "\uD83D\uDC69\u200D\uD83C\uDFEB" },
  { value: "nurse" as const, label: "Nurse", emoji: "\uD83D\uDC89" },
  { value: "secretary" as const, label: "Secretary", emoji: "\uD83D\uDCCB" },
  { value: "yoga-instructor" as const, label: "Yoga Instructor", emoji: "\uD83E\uDDD8" },
  { value: "fitness-coach" as const, label: "Fitness Coach", emoji: "\uD83C\uDFCB\uFE0F" },
] as const;

// ============================================================================
// Component
// ============================================================================

type Step = 1 | 2 | 3 | 4 | 5;

const stepSchemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
  5: step5Schema,
};

const CreateCharacterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step5Attempted, setStep5Attempted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CharacterFormData>({
    resolver: zodResolver(characterFormSchema),
    defaultValues: {
      characterType: "girls",
      age: 21,
      kinks: [],
    },
    mode: "onChange",
  });

  const validateCurrentStep = async (): Promise<boolean> => {
    const schema = stepSchemas[currentStep];

    // Get only the fields for the current step
    const stepFields = Object.keys(schema.shape) as (keyof CharacterFormData)[];

    // Trigger validation for current step fields
    const results = await Promise.all(
      stepFields.map((field) => trigger(field))
    );

    return results.every((result) => result === true);
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();

    if (isValid) {
      if (currentStep < 5) {
        setCurrentStep((prev) => (prev + 1) as Step);
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleCreateCharacter = async () => {
    setStep5Attempted(true);
    const isValid = await validateCurrentStep();
    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }
    // Trigger actual form submission
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: CharacterFormData) => {
    setIsSubmitting(true);

    try {
      // For now, just log the data and show success toast
      console.log("Character Form Data:", data);
      toast.success("Character created successfully!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const characterType = watch("characterType");
  const style = watch("style");

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CreateCharacterStep1
            watch={watch}
            setValue={setValue}
            errors={errors}
          />
        );
      case 2:
        return (
          <CreateCharacterStep2
            watch={watch}
            setValue={setValue}
            errors={errors}
            characterType={characterType}
            style={style}
          />
        );
      case 3:
        return (
          <CreateCharacterStep3
            watch={watch}
            setValue={setValue}
            errors={errors}
            characterType={characterType}
            style={style}
          />
        );
      case 4:
        return (
          <CreateCharacterStep4
            watch={watch}
            setValue={setValue}
            errors={errors}
            characterType={characterType}
            style={style}
          />
        );
      case 5:
        return (
          <CreateCharacterStep5
            watch={watch}
            setValue={setValue}
            register={register}
            errors={step5Attempted ? errors : {}}
            containerRef={containerRef}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === 5;

  return (
    <div ref={containerRef} className="flex h-full flex-col bg-background">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8">
        {/* Step Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col"
        >
          <div className="flex flex-1 items-center justify-center">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 py-4 pb-20 sm:pb-4">
            {currentStep > 1 && (
              <Button type="button" plain onClick={handleBack}>
                Back
              </Button>
            )}

            {isLastStep ? (
              <Button
                type="button"
                onClick={handleCreateCharacter}
                loading={isSubmitting}
                className="min-w-48"
              >
                Create Character
                <ArrowRight data-slot="icon" className="ml-2" />
              </Button>
            ) : (
              <Button type="button" onClick={handleNext} className="min-w-48">
                NEXT
                <ArrowRight data-slot="icon" className="ml-2" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCharacterPage;
