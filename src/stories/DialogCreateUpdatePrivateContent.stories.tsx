import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import DialogCreateUpdatePrivateContent from "@/app/_components/organisms/DialogCreateUpdatePrivateContent";
import type {
  ExistingPrivateContent,
  PrivateContentMediaItem,
} from "@/app/_components/organisms/DialogCreateUpdatePrivateContent";
import { Button } from "@/app/_components/atoms/button";

const meta = {
  title: "Organisms/DialogCreateUpdatePrivateContent",
  component: DialogCreateUpdatePrivateContent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: { table: { disable: true } },
    onClose: { table: { disable: true } },
    mode: {
      control: "select",
      options: ["create", "edit"],
      description: "Whether to create new content or edit existing",
    },
    loading: {
      control: "boolean",
      description: "Loading state for the submit button",
    },
  },
  args: {
    onSubmit: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof DialogCreateUpdatePrivateContent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample media items for edit mode
const sampleMediaItems: PrivateContentMediaItem[] = [
  {
    id: "media-1",
    url: "https://picsum.photos/seed/media1/400/400",
    mediaType: "image",
  },
  {
    id: "media-2",
    url: "https://picsum.photos/seed/media2/400/400",
    mediaType: "image",
  },
  {
    id: "media-3",
    url: "https://picsum.photos/seed/media3/400/400",
    mediaType: "image",
  },
];

// Sample existing content for edit mode
const sampleExistingContent: ExistingPrivateContent = {
  id: "content-1",
  name: "Exclusive Photo Set",
  description:
    "A special collection of exclusive photos just for my premium subscribers.",
  posterUrl: "https://picsum.photos/seed/poster1/300/400",
  media: sampleMediaItems,
};

// ============================================================================
// Create Mode
// ============================================================================
export const CreateMode: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Create Private Content</Button>
        <DialogCreateUpdatePrivateContent
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="create"
          onSubmit={(data) => {
            args.onSubmit?.(data);
            setIsOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "create",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Create mode - empty form for creating new private content with poster and media uploads.",
      },
    },
  },
};

// ============================================================================
// Edit Mode
// ============================================================================
export const EditMode: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Edit Private Content</Button>
        <DialogCreateUpdatePrivateContent
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="edit"
          existingContent={sampleExistingContent}
          onSubmit={(data) => {
            args.onSubmit?.(data);
            setIsOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "edit",
    existingContent: sampleExistingContent,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Edit mode - pre-filled form with existing content data including poster and media items.",
      },
    },
  },
};

// ============================================================================
// Interactive Demo
// ============================================================================
export const Interactive: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-sm">
          Click a button to open the dialog in create or edit mode.
        </p>

        <div className="flex gap-4">
          <Button
            onClick={() => {
              setMode("create");
              setIsOpen(true);
            }}
          >
            Create New Content
          </Button>
          <Button
            outline
            onClick={() => {
              setMode("edit");
              setIsOpen(true);
            }}
          >
            Edit Existing Content
          </Button>
        </div>

        <DialogCreateUpdatePrivateContent
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode={mode}
          existingContent={mode === "edit" ? sampleExistingContent : undefined}
          onSubmit={(data) => {
            console.log("Form submitted:", data);
            setIsOpen(false);
          }}
        />
      </div>
    );
  },
  args: {
    open: false,
    mode: "create",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo showing both create and edit modes. Form data is logged to console on submit.",
      },
    },
  },
};

// ============================================================================
// Mobile View
// ============================================================================
export const MobileView: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Mobile Dialog</Button>
        <DialogCreateUpdatePrivateContent
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="create"
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "create",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Mobile view - the two-column layout stacks vertically on smaller screens.",
      },
    },
  },
};

// ============================================================================
// With Media Items
// ============================================================================
export const WithMedia: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    const contentWithMoreMedia: ExistingPrivateContent = {
      ...sampleExistingContent,
      media: [
        ...sampleMediaItems,
        {
          id: "media-4",
          url: "https://picsum.photos/seed/media4/400/400",
          mediaType: "image",
        },
        {
          id: "media-5",
          url: "https://picsum.photos/seed/media5/400/400",
          mediaType: "image",
        },
        {
          id: "media-6",
          url: "https://picsum.photos/seed/media6/400/400",
          mediaType: "image",
        },
      ],
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>View Content with Media</Button>
        <DialogCreateUpdatePrivateContent
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="edit"
          existingContent={contentWithMoreMedia}
          onSubmit={(data) => {
            args.onSubmit?.(data);
            setIsOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "edit",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Edit mode with multiple media items showing the grid layout with drag-and-drop reordering.",
      },
    },
  },
};

// ============================================================================
// Loading State
// ============================================================================
export const LoadingState: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Loading Dialog</Button>
        <DialogCreateUpdatePrivateContent
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="create"
          loading={true}
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "create",
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Loading state - all inputs are disabled and the submit button shows a loading indicator.",
      },
    },
  },
};
