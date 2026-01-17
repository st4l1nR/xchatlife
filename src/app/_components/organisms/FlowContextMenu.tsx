"use client";

import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import {
  DocumentPlusIcon,
  QueueListIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/20/solid";
import type { FlowNodeType } from "./FlowContext";

// ============================================================================
// Types
// ============================================================================

export type FlowContextMenuProps = {
  id: string;
  type: "node" | "edge";
  nodeType?: FlowNodeType;
  position: { x: number; y: number };
  onClose: () => void;
  onAddSceneAfter?: (nodeId: string) => void;
  onAddChoiceAfter?: (nodeId: string) => void;
  onDuplicate?: (nodeId: string) => void;
  onDelete?: (id: string) => void;
  onInsertSceneOnEdge?: (edgeId: string) => void;
};

// ============================================================================
// Menu Item Component
// ============================================================================

type MenuItemProps = {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
  shortcut?: string;
};

const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  destructive = false,
  shortcut,
}) => {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={clsx(
        "group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
        "focus:outline-none",
        disabled
          ? "cursor-not-allowed opacity-50"
          : destructive
            ? "text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
            : "text-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
      )}
    >
      <Icon
        className={clsx(
          "h-4 w-4",
          disabled
            ? "text-muted-foreground"
            : destructive
              ? "text-destructive group-hover:text-destructive group-focus:text-destructive"
              : "text-muted-foreground group-hover:text-primary-foreground group-focus:text-primary-foreground",
        )}
      />
      <span className="flex-1">{label}</span>
      {shortcut && (
        <kbd
          className={clsx(
            "text-xs",
            disabled
              ? "text-muted-foreground"
              : destructive
                ? "text-destructive/70 group-hover:text-destructive/90 group-focus:text-destructive/90"
                : "text-muted-foreground group-hover:text-primary-foreground/70 group-focus:text-primary-foreground/70",
          )}
        >
          {shortcut}
        </kbd>
      )}
    </button>
  );
};

// ============================================================================
// Divider Component
// ============================================================================

const MenuDivider: React.FC = () => {
  return <div className="bg-border my-1 h-px" />;
};

// ============================================================================
// Main Component
// ============================================================================

const FlowContextMenu: React.FC<FlowContextMenuProps> = ({
  id,
  type,
  nodeType,
  position,
  onClose,
  onAddSceneAfter,
  onAddChoiceAfter,
  onDuplicate,
  onDelete,
  onInsertSceneOnEdge,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Adjust position to stay within viewport
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = position.x;
      let adjustedY = position.y;

      if (position.x + rect.width > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 8;
      }

      if (position.y + rect.height > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 8;
      }

      menuRef.current.style.left = `${adjustedX}px`;
      menuRef.current.style.top = `${adjustedY}px`;
    }
  }, [position]);

  const isStartNode = type === "node" && nodeType === "start";
  const isEdge = type === "edge";

  const handleAddSceneAfter = () => {
    onAddSceneAfter?.(id);
    onClose();
  };

  const handleAddChoiceAfter = () => {
    onAddChoiceAfter?.(id);
    onClose();
  };

  const handleDuplicate = () => {
    onDuplicate?.(id);
    onClose();
  };

  const handleDelete = () => {
    onDelete?.(id);
    onClose();
  };

  const handleInsertSceneOnEdge = () => {
    onInsertSceneOnEdge?.(id);
    onClose();
  };

  const menuLabel = isEdge ? "Edge actions" : `${nodeType ?? "Node"} actions`;

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={menuLabel}
      className={clsx(
        "fixed z-50 min-w-[180px] rounded-xl p-1",
        "bg-popover ring-border shadow-lg ring-1",
        "animate-in fade-in-0 zoom-in-95",
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {isEdge ? (
        // Edge context menu
        <>
          <MenuItem
            icon={ArrowsPointingInIcon}
            label="Insert Scene"
            onClick={handleInsertSceneOnEdge}
          />
          <MenuDivider />
          <MenuItem
            icon={TrashIcon}
            label="Delete Connection"
            onClick={handleDelete}
            destructive
            shortcut="Del"
          />
        </>
      ) : (
        // Node context menu
        <>
          {/* Add Scene After - available for start, scene, choice */}
          {(nodeType === "start" ||
            nodeType === "scene" ||
            nodeType === "choice") && (
            <MenuItem
              icon={DocumentPlusIcon}
              label="Add Scene After"
              onClick={handleAddSceneAfter}
            />
          )}

          {/* Add Choice After - available for start, scene */}
          {(nodeType === "start" || nodeType === "scene") && (
            <MenuItem
              icon={QueueListIcon}
              label="Add Choice After"
              onClick={handleAddChoiceAfter}
            />
          )}

          {/* Duplicate - available for scene, choice (not start/end) */}
          {(nodeType === "scene" || nodeType === "choice") && (
            <>
              <MenuDivider />
              <MenuItem
                icon={DocumentDuplicateIcon}
                label="Duplicate"
                onClick={handleDuplicate}
                shortcut="Ctrl+D"
              />
            </>
          )}

          {/* Delete - available for all except start */}
          <MenuDivider />
          <MenuItem
            icon={TrashIcon}
            label={isStartNode ? "Delete (Protected)" : "Delete"}
            onClick={handleDelete}
            disabled={isStartNode}
            destructive={!isStartNode}
            shortcut="Del"
          />
        </>
      )}
    </div>
  );
};

export default FlowContextMenu;
