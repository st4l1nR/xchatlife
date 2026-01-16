"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type EdgeMouseHandler,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import clsx from "clsx";

import NodeStart from "./NodeStart";
import NodeEnd from "./NodeEnd";
import NodeScene from "./NodeScene";
import NodeChoice from "./NodeChoice";
import FlowContextMenu from "./FlowContextMenu";
import {
  FlowProvider,
  useFlow,
  type FlowNode,
  type FlowEdge,
  type FlowNodeType,
} from "./FlowContext";

// ============================================================================
// Types
// ============================================================================

export type FlowCanvasProps = {
  className?: string;
  initialNodes?: FlowNode[];
  initialEdges?: FlowEdge[];
  onNodeClick?: NodeMouseHandler;
};

// ============================================================================
// Context Menu State Type
// ============================================================================

type ContextMenuState = {
  id: string;
  type: "node" | "edge";
  nodeType?: FlowNodeType;
  position: { x: number; y: number };
} | null;

// ============================================================================
// Inner Component (uses context)
// ============================================================================

const FlowCanvasInner: React.FC<{ className?: string; onNodeClick?: NodeMouseHandler }> = ({
  className,
  onNodeClick,
}) => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    selectEdge,
    clearSelection,
    selectedNodeId,
    selectedEdgeId,
    removeNode,
    removeEdge,
    getNodeById,
    addSceneAfterNode,
    addChoiceAfterNode,
    duplicateNode,
    insertSceneOnEdge,
  } = useFlow();

  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  // Handle node click
  const handleNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      selectNode(node.id);
      onNodeClick?.(event, node);
    },
    [selectNode, onNodeClick]
  );

  // Handle edge click
  const handleEdgeClick: EdgeMouseHandler = useCallback(
    (_event, edge) => {
      selectEdge(edge.id);
    },
    [selectEdge]
  );

  // Handle pane click - clear selection and close context menu
  const handlePaneClick = useCallback(() => {
    clearSelection();
    setContextMenu(null);
  }, [clearSelection]);

  // Handle node context menu (right-click)
  const handleNodeContextMenu: NodeMouseHandler = useCallback(
    (event, node) => {
      event.preventDefault();
      setContextMenu({
        id: node.id,
        type: "node",
        nodeType: node.type as FlowNodeType,
        position: { x: event.clientX, y: event.clientY },
      });
    },
    []
  );

  // Handle edge context menu (right-click)
  const handleEdgeContextMenu: EdgeMouseHandler = useCallback(
    (event, edge) => {
      event.preventDefault();
      setContextMenu({
        id: edge.id,
        type: "edge",
        position: { x: event.clientX, y: event.clientY },
      });
    },
    []
  );

  // Close context menu
  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Context menu action handlers
  const handleAddSceneAfter = useCallback(
    (nodeId: string) => {
      addSceneAfterNode(nodeId);
    },
    [addSceneAfterNode]
  );

  const handleAddChoiceAfter = useCallback(
    (nodeId: string) => {
      addChoiceAfterNode(nodeId);
    },
    [addChoiceAfterNode]
  );

  const handleDuplicate = useCallback(
    (nodeId: string) => {
      duplicateNode(nodeId);
    },
    [duplicateNode]
  );

  const handleDelete = useCallback(
    (id: string) => {
      // Check if it's a node or edge based on context menu state
      if (contextMenu?.type === "edge") {
        removeEdge(id);
      } else {
        // Don't delete start node
        const node = getNodeById(id);
        if (node?.type !== "start") {
          removeNode(id);
        }
      }
    },
    [contextMenu, removeNode, removeEdge, getNodeById]
  );

  const handleInsertSceneOnEdge = useCallback(
    (edgeId: string) => {
      insertSceneOnEdge(edgeId);
    },
    [insertSceneOnEdge]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Delete/Backspace - delete selected node or edge
      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedNodeId) {
          // Protect start node from deletion
          const node = getNodeById(selectedNodeId);
          if (node?.type !== "start") {
            removeNode(selectedNodeId);
          }
        } else if (selectedEdgeId) {
          removeEdge(selectedEdgeId);
        }
      }

      // Ctrl+D / Cmd+D - duplicate selected node
      if ((event.ctrlKey || event.metaKey) && event.key === "d") {
        event.preventDefault();
        if (selectedNodeId) {
          duplicateNode(selectedNodeId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, selectedEdgeId, removeNode, removeEdge, duplicateNode, getNodeById]);

  // Register custom node types
  const nodeTypes = useMemo(
    () => ({
      start: NodeStart,
      end: NodeEnd,
      scene: NodeScene,
      choice: NodeChoice,
    }),
    []
  );

  // Default edge options
  const defaultEdgeOptions = useMemo(
    () => ({
      type: "smoothstep",
      animated: false,
    }),
    []
  );

  // MiniMap node color
  const getNodeColor = useCallback((node: Node) => {
    switch (node.type) {
      case "start":
        return "hsl(var(--primary))";
      case "end":
        return "hsl(var(--destructive))";
      default:
        return "hsl(var(--muted-foreground))";
    }
  }, []);

  return (
    <div className={clsx("h-full w-full", className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        onNodeContextMenu={handleNodeContextMenu}
        onEdgeContextMenu={handleEdgeContextMenu}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          className="!bg-background"
        />
        <Controls className="!border-border !bg-muted !shadow-md [&>button]:!border-border [&>button]:!bg-muted [&>button]:hover:!bg-background [&>button>svg]:!fill-foreground" />
        <MiniMap
          nodeColor={getNodeColor}
          className="!border-border !bg-muted"
          maskColor="hsl(var(--background) / 0.8)"
        />
      </ReactFlow>

      {/* Context Menu */}
      {contextMenu && (
        <FlowContextMenu
          id={contextMenu.id}
          type={contextMenu.type}
          nodeType={contextMenu.nodeType}
          position={contextMenu.position}
          onClose={handleCloseContextMenu}
          onAddSceneAfter={handleAddSceneAfter}
          onAddChoiceAfter={handleAddChoiceAfter}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onInsertSceneOnEdge={handleInsertSceneOnEdge}
        />
      )}
    </div>
  );
};

// ============================================================================
// Main Component (includes providers)
// ============================================================================

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  className,
  initialNodes = [],
  initialEdges = [],
  onNodeClick,
}) => {
  return (
    <FlowProvider initialNodes={initialNodes} initialEdges={initialEdges}>
      <ReactFlowProvider>
        <FlowCanvasInner className={className} onNodeClick={onNodeClick} />
      </ReactFlowProvider>
    </FlowProvider>
  );
};

export default FlowCanvas;
