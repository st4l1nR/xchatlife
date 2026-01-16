import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import FlowContextMenu from "@/app/_components/organisms/FlowContextMenu";

// ============================================================================
// Meta
// ============================================================================

const meta = {
  title: "Organisms/Flow/FlowContextMenu",
  component: FlowContextMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onClose: fn(),
    onAddSceneAfter: fn(),
    onAddChoiceAfter: fn(),
    onDuplicate: fn(),
    onDelete: fn(),
    onInsertSceneOnEdge: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: "400px", height: "400px", position: "relative" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FlowContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Stories
// ============================================================================

/**
 * Context menu for a Scene node.
 * Shows Add Scene After, Add Choice After, Duplicate, and Delete actions.
 */
export const SceneNode: Story = {
  args: {
    id: "scene-1",
    type: "node",
    nodeType: "scene",
    position: { x: 50, y: 50 },
  },
};

/**
 * Context menu for a Start node.
 * Shows Add Scene After, Add Choice After actions.
 * Delete is disabled (protected) as the start node cannot be removed.
 */
export const StartNode: Story = {
  args: {
    id: "start-1",
    type: "node",
    nodeType: "start",
    position: { x: 50, y: 50 },
  },
};

/**
 * Context menu for a Choice node.
 * Shows Add Scene After, Duplicate, and Delete actions.
 */
export const ChoiceNode: Story = {
  args: {
    id: "choice-1",
    type: "node",
    nodeType: "choice",
    position: { x: 50, y: 50 },
  },
};

/**
 * Context menu for an End node.
 * Only shows Delete action.
 */
export const EndNode: Story = {
  args: {
    id: "end-1",
    type: "node",
    nodeType: "end",
    position: { x: 50, y: 50 },
  },
};

/**
 * Context menu for an Edge (connection between nodes).
 * Shows Insert Scene and Delete Connection actions.
 */
export const Edge: Story = {
  args: {
    id: "edge-1",
    type: "edge",
    position: { x: 50, y: 50 },
  },
};

/**
 * Context menu positioned near the right edge of the viewport.
 * The menu should adjust its position to stay within the viewport.
 */
export const PositionedRight: Story = {
  args: {
    id: "scene-1",
    type: "node",
    nodeType: "scene",
    position: { x: 250, y: 50 },
  },
};
