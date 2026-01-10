"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { Dialog, DialogBody } from "@/app/_components/atoms/dialog";
import { Lock, X, ArrowLeft } from "lucide-react";
import ListCardPrivateContent from "./ListCardPrivateContent";
import GalleryPrivateContent from "./GalleryPrivateContent";
import type { CardPrivateContentProps } from "../molecules/CardPrivateContent";
import type { GalleryMediaItem } from "./GalleryPrivateContent";

// ============================================================================
// Types
// ============================================================================

export type DialogPrivateContentProps = {
  className?: string;
  open: boolean;
  onClose: () => void;
  // Data
  items: CardPrivateContentProps[];
  loading?: boolean;
  // Callbacks
  onUnlock?: (item: CardPrivateContentProps, index: number) => void;
};

type ViewType = "list" | "gallery";

// ============================================================================
// Main Component
// ============================================================================

const DialogPrivateContent: React.FC<DialogPrivateContentProps> = ({
  className,
  open,
  onClose,
  items,
  loading = false,
  onUnlock,
}) => {
  const [view, setView] = useState<ViewType>("list");
  const [selectedItem, setSelectedItem] =
    useState<CardPrivateContentProps | null>(null);

  // Reset view when dialog closes
  useEffect(() => {
    if (!open) {
      setView("list");
      setSelectedItem(null);
    }
  }, [open]);

  // Handle item click - switch to gallery view
  const handleItemClick = (item: CardPrivateContentProps, _index: number) => {
    // Only allow gallery view for unlocked items with media
    if (!item.locked && item.media && item.media.length > 0) {
      setSelectedItem(item);
      setView("gallery");
    }
  };

  // Handle back button - return to list view
  const handleBack = () => {
    setView("list");
    setSelectedItem(null);
  };

  // Transform media items for gallery component
  const getGalleryItems = (): GalleryMediaItem[] => {
    if (!selectedItem?.media) return [];
    return selectedItem.media.map((m) => ({
      id: m.id,
      type: m.type,
      src: m.src,
      thumbnailSrc: m.thumbnailSrc,
    }));
  };

  return (
    <Dialog
      className={clsx("relative", className)}
      open={open}
      onClose={onClose}
      size="5xl"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground absolute top-4 right-4 z-10 transition-colors"
        aria-label="Close dialog"
      >
        <X className="h-5 w-5" />
      </button>

      {/* List View */}
      {view === "list" && (
        <>
          {/* Header with lock icon and title */}
          <div className="flex items-center gap-3 pb-4">
            <div className="bg-muted flex size-10 items-center justify-center rounded-full">
              <Lock className="text-foreground size-5" />
            </div>
            <h2 className="text-foreground text-xl font-semibold">
              Private Content
            </h2>
          </div>

          <DialogBody className="max-h-[70vh] overflow-y-auto">
            <ListCardPrivateContent
              layout="grid"
              loading={loading}
              items={items}
              onItemClick={handleItemClick}
              onUnlock={onUnlock}
            />
          </DialogBody>
        </>
      )}

      {/* Gallery View */}
      {view === "gallery" && selectedItem && (
        <>
          {/* Header with back button and description */}
          <div className="flex items-center gap-3 pb-4">
            <button
              onClick={handleBack}
              className="bg-muted hover:bg-muted/80 flex size-10 items-center justify-center rounded-full transition-colors"
              aria-label="Go back to list"
            >
              <ArrowLeft className="text-foreground size-5" />
            </button>
            <h2 className="text-foreground line-clamp-1 text-lg font-medium">
              {selectedItem.description || "Private Content"}
            </h2>
          </div>

          <DialogBody className="h-[70vh]">
            <GalleryPrivateContent
              items={getGalleryItems()}
              className="h-full"
            />
          </DialogBody>
        </>
      )}
    </Dialog>
  );
};

export default DialogPrivateContent;
