import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReactFlowProvider, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import NodeChoice, {
  type NodeChoiceData,
} from "@/app/_components/organisms/NodeChoice";

// Wrapper component to provide ReactFlow context
const NodeChoiceWrapper = ({
  text,
  index,
  selected = false,
}: NodeChoiceData & { selected?: boolean }) => {
  const nodes = [
    {
      id: "choice-1",
      type: "choice",
      position: { x: 50, y: 50 },
      data: {
        text,
        index,
      },
      selected,
    },
  ];

  const nodeTypes = {
    choice: NodeChoice,
  };

  return (
    <ReactFlowProvider>
      <div style={{ width: "350px", height: "150px" }}>
        <ReactFlow
          nodes={nodes}
          edges={[]}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
        />
      </div>
    </ReactFlowProvider>
  );
};

const meta = {
  title: "Organisms/Flow/NodeChoice",
  component: NodeChoiceWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "The choice text",
    },
    index: {
      control: "number",
      description: "Optional index number for the choice",
    },
    selected: {
      control: "boolean",
      description: "Whether the node is selected",
    },
  },
} satisfies Meta<typeof NodeChoiceWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Hi Luna! What a coincidence!",
    index: 1,
    selected: false,
  },
};

export const WithoutIndex: Story = {
  args: {
    text: "Stay silent",
    selected: false,
  },
};

export const LongText: Story = {
  args: {
    text: "I think we should discuss this matter further before making any decisions",
    index: 2,
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    text: "Accept the offer",
    index: 1,
    selected: true,
  },
};
