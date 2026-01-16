import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReactFlowProvider, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import NodeEnd from "@/app/_components/organisms/NodeEnd";

// Wrapper component to provide ReactFlow context
const NodeEndWrapper = ({ selected = false }: { selected?: boolean }) => {
  const nodes = [
    {
      id: "end-1",
      type: "end",
      position: { x: 100, y: 100 },
      data: {},
      selected,
    },
  ];

  const nodeTypes = {
    end: NodeEnd,
  };

  return (
    <ReactFlowProvider>
      <div style={{ width: "300px", height: "200px" }}>
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
  title: "Organisms/Flow/NodeEnd",
  component: NodeEndWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    selected: {
      control: "boolean",
      description: "Whether the node is selected",
    },
  },
} satisfies Meta<typeof NodeEndWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    selected: true,
  },
};
