import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { TabGroup, TabPanels } from "@headlessui/react";
import { fn } from "storybook/test";

import TabCharactersCreateEdit4, {
  type PrivateContentItem,
} from "@/app/_components/organisms/TabCharactersCreateEdit4";
import type { PrivateContentFormData } from "@/app/_components/organisms/DialogCreateUpdatePrivateContent";

// Sample private content items
const samplePrivateContents: PrivateContentItem[] = [
  {
    id: "1",
    name: "Exclusive Photo Set",
    imageSrc:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop",
    description: "Exclusive beach photo collection",
    tokenCost: 50,
    likeCount: 245,
    imageCount: 12,
    media: [
      {
        id: "m1",
        type: "image",
        src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      },
      {
        id: "m2",
        type: "image",
        src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400",
      },
    ],
  },
  {
    id: "2",
    name: "Behind the Scenes",
    imageSrc:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop",
    description: "Behind the scenes footage from my latest shoot",
    tokenCost: 75,
    likeCount: 189,
    imageCount: 8,
    media: [
      {
        id: "m3",
        type: "video",
        src: "/videos/girl-video.mp4",
      },
    ],
  },
  {
    id: "3",
    name: "Premium Collection",
    imageSrc:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
    description: "My most exclusive content collection",
    tokenCost: 100,
    likeCount: 567,
    imageCount: 20,
    media: [
      {
        id: "m4",
        type: "image",
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      },
    ],
  },
  {
    id: "4",
    name: "Special Request",
    imageSrc:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop",
    description: "Custom content made just for you",
    tokenCost: 150,
    likeCount: 98,
    imageCount: 5,
  },
];

// Wrapper component that provides TabGroup/TabPanels context
function TabWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TabGroup>
      <TabPanels>{children}</TabPanels>
    </TabGroup>
  );
}

// Interactive wrapper that handles dialog state
function InteractiveWrapper({
  children: _children,
  onCreatePrivateContent,
  onUpdatePrivateContent,
  onRequestDelete,
  ...props
}: {
  children?: React.ReactNode;
  privateContents: PrivateContentItem[];
  loading?: boolean;
  onCreatePrivateContent?: (data: PrivateContentFormData) => void;
  onUpdatePrivateContent?: (id: string, data: PrivateContentFormData) => void;
  onRequestDelete?: (id: string) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCreate = (data: PrivateContentFormData) => {
    setIsCreating(true);
    onCreatePrivateContent?.(data);
    // Simulate API call
    setTimeout(() => {
      setIsCreating(false);
    }, 1500);
  };

  const handleUpdate = (id: string, data: PrivateContentFormData) => {
    setIsUpdating(true);
    onUpdatePrivateContent?.(id, data);
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
    }, 1500);
  };

  return (
    <TabWrapper>
      <TabCharactersCreateEdit4
        {...props}
        onCreatePrivateContent={handleCreate}
        onUpdatePrivateContent={handleUpdate}
        onRequestDelete={onRequestDelete}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />
    </TabWrapper>
  );
}

const meta = {
  title: "Organisms/TabCharactersCreateEdit4",
  component: TabCharactersCreateEdit4,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: "boolean",
      description: "Loading state for the content list",
    },
    isCreating: {
      control: "boolean",
      description: "Loading state when creating new content",
    },
    isUpdating: {
      control: "boolean",
      description: "Loading state when updating existing content",
    },
    onRequestDelete: {
      action: "onRequestDelete",
      description:
        "Callback when user requests to delete private content (triggers confirmation dialog)",
    },
  },
  args: {
    onCreatePrivateContent: fn(),
    onUpdatePrivateContent: fn(),
    onRequestDelete: fn(),
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
} satisfies Meta<typeof TabCharactersCreateEdit4>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <InteractiveWrapper
      privateContents={[]}
      onCreatePrivateContent={args.onCreatePrivateContent}
      onUpdatePrivateContent={args.onUpdatePrivateContent}
    />
  ),
  args: {
    privateContents: [],
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Empty state with no private content. Click 'Add Private Content' to open the create dialog.",
      },
    },
  },
};

export const WithItems: Story = {
  render: (args) => (
    <InteractiveWrapper
      privateContents={samplePrivateContents}
      onCreatePrivateContent={args.onCreatePrivateContent}
      onUpdatePrivateContent={args.onUpdatePrivateContent}
    />
  ),
  args: {
    privateContents: samplePrivateContents,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows a list of private content items. Click the edit (pencil) button on any card to open the edit dialog with pre-filled data.",
      },
    },
  },
};

export const Loading: Story = {
  render: () => (
    <TabWrapper>
      <TabCharactersCreateEdit4
        privateContents={[]}
        loading={true}
        onCreatePrivateContent={fn()}
        onUpdatePrivateContent={fn()}
      />
    </TabWrapper>
  ),
  args: {
    privateContents: [],
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Loading state showing skeleton cards while content is being fetched.",
      },
    },
  },
};

export const SingleItem: Story = {
  render: (args) => (
    <InteractiveWrapper
      privateContents={[samplePrivateContents[0]!]}
      onCreatePrivateContent={args.onCreatePrivateContent}
      onUpdatePrivateContent={args.onUpdatePrivateContent}
    />
  ),
  args: {
    privateContents: [samplePrivateContents[0]!],
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the component with a single private content item.",
      },
    },
  },
};

export const WithDeleteConfirmation: Story = {
  render: (args) => (
    <InteractiveWrapper
      privateContents={samplePrivateContents}
      onCreatePrivateContent={args.onCreatePrivateContent}
      onUpdatePrivateContent={args.onUpdatePrivateContent}
      onRequestDelete={(id) => {
        const item = samplePrivateContents.find((c) => c.id === id);
        alert(`Delete requested for: ${item?.name ?? id}`);
      }}
    />
  ),
  args: {
    privateContents: samplePrivateContents,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates delete confirmation flow. Click the trash icon on any card to trigger the onRequestDelete callback.",
      },
    },
  },
};

export const MobileView: Story = {
  render: (args) => (
    <InteractiveWrapper
      privateContents={samplePrivateContents}
      onCreatePrivateContent={args.onCreatePrivateContent}
      onUpdatePrivateContent={args.onUpdatePrivateContent}
    />
  ),
  args: {
    privateContents: samplePrivateContents,
    loading: false,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Mobile view of the component. Cards stack vertically on smaller screens.",
      },
    },
  },
};

export const TabletView: Story = {
  render: (args) => (
    <InteractiveWrapper
      privateContents={samplePrivateContents}
      onCreatePrivateContent={args.onCreatePrivateContent}
      onUpdatePrivateContent={args.onUpdatePrivateContent}
    />
  ),
  args: {
    privateContents: samplePrivateContents,
    loading: false,
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
