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
  rectSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardProperty, { type AspectRatio } from "../molecules/CardProperty";
import CardEmptyState from "../molecules/CardEmptyState";

export type PropertyItem = {
  id: string;
  src?: string;
  poster?: string;
  alt?: string;
  emoji?: string;
  mediaType: "image" | "video";
  sortOrder: number;
};

export type ListCardPropertyProps = {
  className?: string;
  layout?: "grid" | "row";
  cols?: 2 | 3 | 4 | 5 | 6;
  gridClassName?: string;
  aspectRatio?: AspectRatio;
  items: PropertyItem[];
  loading?: boolean;
  loadingCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  onReorder?: (items: PropertyItem[]) => void;
};

type SortableCardPropertyProps = {
  item: PropertyItem;
  aspectRatio: AspectRatio;
  layout: "grid" | "row";
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
};

const SortableCardProperty: React.FC<SortableCardPropertyProps> = ({
  item,
  aspectRatio,
  layout,
  onEdit,
  onDelete,
  onClick,
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
        layout === "row" && "w-32 shrink-0 sm:w-40",
        "cursor-grab active:cursor-grabbing",
      )}
    >
      <CardProperty
        id={item.id}
        src={item.src}
        poster={item.poster}
        alt={item.alt}
        emoji={item.emoji}
        mediaType={item.mediaType}
        aspectRatio={aspectRatio}
        onEdit={onEdit}
        onDelete={onDelete}
        onClick={onClick}
        isDragging={isDragging}
      />
    </div>
  );
};

const colsClasses: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
};

const ListCardProperty: React.FC<ListCardPropertyProps> = ({
  className,
  layout = "grid",
  cols = 6,
  gridClassName,
  aspectRatio = "3:4",
  items,
  loading = false,
  loadingCount = 6,
  emptyTitle = "No properties found",
  emptyDescription = "Add properties to get started.",
  onEdit,
  onDelete,
  onClick,
  onReorder,
}) => {
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.sortOrder - b.sortOrder),
    [items],
  );

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

  const itemIds = useMemo(
    () => sortedItems.map((item) => item.id),
    [sortedItems],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedItems.findIndex((item) => item.id === active.id);
      const newIndex = sortedItems.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(sortedItems, oldIndex, newIndex);
        const withNewOrder = reordered.map((item, index) => ({
          ...item,
          sortOrder: index,
        }));
        onReorder?.(withNewOrder);
      }
    }
  };

  const sortingStrategy =
    layout === "row" ? horizontalListSortingStrategy : rectSortingStrategy;

  if (loading) {
    return (
      <div
        className={clsx(
          layout === "grid" && "grid gap-4",
          layout === "grid" && (gridClassName ?? colsClasses[cols]),
          layout === "row" && "scrollbar-thin flex gap-4 overflow-x-auto pb-2",
          className,
        )}
      >
        {Array.from({ length: loadingCount }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              "bg-muted animate-pulse rounded-xl",
              layout === "row" && "w-32 shrink-0 sm:w-40",
              "aspect-3/4",
            )}
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <CardEmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemIds} strategy={sortingStrategy}>
        <div
          className={clsx(
            layout === "grid" && "grid gap-4",
            layout === "grid" && (gridClassName ?? colsClasses[cols]),
            layout === "row" &&
              "scrollbar-thin flex gap-4 overflow-x-auto pb-2",
            className,
          )}
        >
          {sortedItems.map((item) => (
            <SortableCardProperty
              key={item.id}
              item={item}
              aspectRatio={aspectRatio}
              layout={layout}
              onEdit={onEdit}
              onDelete={onDelete}
              onClick={onClick}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default ListCardProperty;
