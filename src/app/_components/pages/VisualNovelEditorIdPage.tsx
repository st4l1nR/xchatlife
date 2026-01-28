"use client";

import React, { useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
  ConnectionLineType,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeStart from "@/app/_components/organisms/NodeStart";
import NodeScene from "@/app/_components/organisms/NodeScene";
import NodeChoice from "@/app/_components/organisms/NodeChoice";
import NodeJump from "@/app/_components/organisms/NodeJump";
import NodeEnd from "@/app/_components/organisms/NodeEnd";
import DialogVisualNovelScene from "@/app/_components/organisms/DialogVisualNovelScene";
import DialogVisualNovelBranch from "@/app/_components/organisms/DialogVisualNovelBranch";
import DialogVisualNovelJump from "@/app/_components/organisms/DialogVisualNovelJump";
import DialogVisualNovelEnd from "@/app/_components/organisms/DialogVisualNovelEnd";
import DialogDeleteNode from "@/app/_components/organisms/DialogDeleteNode";
import {
  useVisualNovelEditor,
  VisualNovelEditorProvider,
  type NodeVariant,
  type VisualNovelNode,
  type Layout,
} from "@/app/_contexts/VisualNovelEditorContext";
import type { SceneFormData } from "@/app/_components/organisms/DialogVisualNovelScene";
import type { BranchFormData } from "@/app/_components/organisms/DialogVisualNovelBranch";
import type { JumpFormData } from "@/app/_components/organisms/DialogVisualNovelJump";
import type { EndFormData } from "@/app/_components/organisms/DialogVisualNovelEnd";

// ============================================================================
// Node Types Configuration
// ============================================================================

const nodeTypes: NodeTypes = {
  start: NodeStart,
  scene: NodeScene,
  branch: NodeChoice,
  jump: NodeJump,
  end: NodeEnd,
};

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_LAYOUT: Layout = {
  nodes: [
    {
      id: "node_1",
      label: "Start",
      width: 100,
      height: 40,
      x: 400,
      y: 50,
      data: {
        variant: "start",
        label: "Start",
      },
    },
  ],
  edges: [],
  width: 800,
  height: 200,
};

// ============================================================================
// Types
// ============================================================================

export interface VisualNovelEditorIdPageProps {
  className?: string;
  visualNovelId: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function convertToReactFlowNodes(
  layoutNodes: VisualNovelNode[],
  layoutEdges: Array<{ source: string; target: string }>,
  onAddNode: (variant: NodeVariant, parentId: string) => void,
): Node[] {
  return layoutNodes.map((node) => {
    // Check if this node has children (has outgoing edges)
    const hasChildren = layoutEdges.some((edge) => edge.source === node.id);

    // Dagre devuelve coordenadas del CENTRO del nodo
    // ReactFlow usa coordenadas de la ESQUINA SUPERIOR IZQUIERDA
    // Por lo tanto, restamos la mitad del ancho/alto para convertir
    return {
      id: node.id,
      type: node.data.variant,
      position: {
        x: (node.x ?? 0) - node.width / 2,
        y: (node.y ?? 0) - node.height / 2,
      },
      data: {
        ...node.data,
        label: node.label,
        onAddNode: (variant: NodeVariant) => onAddNode(variant, node.id),
        isEndOfPath: !hasChildren,
      },
    };
  });
}

function convertToReactFlowEdges(
  layoutEdges: Array<{ source: string; target: string; label?: string }>,
): Edge[] {
  return layoutEdges.map((edge, index) => ({
    id: `edge-${edge.source}-${edge.target}-${index}`,
    source: edge.source,
    target: edge.target,
    type: "smoothstep",
    animated: false,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    },
    style: {
      strokeWidth: 2,
    },
    label: edge.label,
  }));
}

// ============================================================================
// Editor Content Component (must be inside provider)
// ============================================================================

const EditorContent: React.FC<{ className?: string }> = ({ className }) => {
  const {
    layout,
    isDialogOpen,
    selectedNodeId,
    dialogVariant,
    createNode,
    deleteNode,
    updateNode,
    createBranch,
    openDialog,
    closeDialog,
    setJumpTarget,
  } = useVisualNovelEditor();

  // Local state for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<VisualNovelNode | null>(
    null,
  );

  // Handle adding a new node (defined early for use in node data)
  const handleAddNode = useCallback(
    (variant: NodeVariant, parentId: string) => {
      if (variant === "branch") {
        createBranch(parentId, ["Choice 1", "Choice 2"]);
      } else {
        const newNode = createNode(variant, parentId);
        // Open dialog for the new node after a small delay to let state propagate
        setTimeout(() => {
          openDialog(newNode.id, variant);
        }, 100);
      }
    },
    [createNode, createBranch, openDialog],
  );

  // Convert layout to ReactFlow format
  const initialNodes = useMemo(
    () => convertToReactFlowNodes(layout.nodes, layout.edges, handleAddNode),
    [layout.nodes, layout.edges, handleAddNode],
  );
  const initialEdges = useMemo(
    () => convertToReactFlowEdges(layout.edges),
    [layout.edges],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync nodes and edges when layout changes
  React.useEffect(() => {
    setNodes(
      convertToReactFlowNodes(layout.nodes, layout.edges, handleAddNode),
    );
    setEdges(convertToReactFlowEdges(layout.edges));
  }, [layout, setNodes, setEdges, handleAddNode]);

  // Get selected node data
  const selectedNode = useMemo(
    () => layout.nodes.find((n) => n.id === selectedNodeId),
    [layout.nodes, selectedNodeId],
  );

  // Handle node double click
  const onNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // Don't open dialog for start node
      if (node.type === "start") return;
      openDialog(node.id, node.type as NodeVariant);
    },
    [openDialog],
  );

  // Confirm delete
  const handleConfirmDelete = useCallback(() => {
    if (nodeToDelete) {
      deleteNode(nodeToDelete.id);
      setDeleteDialogOpen(false);
      setNodeToDelete(null);
    }
  }, [nodeToDelete, deleteNode]);

  // Handle scene form submit
  const handleSceneSubmit = useCallback(
    (data: SceneFormData) => {
      if (!selectedNodeId) return;
      updateNode(selectedNodeId, {
        data: {
          variant: "scene",
          label: data.label,
          characterName: data.characterName,
          dialogue: data.dialogue,
          dialogueRich: data.dialogueRich,
          media: data.media,
          sceneryImageSrc: data.media?.url,
        },
      });
      closeDialog();
    },
    [selectedNodeId, updateNode, closeDialog],
  );

  // Handle branch form submit
  const handleBranchSubmit = useCallback(
    (data: BranchFormData) => {
      if (!selectedNodeId) return;
      updateNode(selectedNodeId, {
        data: {
          variant: "branch",
          label: data.label,
        },
      });
      closeDialog();
    },
    [selectedNodeId, updateNode, closeDialog],
  );

  // Handle jump form submit
  const handleJumpSubmit = useCallback(
    (data: JumpFormData) => {
      if (!selectedNodeId) return;
      updateNode(selectedNodeId, {
        data: {
          variant: "jump",
          label: data.label,
          targetNodeId: data.targetNodeId,
        },
      });
      setJumpTarget(selectedNodeId, data.targetNodeId);
      closeDialog();
    },
    [selectedNodeId, updateNode, setJumpTarget, closeDialog],
  );

  // Handle end form submit
  const handleEndSubmit = useCallback(
    (data: EndFormData) => {
      if (!selectedNodeId) return;
      updateNode(selectedNodeId, {
        data: {
          variant: "end",
          label: data.label,
          endingType: data.endingType,
          finalMessage: data.finalMessage,
        },
      });
      closeDialog();
    },
    [selectedNodeId, updateNode, closeDialog],
  );

  // Stats
  const sceneCount = layout.nodes.filter(
    (n) => n.data.variant === "scene",
  ).length;
  const branchCount = layout.nodes.filter(
    (n) => n.data.variant === "branch",
  ).length;
  const endCount = layout.nodes.filter((n) => n.data.variant === "end").length;

  // Check if node has children
  const nodeHasChildren = useCallback(
    (nodeId: string) => {
      return layout.edges.some((e) => e.source === nodeId);
    },
    [layout.edges],
  );

  // MiniMap node color
  const getNodeColor = useCallback((node: Node) => {
    switch (node.type) {
      case "start":
        return "#8b5cf6"; // purple
      case "scene":
        return "#6366f1"; // indigo
      case "branch":
        return "#22c55e"; // green
      case "jump":
        return "#3b82f6"; // blue
      case "end":
        return "#ef4444"; // red
      default:
        return "#64748b"; // gray
    }
  }, []);

  return (
    <div className={clsx("flex h-full flex-col", className)}>
      {/* Main Canvas */}
      <div className="relative flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          edgesFocusable={false}
          elementsSelectable={true}
          zoomOnDoubleClick={false}
        >
          <Background color="var(--color-border)" gap={20} />
          <Controls className="!border-border !bg-card [&_button]:!border-border [&_button]:!bg-card [&_button]:hover:!bg-muted !shadow-lg" />
          <MiniMap
            nodeColor={getNodeColor}
            className="!border-border !bg-card"
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>
      </div>

      {/* Stats Footer */}
      <div className="border-border bg-card flex items-center justify-between border-t px-4 py-2">
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <span>
            <span className="text-foreground font-medium">{sceneCount}</span>{" "}
            {sceneCount === 1 ? "scene" : "scenes"}
          </span>
          <span>
            <span className="text-foreground font-medium">{branchCount}</span>{" "}
            {branchCount === 1 ? "choice" : "choices"}
          </span>
          <span>
            <span className="text-foreground font-medium">{endCount}</span>{" "}
            {endCount === 1 ? "ending" : "endings"}
          </span>
        </div>
        <div className="text-muted-foreground text-sm">
          Double-click a node to edit
        </div>
      </div>

      {/* Dialogs */}
      <DialogVisualNovelScene
        open={isDialogOpen && dialogVariant === "scene"}
        onClose={closeDialog}
        mode={selectedNode ? "edit" : "create"}
        nodeData={selectedNode?.data}
        onSubmit={handleSceneSubmit}
      />

      <DialogVisualNovelBranch
        open={isDialogOpen && dialogVariant === "branch"}
        onClose={closeDialog}
        mode={selectedNode ? "edit" : "create"}
        nodeData={selectedNode?.data}
        onSubmit={handleBranchSubmit}
      />

      <DialogVisualNovelJump
        open={isDialogOpen && dialogVariant === "jump"}
        onClose={closeDialog}
        mode={selectedNode ? "edit" : "create"}
        nodeData={selectedNode?.data}
        availableNodes={layout.nodes}
        onSubmit={handleJumpSubmit}
      />

      <DialogVisualNovelEnd
        open={isDialogOpen && dialogVariant === "end"}
        onClose={closeDialog}
        mode={selectedNode ? "edit" : "create"}
        nodeData={selectedNode?.data}
        onSubmit={handleEndSubmit}
      />

      <DialogDeleteNode
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        nodeVariant={nodeToDelete?.data.variant}
        nodeName={nodeToDelete?.label}
        hasChildren={nodeToDelete ? nodeHasChildren(nodeToDelete.id) : false}
      />
    </div>
  );
};

// ============================================================================
// Main Page Component
// ============================================================================

const VisualNovelEditorIdPage: React.FC<VisualNovelEditorIdPageProps> = ({
  className,
  visualNovelId,
}) => {
  // TODO: In the future, fetch visual novel data by ID from the API
  // For now, use mock data
  console.log("Visual Novel ID:", visualNovelId);

  return (
    <VisualNovelEditorProvider initialLayout={MOCK_LAYOUT}>
      <div className={clsx("h-[calc(100vh-4rem)]", className)}>
        <EditorContent />
      </div>
    </VisualNovelEditorProvider>
  );
};

export default VisualNovelEditorIdPage;
