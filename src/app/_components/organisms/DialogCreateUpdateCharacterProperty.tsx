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

export type CharacterPropertyType = keyof typeof PROPERTY_TYPES;

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

export type DialogCreateUpdateCharacterPropertyProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  mode: "create" | "update";
  propertyType: CharacterPropertyType;
  existingProperty?: ExistingPropertyData;
  onSuccess?: () => void;
};

const DialogCreateUpdateCharacterProperty: React.FC<
  DialogCreateUpdateCharacterPropertyProps
> = ({
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

  // Mutations
  const createMutation = api.characterOptions.createProperty.useMutation({
    onSuccess: () => {
      toast.success(`${PROPERTY_TYPES[propertyType].singular} created!`);
      void utils.characterOptions.invalidate();
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create");
    },
  });

  const updateMutation = api.characterOptions.updateProperty.useMutation({
    onSuccess: () => {
      toast.success(`${PROPERTY_TYPES[propertyType].singular} updated!`);
      void utils.characterOptions.invalidate();
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update");
    },
  });

  const loading = createMutation.isPending || updateMutation.isPending;

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

    if (mode === "create") {
      createMutation.mutate({
        propertyType,
        name: data.name,
        label: data.label,
        description: data.description,
        emoji: data.emoji,
        genderId: data.genderId,
        styleId: data.styleId,
        imageUrl,
        videoUrl,
      });
    } else if (existingProperty) {
      updateMutation.mutate({
        id: existingProperty.id,
        propertyType,
        name: data.name,
        label: data.label,
        description: data.description,
        emoji: data.emoji,
        genderId: data.genderId,
        styleId: data.styleId,
        imageUrl,
        videoUrl,
      });
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

export default DialogCreateUpdateCharacterProperty;
