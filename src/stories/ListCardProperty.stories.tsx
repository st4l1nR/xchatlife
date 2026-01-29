import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";

import ListCardProperty, {
  type PropertyItem,
} from "@/app/_components/organisms/ListCardProperty";
import DialogCreateUpdateProperty from "@/app/_components/organisms/DialogCreateUpdateProperty";
import type { ExistingPropertyData } from "@/app/_components/organisms/DialogCreateUpdateProperty";
import type { CharacterPropertyType } from "@/hooks/useCharacterPropertyQuery";

const meta = {
  title: "Organisms/ListCardProperty",
  component: ListCardProperty,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    layout: {
      control: "radio",
      options: ["grid", "row"],
      description: "Layout mode: grid or horizontal row",
    },
    cols: {
      control: "select",
      options: [2, 3, 4, 5, 6],
      description: "Number of columns in grid layout",
    },
    aspectRatio: {
      control: "select",
      options: ["16:9", "4:3", "1:1", "3:4", "9:16"],
      description: "Aspect ratio of the cards",
    },
    loading: {
      control: "boolean",
      description: "Show loading skeleton state",
    },
    loadingCount: {
      control: "number",
      description: "Number of loading skeletons to show",
    },
    emptyTitle: {
      control: "text",
      description: "Title for empty state",
    },
    emptyDescription: {
      control: "text",
      description: "Description for empty state",
    },
  },
} satisfies Meta<typeof ListCardProperty>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockImage = "/images/girl-poster.webp";
const mockVideo =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const generateMockItems = (count: number): PropertyItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    src: mockImage,
    alt: `Property ${i + 1}`,
    mediaType: "image" as const,
    sortOrder: i,
  }));

const mixedMediaItems: PropertyItem[] = [
  {
    id: "mix-1",
    src: mockImage,
    alt: "Image 1",
    mediaType: "image",
    sortOrder: 0,
  },
  {
    id: "mix-2",
    src: mockVideo,
    alt: "Video 1",
    mediaType: "video",
    sortOrder: 1,
  },
  {
    id: "mix-3",
    src: mockImage,
    alt: "Image 2",
    mediaType: "image",
    sortOrder: 2,
  },
  {
    id: "mix-4",
    src: mockVideo,
    alt: "Video 2",
    mediaType: "video",
    sortOrder: 3,
  },
];

// Extended PropertyItem with extra data for edit dialog
type PropertyItemWithData = PropertyItem & {
  name?: string;
  label?: string;
  description?: string;
  emoji?: string;
};

// Mock items with extra data for edit dialog
const mockItemsWithData: PropertyItemWithData[] = [
  {
    id: "personality-1",
    src: mockImage,
    alt: "Shy",
    mediaType: "image",
    sortOrder: 0,
    name: "shy",
    label: "Shy",
    description: "A reserved and introverted personality",
    emoji: "😊",
  },
  {
    id: "personality-2",
    src: mockImage,
    alt: "Confident",
    mediaType: "image",
    sortOrder: 1,
    name: "confident",
    label: "Confident",
    description: "Self-assured and bold personality",
    emoji: "😊",
  },
  {
    id: "personality-3",
    src: mockImage,
    alt: "Playful",
    mediaType: "image",
    sortOrder: 2,
    name: "playful",
    label: "Playful",
    description: "Fun-loving and mischievous",
    emoji: "😊",
  },
  {
    id: "personality-4",
    src: mockImage,
    alt: "Mysterious",
    mediaType: "image",
    sortOrder: 3,
    name: "mysterious",
    label: "Mysterious",
    description: "Enigmatic and intriguing",
    emoji: "😊",
  },
  {
    id: "personality-5",
    src: mockImage,
    alt: "Sweet",
    mediaType: "image",
    sortOrder: 4,
    name: "sweet",
    label: "Sweet",
    description: "Kind and gentle personality",
    emoji: "😊",
  },
  {
    id: "personality-6",
    src: mockImage,
    alt: "Dominant",
    mediaType: "image",
    sortOrder: 5,
    name: "dominant",
    label: "Dominant",
    description: "Assertive and commanding",
    emoji: "😊",
  },
];

// Interactive wrapper for stories with state
const InteractiveWrapper = ({
  initialItems,
  propertyType = "personality",
  ...props
}: Omit<
  React.ComponentProps<typeof ListCardProperty>,
  "items" | "onEdit" | "onReorder" | "onDelete"
> & {
  initialItems: PropertyItemWithData[];
  propertyType?: CharacterPropertyType;
}) => {
  const [items, setItems] = useState<PropertyItemWithData[]>(initialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    ExistingPropertyData | undefined
  >();

  const handleReorder = (newItems: PropertyItem[]) => {
    console.log("Reordered:", newItems);
    setItems(newItems as PropertyItemWithData[]);
  };

  const handleEdit = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setSelectedItem({
        id: item.id,
        name: item.name ?? `property-${item.id}`,
        label: item.label ?? item.alt ?? "Property",
        description: item.description,
        emoji: item.emoji,
        image: item.src ? { id: item.id, url: item.src } : null,
        video:
          item.mediaType === "video" && item.src
            ? { id: item.id, url: item.src }
            : null,
      });
      setDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    console.log("Delete:", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Drag and drop to reorder. Click edit (pencil) to open dialog. Click
          delete (trash on hover) to remove.
        </p>
        <p className="text-muted-foreground text-xs">
          Current order: {items.map((i) => i.id).join(", ")}
        </p>
        <ListCardProperty
          {...props}
          items={items}
          onReorder={handleReorder}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <DialogCreateUpdateProperty
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode="update"
        propertyType={propertyType}
        existingProperty={selectedItem}
        onSuccess={() => setDialogOpen(false)}
      />
    </>
  );
};

// --- Stories ---

export const Default: Story = {
  args: {
    items: generateMockItems(12),
    layout: "grid",
    cols: 6,
  },
};

export const RowLayout: Story = {
  args: {
    items: generateMockItems(12),
    layout: "row",
  },
};

export const Interactive: Story = {
  args: {
    items: mockItemsWithData,
    layout: "grid",
    cols: 3,
  },
  render: (args) => (
    <InteractiveWrapper
      initialItems={args.items as PropertyItemWithData[]}
      layout={args.layout}
      cols={args.cols}
      propertyType="personality"
    />
  ),
};

export const Loading: Story = {
  args: {
    items: [],
    layout: "grid",
    cols: 4,
    loading: true,
    loadingCount: 8,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    layout: "grid",
    cols: 4,
    emptyTitle: "No properties found",
    emptyDescription: "Add properties to get started.",
  },
};

export const Showcase: Story = {
  name: "Showcase (All Variants)",
  args: {
    items: [],
  },
  render: () => (
    <div className="space-y-12">
      {/* Layouts */}
      <section className="space-y-4">
        <h2 className="text-foreground text-xl font-bold">Layouts</h2>

        <div className="space-y-2">
          <h3 className="text-muted-foreground text-sm font-medium">
            Grid (6 cols)
          </h3>
          <ListCardProperty
            items={generateMockItems(6)}
            layout="grid"
            cols={6}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-muted-foreground text-sm font-medium">
            Grid (4 cols)
          </h3>
          <ListCardProperty
            items={generateMockItems(4)}
            layout="grid"
            cols={4}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-muted-foreground text-sm font-medium">
            Grid (3 cols)
          </h3>
          <ListCardProperty
            items={generateMockItems(3)}
            layout="grid"
            cols={3}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-muted-foreground text-sm font-medium">Row</h3>
          <ListCardProperty items={generateMockItems(8)} layout="row" />
        </div>
      </section>

      {/* Aspect Ratios */}
      <section className="space-y-4">
        <h2 className="text-foreground text-xl font-bold">Aspect Ratios</h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-muted-foreground text-sm font-medium">
              1:1 (Square)
            </h3>
            <ListCardProperty
              items={generateMockItems(3)}
              layout="grid"
              cols={3}
              aspectRatio="1:1"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-muted-foreground text-sm font-medium">
              16:9 (Widescreen)
            </h3>
            <ListCardProperty
              items={generateMockItems(3)}
              layout="grid"
              cols={3}
              aspectRatio="16:9"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-muted-foreground text-sm font-medium">
              4:3 (Standard)
            </h3>
            <ListCardProperty
              items={generateMockItems(3)}
              layout="grid"
              cols={3}
              aspectRatio="4:3"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-muted-foreground text-sm font-medium">
              3:4 (Portrait)
            </h3>
            <ListCardProperty
              items={generateMockItems(3)}
              layout="grid"
              cols={3}
              aspectRatio="3:4"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-muted-foreground text-sm font-medium">
            9:16 (Vertical)
          </h3>
          <ListCardProperty
            items={generateMockItems(6)}
            layout="grid"
            cols={6}
            aspectRatio="9:16"
          />
        </div>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-foreground text-xl font-bold">States</h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-muted-foreground text-sm font-medium">
              With Actions (hover cards)
            </h3>
            <ListCardProperty
              items={generateMockItems(3)}
              layout="grid"
              cols={3}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-muted-foreground text-sm font-medium">
              Mixed Media
            </h3>
            <ListCardProperty items={mixedMediaItems} layout="grid" cols={4} />
          </div>

          <div className="space-y-2">
            <h3 className="text-muted-foreground text-sm font-medium">
              Loading
            </h3>
            <ListCardProperty
              items={[]}
              layout="grid"
              cols={3}
              loading={true}
              loadingCount={3}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-muted-foreground text-sm font-medium">Empty</h3>
            <ListCardProperty
              items={[]}
              layout="grid"
              cols={3}
              emptyTitle="No properties"
              emptyDescription="Add properties to get started."
            />
          </div>
        </div>
      </section>
    </div>
  ),
};
