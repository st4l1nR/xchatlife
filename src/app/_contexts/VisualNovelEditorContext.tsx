"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useRef,
  type ReactNode,
} from "react";
import type dagreType from "dagre";

// ============================================================================
// Types
// ============================================================================

export type NodeVariant = "start" | "scene" | "branch" | "jump" | "end";
export type EndingType = "good" | "neutral" | "bad" | "secret";

export interface VisualNovelNodeData {
  variant: NodeVariant;
  label: string;
  // Scene specific
  characterName?: string;
  characterAvatarSrc?: string;
  sceneryImageSrc?: string;
  dialogue?: string;
  dialogueRich?: string;
  media?: {
    type: "image" | "video";
    url: string;
    file?: File;
  };
  // Branch specific
  choices?: Array<{
    id: string;
    text: string;
    targetNodeId?: string;
  }>;
  // Jump specific
  targetNodeId?: string;
  // End specific
  endingType?: EndingType;
  finalMessage?: string;
}

export interface VisualNovelNode {
  id: string;
  label: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
  data: VisualNovelNodeData;
}

export interface VisualNovelEdge {
  id?: string;
  source: string;
  target: string;
  sourceHandle?: string;
  label?: string;
  points?: Array<{ x: number; y: number }>;
}

export interface Layout {
  nodes: VisualNovelNode[];
  edges: VisualNovelEdge[];
  width: number;
  height: number;
}

export interface VisualNovelEditorContextValue {
  // State
  layout: Layout;
  isDialogOpen: boolean;
  selectedNodeId: string | null;
  dialogVariant: NodeVariant | null;
  hasUnsavedChanges: boolean;

  // Node Operations
  createNode: (
    variant: NodeVariant,
    parentId?: string | null,
    label?: string,
  ) => VisualNovelNode;
  deleteNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<VisualNovelNode>) => void;
  insertNode: (
    sourceId: string,
    targetId: string,
    variant: NodeVariant,
    label?: string,
  ) => VisualNovelNode | null;

  // Branch Operations
  createBranch: (parentId: string, choices?: string[]) => VisualNovelNode[];
  addChoice: (parentId: string, text: string) => void;
  removeChoice: (parentId: string, choiceId: string) => void;

  // UI Operations
  openDialog: (nodeId: string, variant?: NodeVariant) => void;
  closeDialog: () => void;

  // Edge Operations
  connectTo: (sourceId: string, targetId: string, label?: string) => void;
  setJumpTarget: (jumpNodeId: string, targetNodeId: string) => void;

  // Export/Import
  exportLayout: () => Layout;
  importLayout: (layout: Layout) => void;
  resetLayout: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_START_NODE: VisualNovelNode = {
  id: "node_1",
  label: "Start",
  width: 100,
  height: 40,
  data: {
    variant: "start",
    label: "Start",
  },
};

// ============================================================================
// Context
// ============================================================================

const VisualNovelEditorContext = createContext<
  VisualNovelEditorContextValue | undefined
>(undefined);

// ============================================================================
// Provider
// ============================================================================

export interface VisualNovelEditorProviderProps {
  children: ReactNode;
  initialLayout?: Layout;
}

export function VisualNovelEditorProvider({
  children,
  initialLayout,
}: VisualNovelEditorProviderProps) {
  const [layout, setLayout] = useState<Layout>(
    initialLayout ?? {
      nodes: [DEFAULT_START_NODE],
      edges: [],
      width: 0,
      height: 0,
    },
  );
  const [nodeCounter, setNodeCounter] = useState<number>(2);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [dialogVariant, setDialogVariant] = useState<NodeVariant | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Dagre se carga dinámicamente y se cachea en un ref
  const dagreRef = useRef<typeof dagreType | null>(null);
  const dagreLoadingPromise = useRef<Promise<typeof dagreType> | null>(null);

  // Función para obtener dagre (carga bajo demanda con cache)
  const getDagre = useCallback(async (): Promise<typeof dagreType> => {
    if (dagreRef.current) {
      return dagreRef.current;
    }
    if (!dagreLoadingPromise.current) {
      dagreLoadingPromise.current = import("dagre").then((m) => m.default);
    }
    const dagre = await dagreLoadingPromise.current;
    dagreRef.current = dagre;
    return dagre;
  }, []);

  // -------------------------------------------------------------------------
  // Calculate Node Height
  // -------------------------------------------------------------------------
  const calculateNodeHeight = useCallback((node: VisualNovelNode): number => {
    const variant = node.data?.variant ?? "scene";

    switch (variant) {
      case "start":
        return 40;

      case "branch":
        return 40; // Match Tello exactly

      case "jump":
        return 60;

      case "end":
        return 60;

      case "scene":
      default:
        // Base height for scene card
        let height = 80;
        // Add height if has scenery image
        if (node.data?.sceneryImageSrc || node.data?.media?.url) {
          height += 96; // Image preview height
        }
        // Add height for dialogue
        if (node.data?.dialogue) {
          height += 40;
        }
        return Math.min(height, 220);
    }
  }, []);

  // -------------------------------------------------------------------------
  // Calculate Node Width
  // -------------------------------------------------------------------------
  const calculateNodeWidth = useCallback((node: VisualNovelNode): number => {
    const variant = node.data?.variant ?? "scene";

    switch (variant) {
      case "start":
        return 100;
      case "end":
        return 100;
      case "jump":
        return 120;
      case "branch":
        return 80; // Match Tello exactly
      case "scene":
      default:
        return 224; // w-56 = 14rem = 224px
    }
  }, []);

  // -------------------------------------------------------------------------
  // Generate Layout - carga dagre y calcula layout (UN SOLO setLayout)
  // -------------------------------------------------------------------------
  const generateLayout = useCallback(
    (nodes: VisualNovelNode[], edges: VisualNovelEdge[]) => {
      console.log("[generateLayout] Called with", nodes.length, "nodes");
      if (nodes.length === 0) {
        setLayout({ nodes: [], edges: [], width: 0, height: 0 });
        return;
      }

      // Cargar dagre y calcular layout
      void (async () => {
        try {
          console.log("[generateLayout] Loading dagre...");
          const dagreInstance = await getDagre();
          console.log("[generateLayout] Dagre loaded:", !!dagreInstance);

          // Crear grafo de Dagre
          const dagreGraph = new dagreInstance.graphlib.Graph();
          dagreGraph.setDefaultEdgeLabel(() => ({}));
          dagreGraph.setGraph({
            rankdir: "TB",
            nodesep: 400, // Espacio HORIZONTAL entre nodos hermanos (mismo rank)
            ranksep: 160, // Espacio VERTICAL entre niveles
            marginx: 40,
            marginy: 40,
          });

          // Agregar nodos al grafo
          nodes.forEach((node) => {
            const nodeWidth = calculateNodeWidth(node);
            const nodeHeight = calculateNodeHeight(node);
            dagreGraph.setNode(node.id, {
              width: nodeWidth,
              height: nodeHeight,
            });
          });

          // Agregar edges (excepto jump para el cálculo de layout)
          edges.forEach((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            if (sourceNode?.data?.variant === "jump") {
              return;
            }
            dagreGraph.setEdge(edge.source, edge.target);
          });

          // Calcular layout
          dagreInstance.layout(dagreGraph);

          // Mapear posiciones a los nodos
          const layoutedNodes = nodes.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            return {
              ...node,
              width: calculateNodeWidth(node),
              height: calculateNodeHeight(node),
              x: nodeWithPosition?.x ?? 400,
              y: nodeWithPosition?.y ?? 0,
            };
          });

          // Mapear puntos a los edges
          const layoutedEdges = edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            if (sourceNode?.data?.variant === "jump") {
              return { ...edge, points: [] };
            }
            const edgeWithPoints = dagreGraph.edge(edge.source, edge.target);
            return {
              ...edge,
              points: edgeWithPoints?.points ?? [],
            };
          });

          const graph = dagreGraph.graph();

          console.log(
            "[generateLayout] Setting layout with",
            layoutedNodes.length,
            "nodes",
          );
          console.log(
            "[generateLayout] First node position:",
            layoutedNodes[0]?.x,
            layoutedNodes[0]?.y,
          );

          // UN SOLO setLayout (sin race condition)
          setLayout({
            nodes: layoutedNodes,
            edges: layoutedEdges,
            width: graph.width ?? 0,
            height: graph.height ?? 0,
          });
          console.log("[generateLayout] Layout set!");
        } catch (error) {
          console.error("[generateLayout] Error calculating layout:", error);
        }
      })();
    },
    [calculateNodeHeight, calculateNodeWidth, getDagre],
  );

  // -------------------------------------------------------------------------
  // Create Node
  // -------------------------------------------------------------------------
  const createNode = useCallback(
    (
      variant: NodeVariant,
      parentId: string | null = null,
      label?: string,
    ): VisualNovelNode => {
      console.log(
        "[createNode] Called with variant:",
        variant,
        "parentId:",
        parentId,
      );
      const defaultLabel =
        label ??
        (variant === "scene"
          ? `Scene ${nodeCounter}`
          : variant === "branch"
            ? `Branch ${nodeCounter}`
            : variant === "jump"
              ? `Jump ${nodeCounter}`
              : variant === "end"
                ? `End ${nodeCounter}`
                : `Node ${nodeCounter}`);

      const newNode: VisualNovelNode = {
        id: `node_${nodeCounter}`,
        label: defaultLabel,
        width: 224,
        height: 120,
        data: {
          variant,
          label: defaultLabel,
          ...(variant === "end" && { endingType: "neutral" as EndingType }),
        },
      };

      const newNodes = [...layout.nodes, newNode];
      let newEdges = [...layout.edges];

      if (parentId) {
        const newEdge: VisualNovelEdge = {
          source: parentId,
          target: newNode.id,
        };
        newEdges = [...layout.edges, newEdge];
      }

      setNodeCounter((prev) => prev + 1);
      setHasUnsavedChanges(true);
      generateLayout(newNodes, newEdges);

      return newNode;
    },
    [nodeCounter, layout, generateLayout],
  );

  // -------------------------------------------------------------------------
  // Delete Node (and all downstream nodes)
  // -------------------------------------------------------------------------
  const deleteNode = useCallback(
    (nodeId: string): void => {
      // Don't allow deleting the start node
      const nodeToDelete = layout.nodes.find((n) => n.id === nodeId);
      if (nodeToDelete?.data?.variant === "start") {
        return;
      }

      const nodesToDelete = new Set<string>();

      const findDownstreamNodes = (currentNodeId: string) => {
        if (nodesToDelete.has(currentNodeId)) return;
        nodesToDelete.add(currentNodeId);

        const outgoingEdges = layout.edges.filter(
          (edge) => edge.source === currentNodeId,
        );

        outgoingEdges.forEach((edge) => {
          findDownstreamNodes(edge.target);
        });
      };

      findDownstreamNodes(nodeId);

      const newNodes = layout.nodes.filter(
        (node) => !nodesToDelete.has(node.id),
      );

      const newEdges = layout.edges.filter(
        (edge) =>
          !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target),
      );

      setHasUnsavedChanges(true);
      generateLayout(newNodes, newEdges);
    },
    [layout, generateLayout],
  );

  // -------------------------------------------------------------------------
  // Update Node
  // -------------------------------------------------------------------------
  const updateNode = useCallback(
    (nodeId: string, updates: Partial<VisualNovelNode>): void => {
      const newNodes = layout.nodes.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = {
            ...node,
            ...updates,
            data: {
              ...node.data,
              ...updates.data,
            },
          };

          // Sync label
          if (updates.data?.label) {
            updatedNode.label = updates.data.label;
          }

          return updatedNode;
        }
        return node;
      });

      setHasUnsavedChanges(true);
      generateLayout(newNodes, layout.edges);
    },
    [layout, generateLayout],
  );

  // -------------------------------------------------------------------------
  // Insert Node between two existing nodes
  // -------------------------------------------------------------------------
  const insertNode = useCallback(
    (
      sourceId: string,
      targetId: string,
      variant: NodeVariant,
      label?: string,
    ): VisualNovelNode | null => {
      const edgeExists = layout.edges.find(
        (edge) => edge.source === sourceId && edge.target === targetId,
      );

      if (!edgeExists) return null;

      const defaultLabel = label ?? `${variant} ${nodeCounter}`;

      const newNode: VisualNovelNode = {
        id: `node_${nodeCounter}`,
        label: defaultLabel,
        width: 224,
        height: 120,
        data: {
          variant,
          label: defaultLabel,
        },
      };

      const newNodes = [...layout.nodes, newNode];

      // Remove old edge and add two new edges
      const newEdges: VisualNovelEdge[] = layout.edges
        .filter(
          (edge) => !(edge.source === sourceId && edge.target === targetId),
        )
        .concat([
          { source: sourceId, target: newNode.id },
          { source: newNode.id, target: targetId },
        ]);

      setNodeCounter((prev) => prev + 1);
      setHasUnsavedChanges(true);
      generateLayout(newNodes, newEdges);

      return newNode;
    },
    [nodeCounter, layout, generateLayout],
  );

  // -------------------------------------------------------------------------
  // Create Branch (creates multiple choice nodes)
  // -------------------------------------------------------------------------
  const createBranch = useCallback(
    (
      parentId: string,
      choices: string[] = ["Choice 1", "Choice 2"],
    ): VisualNovelNode[] => {
      const choiceNodes: VisualNovelNode[] = choices.map(
        (choiceText, index) => ({
          id: `node_${nodeCounter + index}`,
          label: choiceText,
          width: 80, // Match Tello exactly
          height: 40, // Match Tello exactly
          data: {
            variant: "branch" as NodeVariant,
            label: choiceText,
          },
        }),
      );

      const newNodes = [...layout.nodes, ...choiceNodes];
      const newEdges: VisualNovelEdge[] = [
        ...layout.edges,
        ...choiceNodes.map((node) => ({
          source: parentId,
          target: node.id,
        })),
      ];

      setNodeCounter((prev) => prev + choices.length);
      setHasUnsavedChanges(true);
      generateLayout(newNodes, newEdges);

      return choiceNodes;
    },
    [nodeCounter, layout, generateLayout],
  );

  // -------------------------------------------------------------------------
  // Add Choice to a parent node
  // -------------------------------------------------------------------------
  const addChoice = useCallback(
    (parentId: string, text: string): void => {
      const choiceNode: VisualNovelNode = {
        id: `node_${nodeCounter}`,
        label: text,
        width: 80, // Match Tello exactly
        height: 40, // Match Tello exactly
        data: {
          variant: "branch",
          label: text,
        },
      };

      const newNodes = [...layout.nodes, choiceNode];
      const newEdges: VisualNovelEdge[] = [
        ...layout.edges,
        { source: parentId, target: choiceNode.id },
      ];

      setNodeCounter((prev) => prev + 1);
      setHasUnsavedChanges(true);
      generateLayout(newNodes, newEdges);
    },
    [nodeCounter, layout, generateLayout],
  );

  // -------------------------------------------------------------------------
  // Remove Choice
  // -------------------------------------------------------------------------
  const removeChoice = useCallback(
    (parentId: string, choiceId: string): void => {
      // This is essentially deleteNode but we verify it's a branch from the parent
      const edge = layout.edges.find(
        (e) => e.source === parentId && e.target === choiceId,
      );
      if (!edge) return;

      deleteNode(choiceId);
    },
    [layout.edges, deleteNode],
  );

  // -------------------------------------------------------------------------
  // Open Dialog
  // -------------------------------------------------------------------------
  const openDialog = useCallback(
    (nodeId: string, variant?: NodeVariant): void => {
      const node = layout.nodes.find((n) => n.id === nodeId);
      const nodeVariant = variant ?? node?.data?.variant ?? "scene";

      setSelectedNodeId(nodeId);
      setDialogVariant(nodeVariant);
      setIsDialogOpen(true);
    },
    [layout.nodes],
  );

  // -------------------------------------------------------------------------
  // Close Dialog
  // -------------------------------------------------------------------------
  const closeDialog = useCallback((): void => {
    setIsDialogOpen(false);
    setSelectedNodeId(null);
    setDialogVariant(null);
  }, []);

  // -------------------------------------------------------------------------
  // Connect To
  // -------------------------------------------------------------------------
  const connectTo = useCallback(
    (sourceId: string, targetId: string, label?: string): void => {
      const existingEdge = layout.edges.find(
        (edge) => edge.source === sourceId && edge.target === targetId,
      );

      if (existingEdge) return;

      const newEdge: VisualNovelEdge = {
        source: sourceId,
        target: targetId,
        label,
      };

      const newEdges = [...layout.edges, newEdge];
      setHasUnsavedChanges(true);
      setLayout((prev) => ({ ...prev, edges: newEdges }));
    },
    [layout],
  );

  // -------------------------------------------------------------------------
  // Set Jump Target
  // -------------------------------------------------------------------------
  const setJumpTarget = useCallback(
    (jumpNodeId: string, targetNodeId: string): void => {
      // Remove existing edge from this jump node
      const filteredEdges = layout.edges.filter(
        (edge) => edge.source !== jumpNodeId,
      );

      // Add new edge if target is specified
      const newEdges = targetNodeId
        ? [
            ...filteredEdges,
            {
              source: jumpNodeId,
              target: targetNodeId,
            },
          ]
        : filteredEdges;

      // Update the node's targetNodeId
      const newNodes = layout.nodes.map((node) => {
        if (node.id === jumpNodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              targetNodeId,
            },
          };
        }
        return node;
      });

      setHasUnsavedChanges(true);
      setLayout((prev) => ({
        ...prev,
        nodes: newNodes,
        edges: newEdges,
      }));
    },
    [layout],
  );

  // -------------------------------------------------------------------------
  // Export Layout
  // -------------------------------------------------------------------------
  const exportLayout = useCallback((): Layout => {
    return layout;
  }, [layout]);

  // -------------------------------------------------------------------------
  // Import Layout
  // -------------------------------------------------------------------------
  const importLayout = useCallback((newLayout: Layout): void => {
    // Find max node number to set counter
    const maxNodeNum = Math.max(
      ...newLayout.nodes.map((node) => {
        const match = node.id.match(/node_(\d+)/);
        return match?.[1] ? parseInt(match[1], 10) : 0;
      }),
      0,
    );
    setNodeCounter(maxNodeNum + 1);
    setLayout(newLayout);
    setHasUnsavedChanges(false);
  }, []);

  // -------------------------------------------------------------------------
  // Reset Layout
  // -------------------------------------------------------------------------
  const resetLayout = useCallback((): void => {
    setLayout({
      nodes: [DEFAULT_START_NODE],
      edges: [],
      width: 0,
      height: 0,
    });
    setNodeCounter(2);
    setHasUnsavedChanges(false);
  }, []);

  // -------------------------------------------------------------------------
  // Context Value
  // -------------------------------------------------------------------------
  const value: VisualNovelEditorContextValue = {
    layout,
    isDialogOpen,
    selectedNodeId,
    dialogVariant,
    hasUnsavedChanges,

    createNode,
    deleteNode,
    updateNode,
    insertNode,

    createBranch,
    addChoice,
    removeChoice,

    openDialog,
    closeDialog,

    connectTo,
    setJumpTarget,

    exportLayout,
    importLayout,
    resetLayout,
  };

  return (
    <VisualNovelEditorContext.Provider value={value}>
      {children}
    </VisualNovelEditorContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useVisualNovelEditor(): VisualNovelEditorContextValue {
  const context = useContext(VisualNovelEditorContext);
  if (!context) {
    throw new Error(
      "useVisualNovelEditor must be used within VisualNovelEditorProvider",
    );
  }
  return context;
}
