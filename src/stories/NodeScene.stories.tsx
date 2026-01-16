import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReactFlowProvider, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import NodeScene, {
  type NodeSceneData,
} from "@/app/_components/organisms/NodeScene";

// Wrapper component to provide ReactFlow context
const NodeSceneWrapper = ({
  characterName,
  characterAvatarSrc,
  dialogue,
  sceneryImageSrc,
  selected = false,
}: NodeSceneData & { selected?: boolean }) => {
  const nodes = [
    {
      id: "scene-1",
      type: "scene",
      position: { x: 50, y: 50 },
      data: {
        characterName,
        characterAvatarSrc,
        dialogue,
        sceneryImageSrc,
      },
      selected,
    },
  ];

  const nodeTypes = {
    scene: NodeScene,
  };

  return (
    <ReactFlowProvider>
      <div style={{ width: "350px", height: "350px" }}>
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
  title: "Organisms/Flow/NodeScene",
  component: NodeSceneWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    characterName: {
      control: "text",
      description: "Name of the character speaking",
    },
    characterAvatarSrc: {
      control: "text",
      description: "URL of the character avatar image",
    },
    dialogue: {
      control: "text",
      description: "The dialogue text for this scene",
    },
    sceneryImageSrc: {
      control: "text",
      description: "URL of the background scenery image",
    },
    selected: {
      control: "boolean",
      description: "Whether the node is selected",
    },
  },
} satisfies Meta<typeof NodeSceneWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    characterName: "Luna",
    characterAvatarSrc: "/images/girl-poster.webp",
    dialogue: "Hey! I didn't expect to see you here...",
    sceneryImageSrc: "/images/girl-poster.webp",
    selected: false,
  },
};

export const NoCharacter: Story = {
  args: {
    dialogue: "The wind howls through the abandoned corridors...",
    sceneryImageSrc: "/images/girl-poster.webp",
    selected: false,
  },
};

export const NoScenery: Story = {
  args: {
    characterName: "Marcus",
    characterAvatarSrc: "/images/girl-poster.webp",
    dialogue: "We need to talk about what happened last night.",
    selected: false,
  },
};

export const LongDialogue: Story = {
  args: {
    characterName: "Elena",
    characterAvatarSrc: "/images/girl-poster.webp",
    dialogue:
      "I've been thinking about this for a long time now, and I finally realized that sometimes the hardest choices are the ones that define who we truly are.",
    sceneryImageSrc: "/images/girl-poster.webp",
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    characterName: "Luna",
    characterAvatarSrc: "/images/girl-poster.webp",
    dialogue: "Hey! I didn't expect to see you here...",
    sceneryImageSrc: "/images/girl-poster.webp",
    selected: true,
  },
};

export const EmptyScene: Story = {
  args: {
    selected: false,
  },
};
