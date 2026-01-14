"use client";

import React from "react";
import clsx from "clsx";
import { TabPanel } from "@headlessui/react";
import { useFormContext, Controller } from "react-hook-form";
import ListCardMediaUpload, {
  type MediaUploadItem,
} from "./ListCardMediaUpload";

// Extended type that includes File for new uploads
export type ReelUploadItem = MediaUploadItem & {
  file?: File;
};

export type TabCharactersCreateEdit2Props = {
  className?: string;
  defaultReels?: ReelUploadItem[];
  onRequestDelete?: (id: string) => void;
};

const TabCharactersCreateEdit2: React.FC<TabCharactersCreateEdit2Props> = ({
  className,
  defaultReels = [],
  onRequestDelete,
}) => {
  const { control, setValue, watch } = useFormContext();
  const reels = (watch("reels") ?? defaultReels) as ReelUploadItem[];

  const handleAdd = (file: File) => {
    const newItem: ReelUploadItem = {
      id: `reel-${Date.now()}`,
      url: URL.createObjectURL(file),
      mediaType: file.type.startsWith("video/") ? "video" : "image",
      file, // Keep file reference for upload
    };
    setValue("reels", [...reels, newItem]);
  };

  const handleRemove = (id: string) => {
    // Check if it's an existing reel (persisted) vs new (temp ID)
    const isExisting = !id.startsWith("reel-");

    if (isExisting && onRequestDelete) {
      // Show confirmation dialog for existing reels
      onRequestDelete(id);
    } else {
      // Just remove from local state for new items
      setValue(
        "reels",
        reels.filter((item) => item.id !== id),
      );
    }
  };

  const handleReorder = (newItems: MediaUploadItem[]) => {
    setValue("reels", newItems);
  };

  return (
    <TabPanel className={clsx("space-y-6", className)}>
      <div className="bg-card rounded-2xl p-6">
        <h3 className="text-foreground mb-4 text-lg font-semibold">
          Upload Reels
        </h3>
        <Controller
          name="reels"
          control={control}
          defaultValue={defaultReels}
          render={({ fieldState }) => (
            <>
              <ListCardMediaUpload
                layout="grid"
                cols={3}
                items={reels}
                aspectRatio="9:16"
                accept={{ "video/*": [".mp4", ".webm", ".mov"] }}
                onAdd={handleAdd}
                onRemove={handleRemove}
                onReorder={handleReorder}
              />
              {fieldState.error && (
                <p className="text-destructive mt-2 text-sm">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </TabPanel>
  );
};

export default TabCharactersCreateEdit2;
