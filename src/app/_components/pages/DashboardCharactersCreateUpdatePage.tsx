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
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TabGroup, TabPanels } from "@headlessui/react";
import toast from "react-hot-toast";

import { api } from "@/trpc/react";
import { useMediaUpload } from "@/hooks/useMediaUpload";
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
import DialogDeleteConfirmation from "../organisms/DialogDeleteConfirmation";
import type { MediaUploadItem } from "../organisms/ListCardMediaUpload";
import type { StoryUploadItem } from "../organisms/TabCharactersCreateEdit3";
import type { ReelUploadItem } from "../organisms/TabCharactersCreateEdit2";
import type { PrivateContentFormData } from "../organisms/DialogCreateUpdatePrivateContent";

// ============================================================================
// Form Schema
// ============================================================================

const characterFormSchema = z.object({
  // Profile fields
  avatarImage: z.any().optional(),
  posterImage: z.any().optional(),
  posterVideo: z.any().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.coerce
    .number()
    .min(18, "Minimum age is 18")
    .max(80, "Maximum age is 80"),
  gender: z.string().optional(),
  description: z.string().optional(),
  style: z.string().optional(),
  ethnicity: z.string().optional(),
  personality: z.string().optional(),
  hairStyle: z.string().optional(),
  hairColor: z.string().optional(),
  eyeColor: z.string().optional(),
  bodyType: z.string().optional(),
  breastSize: z.string().optional(),
  occupation: z.string().optional(),
  relationship: z.string().optional(),
  voice: z.string().optional(),
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
    avatarImage?: string;
    bannerSrc?: string;
    posterImage?: string;
    posterVideo?: string;
    age?: number;
    gender?: string;
    description?: string;
    style?: string;
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
    genderOptions: SelectOption[];
    styleOptions: SelectOption[];
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

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "reel" | "story" | "private content";
    id: string;
    name?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ============================================================================
  // tRPC Queries (only when not using mock data)
  // ============================================================================

  // Fetch character data for edit mode
  const { data: characterData, isLoading: isLoadingCharacter } =
    api.character.getByIdForEdit.useQuery(
      { id: id! },
      { enabled: !mock && Boolean(id) },
    );

  // Fetch private content for character
  const { data: privateContentData } =
    api.privateContent.getByCharacter.useQuery(
      { characterId: id! },
      { enabled: !mock && Boolean(id) },
    );

  // Validation functions for query enabled conditions (defined early for use in query)
  const isValidGender = useCallback(
    (v: string | undefined): v is "girl" | "men" | "trans" =>
      v === "girl" || v === "men" || v === "trans",
    [],
  );
  const isValidStyle = useCallback(
    (v: string | undefined): v is "realistic" | "anime" =>
      v === "realistic" || v === "anime",
    [],
  );

  // ============================================================================
  // tRPC Mutations & Media Upload
  // ============================================================================

  const { uploadFile } = useMediaUpload();

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

  const createMutation = api.character.create.useMutation({
    onSuccess: (data) => {
      toast.success("Character created successfully");
      void utils.character.getForDashboard.invalidate();
      router.push(`/dashboard/characters/create-update?id=${data.characterId}`);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create character");
    },
  });

  // Reel mutations
  const createReelMutation = api.reel.create.useMutation({
    onSuccess: () => {
      void utils.character.getByIdForEdit.invalidate({ id: id! });
    },
  });

  const deleteReelMutation = api.reel.delete.useMutation({
    onSuccess: () => {
      toast.success("Reel deleted successfully");
      void utils.character.getByIdForEdit.invalidate({ id: id! });
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete reel");
    },
  });

  // Story mutations
  const createStoryMutation = api.story.create.useMutation({
    onSuccess: () => {
      void utils.character.getByIdForEdit.invalidate({ id: id! });
    },
  });

  const deleteStoryMutation = api.story.delete.useMutation({
    onSuccess: () => {
      toast.success("Story deleted successfully");
      void utils.character.getByIdForEdit.invalidate({ id: id! });
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete story");
    },
  });

  // Private content mutations
  const createPrivateContentMutation = api.privateContent.create.useMutation({
    onSuccess: () => {
      toast.success("Private content created successfully");
      void utils.privateContent.getByCharacter.invalidate({ characterId: id! });
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create private content");
    },
  });

  const updatePrivateContentMutation = api.privateContent.update.useMutation({
    onSuccess: () => {
      toast.success("Private content updated successfully");
      void utils.privateContent.getByCharacter.invalidate({ characterId: id! });
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update private content");
    },
  });

  const deletePrivateContentMutation = api.privateContent.delete.useMutation({
    onSuccess: () => {
      toast.success("Private content deleted successfully");
      void utils.privateContent.getByCharacter.invalidate({ characterId: id! });
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete private content");
    },
  });

  // Media record mutation
  const createMediaRecordMutation = api.media.createMediaRecord.useMutation();

  // ============================================================================
  // Transform API data to component format
  // ============================================================================

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
        expiresAt: Date | null;
      }) => ({
        id: s.id,
        url: s.url,
        thumbnailUrl: s.thumbnailUrl ?? undefined,
        mediaType: s.mediaType,
      }),
    );
  }, [characterData?.data?.stories]);

  // Transform private content data for display
  const displayPrivateContents = useMemo((): PrivateContentItem[] => {
    // If using mock data, use local state
    if (mock) {
      return privateContents;
    }

    // If using API data, transform it
    if (privateContentData) {
      return privateContentData.map((pc) => ({
        id: pc.id,
        name: pc.name,
        imageSrc: pc.posterUrl ?? "/images/placeholder.jpg",
        description: pc.description ?? undefined,
        tokenCost: pc.tokenPrice,
        locked: false,
        media: pc.media?.map((m) => ({
          id: m.id,
          src: m.url,
          type: m.mediaType as "image" | "video",
        })),
      }));
    }

    return privateContents;
  }, [mock, privateContents, privateContentData]);

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
        ethnicity: data.ethnicityId,
        personality: data.personalityId,
        hairStyle: data.hairStyleId,
        hairColor: data.hairColorId,
        eyeColor: data.eyeColorId,
        bodyType: data.bodyTypeId,
        breastSize: data.breastSizeId,
        occupation: data.occupationId,
        relationship: data.relationshipId,
        voice: data.voice,
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
      ethnicity: "",
      personality: "",
      hairStyle: "",
      hairColor: "",
      eyeColor: "",
      bodyType: "",
      breastSize: "",
      occupation: "",
      relationship: "",
      voice: "",
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

  // Use useWatch for specific fields to avoid full re-renders
  const isPublic = useWatch({ control: methods.control, name: "isPublic" });
  const watchedGender = useWatch({
    control: methods.control,
    name: "gender",
  }) as "girl" | "men" | "trans" | undefined;
  const watchedStyle = useWatch({ control: methods.control, name: "style" }) as
    | "realistic"
    | "anime"
    | undefined;

  // Use characterData values as fallback when form values are empty (before reset runs)
  const effectiveGender = (watchedGender || characterData?.data?.gender) as
    | "girl"
    | "men"
    | "trans"
    | undefined;
  const effectiveStyle = (watchedStyle || characterData?.data?.style) as
    | "realistic"
    | "anime"
    | undefined;

  // Fetch ALL character options once on page load (no refetch on gender/style change)
  const { data: allOptionsData, isLoading: isLoadingOptions } =
    api.options.getAllCharacterOptions.useQuery(undefined, {
      enabled: !mock,
      staleTime: 10 * 60 * 1000, // 10 minutes - static data
      refetchOnWindowFocus: false,
    });

  // Get genderId and styleId for filtering options
  const selectedGenderId = useMemo(() => {
    if (!allOptionsData?.data || !effectiveGender) return null;
    return (
      allOptionsData.data.genders.find((g) => g.name === effectiveGender)?.id ??
      null
    );
  }, [allOptionsData, effectiveGender]);

  const selectedStyleId = useMemo(() => {
    if (!allOptionsData?.data || !effectiveStyle) return null;
    return (
      allOptionsData.data.styles.find((s) => s.name === effectiveStyle)?.id ??
      null
    );
  }, [allOptionsData, effectiveStyle]);

  // Transform gender and style options to SelectOption format
  const transformedGenderStyleOptions = useMemo(() => {
    if (!allOptionsData?.data) return null;
    const data = allOptionsData.data;
    return {
      genderOptions: data.genders.map((g) => ({
        value: g.name,
        label: g.label,
      })),
      styleOptions: data.styles.map((s) => ({
        value: s.name,
        label: s.label,
      })),
    };
  }, [allOptionsData]);

  // Filter and transform variant options based on selected gender/style
  const transformedVariantOptions = useMemo(() => {
    if (!allOptionsData?.data || !selectedGenderId || !selectedStyleId)
      return null;
    const data = allOptionsData.data;

    // Filter helper
    const filterByGenderStyle = <
      T extends { genderId: string; styleId: string },
    >(
      items: T[],
    ) =>
      items.filter(
        (item) =>
          item.genderId === selectedGenderId &&
          item.styleId === selectedStyleId,
      );

    return {
      ethnicityOptions: filterByGenderStyle(data.ethnicities).map((e) => ({
        value: e.id,
        label: e.label,
      })),
      hairStyleOptions: filterByGenderStyle(data.hairStyles).map((h) => ({
        value: h.id,
        label: h.label,
      })),
      hairColorOptions: filterByGenderStyle(data.hairColors).map((h) => ({
        value: h.id,
        label: h.label,
      })),
      eyeColorOptions: filterByGenderStyle(data.eyeColors).map((e) => ({
        value: e.id,
        label: e.label,
      })),
      bodyTypeOptions: filterByGenderStyle(data.bodyTypes).map((b) => ({
        value: b.id,
        label: b.label,
      })),
      breastSizeOptions: filterByGenderStyle(data.breastSizes).map((b) => ({
        value: b.id,
        label: b.label,
      })),
    };
  }, [allOptionsData, selectedGenderId, selectedStyleId]);

  // Filter and transform universal options based on selected gender/style
  const transformedUniversalOptions = useMemo(() => {
    if (!allOptionsData?.data || !selectedGenderId || !selectedStyleId)
      return null;
    const data = allOptionsData.data;

    // Filter helper
    const filterByGenderStyle = <
      T extends { genderId: string; styleId: string },
    >(
      items: T[],
    ) =>
      items.filter(
        (item) =>
          item.genderId === selectedGenderId &&
          item.styleId === selectedStyleId,
      );

    return {
      personalityOptions: filterByGenderStyle(data.personalities).map((p) => ({
        value: p.id,
        label: p.label,
      })),
      relationshipOptions: filterByGenderStyle(data.relationships).map((r) => ({
        value: r.id,
        label: r.label,
      })),
      occupationOptions: filterByGenderStyle(data.occupations).map((o) => ({
        value: o.id,
        label: o.label,
      })),
    };
  }, [allOptionsData, selectedGenderId, selectedStyleId]);

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
        ethnicity: data.ethnicityId,
        personality: data.personalityId,
        hairStyle: data.hairStyleId,
        hairColor: data.hairColorId,
        eyeColor: data.eyeColorId,
        bodyType: data.bodyTypeId,
        breastSize: data.breastSizeId,
        occupation: data.occupationId,
        relationship: data.relationshipId,
        voice: data.voice,
        reels: transformedReels,
        stories: transformedStories,
        isPublic: data.isPublic,
      });
    }
  }, [characterData?.data, mock, reset, transformedReels, transformedStories]);

  // Check if initial data is still loading (only for page-level spinner)
  // Note: isLoadingOptions covers all options (genders, styles, and dependent options)
  const isLoadingData =
    !mock && ((isEditMode && isLoadingCharacter) || isLoadingOptions);

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
          // Process NEW reels (upload files and create records)
          const newReels = (data.reels as ReelUploadItem[])?.filter(
            (r) => r.id && r.id.startsWith("reel-") && r.file,
          );

          if (newReels && newReels.length > 0) {
            toast.loading(`Uploading ${newReels.length} reel(s)...`, {
              id: "upload-reels",
            });

            for (const reel of newReels) {
              if (reel.file) {
                // Upload video to R2
                const uploadResult = await uploadFile(reel.file, "characters");

                // Create media record
                const mediaResult = await createMediaRecordMutation.mutateAsync(
                  {
                    key: uploadResult.key,
                    url: uploadResult.publicUrl,
                    mimeType: reel.file.type,
                    size: reel.file.size,
                  },
                );

                // Create reel record
                await createReelMutation.mutateAsync({
                  characterId: id,
                  videoId: mediaResult.data.id,
                });
              }
            }

            toast.dismiss("upload-reels");
            toast.success(`${newReels.length} reel(s) uploaded successfully`);
          }

          // Process NEW stories (upload files and create records)
          const newStories = (data.stories as StoryUploadItem[])?.filter(
            (s) => s.id && s.id.startsWith("story-") && s.file,
          );

          if (newStories && newStories.length > 0) {
            toast.loading(`Uploading ${newStories.length} story(ies)...`, {
              id: "upload-stories",
            });

            for (const story of newStories) {
              if (story.file) {
                // Upload media to R2
                const uploadResult = await uploadFile(story.file, "characters");

                // Create media record
                const mediaResult = await createMediaRecordMutation.mutateAsync(
                  {
                    key: uploadResult.key,
                    url: uploadResult.publicUrl,
                    mimeType: story.file.type,
                    size: story.file.size,
                  },
                );

                // Create story record (permanent - no expiration)
                await createStoryMutation.mutateAsync({
                  characterId: id,
                  mediaId: mediaResult.data.id,
                });
              }
            }

            toast.dismiss("upload-stories");
            toast.success(
              `${newStories.length} story(ies) uploaded successfully`,
            );
          }

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
            // Reorder arrays
            reelOrder:
              reelOrder && reelOrder.length > 0 ? reelOrder : undefined,
            storyOrder:
              storyOrder && storyOrder.length > 0 ? storyOrder : undefined,
          });
        } catch (error) {
          console.error("Error saving character:", error);
          toast.dismiss("upload-reels");
          toast.dismiss("upload-stories");
        } finally {
          setIsSaving(false);
        }
      } else {
        // Create mode - upload media and create character
        setIsSaving(true);
        try {
          // Validate required fields for create mode
          if (!data.gender || !isValidGender(data.gender)) {
            toast.error("Please select a gender");
            return;
          }
          if (!data.style || !isValidStyle(data.style)) {
            toast.error("Please select a style");
            return;
          }
          if (!data.voice) {
            toast.error("Please select a voice");
            return;
          }
          if (
            !data.ethnicity ||
            !data.personality ||
            !data.hairStyle ||
            !data.hairColor ||
            !data.eyeColor ||
            !data.bodyType ||
            !data.breastSize ||
            !data.occupation ||
            !data.relationship
          ) {
            toast.error("Please fill in all attribute fields");
            return;
          }
          if (!data.posterImage || !data.posterVideo) {
            toast.error("Please upload both poster image and video");
            return;
          }

          // Upload poster image to R2
          let posterUrl: string;
          if (data.posterImage instanceof File) {
            toast.loading("Uploading poster image...", { id: "upload-poster" });
            const posterResult = await uploadFile(
              data.posterImage,
              "characters",
            );
            posterUrl = posterResult.publicUrl;
            toast.dismiss("upload-poster");
          } else if (typeof data.posterImage === "string") {
            posterUrl = data.posterImage;
          } else {
            toast.error("Invalid poster image");
            return;
          }

          // Upload poster video to R2
          let videoUrl: string;
          if (data.posterVideo instanceof File) {
            toast.loading("Uploading poster video...", { id: "upload-video" });
            const videoResult = await uploadFile(
              data.posterVideo,
              "characters",
            );
            videoUrl = videoResult.publicUrl;
            toast.dismiss("upload-video");
          } else if (typeof data.posterVideo === "string") {
            videoUrl = data.posterVideo;
          } else {
            toast.error("Invalid poster video");
            return;
          }

          // Combine firstName and lastName into name
          const name = `${data.firstName} ${data.lastName}`.trim();
          if (name.length < 2 || name.length > 20) {
            toast.error("Name must be between 2 and 20 characters");
            return;
          }

          // Create the character
          await createMutation.mutateAsync({
            characterType: data.gender,
            style: data.style,
            name,
            age: data.age,
            voice: data.voice,
            posterUrl,
            videoUrl,
            isPublic: data.isPublic,
            // Option IDs
            ethnicityId: data.ethnicity,
            personalityId: data.personality,
            hairStyleId: data.hairStyle,
            hairColorId: data.hairColor,
            eyeColorId: data.eyeColor,
            bodyTypeId: data.bodyType,
            breastSizeId: data.breastSize,
            occupationId: data.occupation,
            relationshipId: data.relationship,
          });
        } catch (error) {
          console.error("Error creating character:", error);
          toast.dismiss("upload-poster");
          toast.dismiss("upload-video");
          // Error toast is handled by mutation onError
        } finally {
          setIsSaving(false);
        }
      }
    },
    [
      id,
      mock,
      privateContents,
      isEditMode,
      updateMutation,
      createMutation,
      uploadFile,
      isValidGender,
      isValidStyle,
      createMediaRecordMutation,
      createReelMutation,
      createStoryMutation,
    ],
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
    async (data: PrivateContentFormData) => {
      if (mock) {
        // Mock mode - local state only
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
        return;
      }

      // Real API call
      if (!id) {
        toast.error("Character must be saved first");
        return;
      }

      try {
        toast.loading("Uploading private content...", { id: "upload-pc" });

        // Upload poster if it's a File
        let posterUrl = data.posterUrl;
        if (data.posterFile) {
          const posterResult = await uploadFile(data.posterFile, "characters");
          posterUrl = posterResult.publicUrl;
        }

        // Upload media files
        const uploadedMedia: { url: string; mediaType: "image" | "video" }[] =
          [];
        for (const item of data.media ?? []) {
          if (item.file) {
            const mediaResult = await uploadFile(item.file, "characters");
            uploadedMedia.push({
              url: mediaResult.publicUrl,
              mediaType: item.mediaType ?? "image",
            });
          } else if (item.url && !item.url.startsWith("blob:")) {
            // Keep existing URLs (for edit mode)
            uploadedMedia.push({
              url: item.url,
              mediaType: item.mediaType ?? "image",
            });
          }
        }

        toast.dismiss("upload-pc");

        await createPrivateContentMutation.mutateAsync({
          characterId: id,
          name: data.name,
          description: data.description,
          tokenPrice: data.tokenPrice,
          posterUrl,
          mediaUrls: uploadedMedia,
        });
      } catch (error) {
        toast.dismiss("upload-pc");
        console.error("Error creating private content:", error);
      }
    },
    [mock, id, createPrivateContentMutation, uploadFile],
  );

  const handleUpdatePrivateContent = useCallback(
    async (contentId: string, data: PrivateContentFormData) => {
      if (mock) {
        // Mock mode - local state only
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
        return;
      }

      // Real API call
      try {
        toast.loading("Updating private content...", { id: "update-pc" });

        // Upload poster if it's a new File
        let posterUrl = data.posterUrl;
        if (data.posterFile) {
          const posterResult = await uploadFile(data.posterFile, "characters");
          posterUrl = posterResult.publicUrl;
        }

        // Upload media files
        const uploadedMedia: { url: string; mediaType: "image" | "video" }[] =
          [];
        for (const item of data.media ?? []) {
          if (item.file) {
            const mediaResult = await uploadFile(item.file, "characters");
            uploadedMedia.push({
              url: mediaResult.publicUrl,
              mediaType: item.mediaType ?? "image",
            });
          } else if (item.url && !item.url.startsWith("blob:")) {
            // Keep existing URLs
            uploadedMedia.push({
              url: item.url,
              mediaType: item.mediaType ?? "image",
            });
          }
        }

        toast.dismiss("update-pc");

        await updatePrivateContentMutation.mutateAsync({
          id: contentId,
          name: data.name,
          description: data.description,
          tokenPrice: data.tokenPrice,
          posterUrl,
          mediaUrls: uploadedMedia.length > 0 ? uploadedMedia : undefined,
        });
      } catch (error) {
        toast.dismiss("update-pc");
        console.error("Error updating private content:", error);
      }
    },
    [mock, updatePrivateContentMutation, uploadFile],
  );

  // Delete request handlers
  const handleRequestDeleteReel = useCallback((reelId: string) => {
    setItemToDelete({ type: "reel", id: reelId });
    setDeleteDialogOpen(true);
  }, []);

  const handleRequestDeleteStory = useCallback((storyId: string) => {
    setItemToDelete({ type: "story", id: storyId });
    setDeleteDialogOpen(true);
  }, []);

  const handleRequestDeletePrivateContent = useCallback(
    (contentId: string) => {
      const content = displayPrivateContents.find((c) => c.id === contentId);
      setItemToDelete({
        type: "private content",
        id: contentId,
        name: content?.name,
      });
      setDeleteDialogOpen(true);
    },
    [displayPrivateContents],
  );

  // Delete confirmation handler
  const handleDeleteConfirm = useCallback(async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      switch (itemToDelete.type) {
        case "reel":
          await deleteReelMutation.mutateAsync({ id: itemToDelete.id });
          // Also remove from form state
          setValue(
            "reels",
            (watch("reels") as ReelUploadItem[])?.filter(
              (r) => r.id !== itemToDelete.id,
            ) ?? [],
          );
          break;
        case "story":
          await deleteStoryMutation.mutateAsync({ id: itemToDelete.id });
          // Also remove from form state
          setValue(
            "stories",
            (watch("stories") as StoryUploadItem[])?.filter(
              (s) => s.id !== itemToDelete.id,
            ) ?? [],
          );
          break;
        case "private content":
          if (mock) {
            setPrivateContents((prev) =>
              prev.filter((item) => item.id !== itemToDelete.id),
            );
            toast.success("Private content deleted");
          } else {
            await deletePrivateContentMutation.mutateAsync({
              id: itemToDelete.id,
            });
          }
          break;
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [
    itemToDelete,
    mock,
    deleteReelMutation,
    deleteStoryMutation,
    deletePrivateContentMutation,
    setValue,
    watch,
  ]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  }, []);

  // ============================================================================
  // Render
  // ============================================================================

  // Get dropdown options from mock, API, or use empty arrays
  const dropdownOptions = mock?.dropdownOptions ?? {
    genderOptions: transformedGenderStyleOptions?.genderOptions ?? [],
    styleOptions: transformedGenderStyleOptions?.styleOptions ?? [],
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
          avatarSrc:
            characterData.data.avatarImage ?? characterData.data.posterImage,
          avatarImage: characterData.data.avatarImage,
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
              <SidebarCharactersCreateEdit isEditMode={isEditMode} />
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
                    defaultAvatarImage={characterDisplayData?.avatarImage}
                    defaultPosterImage={characterDisplayData?.posterImage}
                    defaultPosterVideo={characterDisplayData?.posterVideo}
                    {...dropdownOptions}
                  />

                  {/* Tab 2: Reels */}
                  <TabCharactersCreateEdit2
                    defaultReels={characterDisplayData?.reels}
                    onRequestDelete={handleRequestDeleteReel}
                  />

                  {/* Tab 3: Stories */}
                  <TabCharactersCreateEdit3
                    defaultStories={characterDisplayData?.stories}
                    onRequestDelete={handleRequestDeleteStory}
                  />

                  {/* Tab 4: Private Content */}
                  <TabCharactersCreateEdit4
                    privateContents={displayPrivateContents}
                    onCreatePrivateContent={handleCreatePrivateContent}
                    onUpdatePrivateContent={handleUpdatePrivateContent}
                    onRequestDelete={handleRequestDeletePrivateContent}
                    isCreating={createPrivateContentMutation.isPending}
                    isUpdating={updatePrivateContentMutation.isPending}
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
                    {isEditMode ? "Save Changes" : "Create Character"}
                  </Button>
                  {isEditMode && (
                    <Button
                      type="button"
                      color="primary"
                      onClick={handlePublishToggle}
                      loading={isPublishing}
                    >
                      {isPublic ? "Unpublish" : "Publish"}
                    </Button>
                  )}
                </div>
              </footer>
            </div>
          </div>
        </TabGroup>

        {/* Delete Confirmation Dialog */}
        <DialogDeleteConfirmation
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          loading={isDeleting}
          itemType={itemToDelete?.type ?? "reel"}
          itemName={itemToDelete?.name}
        />
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
