import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DashboardCharactersCreateUpdatePage from "@/app/_components/pages/DashboardCharactersCreateUpdatePage";
import type { DashboardCharactersCreateUpdatePageMockData } from "@/app/_components/pages/DashboardCharactersCreateUpdatePage";

// ============================================================================
// Mock Dropdown Options
// ============================================================================

const styleOptions = [
  { value: "anime", label: "Anime" },
  { value: "realistic", label: "Realistic" },
  { value: "cartoon", label: "Cartoon" },
];

const kinksOptions = [
  { value: "romantic", label: "Romantic" },
  { value: "adventurous", label: "Adventurous" },
  { value: "mysterious", label: "Mysterious" },
  { value: "playful", label: "Playful" },
  { value: "dominant", label: "Dominant" },
  { value: "submissive", label: "Submissive" },
];

const ethnicityOptions = [
  { value: "asian", label: "Asian" },
  { value: "caucasian", label: "Caucasian" },
  { value: "african", label: "African" },
  { value: "latin", label: "Latin" },
  { value: "mixed", label: "Mixed" },
];

const personalityOptions = [
  { value: "cheerful", label: "Cheerful" },
  { value: "serious", label: "Serious" },
  { value: "shy", label: "Shy" },
  { value: "confident", label: "Confident" },
  { value: "mysterious", label: "Mysterious" },
];

const hairStyleOptions = [
  { value: "long", label: "Long" },
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "ponytail", label: "Ponytail" },
  { value: "braid", label: "Braid" },
];

const hairColorOptions = [
  { value: "black", label: "Black" },
  { value: "brown", label: "Brown" },
  { value: "blonde", label: "Blonde" },
  { value: "red", label: "Red" },
  { value: "pink", label: "Pink" },
  { value: "blue", label: "Blue" },
];

const eyeColorOptions = [
  { value: "brown", label: "Brown" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "hazel", label: "Hazel" },
  { value: "gray", label: "Gray" },
];

const bodyTypeOptions = [
  { value: "slim", label: "Slim" },
  { value: "athletic", label: "Athletic" },
  { value: "curvy", label: "Curvy" },
  { value: "average", label: "Average" },
];

const breastSizeOptions = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const occupationOptions = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
  { value: "nurse", label: "Nurse" },
  { value: "artist", label: "Artist" },
  { value: "businesswoman", label: "Businesswoman" },
];

const relationshipOptions = [
  { value: "single", label: "Single" },
  { value: "girlfriend", label: "Girlfriend" },
  { value: "wife", label: "Wife" },
  { value: "friend", label: "Friend" },
  { value: "stranger", label: "Stranger" },
];

const dropdownOptions = {
  styleOptions,
  kinksOptions,
  ethnicityOptions,
  personalityOptions,
  hairStyleOptions,
  hairColorOptions,
  eyeColorOptions,
  bodyTypeOptions,
  breastSizeOptions,
  occupationOptions,
  relationshipOptions,
};

// ============================================================================
// Mock Character Data
// ============================================================================

const mockCharacterEdit: DashboardCharactersCreateUpdatePageMockData["character"] =
  {
    id: "char-1",
    firstName: "Marisol",
    lastName: "Contreras",
    avatarSrc:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bannerSrc:
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80",
    posterImage: "https://picsum.photos/seed/poster1/300/400",
    posterVideo: undefined,
    age: 25,
    gender: "Female",
    description:
      "A cheerful and adventurous character who loves to explore new places and meet new people. Always ready for an adventure!",
    style: "anime",
    kinks: ["romantic", "adventurous"],
    ethnicity: "latin",
    personality: "cheerful",
    hairStyle: "long",
    hairColor: "brown",
    eyeColor: "brown",
    bodyType: "athletic",
    breastSize: "medium",
    occupation: "student",
    relationship: "single",
    isPublic: true,
    reels: [
      {
        id: "reel-1",
        url: "https://picsum.photos/seed/reel1/270/480",
        mediaType: "image",
      },
      {
        id: "reel-2",
        url: "https://picsum.photos/seed/reel2/270/480",
        mediaType: "image",
      },
    ],
    stories: [
      {
        id: "story-1",
        url: "https://picsum.photos/seed/story1/270/480",
        mediaType: "image",
      },
    ],
  };

const mockPrivateContents = [
  {
    id: "pc-1",
    imageSrc: "https://picsum.photos/seed/pc1/300/375",
    description: "Exclusive Photo Set Vol. 1",
    name: "Exclusive Photo Set",
    tokenCost: 50,
    locked: false,
    likeCount: 125,
    imageCount: 12,
    media: [
      {
        id: "m1",
        src: "https://picsum.photos/seed/m1/400/400",
        type: "image" as const,
      },
      {
        id: "m2",
        src: "https://picsum.photos/seed/m2/400/400",
        type: "image" as const,
      },
    ],
  },
  {
    id: "pc-2",
    imageSrc: "https://picsum.photos/seed/pc2/300/375",
    description: "Behind the Scenes",
    name: "BTS Collection",
    tokenCost: 75,
    locked: false,
    likeCount: 89,
    imageCount: 8,
  },
];

// ============================================================================
// Story Meta
// ============================================================================

const meta: Meta<typeof DashboardCharactersCreateUpdatePage> = {
  title: "Pages/DashboardCharactersCreateUpdatePage",
  component: DashboardCharactersCreateUpdatePage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-background min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DashboardCharactersCreateUpdatePage>;

// ============================================================================
// Stories
// ============================================================================

/**
 * Create mode - empty form for creating a new character
 */
export const CreateMode: Story = {
  args: {
    mock: {
      dropdownOptions,
    },
  },
};

/**
 * Edit mode - pre-filled form with existing character data
 */
export const EditMode: Story = {
  args: {
    id: "char-1",
    mock: {
      character: mockCharacterEdit,
      dropdownOptions,
    },
  },
};

/**
 * Edit mode with private content items
 */
export const EditModeWithPrivateContent: Story = {
  args: {
    id: "char-1",
    mock: {
      character: mockCharacterEdit,
      dropdownOptions,
      privateContents: mockPrivateContents,
    },
  },
};

/**
 * Edit mode with unpublished character
 */
export const EditModeUnpublished: Story = {
  args: {
    id: "char-2",
    mock: {
      character: {
        ...mockCharacterEdit,
        id: "char-2",
        isPublic: false,
      },
      dropdownOptions,
    },
  },
};

/**
 * Mobile view - responsive layout
 */
export const MobileView: Story = {
  args: {
    mock: {
      character: mockCharacterEdit,
      dropdownOptions,
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

/**
 * Tablet view - responsive layout
 */
export const TabletView: Story = {
  args: {
    id: "char-1",
    mock: {
      character: mockCharacterEdit,
      dropdownOptions,
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

/**
 * New character with minimal data
 */
export const NewCharacterMinimal: Story = {
  args: {
    mock: {
      dropdownOptions,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the form for creating a new character with all fields empty.",
      },
    },
  },
};
