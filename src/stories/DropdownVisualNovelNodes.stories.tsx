import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import DropdownVisualNovelNodes from "@/app/_components/molecules/DropdownVisualNovelNodes";

const meta = {
  title: "Molecules/DropdownVisualNovelNodes",
  component: DropdownVisualNovelNodes,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    parentNodeId: {
      control: "text",
      description: "The ID of the parent node to attach new nodes to",
    },
    isEndOfPath: {
      control: "boolean",
      description:
        "Whether this is at the end of a path (shows Jump/End options)",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  args: {
    onSelect: fn(),
  },
} satisfies Meta<typeof DropdownVisualNovelNodes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    parentNodeId: "node_1",
    isEndOfPath: false,
  },
};

export const AtEndOfPath: Story = {
  args: {
    parentNodeId: "node_1",
    isEndOfPath: true,
  },
};

export const WithCustomClass: Story = {
  args: {
    parentNodeId: "node_1",
    isEndOfPath: true,
    className: "bg-primary text-primary-foreground rounded-full p-2",
  },
};

export const AllVariants: Story = {
  args: {
    parentNodeId: "node_1",
    isEndOfPath: true,
  },
  decorators: [
    () => (
      <div className="flex items-center gap-8 p-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-muted-foreground text-sm">
            Mid-path (no End/Jump)
          </span>
          <DropdownVisualNovelNodes
            parentNodeId="node_1"
            isEndOfPath={false}
            onSelect={fn()}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-muted-foreground text-sm">
            End of path (all options)
          </span>
          <DropdownVisualNovelNodes
            parentNodeId="node_1"
            isEndOfPath={true}
            onSelect={fn()}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-muted-foreground text-sm">Styled button</span>
          <DropdownVisualNovelNodes
            parentNodeId="node_1"
            isEndOfPath={true}
            onSelect={fn()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full p-3 shadow-lg"
          />
        </div>
      </div>
    ),
  ],
};
