import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import FlowCanvas from "@/app/_components/organisms/FlowCanvas";
import type { FlowNode, FlowEdge } from "@/app/_components/organisms/FlowContext";

// ============================================================================
// Mock Data
// ============================================================================

const mockNodes: FlowNode[] = [
  { id: "start-1", type: "start", position: { x: 250, y: 0 }, data: {} },
  {
    id: "scene-1",
    type: "scene",
    position: { x: 200, y: 80 },
    data: {
      characterName: "Luna",
      characterAvatarSrc: "/images/girl-poster.webp",
      dialogue: "Hey! I didn't expect to see you here...",
      sceneryImageSrc: "/images/girl-poster.webp",
    },
  },
  {
    id: "choice-1",
    type: "choice",
    position: { x: 480, y: 280 },
    data: { text: "Hi Luna! What a coincidence!", index: 1 },
  },
  {
    id: "choice-2",
    type: "choice",
    position: { x: 480, y: 340 },
    data: { text: "Oh... I was just leaving.", index: 2 },
  },
  {
    id: "choice-3",
    type: "choice",
    position: { x: 480, y: 400 },
    data: { text: "Stay silent", index: 3 },
  },
  {
    id: "scene-2",
    type: "scene",
    position: { x: 750, y: 260 },
    data: {
      characterName: "Luna",
      dialogue: "Luna smiles warmly at you...",
    },
  },
  { id: "end-1", type: "end", position: { x: 950, y: 290 }, data: {} },
  { id: "end-2", type: "end", position: { x: 750, y: 360 }, data: {} },
  { id: "end-3", type: "end", position: { x: 750, y: 420 }, data: {} },
];

const mockEdges: FlowEdge[] = [
  { id: "e1", source: "start-1", target: "scene-1" },
  { id: "e2", source: "scene-1", target: "choice-1" },
  { id: "e3", source: "scene-1", target: "choice-2" },
  { id: "e4", source: "scene-1", target: "choice-3" },
  { id: "e5", source: "choice-1", target: "scene-2" },
  { id: "e6", source: "choice-2", target: "end-2" },
  { id: "e7", source: "choice-3", target: "end-3" },
  { id: "e8", source: "scene-2", target: "end-1" },
];

// Simple flow for demonstrating context menu
const simpleNodes: FlowNode[] = [
  { id: "start-1", type: "start", position: { x: 250, y: 50 }, data: {} },
  {
    id: "scene-1",
    type: "scene",
    position: { x: 200, y: 200 },
    data: {
      characterName: "Character",
      dialogue: "Right-click me to see the context menu!",
    },
  },
  { id: "end-1", type: "end", position: { x: 250, y: 400 }, data: {} },
];

const simpleEdges: FlowEdge[] = [
  { id: "e1", source: "start-1", target: "scene-1" },
  { id: "e2", source: "scene-1", target: "end-1" },
];

// ============================================================================
// Meta
// ============================================================================

const meta = {
  title: "Organisms/Flow/FlowCanvas",
  component: FlowCanvas,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## FlowCanvas

Interactive flow canvas for building visual stories with nodes and edges.

### Context Menu Actions

**Right-click on any node or edge to open the context menu:**

| Node Type | Available Actions |
|-----------|-------------------|
| Start | Add Scene After, Add Choice After (Delete disabled) |
| Scene | Add Scene After, Add Choice After, Duplicate, Delete |
| Choice | Add Scene After, Duplicate, Delete |
| End | Delete |
| Edge | Insert Scene, Delete Connection |

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| \`Delete\` / \`Backspace\` | Delete selected node or edge |
| \`Ctrl+D\` / \`Cmd+D\` | Duplicate selected node |

### Interactions

- **Click** a node to select it
- **Right-click** a node or edge to open context menu
- **Drag** nodes to reposition them
- **Connect** nodes by dragging from handles
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "700px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FlowCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Stories
// ============================================================================

/**
 * Default story with a complete flow including multiple scenes, choices, and endings.
 *
 * **Try it out:**
 * - Right-click on any node to see the context menu
 * - Select a node and press `Delete` to remove it
 * - Select a node and press `Ctrl+D` to duplicate it
 * - Right-click on an edge (connection line) to insert a scene or delete the connection
 */
export const Default: Story = {
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
};

/**
 * Empty canvas - start building your flow from scratch.
 *
 * This is useful for testing the empty state of the canvas.
 */
export const Empty: Story = {
  args: {
    initialNodes: [],
    initialEdges: [],
  },
};

/**
 * Simple flow with just Start → Scene → End.
 *
 * **Perfect for testing context menu actions:**
 * 1. Right-click the **Start** node → Add Scene After or Add Choice After
 * 2. Right-click the **Scene** node → Add Scene After, Add Choice After, Duplicate, or Delete
 * 3. Right-click the **End** node → Delete
 * 4. Right-click any **edge** → Insert Scene or Delete Connection
 *
 * **Keyboard shortcuts:**
 * - Click a node, then press `Delete` to remove it
 * - Click a node, then press `Ctrl+D` (or `Cmd+D` on Mac) to duplicate it
 */
export const WithContextMenu: Story = {
  args: {
    initialNodes: simpleNodes,
    initialEdges: simpleEdges,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A simple flow designed to demonstrate context menu functionality. Right-click on nodes or edges to see available actions.",
      },
    },
  },
};
