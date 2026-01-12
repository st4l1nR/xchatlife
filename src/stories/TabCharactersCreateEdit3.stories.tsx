import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TabGroup, TabPanels } from "@headlessui/react";

import TabCharactersCreateEdit3, {
  type StoryUploadItem,
} from "@/app/_components/organisms/TabCharactersCreateEdit3";

// Sample images for stories (portrait/vertical format)
const sampleStoryImages = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=711&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=711&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=711&fit=crop",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=711&fit=crop",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=711&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=711&fit=crop",
];

const sampleVideo = "/videos/girl-video.mp4";

const createMockStories = (count: number): StoryUploadItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `story-${i + 1}`,
    url: sampleStoryImages[i % sampleStoryImages.length],
    mediaType: "image" as const,
  }));
};

const createMixedStories = (): StoryUploadItem[] => [
  { id: "story-1", url: sampleStoryImages[0], mediaType: "image" },
  { id: "story-2", url: sampleVideo, mediaType: "video" },
  { id: "story-3", url: sampleStoryImages[1], mediaType: "image" },
  { id: "story-4", url: sampleStoryImages[2], mediaType: "image" },
];

// Zod schema for form validation
const storiesFormSchema = z.object({
  stories: z
    .array(
      z.object({
        id: z.string(),
        url: z.string().optional(),
        file: z.any().optional(),
        mediaType: z.enum(["image", "video"]).optional(),
      }),
    )
    .optional(),
});

type StoriesFormData = z.infer<typeof storiesFormSchema>;

// Wrapper component that provides FormProvider and TabGroup/TabPanels
function FormWrapper({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: Partial<StoriesFormData>;
}) {
  const methods = useForm<StoriesFormData>({
    resolver: zodResolver(storiesFormSchema),
    defaultValues: {
      stories: [],
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
  title: "Organisms/TabCharactersCreateEdit3",
  component: TabCharactersCreateEdit3,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes",
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
} satisfies Meta<typeof TabCharactersCreateEdit3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <FormWrapper>
      <TabCharactersCreateEdit3 {...args} />
    </FormWrapper>
  ),
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "Empty stories tab ready for uploads. Shows only the upload card.",
      },
    },
  },
};

export const WithExistingStories: Story = {
  render: (args) => (
    <FormWrapper
      defaultValues={{
        stories: createMockStories(3),
      }}
    >
      <TabCharactersCreateEdit3 {...args} />
    </FormWrapper>
  ),
  args: {
    defaultStories: createMockStories(3),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Stories tab with existing uploads. Useful for editing existing characters.",
      },
    },
  },
};

export const WithMixedMedia: Story = {
  render: (args) => (
    <FormWrapper
      defaultValues={{
        stories: createMixedStories(),
      }}
    >
      <TabCharactersCreateEdit3 {...args} />
    </FormWrapper>
  ),
  args: {
    defaultStories: createMixedStories(),
  },
  parameters: {
    docs: {
      description: {
        story: "Stories tab with both images and videos.",
      },
    },
  },
};

export const ManyStories: Story = {
  render: (args) => (
    <FormWrapper
      defaultValues={{
        stories: createMockStories(8),
      }}
    >
      <TabCharactersCreateEdit3 {...args} />
    </FormWrapper>
  ),
  args: {
    defaultStories: createMockStories(8),
  },
  parameters: {
    docs: {
      description: {
        story: "Stories tab with many items to test scrolling and layout.",
      },
    },
  },
};

export const MobileView: Story = {
  render: (args) => (
    <FormWrapper
      defaultValues={{
        stories: createMockStories(4),
      }}
    >
      <TabCharactersCreateEdit3 {...args} />
    </FormWrapper>
  ),
  args: {
    defaultStories: createMockStories(4),
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Mobile view of the stories tab. Grid remains 2 columns for optimal story viewing.",
      },
    },
  },
};

export const TabletView: Story = {
  render: (args) => (
    <FormWrapper
      defaultValues={{
        stories: createMockStories(4),
      }}
    >
      <TabCharactersCreateEdit3 {...args} />
    </FormWrapper>
  ),
  args: {
    defaultStories: createMockStories(4),
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story: "Tablet view of the stories tab.",
      },
    },
  },
};
