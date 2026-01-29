import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TableVisualNovel from "@/app/_components/organisms/TableVisualNovel";
import type { TableVisualNovelItem } from "@/app/_components/organisms/TableVisualNovel";

// Generate mock visual novels for testing
const generateMockVisualNovels = (count: number): TableVisualNovelItem[] => {
  const statuses = ["published", "draft"] as const;

  const titles = [
    "The Lost Kingdom",
    "Midnight Romance",
    "Echoes of Destiny",
    "Crimson Heart",
    "Starlight Academy",
    "Whispers in the Dark",
    "Summer Festival",
    "The Dragon's Promise",
    "Cherry Blossom Dreams",
    "Neon City Nights",
  ];

  const descriptions = [
    "An epic adventure through a magical realm",
    "A heartwarming tale of forbidden love",
    "Choose your destiny in this branching narrative",
    "A dark romance with multiple endings",
    "Supernatural romance at a prestigious school",
    "A mystery thriller with romance elements",
    "A slice of life summer adventure",
    "Fantasy adventure with mythical creatures",
    "A peaceful journey through Japanese culture",
    "Sci-fi romance in a dystopian future",
  ];

  const nodesOptions = [5, 12, 25, 38, 50, 75, 100, 150, 8, 15];
  const edgesOptions = [4, 10, 22, 35, 48, 72, 95, 145, 7, 13];
  const charactersOptions = [1, 2, 3, 4, 5, 6, 2, 3, 1, 4];

  return Array.from({ length: count }, (_, i) => {
    const title = titles[i % titles.length] ?? `Visual Novel ${i + 1}`;
    const description = descriptions[i % descriptions.length];
    const daysAgo = Math.floor(Math.random() * 365);
    const createdAt = new Date(
      Date.now() - daysAgo * 24 * 60 * 60 * 1000,
    ).toISOString();

    return {
      id: `visual-novel-${i + 1}`,
      title,
      description,
      thumbnailSrc:
        i % 3 === 0 ? `https://picsum.photos/seed/vn-${i}/200/200` : undefined,
      status: statuses[i % statuses.length]!,
      nodesCount: nodesOptions[i % nodesOptions.length]!,
      edgesCount: edgesOptions[i % edgesOptions.length]!,
      charactersCount: charactersOptions[i % charactersOptions.length]!,
      createdAt,
    };
  });
};

// Mock data
const mockVisualNovels10 = generateMockVisualNovels(10);
const mockVisualNovels5 = mockVisualNovels10.slice(0, 5);

const meta: Meta<typeof TableVisualNovel> = {
  title: "Organisms/TableVisualNovel",
  component: TableVisualNovel,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-background min-h-screen p-6">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onDelete: { action: "delete" },
    onView: { action: "view" },
    onEdit: { action: "edit" },
    onPublish: { action: "publish" },
    onDuplicate: { action: "duplicate" },
    onPageChange: { action: "pageChange" },
  },
};

export default meta;
type Story = StoryObj<typeof TableVisualNovel>;

// ============================================================================
// Default - populated table
// ============================================================================
export const Default: Story = {
  args: {
    loading: false,
    totalDocs: mockVisualNovels10.length,
    data: mockVisualNovels10,
    pagination: {
      page: 1,
      total: mockVisualNovels10.length,
      totalPage: 1,
      size: 10,
    },
  },
};

// ============================================================================
// Loading - loading state
// ============================================================================
export const Loading: Story = {
  args: {
    loading: true,
    totalDocs: 0,
    data: [],
  },
};

// ============================================================================
// Empty - no data
// ============================================================================
export const Empty: Story = {
  args: {
    loading: false,
    totalDocs: 0,
    data: [],
  },
};

// ============================================================================
// WithPagination - multiple pages
// ============================================================================
export const WithPagination: Story = {
  args: {
    loading: false,
    totalDocs: 50,
    data: mockVisualNovels10,
    pagination: {
      page: 3,
      total: 50,
      totalPage: 5,
      size: 10,
    },
  },
};

// ============================================================================
// FewItems - only a few items
// ============================================================================
export const FewItems: Story = {
  args: {
    loading: false,
    totalDocs: mockVisualNovels5.length,
    data: mockVisualNovels5,
    pagination: {
      page: 1,
      total: mockVisualNovels5.length,
      totalPage: 1,
      size: 10,
    },
  },
};

// ============================================================================
// AllPublished - all items are published
// ============================================================================
export const AllPublished: Story = {
  args: {
    loading: false,
    totalDocs: mockVisualNovels10.length,
    data: mockVisualNovels10.map((vn) => ({
      ...vn,
      status: "published" as const,
    })),
    pagination: {
      page: 1,
      total: mockVisualNovels10.length,
      totalPage: 1,
      size: 10,
    },
  },
};

// ============================================================================
// AllDraft - all items are drafts
// ============================================================================
export const AllDraft: Story = {
  args: {
    loading: false,
    totalDocs: mockVisualNovels10.length,
    data: mockVisualNovels10.map((vn) => ({
      ...vn,
      status: "draft" as const,
    })),
    pagination: {
      page: 1,
      total: mockVisualNovels10.length,
      totalPage: 1,
      size: 10,
    },
  },
};

// ============================================================================
// WithThumbnails - all items have thumbnails
// ============================================================================
export const WithThumbnails: Story = {
  args: {
    loading: false,
    totalDocs: mockVisualNovels10.length,
    data: mockVisualNovels10.map((vn, i) => ({
      ...vn,
      thumbnailSrc: `https://picsum.photos/seed/vn-thumb-${i}/200/200`,
    })),
    pagination: {
      page: 1,
      total: mockVisualNovels10.length,
      totalPage: 1,
      size: 10,
    },
  },
};

// ============================================================================
// WithoutThumbnails - no thumbnails
// ============================================================================
export const WithoutThumbnails: Story = {
  args: {
    loading: false,
    totalDocs: mockVisualNovels10.length,
    data: mockVisualNovels10.map((vn) => ({
      ...vn,
      thumbnailSrc: undefined,
    })),
    pagination: {
      page: 1,
      total: mockVisualNovels10.length,
      totalPage: 1,
      size: 10,
    },
  },
};

// ============================================================================
// LongTitles - items with very long titles
// ============================================================================
export const LongTitles: Story = {
  args: {
    loading: false,
    totalDocs: mockVisualNovels5.length,
    data: mockVisualNovels5.map((vn, i) => ({
      ...vn,
      title: `${vn.title}: An Extended Tale of Adventure, Romance, and Mystery - Part ${i + 1}`,
      description: `${vn.description} with many twists and turns throughout the entire experience.`,
    })),
    pagination: {
      page: 1,
      total: mockVisualNovels5.length,
      totalPage: 1,
      size: 10,
    },
  },
};

// ============================================================================
// ManyNodes - items with many nodes
// ============================================================================
export const ManyNodes: Story = {
  args: {
    loading: false,
    totalDocs: mockVisualNovels10.length,
    data: mockVisualNovels10.map((vn, i) => ({
      ...vn,
      nodesCount: 100 + i * 50,
      edgesCount: 95 + i * 48,
      charactersCount: 5 + i,
    })),
    pagination: {
      page: 1,
      total: mockVisualNovels10.length,
      totalPage: 1,
      size: 10,
    },
  },
};

// ============================================================================
// NoDescription - items without descriptions
// ============================================================================
export const NoDescription: Story = {
  args: {
    loading: false,
    totalDocs: mockVisualNovels10.length,
    data: mockVisualNovels10.map((vn) => ({
      ...vn,
      description: undefined,
    })),
    pagination: {
      page: 1,
      total: mockVisualNovels10.length,
      totalPage: 1,
      size: 10,
    },
  },
};

// ============================================================================
// MobileView - mobile viewport
// ============================================================================
export const MobileView: Story = {
  args: {
    loading: false,
    totalDocs: mockVisualNovels5.length,
    data: mockVisualNovels5,
    pagination: {
      page: 1,
      total: mockVisualNovels5.length,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

// ============================================================================
// TabletView - tablet viewport
// ============================================================================
export const TabletView: Story = {
  args: {
    loading: false,
    totalDocs: mockVisualNovels10.length,
    data: mockVisualNovels10,
    pagination: {
      page: 1,
      total: mockVisualNovels10.length,
      totalPage: 1,
      size: 10,
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};
