"use client";

import React, { useMemo } from "react";
import clsx from "clsx";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardMediaUpload, {
  type AspectRatio,
} from "../molecules/CardMediaUpload";
import type { Accept } from "react-dropzone";

export type MediaUploadItem = {
  id: string;
  url?: string;
  mediaType?: "image" | "video";
};

export type ListCardMediaUploadProps = {
  className?: string;
  layout?: "row" | "grid";
  cols?: number;
  items: MediaUploadItem[];
  aspectRatio?: AspectRatio;
  accept?: Accept;
  maxSize?: number;
  disabled?: boolean;
  onAdd?: (file: File) => void;
  onRemove?: (id: string) => void;
  onReorder?: (items: MediaUploadItem[]) => void;
};

type SortableMediaItemProps = {
  item: MediaUploadItem;
  aspectRatio?: AspectRatio;
  layout: "row" | "grid";
  onRemove?: (id: string) => void;
};

const SortableMediaItem: React.FC<SortableMediaItemProps> = ({
  item,
  aspectRatio,
  layout,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        "relative",
        layout === "row" && "w-48 shrink-0",
        isDragging && "opacity-50",
        "cursor-grab active:cursor-grabbing",
      )}
    >
      <CardMediaUpload
        defaultMedia={item.url}
        defaultMediaType={item.mediaType}
        aspectRatio={aspectRatio}
        enablePreview={true}
        onRemove={onRemove ? () => onRemove(item.id) : undefined}
      />
    </div>
  );
};

const ListCardMediaUpload: React.FC<ListCardMediaUploadProps> = ({
  className,
  layout = "grid",
  cols = 4,
  items,
  aspectRatio = "1:1",
  accept,
  maxSize,
  disabled = false,
  onAdd,
  onRemove,
  onReorder,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const itemIds = useMemo(() => items.map((item) => item.id), [items]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        onReorder?.(newItems);
      }
    }
  };

  const handleAddFile = (file: File | null) => {
    if (file) {
      onAdd?.(file);
    }
  };

  const sortingStrategy =
    layout === "row" ? horizontalListSortingStrategy : rectSortingStrategy;

  return (
    <div className={clsx("w-full", className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={sortingStrategy}>
          <div
            className={clsx(
              layout === "grid" && "grid gap-4",
              layout === "row" &&
                "scrollbar-thin flex gap-4 overflow-x-auto pb-2",
            )}
            style={
              layout === "grid"
                ? {
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  }
                : undefined
            }
          >
            {items.map((item) => (
              <SortableMediaItem
                key={item.id}
                item={item}
                aspectRatio={aspectRatio}
                layout={layout}
                onRemove={onRemove}
              />
            ))}

            {/* Empty upload card - always at the end, not draggable */}
            <div className={clsx(layout === "row" && "w-48 shrink-0")}>
              <CardMediaUpload
                aspectRatio={aspectRatio}
                accept={accept}
                maxSize={maxSize}
                disabled={disabled}
                onChange={handleAddFile}
                enablePreview={false}
              />
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ListCardMediaUpload;
