import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import AsideCharacterSummary from "@/app/_components/organisms/AsideCharacterSummary";
import DialogAuth from "@/app/_components/organisms/DialogAuth";
import type { DialogAuthVariant } from "@/app/_components/organisms/DialogAuth";

const meta = {
  title: "Organisms/AsideCharacterSummary",
  component: AsideCharacterSummary,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Character name",
    },
    isVerified: {
      control: "boolean",
      description: "Shows verified badge next to name",
    },
    description: {
      control: "text",
      description: "Character description text",
    },
    isLiked: {
      control: "boolean",
      description: "Whether the character is liked",
    },
  },
  decorators: [
    (Story) => (
      <div className="h-[700px] w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AsideCharacterSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockMedia = [
  { id: "1", type: "image" as const, src: "/images/girl-poster.webp" },
  {
    id: "2",
    type: "video" as const,
    src: "/videos/girl-video.mp4",
    posterSrc: "/images/girl-poster.webp",
  },
  { id: "3", type: "image" as const, src: "/images/girl-poster.webp" },
];

const mockAbout = {
  age: 19,
  bodyType: "Slim",
  ethnicity: "American",
  language: "English",
  relationshipStatus: "None",
  occupation: "College Student",
  hobbies: "Cheerleading, Watching Movies, Online Shopping",
  personality: "Playful, Energetic",
};

const mockDescription =
  "Savannah is a 19-year-old freshman college pom-pom girl with blonde hair, blue eyes, and a slim, toned body. Hungry for adventures, she is looking for someone experienced.";

// Default story
export const Default: Story = {
  args: {
    name: "Savannah Carter",
    isVerified: true,
    description: mockDescription,
    media: mockMedia,
    isLiked: false,
    about: mockAbout,
  },
};

// With video as first media
export const WithVideo: Story = {
  args: {
    ...Default.args,
    media: [
      {
        id: "1",
        type: "video" as const,
        src: "/videos/girl-video.mp4",
        posterSrc: "/images/girl-poster.webp",
      },
      { id: "2", type: "image" as const, src: "/images/girl-poster.webp" },
    ],
  },
};

// Single media (no navigation)
export const SingleMedia: Story = {
  args: {
    ...Default.args,
    media: [
      { id: "1", type: "image" as const, src: "/images/girl-poster.webp" },
    ],
  },
};

// Pre-liked state
export const Liked: Story = {
  args: {
    ...Default.args,
    isLiked: true,
  },
};

// Interactive with like toggle
const InteractiveTemplate = () => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  return (
    <AsideCharacterSummary
      name="Savannah Carter"
      isVerified={true}
      description={mockDescription}
      media={mockMedia}
      isLiked={isLiked}
      onLikeToggle={handleLikeToggle}
      about={mockAbout}
      onCallMe={() => console.log("Call Me clicked")}
      onGenerateImage={() => console.log("Generate Image clicked")}
      onPrivateContent={() => console.log("Private Content clicked")}
    />
  );
};

export const Interactive: Story = {
  args: Default.args,
  render: () => <InteractiveTemplate />,
};

// With auth dialog for like
const WithAuthDialogTemplate = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState<DialogAuthVariant>("sign-in");
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  return (
    <>
      <AsideCharacterSummary
        name="Savannah Carter"
        isVerified={true}
        description={mockDescription}
        media={mockMedia}
        isLiked={isLiked}
        onLikeToggle={handleLikeToggle}
        onAuthRequired={() => setAuthOpen(true)}
        about={mockAbout}
        onCallMe={() => console.log("Call Me clicked")}
        onGenerateImage={() => console.log("Generate Image clicked")}
        onPrivateContent={() => console.log("Private Content clicked")}
      />
      <DialogAuth
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        variant={authVariant}
        onVariantChange={setAuthVariant}
      />
    </>
  );
};

export const WithAuthDialog: Story = {
  args: Default.args,
  render: () => <WithAuthDialogTemplate />,
};

// Without about section
export const WithoutAbout: Story = {
  args: {
    ...Default.args,
    about: undefined,
  },
};

// Not verified
export const NotVerified: Story = {
  args: {
    ...Default.args,
    isVerified: false,
  },
};

// Long description
export const LongDescription: Story = {
  args: {
    ...Default.args,
    description:
      "Savannah is a 19-year-old freshman college pom-pom girl with blonde hair, blue eyes, and a slim, toned body. Hungry for adventures, she is looking for someone experienced. She loves to spend her weekends at the beach, practicing new cheerleading routines, and binge-watching her favorite TV shows. When she's not studying, you can find her at the local coffee shop or shopping for the latest fashion trends. She dreams of traveling the world and experiencing different cultures.",
  },
};

// All variants side by side
export const AllVariants: Story = {
  args: Default.args,
  decorators: [
    () => (
      <div className="flex gap-4 p-4">
        <div className="h-[700px] w-80">
          <AsideCharacterSummary
            name="Savannah Carter"
            isVerified={true}
            description={mockDescription}
            media={mockMedia}
            isLiked={false}
            about={mockAbout}
          />
        </div>
        <div className="h-[700px] w-80">
          <AsideCharacterSummary
            name="Emma Rose"
            isVerified={false}
            description="A mysterious artist with a passion for the unknown."
            media={[
              {
                id: "1",
                type: "image" as const,
                src: "/images/girl-poster.webp",
              },
            ]}
            isLiked={true}
            about={{
              age: 24,
              bodyType: "Athletic",
              occupation: "Artist",
              personality: "Creative, Mysterious",
            }}
          />
        </div>
      </div>
    ),
  ],
};
