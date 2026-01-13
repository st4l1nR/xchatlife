"use client";

import React, {
  useState,
  useCallback,
  Suspense,
  useMemo,
  useEffect,
} from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TabGroup, TabPanels } from "@headlessui/react";
import toast from "react-hot-toast";

import { api } from "@/trpc/react";
import { Button } from "../atoms/button";
import { Spinner } from "../atoms/spinner";
import SidebarCharactersCreateEdit from "../organisms/SidebarCharactersCreateEdit";
import TabCharactersCreateEdit1, {
  type SelectOption,
} from "../organisms/TabCharactersCreateEdit1";
import TabCharactersCreateEdit2 from "../organisms/TabCharactersCreateEdit2";
import TabCharactersCreateEdit3 from "../organisms/TabCharactersCreateEdit3";
import TabCharactersCreateEdit4, {
  type PrivateContentItem,
} from "../organisms/TabCharactersCreateEdit4";
import type { TagOption } from "../molecules/InputTags";
import type { MediaUploadItem } from "../organisms/ListCardMediaUpload";
import type { StoryUploadItem } from "../organisms/TabCharactersCreateEdit3";
import type { PrivateContentFormData } from "../organisms/DialogCreateUpdatePrivateContent";

// ============================================================================
// Form Schema
// ============================================================================

const characterFormSchema = z.object({
  // Profile fields
  posterImage: z.any().optional(),
  posterVideo: z.any().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.coerce.number().min(1, "Age is required").max(999),
  gender: z.string().optional(),
  description: z.string().optional(),
  style: z.string().optional(),
  kinks: z.array(z.string()).max(3, "Maximum 3 kinks allowed").optional(),
  ethnicity: z.string().optional(),
  personality: z.string().optional(),
  hairStyle: z.string().optional(),
  hairColor: z.string().optional(),
  eyeColor: z.string().optional(),
  bodyType: z.string().optional(),
  breastSize: z.string().optional(),
  occupation: z.string().optional(),
  relationship: z.string().optional(),
  // Reels & Stories
  reels: z.array(z.any()).optional(),
  stories: z.array(z.any()).optional(),
  // State
  isPublic: z.boolean(),
});

export type CharacterFormData = z.infer<typeof characterFormSchema>;

// ============================================================================
// Mock Data Types
// ============================================================================

export type DashboardCharactersCreateUpdatePageMockData = {
  character?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarSrc?: string;
    bannerSrc?: string;
    posterImage?: string;
    posterVideo?: string;
    age?: number;
    gender?: string;
    description?: string;
    style?: string;
    kinks?: string[];
    ethnicity?: string;
    personality?: string;
    hairStyle?: string;
    hairColor?: string;
    eyeColor?: string;
    bodyType?: string;
    breastSize?: string;
    occupation?: string;
    relationship?: string;
    reels?: MediaUploadItem[];
    stories?: StoryUploadItem[];
    isPublic: boolean;
  };
  dropdownOptions: {
    styleOptions: SelectOption[];
    kinksOptions: TagOption[];
    ethnicityOptions: SelectOption[];
    personalityOptions: SelectOption[];
    hairStyleOptions: SelectOption[];
    hairColorOptions: SelectOption[];
    eyeColorOptions: SelectOption[];
    bodyTypeOptions: SelectOption[];
    breastSizeOptions: SelectOption[];
    occupationOptions: SelectOption[];
    relationshipOptions: SelectOption[];
  };
  privateContents?: PrivateContentItem[];
};

export type DashboardCharactersCreateUpdatePageProps = {
  className?: string;
  id?: string;
  mock?: DashboardCharactersCreateUpdatePageMockData;
};

// ============================================================================
// Main Component Content
// ============================================================================

function DashboardCharactersCreateUpdatePageContent({
  className,
  id,
  mock,
}: DashboardCharactersCreateUpdatePageProps) {
  const router = useRouter();
  const isEditMode = Boolean(id);
  const utils = api.useUtils();

  // Loading states for buttons
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Private content state (managed locally for mock)
  const [privateContents, setPrivateContents] = useState<PrivateContentItem[]>(
    mock?.privateContents ?? [],
  );

  // ============================================================================
  // tRPC Queries (only when not using mock data)
  // ============================================================================

  // Fetch character data for edit mode
  const { data: characterData, isLoading: isLoadingCharacter } =
    api.character.getByIdForEdit.useQuery(
      { id: id! },
      { enabled: !mock && Boolean(id) },
    );

  // Fetch universal options (personalities, relationships, occupations, kinks)
  const { data: universalOptionsData, isLoading: isLoadingUniversalOptions } =
    api.options.getUniversalOptions.useQuery(undefined, { enabled: !mock });

  // Fetch variant-specific options based on character's gender/style
  const characterGender = characterData?.data?.gender as
    | "girl"
    | "men"
    | "trans"
    | undefined;
  const characterStyle = characterData?.data?.style as
    | "realistic"
    | "anime"
    | undefined;
  const { data: variantOptionsData, isLoading: isLoadingVariantOptions } =
    api.options.getVariantOptions.useQuery(
      { gender: characterGender!, style: characterStyle! },
      { enabled: !mock && Boolean(characterGender) && Boolean(characterStyle) },
    );

  // ============================================================================
  // tRPC Mutations
  // ============================================================================

  const updateMutation = api.character.update.useMutation({
    onSuccess: () => {
      toast.success("Character updated successfully");
      void utils.character.getForDashboard.invalidate();
      void utils.character.getByIdForEdit.invalidate({ id: id! });
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update character");
    },
  });

  // ============================================================================
  // Transform API data to component format
  // ============================================================================

  // Transform universal options to SelectOption format
  const transformedUniversalOptions = useMemo(() => {
    if (!universalOptionsData?.data) return null;
    const data = universalOptionsData.data;
    return {
      personalityOptions: data.personalities.map((p) => ({
        value: p.id,
        label: p.label,
      })),
      relationshipOptions: data.relationships.map((r) => ({
        value: r.id,
        label: r.label,
      })),
      occupationOptions: data.occupations.map((o) => ({
        value: o.id,
        label: o.label,
      })),
      kinksOptions: data.kinks.map((k) => ({ value: k.id, label: k.label })),
    };
  }, [universalOptionsData]);

  // Transform variant options to SelectOption format
  const transformedVariantOptions = useMemo(() => {
    if (!variantOptionsData?.data) return null;
    const data = variantOptionsData.data;
    return {
      ethnicityOptions: data.ethnicities.map((e) => ({
        value: e.id,
        label: e.label,
      })),
      hairStyleOptions: data.hairStyles.map((h) => ({
        value: h.id,
        label: h.label,
      })),
      hairColorOptions: data.hairColors.map((h) => ({
        value: h.id,
        label: h.label,
      })),
      eyeColorOptions: data.eyeColors.map((e) => ({
        value: e.id,
        label: e.label,
      })),
      bodyTypeOptions: data.bodyTypes.map((b) => ({
        value: b.id,
        label: b.label,
      })),
      breastSizeOptions: data.breastSizes.map((b) => ({
        value: b.id,
        label: b.label,
      })),
    };
  }, [variantOptionsData]);

  // Transform character data for reels
  const transformedReels = useMemo((): MediaUploadItem[] | undefined => {
    if (!characterData?.data?.reels) return undefined;
    return characterData.data.reels.map(
      (r: {
        id: string;
        url: string;
        thumbnailUrl?: string | null;
        mediaType: "video" | "image";
        sortOrder: number;
      }) => ({
        id: r.id,
        url: r.url,
        thumbnailUrl: r.thumbnailUrl ?? undefined,
        mediaType: r.mediaType,
      }),
    );
  }, [characterData?.data?.reels]);

  // Transform character data for stories
  const transformedStories = useMemo((): StoryUploadItem[] | undefined => {
    if (!characterData?.data?.stories) return undefined;
    return characterData.data.stories.map(
      (s: {
        id: string;
        url: string;
        thumbnailUrl?: string | null;
        mediaType: "video" | "image";
        sortOrder: number;
        expiresAt: Date;
      }) => ({
        id: s.id,
        url: s.url,
        thumbnailUrl: s.thumbnailUrl ?? undefined,
        mediaType: s.mediaType,
      }),
    );
  }, [characterData?.data?.stories]);

  // Get default values from mock data or API data
  const defaultValues = useMemo((): Partial<CharacterFormData> => {
    // If using mock data
    if (mock?.character) {
      return {
        firstName: mock.character.firstName,
        lastName: mock.character.lastName,
        age: mock.character.age,
        gender: mock.character.gender,
        description: mock.character.description,
        style: mock.character.style,
        kinks: mock.character.kinks,
        ethnicity: mock.character.ethnicity,
        personality: mock.character.personality,
        hairStyle: mock.character.hairStyle,
        hairColor: mock.character.hairColor,
        eyeColor: mock.character.eyeColor,
        bodyType: mock.character.bodyType,
        breastSize: mock.character.breastSize,
        occupation: mock.character.occupation,
        relationship: mock.character.relationship,
        reels: mock.character.reels,
        stories: mock.character.stories,
        isPublic: mock.character.isPublic,
      };
    }

    // If using API data (edit mode)
    if (characterData?.data) {
      const data = characterData.data;
      return {
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age,
        gender: data.gender,
        description: "",
        style: data.style,
        kinks: data.kinkIds,
        ethnicity: data.ethnicityId,
        personality: data.personalityId,
        hairStyle: data.hairStyleId,
        hairColor: data.hairColorId,
        eyeColor: data.eyeColorId,
        bodyType: data.bodyTypeId,
        breastSize: data.breastSizeId,
        occupation: data.occupationId,
        relationship: data.relationshipId,
        reels: transformedReels,
        stories: transformedStories,
        isPublic: data.isPublic,
      };
    }

    // Default empty values for create mode
    return {
      firstName: "",
      lastName: "",
      age: undefined,
      gender: "",
      description: "",
      style: "",
      kinks: [],
      ethnicity: "",
      personality: "",
      hairStyle: "",
      hairColor: "",
      eyeColor: "",
      bodyType: "",
      breastSize: "",
      occupation: "",
      relationship: "",
      reels: [],
      stories: [],
      isPublic: false,
    };
  }, [
    mock?.character,
    characterData?.data,
    transformedReels,
    transformedStories,
  ]);

  // Form setup
  const methods = useForm<CharacterFormData>({
    resolver: zodResolver(characterFormSchema),
    defaultValues,
  });

  const { handleSubmit, watch, setValue, reset } = methods;
  const isPublic = watch("isPublic");

  // Reset form when character data loads
  useEffect(() => {
    if (characterData?.data && !mock) {
      const data = characterData.data;
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age,
        gender: data.gender,
        description: "",
        style: data.style,
        kinks: data.kinkIds,
        ethnicity: data.ethnicityId,
        personality: data.personalityId,
        hairStyle: data.hairStyleId,
        hairColor: data.hairColorId,
        eyeColor: data.eyeColorId,
        bodyType: data.bodyTypeId,
        breastSize: data.breastSizeId,
        occupation: data.occupationId,
        relationship: data.relationshipId,
        reels: transformedReels,
        stories: transformedStories,
        isPublic: data.isPublic,
      });
    }
  }, [characterData?.data, mock, reset, transformedReels, transformedStories]);

  // Check if data is still loading
  const isLoadingData =
    !mock &&
    ((isEditMode && isLoadingCharacter) ||
      isLoadingUniversalOptions ||
      (characterGender && characterStyle && isLoadingVariantOptions));

  // Get header props from form values or mock
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const displayName =
    firstName || lastName
      ? `${firstName} ${lastName}`.trim()
      : isEditMode
        ? "Edit Character"
        : "New Character";

  // ============================================================================
  // Action Handlers
  // ============================================================================

  const handleDiscard = useCallback(() => {
    router.push("/dashboard/characters");
  }, [router]);

  const handleSave = useCallback(
    async (data: CharacterFormData) => {
      // If mock mode, just log and simulate
      if (mock) {
        setIsSaving(true);
        try {
          console.log("Saving character (mock):", {
            id,
            data,
            privateContents,
          });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          toast.success("Changes saved successfully");
        } catch (error) {
          console.error("Error saving:", error);
          toast.error("Failed to save changes");
        } finally {
          setIsSaving(false);
        }
        return;
      }

      // Real API call for edit mode
      if (isEditMode && id) {
        setIsSaving(true);
        try {
          // Build reorder arrays from current form data
          // Only include items that have a persisted ID (not temporary client-side IDs)
          const reelOrder = data.reels
            ?.filter((r: MediaUploadItem) => r.id && !r.id.startsWith("reel-"))
            .map((r: MediaUploadItem, index: number) => ({
              id: r.id,
              sortOrder: index,
            }));

          const storyOrder = data.stories
            ?.filter((s: StoryUploadItem) => s.id && !s.id.startsWith("story-"))
            .map((s: StoryUploadItem, index: number) => ({
              id: s.id,
              sortOrder: index,
            }));

          await updateMutation.mutateAsync({
            id,
            firstName: data.firstName,
            lastName: data.lastName,
            age: data.age,
            isPublic: data.isPublic,
            // Option IDs
            ethnicityId: data.ethnicity || undefined,
            personalityId: data.personality || undefined,
            hairStyleId: data.hairStyle || undefined,
            hairColorId: data.hairColor || undefined,
            eyeColorId: data.eyeColor || undefined,
            bodyTypeId: data.bodyType || undefined,
            breastSizeId: data.breastSize || undefined,
            occupationId: data.occupation || undefined,
            relationshipId: data.relationship || undefined,
            kinkIds:
              data.kinks && data.kinks.length > 0 ? data.kinks : undefined,
            // Reorder arrays
            reelOrder:
              reelOrder && reelOrder.length > 0 ? reelOrder : undefined,
            storyOrder:
              storyOrder && storyOrder.length > 0 ? storyOrder : undefined,
          });
        } finally {
          setIsSaving(false);
        }
      } else {
        // Create mode - not yet implemented in this form
        // The existing character creation uses a different multi-step flow
        toast.error("Create mode is not yet supported in this form");
      }
    },
    [id, mock, privateContents, isEditMode, updateMutation],
  );

  const handlePublishToggle = useCallback(async () => {
    // If mock mode, just simulate
    if (mock) {
      setIsPublishing(true);
      try {
        const newPublicState = !isPublic;
        setValue("isPublic", newPublicState);
        console.log("Publishing state changed (mock):", {
          id,
          isPublic: newPublicState,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(
          newPublicState ? "Character published" : "Character unpublished",
        );
      } catch (error) {
        console.error("Error publishing:", error);
        toast.error("Failed to update publish state");
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    // Real API call
    if (isEditMode && id) {
      setIsPublishing(true);
      try {
        const newPublicState = !isPublic;
        await updateMutation.mutateAsync({
          id,
          isPublic: newPublicState,
        });
        setValue("isPublic", newPublicState);
      } finally {
        setIsPublishing(false);
      }
    }
  }, [id, mock, isPublic, setValue, isEditMode, updateMutation]);

  // Private content handlers
  const handleCreatePrivateContent = useCallback(
    (data: PrivateContentFormData) => {
      console.log("Creating private content:", data);
      const newItem: PrivateContentItem = {
        id: `pc-${Date.now()}`,
        imageSrc: data.posterUrl ?? "/images/placeholder.jpg",
        description: data.description,
        name: data.name,
        tokenCost: data.tokenPrice,
        locked: false,
        media: data.media?.map((m) => ({
          id: m.id,
          src: m.url ?? "",
          type: m.mediaType ?? "image",
        })),
      };
      setPrivateContents((prev) => [...prev, newItem]);
      toast.success("Private content created");
    },
    [],
  );

  const handleUpdatePrivateContent = useCallback(
    (contentId: string, data: PrivateContentFormData) => {
      console.log("Updating private content:", { contentId, data });
      setPrivateContents((prev) =>
        prev.map((item) =>
          item.id === contentId
            ? {
                ...item,
                imageSrc: data.posterUrl ?? item.imageSrc,
                description: data.description,
                name: data.name,
                tokenCost: data.tokenPrice,
                media: data.media?.map((m) => ({
                  id: m.id,
                  src: m.url ?? "",
                  type: m.mediaType ?? "image",
                })),
              }
            : item,
        ),
      );
      toast.success("Private content updated");
    },
    [],
  );

  // ============================================================================
  // Render
  // ============================================================================

  // Style options (static for now, can be made dynamic if needed)
  const styleOptions: SelectOption[] = [
    { value: "realistic", label: "Realistic" },
    { value: "anime", label: "Anime" },
  ];

  // Get dropdown options from mock, API, or use empty arrays
  const dropdownOptions = mock?.dropdownOptions ?? {
    styleOptions,
    kinksOptions: transformedUniversalOptions?.kinksOptions ?? [],
    ethnicityOptions: transformedVariantOptions?.ethnicityOptions ?? [],
    personalityOptions: transformedUniversalOptions?.personalityOptions ?? [],
    hairStyleOptions: transformedVariantOptions?.hairStyleOptions ?? [],
    hairColorOptions: transformedVariantOptions?.hairColorOptions ?? [],
    eyeColorOptions: transformedVariantOptions?.eyeColorOptions ?? [],
    bodyTypeOptions: transformedVariantOptions?.bodyTypeOptions ?? [],
    breastSizeOptions: transformedVariantOptions?.breastSizeOptions ?? [],
    occupationOptions: transformedUniversalOptions?.occupationOptions ?? [],
    relationshipOptions: transformedUniversalOptions?.relationshipOptions ?? [],
  };

  // Get character data for display (from mock or API)
  const characterDisplayData =
    mock?.character ??
    (characterData?.data
      ? {
          avatarSrc: characterData.data.posterImage,
          bannerSrc: undefined,
          posterImage: characterData.data.posterImage,
          posterVideo: characterData.data.posterVideo,
          style: characterData.data.style,
          reels: transformedReels,
          stories: transformedStories,
        }
      : undefined);

  // Show loading state while fetching data
  if (isLoadingData) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Spinner className="text-muted-foreground h-8 w-8" />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleSave)}
        className={clsx("min-h-screen", className)}
      >
        <TabGroup>
          <div className="flex">
            {/* Left Sidebar - Sticky */}
            <aside className="bg-card border-border sticky top-0 hidden h-screen w-64 shrink-0 border-r p-4 md:block">
              <SidebarCharactersCreateEdit />
            </aside>

            {/* Right Content Area */}
            <div className="flex flex-1 flex-col">
              {/* Main Content - Scrollable */}
              <main className="flex-1 overflow-y-auto p-6">
                <TabPanels>
                  {/* Tab 1: Profile */}
                  <TabCharactersCreateEdit1
                    name={displayName}
                    avatarSrc={characterDisplayData?.avatarSrc}
                    role={characterDisplayData?.style}
                    joinedDate={isEditMode ? "Member" : undefined}
                    bannerSrc={characterDisplayData?.bannerSrc}
                    defaultPosterImage={characterDisplayData?.posterImage}
                    defaultPosterVideo={characterDisplayData?.posterVideo}
                    {...dropdownOptions}
                  />

                  {/* Tab 2: Reels */}
                  <TabCharactersCreateEdit2
                    defaultReels={characterDisplayData?.reels}
                  />

                  {/* Tab 3: Stories */}
                  <TabCharactersCreateEdit3
                    defaultStories={characterDisplayData?.stories}
                  />

                  {/* Tab 4: Private Content */}
                  <TabCharactersCreateEdit4
                    privateContents={privateContents}
                    onCreatePrivateContent={handleCreatePrivateContent}
                    onUpdatePrivateContent={handleUpdatePrivateContent}
                  />
                </TabPanels>
              </main>

              {/* Footer Action Bar - Sticky */}
              <footer className="bg-card border-border sticky -bottom-0 border-t p-4">
                <div className="flex items-center justify-end gap-3">
                  <Button type="button" plain onClick={handleDiscard}>
                    Discard
                  </Button>
                  <Button type="submit" color="primary" loading={isSaving}>
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    color="primary"
                    onClick={handlePublishToggle}
                    loading={isPublishing}
                  >
                    {isPublic ? "Unpublish" : "Publish"}
                  </Button>
                </div>
              </footer>
            </div>
          </div>
        </TabGroup>
      </form>
    </FormProvider>
  );
}

// ============================================================================
// Exported Component with Suspense
// ============================================================================

const DashboardCharactersCreateUpdatePage: React.FC<
  DashboardCharactersCreateUpdatePageProps
> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center">
          <Spinner className="text-muted-foreground h-8 w-8" />
        </div>
      }
    >
      <DashboardCharactersCreateUpdatePageContent {...props} />
    </Suspense>
  );
};

export default DashboardCharactersCreateUpdatePage;
