"use client";

import React from "react";
import clsx from "clsx";
import { TabPanel } from "@headlessui/react";
import { useFormContext, Controller } from "react-hook-form";
import ListCardMediaUpload, {
  type MediaUploadItem,
} from "./ListCardMediaUpload";

// Extended type that includes File for new uploads
export type StoryUploadItem = MediaUploadItem & {
  file?: File;
};

export type TabCharactersCreateEdit3Props = {
  className?: string;
  defaultStories?: StoryUploadItem[];
  onRequestDelete?: (id: string) => void;
};

const TabCharactersCreateEdit3: React.FC<TabCharactersCreateEdit3Props> = ({
  className,
  defaultStories = [],
  onRequestDelete,
}) => {
  const { control, setValue, watch } = useFormContext();
  const stories = (watch("stories") ?? defaultStories) as StoryUploadItem[];

  const handleRemove = (id: string) => {
    // Check if it's an existing story (persisted) vs new (temp ID)
    const isExisting = !id.startsWith("story-");

    if (isExisting && onRequestDelete) {
      // Show confirmation dialog for existing stories
      onRequestDelete(id);
    } else {
      // Just remove from local state for new items
      setValue(
        "stories",
        stories.filter((item) => item.id !== id),
      );
    }
  };

  return (
    <TabPanel className={clsx("space-y-6", className)}>
      <div className="bg-card rounded-2xl p-6">
        <h3 className="text-foreground mb-4 text-lg font-semibold">
          Upload Stories
        </h3>
        <Controller
          name="stories"
          control={control}
          defaultValue={defaultStories}
          render={({ field }) => (
            <ListCardMediaUpload
              layout="grid"
              cols={3}
              items={stories}
              aspectRatio="9:16"
              accept={{
                "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
                "video/*": [".mp4", ".webm", ".mov"],
              }}
              onAdd={(file) => {
                const newItem: StoryUploadItem = {
                  id: `story-${Date.now()}`,
                  url: URL.createObjectURL(file),
                  file: file,
                  mediaType: file.type.startsWith("video/") ? "video" : "image",
                };
                field.onChange([...stories, newItem]);
              }}
              onRemove={handleRemove}
              onReorder={(newItems) => {
                field.onChange(newItems);
              }}
            />
          )}
        />
      </div>
    </TabPanel>
  );
};

export default TabCharactersCreateEdit3;
