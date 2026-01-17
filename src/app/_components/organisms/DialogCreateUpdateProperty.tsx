"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { Button } from "@/app/_components/atoms/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
} from "@/app/_components/atoms/dialog";
import { Field, Label, ErrorMessage } from "@/app/_components/atoms/fieldset";
import { Input } from "@/app/_components/atoms/input";
import { Textarea } from "@/app/_components/atoms/textarea";
import {
  Listbox,
  ListboxOption,
  ListboxLabel,
} from "@/app/_components/atoms/listbox";
import CardMediaUpload from "@/app/_components/molecules/CardMediaUpload";
import { api } from "@/trpc/react";
import type { CharacterPropertyType } from "@/hooks/useCharacterPropertyQuery";

// Property types configuration
const PROPERTY_TYPES = {
  personality: { singular: "Personality", plural: "Personalities" },
  relationship: { singular: "Relationship", plural: "Relationships" },
  occupation: { singular: "Occupation", plural: "Occupations" },
  ethnicity: { singular: "Ethnicity", plural: "Ethnicities" },
  hairStyle: { singular: "Hair Style", plural: "Hair Styles" },
  hairColor: { singular: "Hair Color", plural: "Hair Colors" },
  eyeColor: { singular: "Eye Color", plural: "Eye Colors" },
  bodyType: { singular: "Body Type", plural: "Body Types" },
  breastSize: { singular: "Breast Size", plural: "Breast Sizes" },
  gender: { singular: "Gender", plural: "Genders" },
  style: { singular: "Style", plural: "Styles" },
} as const;

// Zod validation schema
const propertyFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().min(1, "Label is required"),
  description: z.string().optional(),
  emoji: z.string().optional(),
  genderId: z.string().optional(),
  styleId: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

export type ExistingPropertyData = {
  id: string;
  name: string;
  label: string;
  description?: string | null;
  emoji?: string | null;
  genderId?: string;
  styleId?: string;
  image?: { id: string; url: string } | null;
  video?: { id: string; url: string } | null;
};

export type DialogCreateUpdatePropertyProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  mode: "create" | "update";
  propertyType: CharacterPropertyType;
  existingProperty?: ExistingPropertyData;
  onSuccess?: () => void;
};

const DialogCreateUpdateProperty: React.FC<DialogCreateUpdatePropertyProps> = ({
  className,
  open,
  onClose,
  mode,
  propertyType,
  existingProperty,
  onSuccess,
}) => {
  // State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [posterImage, setPosterImage] = useState<File | null>(null);
  const [posterVideo, setPosterVideo] = useState<File | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Check if this property type requires gender/style
  const requiresGenderStyle = !["gender", "style"].includes(propertyType);

  // tRPC utilities
  const utils = api.useUtils();

  // Fetch gender and style options
  const { data: optionsData } = api.options.getGenderAndStyleOptions.useQuery(
    undefined,
    { enabled: requiresGenderStyle },
  );

  // Create mutations for each property type
  const createGender = api.characterGender.create.useMutation();
  const createStyle = api.characterStyle.create.useMutation();
  const createEthnicity = api.characterEthnicity.create.useMutation();
  const createHairStyle = api.characterHairStyle.create.useMutation();
  const createHairColor = api.characterHairColor.create.useMutation();
  const createEyeColor = api.characterEyeColor.create.useMutation();
  const createBodyType = api.characterBodyType.create.useMutation();
  const createBreastSize = api.characterBreastSize.create.useMutation();
  const createPersonality = api.characterPersonality.create.useMutation();
  const createRelationship = api.characterRelationship.create.useMutation();
  const createOccupation = api.characterOccupation.create.useMutation();

  // Update mutations for each property type
  const updateGender = api.characterGender.update.useMutation();
  const updateStyle = api.characterStyle.update.useMutation();
  const updateEthnicity = api.characterEthnicity.update.useMutation();
  const updateHairStyle = api.characterHairStyle.update.useMutation();
  const updateHairColor = api.characterHairColor.update.useMutation();
  const updateEyeColor = api.characterEyeColor.update.useMutation();
  const updateBodyType = api.characterBodyType.update.useMutation();
  const updateBreastSize = api.characterBreastSize.update.useMutation();
  const updatePersonality = api.characterPersonality.update.useMutation();
  const updateRelationship = api.characterRelationship.update.useMutation();
  const updateOccupation = api.characterOccupation.update.useMutation();

  const createMutations = {
    gender: createGender,
    style: createStyle,
    ethnicity: createEthnicity,
    hairStyle: createHairStyle,
    hairColor: createHairColor,
    eyeColor: createEyeColor,
    bodyType: createBodyType,
    breastSize: createBreastSize,
    personality: createPersonality,
    relationship: createRelationship,
    occupation: createOccupation,
  };

  const updateMutations = {
    gender: updateGender,
    style: updateStyle,
    ethnicity: updateEthnicity,
    hairStyle: updateHairStyle,
    hairColor: updateHairColor,
    eyeColor: updateEyeColor,
    bodyType: updateBodyType,
    breastSize: updateBreastSize,
    personality: updatePersonality,
    relationship: updateRelationship,
    occupation: updateOccupation,
  };

  const currentCreateMutation = createMutations[propertyType];
  const currentUpdateMutation = updateMutations[propertyType];

  const loading =
    currentCreateMutation.isPending || currentUpdateMutation.isPending;

  // Invalidate queries helper
  const invalidatePropertyQueries = () => {
    switch (propertyType) {
      case "gender":
        void utils.characterGender.invalidate();
        break;
      case "style":
        void utils.characterStyle.invalidate();
        break;
      case "ethnicity":
        void utils.characterEthnicity.invalidate();
        break;
      case "hairStyle":
        void utils.characterHairStyle.invalidate();
        break;
      case "hairColor":
        void utils.characterHairColor.invalidate();
        break;
      case "eyeColor":
        void utils.characterEyeColor.invalidate();
        break;
      case "bodyType":
        void utils.characterBodyType.invalidate();
        break;
      case "breastSize":
        void utils.characterBreastSize.invalidate();
        break;
      case "personality":
        void utils.characterPersonality.invalidate();
        break;
      case "relationship":
        void utils.characterRelationship.invalidate();
        break;
      case "occupation":
        void utils.characterOccupation.invalidate();
        break;
    }
  };

  // Form setup
  const defaultValues = useMemo(
    () => ({
      name: existingProperty?.name ?? "",
      label: existingProperty?.label ?? "",
      description: existingProperty?.description ?? "",
      emoji: existingProperty?.emoji ?? "😊",
      genderId: existingProperty?.genderId ?? "",
      styleId: existingProperty?.styleId ?? "",
    }),
    [existingProperty],
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues,
  });

  const selectedEmoji = watch("emoji");

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setPosterImage(null);
      setPosterVideo(null);
      setShowEmojiPicker(false);
    }
  }, [open, defaultValues, reset]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Handlers
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setValue("emoji", emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const onFormSubmit = async (data: PropertyFormData) => {
    // Validate gender/style for property types that require them
    if (requiresGenderStyle && (!data.genderId || !data.styleId)) {
      toast.error("Gender and Style are required");
      return;
    }

    // Convert files to data URLs for upload (the backend will handle the actual upload)
    let imageUrl: string | undefined;
    let videoUrl: string | undefined;

    if (posterImage) {
      imageUrl = await fileToDataUrl(posterImage);
    }

    if (posterVideo) {
      videoUrl = await fileToDataUrl(posterVideo);
    }

    const basePayload = {
      name: data.name,
      label: data.label,
      description: data.description,
      emoji: data.emoji,
      imageUrl,
      videoUrl,
    };

    const payloadWithGenderStyle = requiresGenderStyle
      ? { ...basePayload, genderId: data.genderId!, styleId: data.styleId! }
      : basePayload;

    try {
      if (mode === "create") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (currentCreateMutation as any).mutateAsync(
          payloadWithGenderStyle,
        );
        toast.success(`${PROPERTY_TYPES[propertyType].singular} created!`);
      } else if (existingProperty) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (currentUpdateMutation as any).mutateAsync({
          id: existingProperty.id,
          ...payloadWithGenderStyle,
        });
        toast.success(`${PROPERTY_TYPES[propertyType].singular} updated!`);
      }
      invalidatePropertyQueries();
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save property",
      );
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      className={clsx("", className)}
      open={open}
      onClose={handleClose}
      size="2xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogBody className="space-y-6">
          {/* Row 1: Name and Label */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label>Name</Label>
              <Input
                type="text"
                placeholder="Enter name (e.g., shy)"
                {...register("name")}
                data-invalid={errors.name ? true : undefined}
                disabled={loading}
              />
              {errors.name && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>Label</Label>
              <Input
                type="text"
                placeholder="Enter label (e.g., Shy)"
                {...register("label")}
                data-invalid={errors.label ? true : undefined}
                disabled={loading}
              />
              {errors.label && (
                <ErrorMessage>{errors.label.message}</ErrorMessage>
              )}
            </Field>
          </div>

          {/* Row 2: Style and Gender (only for property types that require them) */}
          {requiresGenderStyle && (
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label>Style</Label>
                <Controller
                  name="styleId"
                  control={control}
                  render={({ field }) => (
                    <Listbox
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select style"
                      disabled={loading}
                    >
                      {optionsData?.data?.styles?.map((style) => (
                        <ListboxOption key={style.id} value={style.id}>
                          <ListboxLabel>
                            {style.emoji} {style.label}
                          </ListboxLabel>
                        </ListboxOption>
                      ))}
                    </Listbox>
                  )}
                />
                {errors.styleId && (
                  <ErrorMessage>{errors.styleId.message}</ErrorMessage>
                )}
              </Field>

              <Field>
                <Label>Gender</Label>
                <Controller
                  name="genderId"
                  control={control}
                  render={({ field }) => (
                    <Listbox
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select gender"
                      disabled={loading}
                    >
                      {optionsData?.data?.genders?.map((gender) => (
                        <ListboxOption key={gender.id} value={gender.id}>
                          <ListboxLabel>
                            {gender.emoji} {gender.label}
                          </ListboxLabel>
                        </ListboxOption>
                      ))}
                    </Listbox>
                  )}
                />
                {errors.genderId && (
                  <ErrorMessage>{errors.genderId.message}</ErrorMessage>
                )}
              </Field>
            </div>
          )}

          {/* Row 3: Description */}
          <Field>
            <Label>Description (Optional)</Label>
            <Textarea
              placeholder="Enter description..."
              rows={3}
              {...register("description")}
              disabled={loading}
            />
          </Field>

          {/* Row 4: Emoji Picker */}
          <div>
            <p className="text-foreground mb-2 text-base/6 font-medium sm:text-sm/6">
              Add Emoji
            </p>
            <div className="relative" ref={emojiPickerRef}>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={loading}
                className={clsx(
                  "bg-muted flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed transition-colors",
                  "border-border hover:border-foreground/30",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                {selectedEmoji ? (
                  <span className="text-4xl">{selectedEmoji}</span>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Click to add
                  </span>
                )}
              </button>
              {showEmojiPicker && (
                <div className="absolute z-50 mt-2">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
          </div>

          {/* Row 5: Media Uploads */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-foreground mb-2 text-base/6 font-medium sm:text-sm/6">
                Poster Image
              </p>
              <CardMediaUpload
                aspectRatio="1:1"
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
                }}
                defaultMedia={existingProperty?.image?.url}
                defaultMediaType="image"
                onChange={setPosterImage}
                disabled={loading}
                showBrowseButton
              />
            </div>

            <div>
              <p className="text-foreground mb-2 text-base/6 font-medium sm:text-sm/6">
                Poster Video
              </p>
              <CardMediaUpload
                aspectRatio="1:1"
                accept={{ "video/*": [".mp4", ".webm", ".mov"] }}
                defaultMedia={existingProperty?.video?.url}
                defaultMediaType="video"
                onChange={setPosterVideo}
                disabled={loading}
                showBrowseButton
              />
            </div>
          </div>
        </DialogBody>

        <DialogActions>
          <Button plain onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {mode === "create" ? "Submit" : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Helper function to convert File to data URL
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default DialogCreateUpdateProperty;
