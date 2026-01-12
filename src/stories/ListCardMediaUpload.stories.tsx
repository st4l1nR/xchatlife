import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { useState } from "react";

import ListCardMediaUpload, {
  type MediaUploadItem,
} from "@/app/_components/organisms/ListCardMediaUpload";

const sampleImages = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
];

const sampleVideo =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const createMockItems = (count: number): MediaUploadItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    url: sampleImages[i % sampleImages.length],
    mediaType: "image" as const,
  }));
};

const createMixedItems = (): MediaUploadItem[] => [
  { id: "item-1", url: sampleImages[0], mediaType: "image" },
  { id: "item-2", url: sampleVideo, mediaType: "video" },
  { id: "item-3", url: sampleImages[1], mediaType: "image" },
  { id: "item-4", url: sampleImages[2], mediaType: "image" },
];

const meta = {
  title: "Organisms/ListCardMediaUpload",
  component: ListCardMediaUpload,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    layout: {
      control: "radio",
      options: ["grid", "row"],
      description: "Layout mode for the media upload list",
    },
    cols: {
      control: { type: "number", min: 1, max: 8 },
      description: "Number of columns for grid layout (default: 4)",
    },
    aspectRatio: {
      control: "select",
      options: ["16:9", "4:3", "1:1", "3:4", "9:16"],
      description: "Aspect ratio for all upload cards",
    },
    disabled: {
      control: "boolean",
      description: "Whether all upload cards are disabled",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  args: {
    onAdd: fn(),
    onRemove: fn(),
    onReorder: fn(),
  },
} satisfies Meta<typeof ListCardMediaUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    layout: "grid",
    items: createMockItems(3),
    aspectRatio: "1:1",
  },
};

export const RowLayout: Story = {
  args: {
    layout: "row",
    items: createMockItems(4),
    aspectRatio: "1:1",
  },
};

export const Empty: Story = {
  args: {
    layout: "grid",
    items: [],
    aspectRatio: "1:1",
  },
};

export const SingleItem: Story = {
  args: {
    layout: "grid",
    items: createMockItems(1),
    aspectRatio: "1:1",
  },
};

export const ManyItems: Story = {
  args: {
    layout: "grid",
    items: createMockItems(8),
    aspectRatio: "1:1",
  },
};

export const ManyItemsRow: Story = {
  name: "Many Items (Row)",
  args: {
    layout: "row",
    items: createMockItems(8),
    aspectRatio: "1:1",
  },
};

export const Disabled: Story = {
  args: {
    layout: "grid",
    items: createMockItems(3),
    aspectRatio: "1:1",
    disabled: true,
  },
};

export const VideoItems: Story = {
  args: {
    layout: "grid",
    items: createMixedItems(),
    aspectRatio: "16:9",
  },
};

export const AspectRatio16x9: Story = {
  name: "Aspect Ratio 16:9",
  args: {
    layout: "grid",
    items: createMockItems(3),
    aspectRatio: "16:9",
  },
};

export const AspectRatio3x4: Story = {
  name: "Aspect Ratio 3:4",
  args: {
    layout: "grid",
    items: createMockItems(3),
    aspectRatio: "3:4",
  },
};

// Interactive grid layout
const InteractiveGridTemplate = () => {
  const [items, setItems] = useState<MediaUploadItem[]>(createMockItems(8));

  const handleAdd = (file: File) => {
    const newItem: MediaUploadItem = {
      id: `item-${Date.now()}`,
      url: URL.createObjectURL(file),
      mediaType: file.type.startsWith("video/") ? "video" : "image",
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReorder = (newItems: MediaUploadItem[]) => {
    setItems(newItems);
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Drag and drop items to reorder. Click the empty card to add new media.
      </p>
      <ListCardMediaUpload
        layout="grid"
        items={items}
        aspectRatio="1:1"
        onAdd={handleAdd}
        onRemove={handleRemove}
        onReorder={handleReorder}
      />
      <div className="text-muted-foreground mt-4 text-xs">
        Current order: {items.map((item) => item.id).join(", ")}
      </div>
    </div>
  );
};

export const InteractiveGrid: Story = {
  name: "Interactive (Grid)",
  args: {
    items: [],
  },
  render: () => <InteractiveGridTemplate />,
};

// Interactive grid with 9:16 aspect ratio and 2 columns
const InteractiveGrid916Template = () => {
  const [items, setItems] = useState<MediaUploadItem[]>(createMockItems(4));

  const handleAdd = (file: File) => {
    const newItem: MediaUploadItem = {
      id: `item-${Date.now()}`,
      url: URL.createObjectURL(file),
      mediaType: file.type.startsWith("video/") ? "video" : "image",
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReorder = (newItems: MediaUploadItem[]) => {
    setItems(newItems);
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Drag and drop items to reorder. 9:16 aspect ratio with 2 columns.
      </p>
      <ListCardMediaUpload
        layout="grid"
        cols={2}
        items={items}
        aspectRatio="9:16"
        onAdd={handleAdd}
        onRemove={handleRemove}
        onReorder={handleReorder}
      />
      <div className="text-muted-foreground mt-4 text-xs">
        Current order: {items.map((item) => item.id).join(", ")}
      </div>
    </div>
  );
};

export const InteractiveGrid916: Story = {
  name: "Interactive (Grid 9:16)",
  args: {
    items: [],
  },
  render: () => <InteractiveGrid916Template />,
};

// Interactive row layout
const InteractiveRowTemplate = () => {
  const [items, setItems] = useState<MediaUploadItem[]>(createMockItems(4));

  const handleAdd = (file: File) => {
    const newItem: MediaUploadItem = {
      id: `item-${Date.now()}`,
      url: URL.createObjectURL(file),
      mediaType: file.type.startsWith("video/") ? "video" : "image",
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReorder = (newItems: MediaUploadItem[]) => {
    setItems(newItems);
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Drag and drop items to reorder in row layout.
      </p>
      <ListCardMediaUpload
        layout="row"
        items={items}
        aspectRatio="1:1"
        onAdd={handleAdd}
        onRemove={handleRemove}
        onReorder={handleReorder}
      />
      <div className="text-muted-foreground mt-4 text-xs">
        Current order: {items.map((item) => item.id).join(", ")}
      </div>
    </div>
  );
};

export const InteractiveRow: Story = {
  name: "Interactive (Row)",
  args: {
    items: [],
  },
  render: () => <InteractiveRowTemplate />,
};

// Comparison of both layouts
export const LayoutComparison: Story = {
  name: "Layout Comparison",
  args: {
    items: [],
  },
  decorators: [
    () => (
      <div className="space-y-8">
        <div>
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            Grid Layout
          </h3>
          <ListCardMediaUpload
            layout="grid"
            items={createMockItems(4)}
            aspectRatio="1:1"
            onAdd={fn()}
            onRemove={fn()}
            onReorder={fn()}
          />
        </div>
        <div>
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            Row Layout
          </h3>
          <ListCardMediaUpload
            layout="row"
            items={createMockItems(4)}
            aspectRatio="1:1"
            onAdd={fn()}
            onRemove={fn()}
            onReorder={fn()}
          />
        </div>
      </div>
    ),
  ],
};
