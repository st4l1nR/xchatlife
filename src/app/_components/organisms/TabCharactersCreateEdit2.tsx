"use client";

import React from "react";
import clsx from "clsx";
import { TabPanel } from "@headlessui/react";
import { useFormContext, Controller } from "react-hook-form";
import ListCardMediaUpload, {
  type MediaUploadItem,
} from "./ListCardMediaUpload";

export type TabCharactersCreateEdit2Props = {
  className?: string;
  defaultReels?: MediaUploadItem[];
};

const TabCharactersCreateEdit2: React.FC<TabCharactersCreateEdit2Props> = ({
  className,
  defaultReels = [],
}) => {
  const { control, setValue, watch } = useFormContext();
  const reels = watch("reels") ?? defaultReels;

  const handleAdd = (file: File) => {
    const newItem: MediaUploadItem = {
      id: `reel-${Date.now()}`,
      url: URL.createObjectURL(file),
      mediaType: file.type.startsWith("video/") ? "video" : "image",
    };
    setValue("reels", [...reels, newItem]);
  };

  const handleRemove = (id: string) => {
    setValue(
      "reels",
      reels.filter((item: MediaUploadItem) => item.id !== id),
    );
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
                cols={2}
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
