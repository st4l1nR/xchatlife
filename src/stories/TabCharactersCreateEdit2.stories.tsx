import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TabGroup, TabPanels } from "@headlessui/react";
import { useState } from "react";

import TabCharactersCreateEdit2 from "@/app/_components/organisms/TabCharactersCreateEdit2";
import type { MediaUploadItem } from "@/app/_components/organisms/ListCardMediaUpload";

const sampleVideo = "/videos/girl-video.mp4";

const createMockReels = (count: number): MediaUploadItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `reel-${i + 1}`,
    url: sampleVideo,
    mediaType: "video" as const,
  }));
};

// Zod schema for form validation
const reelsFormSchema = z.object({
  reels: z
    .array(
      z.object({
        id: z.string(),
        url: z.string().optional(),
        mediaType: z.enum(["image", "video"]).optional(),
      }),
    )
    .optional(),
});

type ReelsFormData = z.infer<typeof reelsFormSchema>;

// Wrapper component that provides FormProvider and TabGroup/TabPanels
function FormWrapper({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: Partial<ReelsFormData>;
}) {
  const methods = useForm<ReelsFormData>({
    resolver: zodResolver(reelsFormSchema),
    defaultValues: {
      reels: [],
      ...defaultValues,
    },
  });

  return (
    <FormProvider {...methods}>
      <TabGroup>
        <TabPanels>{children}</TabPanels>
      </TabGroup>
    </FormProvider>
  );
}

const meta = {
  title: "Organisms/TabCharactersCreateEdit2",
  component: TabCharactersCreateEdit2,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    defaultReels: {
      description: "Default reels for edit mode",
    },
    onRequestDelete: {
      action: "onRequestDelete",
      description:
        "Callback when user requests to delete an existing reel (triggers confirmation dialog)",
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background min-h-screen p-6">
        <div className="mx-auto max-w-4xl">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof TabCharactersCreateEdit2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <FormWrapper>
      <TabCharactersCreateEdit2 {...args} />
    </FormWrapper>
  ),
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Empty state with just the upload card for adding new reels.",
      },
    },
  },
};

export const WithExistingReels: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ reels: createMockReels(3) }}>
      <TabCharactersCreateEdit2 {...args} />
    </FormWrapper>
  ),
  args: {
    defaultReels: createMockReels(3),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the component with pre-existing reels, useful for editing.",
      },
    },
  },
};

export const SingleReel: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ reels: createMockReels(1) }}>
      <TabCharactersCreateEdit2 {...args} />
    </FormWrapper>
  ),
  args: {
    defaultReels: createMockReels(1),
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the component with a single reel uploaded.",
      },
    },
  },
};

export const ManyReels: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ reels: createMockReels(6) }}>
      <TabCharactersCreateEdit2 {...args} />
    </FormWrapper>
  ),
  args: {
    defaultReels: createMockReels(6),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the component with many reels displaying the grid layout.",
      },
    },
  },
};

// Create mock reels with persisted IDs (without "reel-" prefix)
const createPersistedReels = (count: number): MediaUploadItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `persisted-${i + 1}`,
    url: sampleVideo,
    mediaType: "video" as const,
  }));
};

export const WithDeleteConfirmation: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ reels: createPersistedReels(3) }}>
      <TabCharactersCreateEdit2
        {...args}
        defaultReels={createPersistedReels(3)}
        onRequestDelete={(id) => alert(`Delete requested for reel: ${id}`)}
      />
    </FormWrapper>
  ),
  args: {
    defaultReels: createPersistedReels(3),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates delete confirmation flow. Click X on a reel to trigger the onRequestDelete callback. Persisted reels (without 'reel-' prefix) trigger the confirmation dialog.",
      },
    },
  },
};

// Interactive story with full state management
const InteractiveTemplate = () => {
  const [reels, setReels] = useState<MediaUploadItem[]>(createMockReels(3));

  const methods = useForm<ReelsFormData>({
    resolver: zodResolver(reelsFormSchema),
    defaultValues: {
      reels: reels,
    },
  });

  // Sync external state with form
  const handleReelsChange = () => {
    const currentReels = methods.watch("reels");
    if (currentReels) {
      setReels(currentReels);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Drag and drop reels to reorder. Click the empty card to add new
          videos.
        </p>
        <TabGroup>
          <TabPanels>
            <TabCharactersCreateEdit2 defaultReels={reels} />
          </TabPanels>
        </TabGroup>
        <div className="text-muted-foreground mt-4 text-xs">
          <button
            type="button"
            onClick={handleReelsChange}
            className="text-primary underline"
          >
            Log current reels
          </button>
          <pre className="bg-muted mt-2 rounded p-2">
            {JSON.stringify(methods.watch("reels"), null, 2)}
          </pre>
        </div>
      </div>
    </FormProvider>
  );
};

export const Interactive: Story = {
  args: {},
  render: () => <InteractiveTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Interactive story with full state management. You can add, remove, and reorder reels.",
      },
    },
  },
};

export const MobileView: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ reels: createMockReels(3) }}>
      <TabCharactersCreateEdit2 {...args} />
    </FormWrapper>
  ),
  args: {
    defaultReels: createMockReels(3),
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Mobile view of the component.",
      },
    },
  },
};

export const TabletView: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ reels: createMockReels(3) }}>
      <TabCharactersCreateEdit2 {...args} />
    </FormWrapper>
  ),
  args: {
    defaultReels: createMockReels(3),
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story: "Tablet view of the component with responsive grid layout.",
      },
    },
  },
};
