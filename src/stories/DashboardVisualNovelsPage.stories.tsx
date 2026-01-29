import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DashboardVisualNovelsPage from "@/app/_components/pages/DashboardVisualNovelsPage";
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
    "The Enchanted Forest",
    "Love in Tokyo",
    "Mystery at Moonlight Manor",
    "The Pirate's Treasure",
    "Eternal Spring",
    "Shadows of the Past",
    "The Royal Wedding",
    "Cyberpunk Love Story",
    "The Time Traveler's Heart",
    "Island Paradise",
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
    "Explore the secrets of an ancient forest",
    "Modern romance in the heart of Japan",
    "Solve the mystery and find love",
    "Swashbuckling adventure on the high seas",
    "A cozy romance in a magical garden",
    "Uncover dark secrets from the past",
    "Political intrigue meets romance",
    "High-tech love in a neon-lit world",
    "Romance across time and space",
    "Tropical romance and adventure",
  ];

  const nodesOptions = [5, 12, 25, 38, 50, 75, 100, 150, 8, 15, 30, 45];
  const edgesOptions = [4, 10, 22, 35, 48, 72, 95, 145, 7, 13, 28, 42];
  const charactersOptions = [1, 2, 3, 4, 5, 6, 2, 3, 1, 4, 5, 3];

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

// Mock data sets
const mockVisualNovels50 = generateMockVisualNovels(50);
const mockVisualNovels10 = mockVisualNovels50.slice(0, 10);

const meta: Meta<typeof DashboardVisualNovelsPage> = {
  title: "Pages/DashboardVisualNovelsPage",
  component: DashboardVisualNovelsPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-background min-h-screen p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DashboardVisualNovelsPage>;

// ============================================================================
// Default - populated with visual novels
// ============================================================================
export const Default: Story = {
  args: {
    mock: {
      visualNovels: mockVisualNovels10,
      pagination: {
        page: 1,
        total: mockVisualNovels10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
};

// ============================================================================
// Loading - loading state
// ============================================================================
export const Loading: Story = {
  args: {
    mock: {
      visualNovels: [],
      pagination: {
        page: 1,
        total: 0,
        totalPage: 0,
        size: 10,
      },
    },
  },
  render: function Render() {
    return (
      <div className="bg-background min-h-screen p-6">
        <DashboardVisualNovelsPage />
      </div>
    );
  },
};

// ============================================================================
// Empty - no visual novels
// ============================================================================
export const Empty: Story = {
  args: {
    mock: {
      visualNovels: [],
      pagination: {
        page: 1,
        total: 0,
        totalPage: 0,
        size: 10,
      },
    },
  },
};

// ============================================================================
// WithPagination - multiple pages
// ============================================================================
export const WithPagination: Story = {
  args: {
    mock: {
      visualNovels: mockVisualNovels50,
      pagination: {
        page: 3,
        total: 50,
        totalPage: 5,
        size: 10,
      },
    },
  },
};

// ============================================================================
// FilteredByStatusPublished - showing only published visual novels
// ============================================================================
export const FilteredByStatusPublished: Story = {
  args: {
    mock: {
      visualNovels: mockVisualNovels50.filter(
        (vn) => vn.status === "published",
      ),
      pagination: {
        page: 1,
        total: mockVisualNovels50.filter((vn) => vn.status === "published")
          .length,
        totalPage: 3,
        size: 10,
      },
    },
  },
};

// ============================================================================
// FilteredByStatusDraft - showing only draft visual novels
// ============================================================================
export const FilteredByStatusDraft: Story = {
  args: {
    mock: {
      visualNovels: mockVisualNovels50.filter((vn) => vn.status === "draft"),
      pagination: {
        page: 1,
        total: mockVisualNovels50.filter((vn) => vn.status === "draft").length,
        totalPage: 3,
        size: 10,
      },
    },
  },
};

// ============================================================================
// SortedByNodes - sorted by most nodes
// ============================================================================
export const SortedByNodes: Story = {
  args: {
    mock: {
      visualNovels: [...mockVisualNovels10].sort(
        (a, b) => b.nodesCount - a.nodesCount,
      ),
      pagination: {
        page: 1,
        total: mockVisualNovels10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
};

// ============================================================================
// SortedByCharacters - sorted by most characters
// ============================================================================
export const SortedByCharacters: Story = {
  args: {
    mock: {
      visualNovels: [...mockVisualNovels10].sort(
        (a, b) => b.charactersCount - a.charactersCount,
      ),
      pagination: {
        page: 1,
        total: mockVisualNovels10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
};

// ============================================================================
// SortedByTitle - sorted alphabetically by title
// ============================================================================
export const SortedByTitle: Story = {
  args: {
    mock: {
      visualNovels: [...mockVisualNovels10].sort((a, b) =>
        a.title.localeCompare(b.title),
      ),
      pagination: {
        page: 1,
        total: mockVisualNovels10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
};

// ============================================================================
// MobileView - mobile viewport
// ============================================================================
export const MobileView: Story = {
  args: {
    mock: {
      visualNovels: mockVisualNovels10,
      pagination: {
        page: 1,
        total: mockVisualNovels10.length,
        totalPage: 1,
        size: 10,
      },
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
    mock: {
      visualNovels: mockVisualNovels10,
      pagination: {
        page: 1,
        total: mockVisualNovels10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

// ============================================================================
// WithThumbnails - all visual novels with thumbnails
// ============================================================================
export const WithThumbnails: Story = {
  args: {
    mock: {
      visualNovels: mockVisualNovels10.map((vn, i) => ({
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
  },
};

// ============================================================================
// WithoutThumbnails - visual novels without thumbnail images
// ============================================================================
export const WithoutThumbnails: Story = {
  args: {
    mock: {
      visualNovels: mockVisualNovels10.map((vn) => ({
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
  },
};

// ============================================================================
// LongTitles - visual novels with very long titles
// ============================================================================
export const LongTitles: Story = {
  args: {
    mock: {
      visualNovels: mockVisualNovels10.map((vn, i) => ({
        ...vn,
        title: `${vn.title}: An Extended Tale of Adventure, Romance, and Mystery - Part ${i + 1}`,
        description: `${vn.description} with many twists and turns that will keep you on the edge of your seat throughout the entire experience of this incredible visual novel journey.`,
      })),
      pagination: {
        page: 1,
        total: mockVisualNovels10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
};

// ============================================================================
// ManyNodes - visual novels with many nodes
// ============================================================================
export const ManyNodes: Story = {
  args: {
    mock: {
      visualNovels: mockVisualNovels10.map((vn, i) => ({
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
  },
};

// ============================================================================
// ManyVisualNovels - large dataset for stress testing
// ============================================================================
export const ManyVisualNovels: Story = {
  args: {
    mock: {
      visualNovels: mockVisualNovels50,
      pagination: {
        page: 1,
        total: 50,
        totalPage: 5,
        size: 10,
      },
    },
  },
};
