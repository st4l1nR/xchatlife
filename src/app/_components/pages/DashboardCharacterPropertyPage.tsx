"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { Button } from "@/app/_components/atoms/button";
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from "@/app/_components/atoms/dialog";
import ListCardProperty from "@/app/_components/organisms/ListCardProperty";
import DialogCreateUpdateCharacterProperty from "@/app/_components/organisms/DialogCreateUpdateCharacterProperty";
import type { ExistingPropertyData } from "@/app/_components/organisms/DialogCreateUpdateCharacterProperty";
import type { PropertyItem } from "@/app/_components/organisms/ListCardProperty";
import type { CharacterPropertyConfig } from "@/lib/character-property-config";
import {
  useCharacterPropertyQuery,
  useCharacterPropertyReorder,
} from "@/hooks/useCharacterPropertyQuery";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";

export type DashboardCharacterPropertyPageMockData = {
  items: PropertyItem[];
};

// Helper to create default mock data for any property type
export const createDefaultMockData = (
  labels: string[],
): DashboardCharacterPropertyPageMockData => ({
  items: labels.map((label, index) => ({
    id: `${index + 1}`,
    src: "/images/girl-poster.webp",
    alt: label,
    mediaType: "image" as const,
    sortOrder: index,
  })),
});

export type DashboardCharacterPropertyPageProps = {
  config: CharacterPropertyConfig;
  className?: string;
  mock?: DashboardCharacterPropertyPageMockData;
};

const DashboardCharacterPropertyPage: React.FC<
  DashboardCharacterPropertyPageProps
> = ({ config, className, mock }) => {
  const { propertyType, label } = config;

  // State for create/update dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "update">("create");
  const [selectedItem, setSelectedItem] = useState<
    ExistingPropertyData | undefined
  >();

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    label: string;
  } | null>(null);

  // API calls (disabled when mock is provided)
  const { data, isLoading } = useCharacterPropertyQuery(propertyType, !mock);
  const utils = api.useUtils();
  const reorderMutation = useCharacterPropertyReorder(propertyType);

  const deleteMutation = api.characterOptions.deleteProperty.useMutation({
    onSuccess: () => {
      toast.success(`${label.singular} deleted successfully!`);
      void utils.characterOptions.invalidate();
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: (error) => {
      toast.error(
        error.message ?? `Failed to delete ${label.singular.toLowerCase()}`,
      );
    },
  });

  // Handlers
  const handleAdd = () => {
    setDialogMode("create");
    setSelectedItem(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    const item = data?.data?.find((i) => i.id === id);
    if (item) {
      // Build the selected item based on whether it requires gender/style
      const selectedData: ExistingPropertyData = {
        id: item.id,
        name: item.name,
        label: item.label,
        description: item.description,
        emoji: item.emoji,
        image: item.image,
        video: item.video,
      };

      // Add genderId and styleId if the property type requires them
      if (config.requiresGenderStyle && "gender" in item && "style" in item) {
        selectedData.genderId = (
          item as { gender?: { id: string } }
        ).gender?.id;
        selectedData.styleId = (item as { style?: { id: string } }).style?.id;
      }

      setSelectedItem(selectedData);
      setDialogMode("update");
      setDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const item = data?.data?.find((i) => i.id === id);
    if (item) {
      setItemToDelete({ id: item.id, label: item.label });
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate({
        id: itemToDelete.id,
        propertyType,
      });
    }
  };

  const handleReorder = (items: PropertyItem[]) => {
    reorderMutation.mutate({
      items: items.map((item, index) => ({
        id: item.id,
        sortOrder: index,
      })),
    });
  };

  // Map data for ListCardProperty (use mock if provided)
  const items: PropertyItem[] =
    mock?.items ??
    (data?.data ?? []).map((item) => ({
      id: item.id,
      src: item.video?.url ?? item.image?.url ?? "",
      alt: item.label,
      mediaType: item.video ? ("video" as const) : ("image" as const),
      sortOrder: item.sortOrder,
    }));

  return (
    <div className={clsx("space-y-8 p-5", className)}>
      {/* Header */}
      <section>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-semibold">
              Manage {label.plural}
            </h1>
            <p className="text-muted-foreground mt-1 max-w-3xl">
              Create and manage {label.singular.toLowerCase()} options for
              character creation. Drag and drop to reorder.
            </p>
          </div>
          <Button onClick={handleAdd}>
            <Plus data-slot="icon" />
            Add New {label.singular}
          </Button>
        </div>

        {/* List */}
        <ListCardProperty
          items={items}
          loading={isLoading && !mock}
          cols={4}
          aspectRatio="3:4"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
          emptyTitle={`No ${label.plural.toLowerCase()} found`}
          emptyDescription={`Add your first ${label.singular.toLowerCase()} option to get started.`}
        />
      </section>

      {/* Create/Update Dialog */}
      <DialogCreateUpdateCharacterProperty
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
        propertyType={propertyType}
        existingProperty={selectedItem}
        onSuccess={() => setDialogOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          if (!deleteMutation.isPending) {
            setDeleteDialogOpen(false);
            setItemToDelete(null);
          }
        }}
      >
        <DialogTitle>Delete {label.singular}</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete &quot;{itemToDelete?.label}&quot;?
          This action cannot be undone.
        </DialogDescription>
        <DialogActions>
          <Button
            plain
            onClick={() => {
              setDeleteDialogOpen(false);
              setItemToDelete(null);
            }}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={confirmDelete}
            loading={deleteMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DashboardCharacterPropertyPage;
