import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TabGroup, TabPanels } from "@headlessui/react";

import TabCharactersCreateEdit1 from "@/app/_components/organisms/TabCharactersCreateEdit1";

// Sample options for dropdowns
const genderOptions = [
  { value: "girl", label: "Girl" },
  { value: "men", label: "Men" },
  { value: "trans", label: "Trans" },
];

const styleOptions = [
  { value: "anime", label: "Anime" },
  { value: "realistic", label: "Realistic" },
  { value: "cartoon", label: "Cartoon" },
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

// Zod schema for form validation
const characterFormSchema = z.object({
  posterImage: z.any().optional(),
  posterVideo: z.any().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.coerce.number().min(1, "Age is required").max(999),
  gender: z.string().optional(),
  description: z.string().optional(),
  style: z.string().optional(),
  ethnicity: z.string().optional(),
  personality: z.string().optional(),
  hairStyle: z.string().optional(),
  hairColor: z.string().optional(),
  eyeColor: z.string().optional(),
  bodyType: z.string().optional(),
  breastSize: z.string().optional(),
  occupation: z.string().optional(),
  relationship: z.string().optional(),
});

type CharacterFormData = z.infer<typeof characterFormSchema>;

// Wrapper component that provides FormProvider and TabGroup/TabPanels
function FormWrapper({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: Partial<CharacterFormData>;
}) {
  const methods = useForm<CharacterFormData>({
    resolver: zodResolver(characterFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: undefined,
      gender: "",
      description: "",
      style: "",
      ethnicity: "",
      personality: "",
      hairStyle: "",
      hairColor: "",
      eyeColor: "",
      bodyType: "",
      breastSize: "",
      occupation: "",
      relationship: "",
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
  title: "Organisms/TabCharactersCreateEdit1",
  component: TabCharactersCreateEdit1,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Character name displayed in header",
    },
    avatarSrc: {
      control: "text",
      description: "URL for character avatar image",
    },
    role: {
      control: "text",
      description: "Character role/type label",
    },
    joinedDate: {
      control: "text",
      description: "Formatted creation date",
    },
    bannerSrc: {
      control: "text",
      description: "Optional custom banner image URL",
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
} satisfies Meta<typeof TabCharactersCreateEdit1>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default props for all stories
const defaultProps = {
  name: "Marisol Contreras",
  avatarSrc:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  role: "Anime",
  joinedDate: "April 2021",
  genderOptions,
  styleOptions,
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

export const Default: Story = {
  render: (args) => (
    <FormWrapper>
      <TabCharactersCreateEdit1 {...args} />
    </FormWrapper>
  ),
  args: defaultProps,
};

export const WithPrefilledData: Story = {
  render: (args) => (
    <FormWrapper
      defaultValues={{
        firstName: "Marisol",
        lastName: "Contreras",
        age: 25,
        gender: "Female",
        description:
          "A cheerful and adventurous character who loves to explore new places and meet new people. Always ready for an adventure!",
        style: "anime",
        ethnicity: "latin",
        personality: "cheerful",
        hairStyle: "long",
        hairColor: "brown",
        eyeColor: "brown",
        bodyType: "athletic",
        breastSize: "medium",
        occupation: "student",
        relationship: "single",
      }}
    >
      <TabCharactersCreateEdit1
        {...args}
        defaultPosterImage="/images/girl-poster.webp"
        defaultPosterVideo="/videos/girl-video.mp4"
      />
    </FormWrapper>
  ),
  args: defaultProps,
  parameters: {
    docs: {
      description: {
        story:
          "Shows the form with pre-filled data, useful for editing existing characters.",
      },
    },
  },
};

export const WithCustomBanner: Story = {
  render: (args) => (
    <FormWrapper>
      <TabCharactersCreateEdit1 {...args} />
    </FormWrapper>
  ),
  args: {
    ...defaultProps,
    bannerSrc:
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the component with a custom banner image.",
      },
    },
  },
};

export const NewCharacter: Story = {
  render: (args) => (
    <FormWrapper>
      <TabCharactersCreateEdit1 {...args} />
    </FormWrapper>
  ),
  args: {
    ...defaultProps,
    name: "New Character",
    avatarSrc: null,
    role: undefined,
    joinedDate: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the form for creating a new character with minimal header information.",
      },
    },
  },
};

export const MobileView: Story = {
  render: (args) => (
    <FormWrapper>
      <TabCharactersCreateEdit1 {...args} />
    </FormWrapper>
  ),
  args: defaultProps,
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Mobile view of the component. Form fields stack vertically on smaller screens.",
      },
    },
  },
};

export const TabletView: Story = {
  render: (args) => (
    <FormWrapper>
      <TabCharactersCreateEdit1 {...args} />
    </FormWrapper>
  ),
  args: defaultProps,
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
