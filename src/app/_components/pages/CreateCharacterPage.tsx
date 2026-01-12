"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "../atoms/button";
import CreateCharacterStep1 from "../organisms/CreateCharacterStep1";
import CreateCharacterStep2 from "../organisms/CreateCharacterStep2";
import CreateCharacterStep3 from "../organisms/CreateCharacterStep3";
import CreateCharacterStep4 from "../organisms/CreateCharacterStep4";
import CreateCharacterStep5 from "../organisms/CreateCharacterStep5";
import DialogAuth, { type DialogAuthVariant } from "../organisms/DialogAuth";
import { api } from "@/trpc/react";
import { useApp } from "@/app/_contexts/AppContext";
import type {
  CharacterGender,
  CharacterStyle,
} from "../../../../generated/prisma";

// ============================================================================
// Schemas
// ============================================================================

// Character Type (variant) - matches Prisma CharacterGender enum
export const characterTypeSchema = z.enum(["girl", "trans"]);

// Step 1: Style
export const styleSchema = z.enum(["realistic", "anime"]);

// Full character form schema - uses IDs for dynamic options
export const characterFormSchema = z.object({
  // Character type (variant)
  characterType: characterTypeSchema,

  // Step 1
  style: styleSchema,
  // Media URLs from step 1 selection (R2 URLs)
  posterUrl: z.string().optional(),
  videoUrl: z.string().optional(),

  // Step 2 - ID-based
  ethnicityId: z.string().min(1, "Please select an ethnicity"),
  age: z.number().min(18, "Must be at least 18").max(55, "Maximum age is 55"),

  // Step 3 - ID-based
  hairStyleId: z.string().min(1, "Please select a hair style"),
  hairColorId: z.string().min(1, "Please select a hair color"),
  eyeColorId: z.string().min(1, "Please select an eye color"),

  // Step 4 - ID-based
  bodyTypeId: z.string().min(1, "Please select a body type"),
  breastSizeId: z.string().min(1, "Please select a breast size"),

  // Step 5 - ID-based for dynamic options
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be at most 20 characters"),
  personalityId: z.string().min(1, "Please select a personality"),
  relationshipId: z.string().min(1, "Please select a relationship"),
  occupationId: z.string().min(1, "Please select an occupation"),
  kinkIds: z
    .array(z.string())
    .min(1, "Select at least 1 kink")
    .max(3, "Maximum 3 kinks"),
  voice: z.string().min(1, "Please select a voice"),

  // Visibility
  isPublic: z.boolean(),
});

export type CharacterFormData = z.infer<typeof characterFormSchema>;

// Step-specific validation schemas
export const step1Schema = z.object({
  characterType: characterTypeSchema,
  style: styleSchema,
});

export const step2Schema = z.object({
  ethnicityId: z.string().min(1, "Please select an ethnicity"),
  age: z.number().min(18).max(55),
});

export const step3Schema = z.object({
  hairStyleId: z.string().min(1, "Please select a hair style"),
  hairColorId: z.string().min(1, "Please select a hair color"),
  eyeColorId: z.string().min(1, "Please select an eye color"),
});

export const step4Schema = z.object({
  bodyTypeId: z.string().min(1, "Please select a body type"),
  breastSizeId: z.string().min(1, "Please select a breast size"),
});

export const step5Schema = z.object({
  name: z.string().min(2).max(20),
  personalityId: z.string().min(1, "Please select a personality"),
  relationshipId: z.string().min(1, "Please select a relationship"),
  occupationId: z.string().min(1, "Please select an occupation"),
  kinkIds: z.array(z.string()).min(1).max(3),
  voice: z.string().min(1, "Please select a voice"),
});

// ============================================================================
// Option Types
// ============================================================================

export type VariantOption = {
  id: string;
  name: string;
  label: string;
  imageSrc: string;
  videoSrc?: string | null;
};

export type PersonalityOption = {
  id: string;
  name: string;
  label: string;
  imageSrc?: string | null;
};

export type RelationshipOption = {
  id: string;
  name: string;
  label: string;
  imageSrc?: string | null;
};

export type OccupationOption = {
  id: string;
  name: string;
  label: string;
  emoji?: string | null;
};

export type KinkOption = {
  id: string;
  name: string;
  label: string;
};

// ============================================================================
// Hardcoded Constants (Voice only - kept hardcoded per plan)
// ============================================================================

// Voice options with labels (kept hardcoded)
export const VOICE_OPTIONS = [
  { value: "voice-1", label: "Voice 1", description: "Confident" },
  { value: "voice-2", label: "Voice 2", description: "Cheerful" },
  { value: "voice-3", label: "Voice 3", description: "Dominant" },
  { value: "voice-4", label: "Voice 4", description: "Innocent" },
  { value: "voice-5", label: "Voice 5", description: "Sweet" },
  { value: "voice-6", label: "Voice 6", description: "Sultry" },
  { value: "voice-7", label: "Voice 7", description: "Calm" },
  { value: "voice-8", label: "Voice 8", description: "Thoughtful" },
  { value: "voice-9", label: "Voice 9", description: "Whimsical" },
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

// Helper to map form characterType to Prisma CharacterGender
const mapCharacterTypeToGender = (
  characterType: "girl" | "trans",
): CharacterGender => {
  return characterType as CharacterGender;
};

// Helper to map form style to Prisma CharacterStyle
const mapStyleToCharacterStyle = (
  style: "realistic" | "anime",
): CharacterStyle => {
  return style as CharacterStyle;
};

const CreateCharacterPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useApp();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [step5Attempted, setStep5Attempted] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogVariant, setAuthDialogVariant] =
    useState<DialogAuthVariant>("sign-in");
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
      characterType: "girl",
      age: 21,
      kinkIds: [],
      isPublic: false,
    },
    mode: "onChange",
  });

  const characterType = watch("characterType");
  const style = watch("style");

  // Fetch character variants for Step 1
  const { data: variantsData, isLoading: variantsLoading } =
    api.options.getCharacterVariants.useQuery();

  // Fetch variant-specific options (refetches when characterType or style changes)
  const {
    data: variantOptions,
    isLoading: variantLoading,
    isFetching: variantFetching,
  } = api.options.getVariantOptions.useQuery(
    {
      gender: mapCharacterTypeToGender(characterType ?? "girl"),
      style: mapStyleToCharacterStyle(style ?? "realistic"),
    },
    {
      enabled: !!characterType && !!style,
    },
  );

  // Fetch universal options once (personalities, relationships, occupations, kinks)
  const { data: universalOptions, isLoading: universalLoading } =
    api.options.getUniversalOptions.useQuery();

  // Reset variant-specific form values when variant changes
  useEffect(() => {
    if (variantFetching) {
      // Clear variant-specific selections when fetching new options
      setValue("ethnicityId", "");
      setValue("hairStyleId", "");
      setValue("hairColorId", "");
      setValue("eyeColorId", "");
      setValue("bodyTypeId", "");
      setValue("breastSizeId", "");
    }
  }, [variantFetching, setValue]);

  // Proceed to step 5 when user authenticates while dialog is open
  useEffect(() => {
    if (isAuthenticated && authDialogOpen && currentStep === 4) {
      setAuthDialogOpen(false);
      setCurrentStep(5);
    }
  }, [isAuthenticated, authDialogOpen, currentStep]);

  const createCharacter = api.character.create.useMutation({
    onSuccess: (_, variables) => {
      toast.success("Character created successfully!");

      // Redirect based on character type and style
      const { characterType, style } = variables;
      if (characterType === "men") {
        router.push("/realistic-men");
      } else if (style === "anime") {
        router.push("/anime-girl");
      } else {
        router.push("/realistic-girl");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const validateCurrentStep = async (): Promise<boolean> => {
    const schema = stepSchemas[currentStep];

    // Get only the fields for the current step
    const stepFields = Object.keys(schema.shape) as (keyof CharacterFormData)[];

    // Trigger validation for current step fields
    const results = await Promise.all(
      stepFields.map((field) => trigger(field)),
    );

    return results.every((result) => result === true);
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();

    if (isValid) {
      if (currentStep < 5) {
        const nextStep = currentStep + 1;
        // Check if user is authenticated before allowing step 5
        if (nextStep === 5 && !isAuthenticated) {
          setAuthDialogOpen(true);
          return;
        }
        setCurrentStep(nextStep as Step);
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

  const onSubmit = (data: CharacterFormData) => {
    // Ensure posterUrl and videoUrl are set
    if (!data.posterUrl || !data.videoUrl) {
      toast.error("Missing media URLs");
      return;
    }

    createCharacter.mutate({
      characterType: data.characterType,
      style: data.style,
      ethnicityId: data.ethnicityId,
      age: data.age,
      hairStyleId: data.hairStyleId,
      hairColorId: data.hairColorId,
      eyeColorId: data.eyeColorId,
      bodyTypeId: data.bodyTypeId,
      breastSizeId: data.breastSizeId,
      name: data.name,
      personalityId: data.personalityId,
      relationshipId: data.relationshipId,
      occupationId: data.occupationId,
      kinkIds: data.kinkIds,
      voice: data.voice,
      posterUrl: data.posterUrl,
      videoUrl: data.videoUrl,
      isPublic: data.isPublic,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CreateCharacterStep1
            watch={watch}
            setValue={setValue}
            errors={errors}
            variants={variantsData?.data?.variants ?? []}
            loading={variantsLoading}
          />
        );
      case 2:
        return (
          <CreateCharacterStep2
            watch={watch}
            setValue={setValue}
            errors={errors}
            ethnicities={variantOptions?.data?.ethnicities ?? []}
            loading={variantLoading || variantFetching}
          />
        );
      case 3:
        return (
          <CreateCharacterStep3
            watch={watch}
            setValue={setValue}
            errors={errors}
            hairStyles={variantOptions?.data?.hairStyles ?? []}
            hairColors={variantOptions?.data?.hairColors ?? []}
            eyeColors={variantOptions?.data?.eyeColors ?? []}
            loading={variantLoading || variantFetching}
          />
        );
      case 4:
        return (
          <CreateCharacterStep4
            watch={watch}
            setValue={setValue}
            errors={errors}
            bodyTypes={variantOptions?.data?.bodyTypes ?? []}
            breastSizes={variantOptions?.data?.breastSizes ?? []}
            loading={variantLoading || variantFetching}
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
            personalities={universalOptions?.data?.personalities ?? []}
            relationships={universalOptions?.data?.relationships ?? []}
            occupations={universalOptions?.data?.occupations ?? []}
            kinks={universalOptions?.data?.kinks ?? []}
            loading={universalLoading}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === 5;

  return (
    <div ref={containerRef} className="bg-background flex h-full flex-col">
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
              <Button
                type="button"
                plain
                onClick={handleBack}
                disabled={createCharacter.isPending}
              >
                Back
              </Button>
            )}

            {isLastStep ? (
              <Button
                type="button"
                onClick={handleCreateCharacter}
                loading={createCharacter.isPending}
                disabled={createCharacter.isPending}
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

      {/* Auth Dialog */}
      <DialogAuth
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        variant={authDialogVariant}
        onVariantChange={setAuthDialogVariant}
      />
    </div>
  );
};

export default CreateCharacterPage;
