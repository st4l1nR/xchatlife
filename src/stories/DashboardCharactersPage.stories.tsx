import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DashboardCharactersPage from "@/app/_components/pages/DashboardCharactersPage";
import type { TableCharacterItem } from "@/app/_components/organisms/TableCharacter";

// Generate mock characters for testing
const generateMockCharacters = (count: number): TableCharacterItem[] => {
  const styles = ["anime", "realistic"] as const;
  const statuses = ["published", "draft"] as const;

  const names = [
    "Jordan Stevenson",
    "Richard Payne",
    "Jennifer Summers",
    "Mr. Justin Richardson",
    "Nicholas Tanner",
    "Crystal Mays",
    "Mary Garcia",
    "Megan Roberts",
    "Joseph Oliver",
    "Sarah Mitchell",
    "David Chen",
    "Emily Watson",
    "Michael Brown",
    "Lisa Anderson",
    "James Wilson",
    "Amanda Taylor",
    "Robert Martinez",
    "Jessica Lee",
    "William Davis",
    "Ashley Thomas",
  ];

  const usernames = [
    "jordan.stevenson",
    "richard247",
    "summers.45",
    "jr.3734",
    "nicholas.t",
    "mays.754",
    "mary.garcia",
    "roberts.3456",
    "joseph.87",
    "sarah.m",
    "david.c",
    "emily.w",
    "michael.b",
    "lisa.a",
    "james.w",
    "amanda.t",
    "robert.m",
    "jessica.l",
    "william.d",
    "ashley.t",
  ];

  const likesOptions = [13, 100, 1000, 3500, 1, 20, 30, 60, 80, 150, 500, 2000];
  const chatsOptions = [
    12, 1000, 3000, 4000, 5000, 6000, 2000, 3000, 3000, 800, 1200, 900,
  ];

  return Array.from({ length: count }, (_, i) => {
    const name = names[i % names.length] ?? `Character ${i + 1}`;
    const username =
      usernames[i % usernames.length] ??
      name
        .toLowerCase()
        .replace(/\s+/g, ".")
        .replace(/mr\.\s*/i, "");

    return {
      id: `character-${i + 1}`,
      name,
      username,
      avatarSrc: `https://i.pravatar.cc/150?u=${username}-${i}`,
      style: styles[i % styles.length]!,
      likes: likesOptions[i % likesOptions.length]!,
      chats: chatsOptions[i % chatsOptions.length]!,
      status: statuses[i % statuses.length]!,
    };
  });
};

// Mock data sets
const mockCharacters50 = generateMockCharacters(50);
const mockCharacters10 = mockCharacters50.slice(0, 10);

const meta: Meta<typeof DashboardCharactersPage> = {
  title: "Pages/DashboardCharactersPage",
  component: DashboardCharactersPage,
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
type Story = StoryObj<typeof DashboardCharactersPage>;

// ============================================================================
// Default - populated with characters
// ============================================================================
export const Default: Story = {
  args: {
    mock: {
      characters: mockCharacters10,
      pagination: {
        page: 1,
        total: mockCharacters10.length,
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
      characters: [],
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
        <DashboardCharactersPage />
      </div>
    );
  },
};

// ============================================================================
// Empty - no characters
// ============================================================================
export const Empty: Story = {
  args: {
    mock: {
      characters: [],
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
      characters: mockCharacters50,
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
// FilteredByStyle - showing only anime characters
// ============================================================================
export const FilteredByStyleAnime: Story = {
  args: {
    mock: {
      characters: mockCharacters50.filter((c) => c.style === "anime"),
      pagination: {
        page: 1,
        total: mockCharacters50.filter((c) => c.style === "anime").length,
        totalPage: 3,
        size: 10,
      },
    },
  },
};

// ============================================================================
// FilteredByStyle - showing only realistic characters
// ============================================================================
export const FilteredByStyleRealistic: Story = {
  args: {
    mock: {
      characters: mockCharacters50.filter((c) => c.style === "realistic"),
      pagination: {
        page: 1,
        total: mockCharacters50.filter((c) => c.style === "realistic").length,
        totalPage: 3,
        size: 10,
      },
    },
  },
};

// ============================================================================
// FilteredByStatus - showing only published characters
// ============================================================================
export const FilteredByStatusPublished: Story = {
  args: {
    mock: {
      characters: mockCharacters50.filter((c) => c.status === "published"),
      pagination: {
        page: 1,
        total: mockCharacters50.filter((c) => c.status === "published").length,
        totalPage: 3,
        size: 10,
      },
    },
  },
};

// ============================================================================
// SortedByLikes - sorted by most likes
// ============================================================================
export const SortedByLikes: Story = {
  args: {
    mock: {
      characters: [...mockCharacters10].sort((a, b) => b.likes - a.likes),
      pagination: {
        page: 1,
        total: mockCharacters10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
};

// ============================================================================
// SortedByChats - sorted by most chats
// ============================================================================
export const SortedByChats: Story = {
  args: {
    mock: {
      characters: [...mockCharacters10].sort((a, b) => b.chats - a.chats),
      pagination: {
        page: 1,
        total: mockCharacters10.length,
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
      characters: mockCharacters10,
      pagination: {
        page: 1,
        total: mockCharacters10.length,
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
      characters: mockCharacters10,
      pagination: {
        page: 1,
        total: mockCharacters10.length,
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
// WithoutAvatars - characters without avatar images
// ============================================================================
export const WithoutAvatars: Story = {
  args: {
    mock: {
      characters: mockCharacters10.map((character) => ({
        ...character,
        avatarSrc: undefined,
      })),
      pagination: {
        page: 1,
        total: mockCharacters10.length,
        totalPage: 1,
        size: 10,
      },
    },
  },
};

// ============================================================================
// ManyCharacters - large dataset for stress testing
// ============================================================================
export const ManyCharacters: Story = {
  args: {
    mock: {
      characters: mockCharacters50,
      pagination: {
        page: 1,
        total: 50,
        totalPage: 5,
        size: 10,
      },
    },
  },
};
