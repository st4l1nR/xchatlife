import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import DialogCreateUpdateCharacterProperty from "@/app/_components/organisms/DialogCreateUpdateCharacterProperty";
import type {
  CharacterPropertyType,
  ExistingPropertyData,
} from "@/app/_components/organisms/DialogCreateUpdateCharacterProperty";
import { Button } from "@/app/_components/atoms/button";

const meta = {
  title: "Organisms/DialogCreateUpdateCharacterProperty",
  component: DialogCreateUpdateCharacterProperty,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: { table: { disable: true } },
    onClose: { table: { disable: true } },
    mode: {
      control: "select",
      options: ["create", "update"],
      description: "Whether to create a new property or update an existing one",
    },
    propertyType: {
      control: "select",
      options: [
        "personality",
        "relationship",
        "occupation",
        "ethnicity",
        "hairStyle",
        "hairColor",
        "eyeColor",
        "bodyType",
        "breastSize",
        "gender",
        "style",
      ],
      description: "The type of character property to create/edit",
    },
  },
  args: {
    onSuccess: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof DialogCreateUpdateCharacterProperty>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample existing property data for update mode
const sampleExistingProperty: ExistingPropertyData = {
  id: "property-1",
  name: "shy",
  label: "Shy",
  description: "A reserved and introverted personality trait",
  emoji: "😊",
  genderId: "gender-1",
  styleId: "style-1",
  image: {
    id: "image-1",
    url: "https://placehold.co/400x400/orange/white?text=Shy",
  },
  video: null,
};

// ============================================================================
// Create Personality (Default)
// ============================================================================
export const CreatePersonality: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Add New Personality</Button>
        <DialogCreateUpdateCharacterProperty
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="create"
          propertyType="personality"
          onSuccess={() => {
            args.onSuccess?.();
            setIsOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "create",
    propertyType: "personality",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Opens a dialog to create a new personality property. Requires selecting gender and style.",
      },
    },
  },
};

// ============================================================================
// Edit Personality (Update Mode)
// ============================================================================
export const EditPersonality: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Edit Personality</Button>
        <DialogCreateUpdateCharacterProperty
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="update"
          propertyType="personality"
          existingProperty={sampleExistingProperty}
          onSuccess={() => {
            args.onSuccess?.();
            setIsOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "update",
    propertyType: "personality",
    existingProperty: sampleExistingProperty,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Opens a dialog to edit an existing personality. Pre-fills form with existing data including emoji and media.",
      },
    },
  },
};

// ============================================================================
// Create Gender (No Gender/Style Required)
// ============================================================================
export const CreateGender: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Add New Gender</Button>
        <DialogCreateUpdateCharacterProperty
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="create"
          propertyType="gender"
          onSuccess={() => {
            args.onSuccess?.();
            setIsOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "create",
    propertyType: "gender",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Creates a gender property. Note that gender/style selectors are hidden since they are not required for this type.",
      },
    },
  },
};

// ============================================================================
// Create Style (No Gender/Style Required)
// ============================================================================
export const CreateStyle: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Add New Style</Button>
        <DialogCreateUpdateCharacterProperty
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="create"
          propertyType="style"
          onSuccess={() => {
            args.onSuccess?.();
            setIsOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "create",
    propertyType: "style",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Creates a style property. Gender/style selectors are hidden for this type.",
      },
    },
  },
};

// ============================================================================
// Interactive Demo - All Property Types
// ============================================================================
export const InteractiveAllTypes: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "update">("create");
    const [propertyType, setPropertyType] =
      useState<CharacterPropertyType>("personality");

    const propertyTypes: CharacterPropertyType[] = [
      "personality",
      "relationship",
      "occupation",
      "ethnicity",
      "hairStyle",
      "hairColor",
      "eyeColor",
      "bodyType",
      "breastSize",
      "gender",
      "style",
    ];

    return (
      <div className="flex flex-col items-center gap-6">
        <p className="text-muted-foreground text-sm">
          Select a property type and mode to open the dialog.
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {propertyTypes.map((type) =>
            propertyType === type ? (
              <Button key={type} onClick={() => setPropertyType(type)}>
                {type.replace(/([A-Z])/g, " $1").trim()}
              </Button>
            ) : (
              <Button key={type} outline onClick={() => setPropertyType(type)}>
                {type.replace(/([A-Z])/g, " $1").trim()}
              </Button>
            ),
          )}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => {
              setMode("create");
              setIsOpen(true);
            }}
          >
            Create New
          </Button>
          <Button
            outline
            onClick={() => {
              setMode("update");
              setIsOpen(true);
            }}
          >
            Edit Existing
          </Button>
        </div>

        <DialogCreateUpdateCharacterProperty
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode={mode}
          propertyType={propertyType}
          existingProperty={
            mode === "update" ? sampleExistingProperty : undefined
          }
          onSuccess={() => setIsOpen(false)}
        />
      </div>
    );
  },
  args: {
    open: false,
    mode: "create",
    propertyType: "personality",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo showing all property types. Click a type to select it, then create or edit.",
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
        <DialogCreateUpdateCharacterProperty
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="create"
          propertyType="personality"
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "create",
    propertyType: "personality",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Mobile view of the dialog. The form adapts to smaller screens.",
      },
    },
  },
};

// ============================================================================
// Create Hair Style
// ============================================================================
export const CreateHairStyle: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Add New Hair Style</Button>
        <DialogCreateUpdateCharacterProperty
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="create"
          propertyType="hairStyle"
          onSuccess={() => {
            args.onSuccess?.();
            setIsOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "create",
    propertyType: "hairStyle",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Creates a hair style property. Requires selecting gender and style.",
      },
    },
  },
};

// ============================================================================
// Create Ethnicity
// ============================================================================
export const CreateEthnicity: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Add New Ethnicity</Button>
        <DialogCreateUpdateCharacterProperty
          {...args}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          mode="create"
          propertyType="ethnicity"
          onSuccess={() => {
            args.onSuccess?.();
            setIsOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    open: false,
    mode: "create",
    propertyType: "ethnicity",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Creates an ethnicity property. Requires selecting gender and style.",
      },
    },
  },
};
