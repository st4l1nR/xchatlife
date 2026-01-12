import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import InputTags from "@/app/_components/molecules/InputTags";

const sampleOptions = [
  { value: "romantic", label: "Romantic" },
  { value: "adventurous", label: "Adventurous" },
  { value: "mysterious", label: "Mysterious" },
  { value: "playful", label: "Playful" },
  { value: "dominant", label: "Dominant" },
  { value: "submissive", label: "Submissive" },
  { value: "caring", label: "Caring" },
  { value: "intellectual", label: "Intellectual" },
];

const meta = {
  title: "Molecules/InputTags",
  component: InputTags,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    options: {
      control: "object",
      description: "Array of options to choose from",
    },
    value: {
      control: "object",
      description: "Array of selected option values",
    },
    maxItems: {
      control: "number",
      description: "Maximum number of items that can be selected",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text when no items are selected",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    error: {
      control: "text",
      description: "Error message to display",
    },
  },
  args: {
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputTags>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: sampleOptions,
    value: [],
    maxItems: 3,
    placeholder: "Select options...",
  },
};

export const WithSelectedItems: Story = {
  args: {
    options: sampleOptions,
    value: ["romantic", "adventurous"],
    maxItems: 3,
    placeholder: "Select options...",
  },
};

export const MaxItemsReached: Story = {
  args: {
    options: sampleOptions,
    value: ["romantic", "adventurous", "mysterious"],
    maxItems: 3,
    placeholder: "Select options...",
  },
  parameters: {
    docs: {
      description: {
        story:
          "When the maximum number of items is reached, the input shows a message and no more items can be added.",
      },
    },
  },
};

export const WithError: Story = {
  args: {
    options: sampleOptions,
    value: ["romantic"],
    maxItems: 3,
    placeholder: "Select options...",
    error: "Please select at least 2 options",
  },
};

export const Disabled: Story = {
  args: {
    options: sampleOptions,
    value: ["romantic", "adventurous"],
    maxItems: 3,
    placeholder: "Select options...",
    disabled: true,
  },
};

export const SingleItemMax: Story = {
  args: {
    options: sampleOptions,
    value: [],
    maxItems: 1,
    placeholder: "Select one option...",
  },
  parameters: {
    docs: {
      description: {
        story: "Can be configured to allow only a single selection.",
      },
    },
  },
};

export const FiveItemsMax: Story = {
  args: {
    options: sampleOptions,
    value: [],
    maxItems: 5,
    placeholder: "Select up to 5...",
  },
  parameters: {
    docs: {
      description: {
        story: "Allows up to 5 selections.",
      },
    },
  },
};

export const Interactive: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>([]);

    return (
      <div className="space-y-4">
        <InputTags
          options={sampleOptions}
          value={value}
          onChange={setValue}
          maxItems={3}
          placeholder="Select up to 3 kinks..."
        />
        <div className="text-muted-foreground text-sm">
          <p>Selected values: {value.length > 0 ? value.join(", ") : "None"}</p>
          <p>Remaining slots: {3 - value.length}</p>
        </div>
      </div>
    );
  },
  args: {
    options: sampleOptions,
    value: [],
    maxItems: 3,
    placeholder: "Select up to 3 kinks...",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive example demonstrating selecting and removing tags.",
      },
    },
  },
};

export const EmptyOptions: Story = {
  args: {
    options: [],
    value: [],
    maxItems: 3,
    placeholder: "No options available...",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the component behavior when no options are provided.",
      },
    },
  },
};
