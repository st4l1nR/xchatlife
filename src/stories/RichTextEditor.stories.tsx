import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import RichTextEditor from "@/app/_components/molecules/RichTextEditor";

const meta = {
  title: "Molecules/RichTextEditor",
  component: RichTextEditor,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    content: {
      control: "text",
      description: "Initial HTML content for the editor",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text when editor is empty",
    },
    disabled: {
      control: "boolean",
      description: "Whether the editor is disabled",
    },
    minHeight: {
      control: "text",
      description: "Minimum height of the editor content area",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  args: {
    onUpdate: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    placeholder: "Start typing your message...",
  },
};

export const WithContent: Story = {
  args: {
    content:
      "<p>Hello <strong>world</strong>! This is some <em>formatted</em> text.</p>",
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Enter the dialogue for this scene...",
  },
};

export const Disabled: Story = {
  args: {
    content: "<p>This editor is <strong>disabled</strong>.</p>",
    disabled: true,
  },
};

export const TallEditor: Story = {
  args: {
    placeholder: "This editor has a larger minimum height...",
    minHeight: "250px",
  },
};

export const WithListContent: Story = {
  args: {
    content: `
      <p>Here are some key points:</p>
      <ul>
        <li>First item in the list</li>
        <li>Second item with <strong>bold text</strong></li>
        <li>Third item with <em>italic text</em></li>
      </ul>
      <p>And a numbered list:</p>
      <ol>
        <li>Step one</li>
        <li>Step two</li>
        <li>Step three</li>
      </ol>
    `,
  },
};

export const AllVariants: Story = {
  name: "All Variants Grid",
  decorators: [
    () => (
      <div className="grid grid-cols-2 gap-6 p-4" style={{ width: "900px" }}>
        <div>
          <h3 className="text-foreground mb-2 text-sm font-semibold">Empty</h3>
          <RichTextEditor placeholder="Start typing..." onUpdate={fn()} />
        </div>
        <div>
          <h3 className="text-foreground mb-2 text-sm font-semibold">
            With Content
          </h3>
          <RichTextEditor
            content="<p>Hello <strong>world</strong>!</p>"
            onUpdate={fn()}
          />
        </div>
        <div>
          <h3 className="text-foreground mb-2 text-sm font-semibold">
            Disabled
          </h3>
          <RichTextEditor
            content="<p>This is disabled.</p>"
            disabled
            onUpdate={fn()}
          />
        </div>
        <div>
          <h3 className="text-foreground mb-2 text-sm font-semibold">
            With List
          </h3>
          <RichTextEditor
            content="<ul><li>Item one</li><li>Item two</li></ul>"
            onUpdate={fn()}
          />
        </div>
      </div>
    ),
  ],
};
