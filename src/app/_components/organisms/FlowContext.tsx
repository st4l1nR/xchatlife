"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type XYPosition,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";

import type { NodeSceneData } from "./NodeScene";
import type { NodeChoiceData } from "./NodeChoice";

// ============================================================================
// Types
// ============================================================================

export type FlowNodeType = "start" | "end" | "scene" | "choice";

export type FlowNodeData =
  | NodeSceneData
  | NodeChoiceData
  | Record<string, never>;

export type FlowNode = Node<FlowNodeData>;
export type FlowEdge = Edge;

export type AddNodeParams = {
  type: FlowNodeType;
  position?: XYPosition;
  data?: FlowNodeData;
};

export type FlowContextValue = {
  // State
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  // Node operations
  addNode: (params: AddNodeParams) => string;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, data: Partial<FlowNodeData>) => void;
  updateNodePosition: (nodeId: string, position: XYPosition) => void;
  getNodeById: (nodeId: string) => FlowNode | undefined;
  getNodesByType: (type: FlowNodeType) => FlowNode[];

  // Edge operations
  addEdge: (source: string, target: string, sourceHandle?: string) => string;
  removeEdge: (edgeId: string) => void;
  getEdgesByNode: (nodeId: string) => FlowEdge[];
  getEdgeById: (edgeId: string) => FlowEdge | undefined;

  // Selection
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  clearSelection: () => void;

  // Bulk operations
  setNodes: React.Dispatch<React.SetStateAction<FlowNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<FlowEdge[]>>;
  clearCanvas: () => void;

  // React Flow handlers
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  // Helper operations
  addSceneAfterNode: (nodeId: string) => string;
  addChoiceAfterNode: (nodeId: string, choiceText?: string) => string;
  duplicateNode: (nodeId: string) => string | null;
  insertSceneOnEdge: (edgeId: string) => string | null;

  // Stats
  nodeCount: number;
  edgeCount: number;
};

// ============================================================================
// Context
// ============================================================================

const FlowContext = createContext<FlowContextValue | null>(null);

// ============================================================================
// Hook
// ============================================================================

export const useFlow = (): FlowContextValue => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used within a FlowProvider");
  }
  return context;
};

// ============================================================================
// Helper: Generate unique ID
// ============================================================================

const generateId = (type: FlowNodeType): string => {
  return `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
};

// ============================================================================
// Provider Props
// ============================================================================

export type FlowProviderProps = {
  children: ReactNode;
  initialNodes?: FlowNode[];
  initialEdges?: FlowEdge[];
};

// ============================================================================
// Provider
// ============================================================================

export const FlowProvider: React.FC<FlowProviderProps> = ({
  children,
  initialNodes = [],
  initialEdges = [],
}) => {
  // State
  const [nodes, setNodes] = useState<FlowNode[]>(initialNodes);
  const [edges, setEdges] = useState<FlowEdge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // ============================================================================
  // React Flow handlers
  // ============================================================================

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds) as FlowNode[]);
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect: OnConnect = useCallback((connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  // ============================================================================
  // Node operations
  // ============================================================================

  const addNode = useCallback((params: AddNodeParams): string => {
    const { type, position = { x: 100, y: 100 }, data = {} } = params;
    const id = generateId(type);

    const newNode: FlowNode = {
      id,
      type,
      position,
      data,
    };

    setNodes((nds) => [...nds, newNode]);
    return id;
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    // Also remove connected edges
    setEdges((eds) =>
      eds.filter((e) => e.source !== nodeId && e.target !== nodeId),
    );
    // Clear selection if the removed node was selected
    setSelectedNodeId((current) => (current === nodeId ? null : current));
  }, []);

  const updateNode = useCallback(
    (nodeId: string, data: Partial<FlowNodeData>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, ...data } as FlowNodeData }
            : n,
        ),
      );
    },
    [],
  );

  const updateNodePosition = useCallback(
    (nodeId: string, position: XYPosition) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, position } : n)),
      );
    },
    [],
  );

  const getNodeById = useCallback(
    (nodeId: string): FlowNode | undefined => {
      return nodes.find((n) => n.id === nodeId);
    },
    [nodes],
  );

  const getNodesByType = useCallback(
    (type: FlowNodeType): FlowNode[] => {
      return nodes.filter((n) => n.type === type);
    },
    [nodes],
  );

  // ============================================================================
  // Edge operations
  // ============================================================================

  const addEdgeAction = useCallback(
    (source: string, target: string, sourceHandle?: string): string => {
      const id = `edge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      const newEdge: FlowEdge = {
        id,
        source,
        target,
        ...(sourceHandle && { sourceHandle }),
      };

      setEdges((eds) => [...eds, newEdge]);
      return id;
    },
    [],
  );

  const removeEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    setSelectedEdgeId((current) => (current === edgeId ? null : current));
  }, []);

  const getEdgesByNode = useCallback(
    (nodeId: string): FlowEdge[] => {
      return edges.filter((e) => e.source === nodeId || e.target === nodeId);
    },
    [edges],
  );

  const getEdgeById = useCallback(
    (edgeId: string): FlowEdge | undefined => {
      return edges.find((e) => e.id === edgeId);
    },
    [edges],
  );

  // ============================================================================
  // Selection
  // ============================================================================

  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    if (nodeId) {
      setSelectedEdgeId(null);
    }
  }, []);

  const selectEdge = useCallback((edgeId: string | null) => {
    setSelectedEdgeId(edgeId);
    if (edgeId) {
      setSelectedNodeId(null);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, []);

  // ============================================================================
  // Bulk operations
  // ============================================================================

  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, []);

  // ============================================================================
  // Helper operations
  // ============================================================================

  const addSceneAfterNode = useCallback(
    (nodeId: string): string => {
      const sourceNode = nodes.find((n) => n.id === nodeId);
      const position = sourceNode
        ? { x: sourceNode.position.x, y: sourceNode.position.y + 150 }
        : { x: 100, y: 100 };

      const newNodeId = generateId("scene");
      const sceneData: NodeSceneData = {
        characterName: "New Scene",
        dialogue: "",
      };
      const newNode: FlowNode = {
        id: newNodeId,
        type: "scene",
        position,
        data: sceneData,
      };

      setNodes((nds) => [...nds, newNode]);

      // Create edge from source to new node
      const edgeId = `edge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newEdge: FlowEdge = {
        id: edgeId,
        source: nodeId,
        target: newNodeId,
      };
      setEdges((eds) => [...eds, newEdge]);

      return newNodeId;
    },
    [nodes],
  );

  const addChoiceAfterNode = useCallback(
    (nodeId: string, choiceText?: string): string => {
      const sourceNode = nodes.find((n) => n.id === nodeId);
      const position = sourceNode
        ? { x: sourceNode.position.x + 200, y: sourceNode.position.y }
        : { x: 100, y: 100 };

      const newNodeId = generateId("choice");
      const choiceData: NodeChoiceData = {
        text: choiceText ?? "New Choice",
      };
      const newNode: FlowNode = {
        id: newNodeId,
        type: "choice",
        position,
        data: choiceData,
      };

      setNodes((nds) => [...nds, newNode]);

      // Create edge from source to new node
      const edgeId = `edge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newEdge: FlowEdge = {
        id: edgeId,
        source: nodeId,
        target: newNodeId,
      };
      setEdges((eds) => [...eds, newEdge]);

      return newNodeId;
    },
    [nodes],
  );

  const duplicateNode = useCallback(
    (nodeId: string): string | null => {
      const sourceNode = nodes.find((n) => n.id === nodeId);
      if (
        !sourceNode ||
        sourceNode.type === "start" ||
        sourceNode.type === "end"
      ) {
        return null;
      }

      const newNodeId = generateId(sourceNode.type as FlowNodeType);
      const newNode: FlowNode = {
        id: newNodeId,
        type: sourceNode.type,
        position: {
          x: sourceNode.position.x + 50,
          y: sourceNode.position.y + 50,
        },
        data: { ...sourceNode.data },
      };

      setNodes((nds) => [...nds, newNode]);
      return newNodeId;
    },
    [nodes],
  );

  const insertSceneOnEdge = useCallback(
    (edgeId: string): string | null => {
      const edge = edges.find((e) => e.id === edgeId);
      if (!edge) {
        return null;
      }

      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      // Calculate position between source and target
      const position =
        sourceNode && targetNode
          ? {
              x: (sourceNode.position.x + targetNode.position.x) / 2,
              y: (sourceNode.position.y + targetNode.position.y) / 2,
            }
          : { x: 100, y: 100 };

      const newNodeId = generateId("scene");
      const sceneData: NodeSceneData = {
        characterName: "New Scene",
        dialogue: "",
      };
      const newNode: FlowNode = {
        id: newNodeId,
        type: "scene",
        position,
        data: sceneData,
      };

      // Remove the old edge and add two new edges
      setEdges((eds) => {
        const filteredEdges = eds.filter((e) => e.id !== edgeId);
        const edge1Id = `edge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const edge2Id = `edge-${Date.now() + 1}-${Math.random().toString(36).slice(2, 7)}`;

        return [
          ...filteredEdges,
          { id: edge1Id, source: edge.source, target: newNodeId },
          { id: edge2Id, source: newNodeId, target: edge.target },
        ];
      });

      setNodes((nds) => [...nds, newNode]);
      return newNodeId;
    },
    [edges, nodes],
  );

  // ============================================================================
  // Context value
  // ============================================================================

  const value = useMemo<FlowContextValue>(
    () => ({
      // State
      nodes,
      edges,
      selectedNodeId,
      selectedEdgeId,

      // Node operations
      addNode,
      removeNode,
      updateNode,
      updateNodePosition,
      getNodeById,
      getNodesByType,

      // Edge operations
      addEdge: addEdgeAction,
      removeEdge,
      getEdgesByNode,
      getEdgeById,

      // Selection
      selectNode,
      selectEdge,
      clearSelection,

      // Bulk operations
      setNodes,
      setEdges,
      clearCanvas,

      // React Flow handlers
      onNodesChange,
      onEdgesChange,
      onConnect,

      // Helper operations
      addSceneAfterNode,
      addChoiceAfterNode,
      duplicateNode,
      insertSceneOnEdge,

      // Stats
      nodeCount: nodes.length,
      edgeCount: edges.length,
    }),
    [
      nodes,
      edges,
      selectedNodeId,
      selectedEdgeId,
      addNode,
      removeNode,
      updateNode,
      updateNodePosition,
      getNodeById,
      getNodesByType,
      addEdgeAction,
      removeEdge,
      getEdgesByNode,
      getEdgeById,
      selectNode,
      selectEdge,
      clearSelection,
      clearCanvas,
      onNodesChange,
      onEdgesChange,
      onConnect,
      addSceneAfterNode,
      addChoiceAfterNode,
      duplicateNode,
      insertSceneOnEdge,
    ],
  );

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};

export default FlowContext;
