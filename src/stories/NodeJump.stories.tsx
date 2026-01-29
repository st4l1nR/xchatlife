import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import NodeJump from "@/app/_components/organisms/NodeJump";

const meta = {
  title: "Organisms/NodeJump",
  component: NodeJump,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    selected: {
      control: "boolean",
      description: "Whether the node is currently selected",
    },
    data: {
      control: "object",
      description: "Node data containing label and target",
    },
  },
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div className="p-8">
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
} satisfies Meta<typeof NodeJump>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "jump_1",
    type: "jump",
    data: {
      label: "Jump",
    },
    selected: false,
    dragging: false,
    draggable: true,
    selectable: true,
    deletable: true,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
    zIndex: 0,
  },
};

export const WithTarget: Story = {
  args: {
    id: "jump_1",
    type: "jump",
    data: {
      label: "Return to Start",
      targetNodeId: "node_1",
      targetNodeLabel: "Opening Scene",
    },
    selected: false,
    dragging: false,
    draggable: true,
    selectable: true,
    deletable: true,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
    zIndex: 0,
  },
};

export const Selected: Story = {
  args: {
    id: "jump_1",
    type: "jump",
    data: {
      label: "Jump to Branch",
      targetNodeId: "node_5",
      targetNodeLabel: "Decision Point",
    },
    selected: true,
    dragging: false,
    draggable: true,
    selectable: true,
    deletable: true,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
    zIndex: 0,
  },
};

export const LongLabel: Story = {
  args: {
    id: "jump_1",
    type: "jump",
    data: {
      label: "Return to the beginning of the story",
      targetNodeId: "node_1",
      targetNodeLabel: "The Grand Opening Scene",
    },
    selected: false,
    dragging: false,
    draggable: true,
    selectable: true,
    deletable: true,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
    zIndex: 0,
  },
};

export const AllVariants: Story = {
  name: "All Variants Grid",
  args: {
    id: "jump_1",
    type: "jump",
    data: { label: "Jump" },
    selected: false,
    dragging: false,
    draggable: true,
    selectable: true,
    deletable: true,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
    zIndex: 0,
  },
  decorators: [
    () => (
      <ReactFlowProvider>
        <div className="grid grid-cols-2 gap-6 p-8">
          <div>
            <h3 className="text-foreground mb-2 text-sm font-semibold">
              Default
            </h3>
            <NodeJump
              id="jump_1"
              type="jump"
              data={{ label: "Jump" }}
              selected={false}
              dragging={false}
              draggable={true}
              selectable={true}
              deletable={true}
              isConnectable={true}
              positionAbsoluteX={0}
              positionAbsoluteY={0}
              zIndex={0}
            />
          </div>
          <div>
            <h3 className="text-foreground mb-2 text-sm font-semibold">
              With Target
            </h3>
            <NodeJump
              id="jump_2"
              type="jump"
              data={{
                label: "Loop Back",
                targetNodeId: "node_1",
                targetNodeLabel: "Scene 1",
              }}
              selected={false}
              dragging={false}
              draggable={true}
              selectable={true}
              deletable={true}
              isConnectable={true}
              positionAbsoluteX={0}
              positionAbsoluteY={0}
              zIndex={0}
            />
          </div>
          <div>
            <h3 className="text-foreground mb-2 text-sm font-semibold">
              Selected
            </h3>
            <NodeJump
              id="jump_3"
              type="jump"
              data={{
                label: "Return",
                targetNodeId: "node_5",
                targetNodeLabel: "Main Path",
              }}
              selected={true}
              dragging={false}
              draggable={true}
              selectable={true}
              deletable={true}
              isConnectable={true}
              positionAbsoluteX={0}
              positionAbsoluteY={0}
              zIndex={0}
            />
          </div>
          <div>
            <h3 className="text-foreground mb-2 text-sm font-semibold">
              No Target
            </h3>
            <NodeJump
              id="jump_4"
              type="jump"
              data={{ label: "Unconnected Jump" }}
              selected={false}
              dragging={false}
              draggable={true}
              selectable={true}
              deletable={true}
              isConnectable={true}
              positionAbsoluteX={0}
              positionAbsoluteY={0}
              zIndex={0}
            />
          </div>
        </div>
      </ReactFlowProvider>
    ),
  ],
};
