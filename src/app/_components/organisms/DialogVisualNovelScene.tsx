"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/_components/atoms/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/app/_components/atoms/dialog";
import { Field, Label, ErrorMessage } from "@/app/_components/atoms/fieldset";
import { Input } from "@/app/_components/atoms/input";
import CardMediaUpload from "@/app/_components/molecules/CardMediaUpload";
import RichTextEditor from "@/app/_components/molecules/RichTextEditor";
import type { VisualNovelNodeData } from "@/app/_contexts/VisualNovelEditorContext";

// ============================================================================
// Types
// ============================================================================

export interface DialogVisualNovelSceneProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  nodeData?: VisualNovelNodeData;
  onSubmit?: (data: SceneFormData) => void;
  loading?: boolean;
}

export interface SceneFormData {
  label: string;
  characterName?: string;
  dialogue?: string;
  dialogueRich?: string;
  media?: {
    type: "image" | "video";
    url: string;
    file?: File;
  };
}

// ============================================================================
// Schema
// ============================================================================

const sceneSchema = z.object({
  label: z.string().min(1, "Scene name is required"),
  characterName: z.string().optional(),
  dialogue: z.string().optional(),
  dialogueRich: z.string().optional(),
});

type SceneSchemaType = z.infer<typeof sceneSchema>;

// ============================================================================
// Component
// ============================================================================

const DialogVisualNovelScene: React.FC<DialogVisualNovelSceneProps> = ({
  className,
  open,
  onClose,
  mode,
  nodeData,
  onSubmit,
  loading = false,
}) => {
  const [mediaFile, setMediaFile] = React.useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = React.useState<string | undefined>(
    nodeData?.media?.url ?? nodeData?.sceneryImageSrc,
  );
  const [mediaType, setMediaType] = React.useState<"image" | "video">(
    nodeData?.media?.type ?? "image",
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SceneSchemaType>({
    resolver: zodResolver(sceneSchema),
    defaultValues: {
      label: nodeData?.label ?? "",
      characterName: nodeData?.characterName ?? "",
      dialogue: nodeData?.dialogue ?? "",
      dialogueRich: nodeData?.dialogueRich ?? "",
    },
  });

  // Reset form when dialog opens or nodeData changes
  useEffect(() => {
    if (open) {
      reset({
        label: nodeData?.label ?? "",
        characterName: nodeData?.characterName ?? "",
        dialogue: nodeData?.dialogue ?? "",
        dialogueRich: nodeData?.dialogueRich ?? "",
      });
      setMediaPreview(nodeData?.media?.url ?? nodeData?.sceneryImageSrc);
      setMediaType(nodeData?.media?.type ?? "image");
      setMediaFile(null);
    }
  }, [open, nodeData, reset]);

  const handleMediaChange = (file: File | null) => {
    setMediaFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setMediaType(file.type.startsWith("video/") ? "video" : "image");
    } else {
      setMediaPreview(undefined);
    }
  };

  const onFormSubmit = (data: SceneSchemaType) => {
    const formData: SceneFormData = {
      ...data,
      media: mediaFile
        ? {
            type: mediaType,
            url: mediaPreview ?? "",
            file: mediaFile,
          }
        : mediaPreview
          ? {
              type: mediaType,
              url: mediaPreview,
            }
          : undefined,
    };
    onSubmit?.(formData);
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
      size="xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogTitle>
          {mode === "create" ? "Add Scene" : "Edit Scene"}
        </DialogTitle>
        <DialogDescription>
          Configure the scene with media and dialogue
        </DialogDescription>

        <DialogBody className="space-y-6">
          {/* Scene Name Field */}
          <Field>
            <Label>Scene Name</Label>
            <Input
              type="text"
              placeholder="e.g., Opening Scene, First Meeting"
              {...register("label")}
              data-invalid={errors.label ? true : undefined}
              disabled={loading}
            />
            {errors.label && (
              <ErrorMessage>{errors.label.message}</ErrorMessage>
            )}
          </Field>

          {/* Media Upload Field */}
          <div className="space-y-2">
            <label className="text-foreground text-lg/6 font-medium sm:text-base/6">
              Scene Media
            </label>
            <CardMediaUpload
              aspectRatio="16:9"
              defaultMedia={mediaPreview}
              defaultMediaType={mediaType}
              file={mediaFile ?? undefined}
              onChange={handleMediaChange}
              disabled={loading}
            />
          </div>

          {/* Character Name Field */}
          <Field>
            <Label>Character Name (Optional)</Label>
            <Input
              type="text"
              placeholder="Who is speaking?"
              {...register("characterName")}
              disabled={loading}
            />
          </Field>

          {/* Dialogue Field */}
          <div className="space-y-2">
            <label className="text-foreground text-lg/6 font-medium sm:text-base/6">
              Dialogue
            </label>
            <Controller
              name="dialogueRich"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value ?? ""}
                  onUpdate={(content) => field.onChange(content)}
                  placeholder="Enter the dialogue for this scene..."
                  disabled={loading}
                  minHeight="150px"
                />
              )}
            />
          </div>
        </DialogBody>

        <DialogActions>
          <Button plain onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {mode === "create" ? "Add Scene" : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogVisualNovelScene;
