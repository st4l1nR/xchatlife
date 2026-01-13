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
};

const TabCharactersCreateEdit3: React.FC<TabCharactersCreateEdit3Props> = ({
  className,
  defaultStories = [],
}) => {
  const { control } = useFormContext();

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
              cols={2}
              items={field.value ?? []}
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
                field.onChange([...(field.value ?? []), newItem]);
              }}
              onRemove={(id) => {
                field.onChange(
                  ((field.value ?? []) as StoryUploadItem[]).filter(
                    (item: StoryUploadItem) => item.id !== id,
                  ),
                );
              }}
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
