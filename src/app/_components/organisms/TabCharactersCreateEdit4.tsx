"use client";

import React, { useState, useCallback } from "react";
import clsx from "clsx";
import { TabPanel } from "@headlessui/react";
import { Plus } from "lucide-react";
import { Button } from "../atoms/button";
import ListCardPrivateContent from "./ListCardPrivateContent";
import DialogCreateUpdatePrivateContent, {
  type ExistingPrivateContent,
  type PrivateContentFormData,
} from "./DialogCreateUpdatePrivateContent";
import type { CardPrivateContentProps } from "../molecules/CardPrivateContent";

// ============================================================================
// Types
// ============================================================================

export type PrivateContentItem = CardPrivateContentProps & {
  id: string;
  name?: string;
};

export type TabCharactersCreateEdit4Props = {
  className?: string;
  // Private content items
  privateContents: PrivateContentItem[];
  loading?: boolean;
  // Dialog handlers
  onCreatePrivateContent?: (data: PrivateContentFormData) => void;
  onUpdatePrivateContent?: (id: string, data: PrivateContentFormData) => void;
  // Loading states for dialog submission
  isCreating?: boolean;
  isUpdating?: boolean;
};

// ============================================================================
// Main Component
// ============================================================================

const TabCharactersCreateEdit4: React.FC<TabCharactersCreateEdit4Props> = ({
  className,
  privateContents,
  loading = false,
  onCreatePrivateContent,
  onUpdatePrivateContent,
  isCreating = false,
  isUpdating = false,
}) => {
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedContent, setSelectedContent] = useState<
    ExistingPrivateContent | undefined
  >(undefined);

  // Open dialog in create mode
  const handleAddClick = useCallback(() => {
    setDialogMode("create");
    setSelectedContent(undefined);
    setDialogOpen(true);
  }, []);

  // Open dialog in edit mode with selected item
  const handleEditClick = useCallback((item: PrivateContentItem) => {
    setDialogMode("edit");
    setSelectedContent({
      id: item.id,
      name: item.name ?? item.description ?? "",
      tokenPrice: item.tokenCost,
      description: item.description,
      posterUrl: item.imageSrc,
      media: item.media?.map((m) => ({
        id: m.id,
        url: m.src,
        mediaType: m.type,
      })),
    });
    setDialogOpen(true);
  }, []);

  // Close dialog
  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setSelectedContent(undefined);
  }, []);

  // Handle dialog submit
  const handleDialogSubmit = useCallback(
    (data: PrivateContentFormData) => {
      if (dialogMode === "create") {
        onCreatePrivateContent?.(data);
      } else if (selectedContent) {
        onUpdatePrivateContent?.(selectedContent.id, data);
      }
    },
    [
      dialogMode,
      selectedContent,
      onCreatePrivateContent,
      onUpdatePrivateContent,
    ],
  );

  // Map items to include onUpdate callback and set locked=false
  const itemsWithEditHandler: CardPrivateContentProps[] = privateContents.map(
    (item) => ({
      ...item,
      locked: false,
      onUpdate: () => handleEditClick(item),
    }),
  );

  return (
    <TabPanel className={clsx("space-y-6", className)}>
      {/* Header Section */}
      <div className="bg-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-lg font-semibold">
            Add private content to character
          </h3>
          <Button color="primary" onClick={handleAddClick}>
            <Plus data-slot="icon" className="size-4" />
            Add Private Content
          </Button>
        </div>
      </div>

      {/* Private Content List */}
      <ListCardPrivateContent
        layout="grid"
        loading={loading}
        items={itemsWithEditHandler}
        emptyStateTitle="No private content yet"
        emptyStateDescription="Add private content for your character by clicking the button above."
      />

      {/* Create/Update Dialog */}
      <DialogCreateUpdatePrivateContent
        open={dialogOpen}
        onClose={handleDialogClose}
        mode={dialogMode}
        existingContent={selectedContent}
        onSubmit={handleDialogSubmit}
        loading={dialogMode === "create" ? isCreating : isUpdating}
      />
    </TabPanel>
  );
};

export default TabCharactersCreateEdit4;
