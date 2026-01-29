"use client";

import React from "react";
import clsx from "clsx";
import { Plus, ImageIcon, GitBranch, RotateCcw, Flag } from "lucide-react";
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownLabel,
  DropdownDescription,
  DropdownDivider,
} from "@/app/_components/atoms/dropdown";
import type { NodeVariant } from "@/app/_contexts/VisualNovelEditorContext";

// ============================================================================
// Types
// ============================================================================

export interface DropdownVisualNovelNodesProps {
  parentNodeId: string;
  isEndOfPath?: boolean;
  onSelect?: (variant: NodeVariant) => void;
  className?: string;
  size?: "sm" | "md";
}

// ============================================================================
// Node Options Configuration
// ============================================================================

interface NodeOption {
  variant: NodeVariant;
  label: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  showAtEnd?: boolean;
}

const NODE_OPTIONS: NodeOption[] = [
  {
    variant: "scene",
    label: "Scene",
    description: "Add a scene with dialogue and media",
    icon: <ImageIcon className="h-4 w-4" />,
    iconColor: "text-purple-500",
  },
  {
    variant: "branch",
    label: "Branch",
    description: "Add a choice/decision point",
    icon: <GitBranch className="h-4 w-4" />,
    iconColor: "text-green-500",
  },
  {
    variant: "jump",
    label: "Jump",
    description: "Jump to another scene",
    icon: <RotateCcw className="h-4 w-4" />,
    iconColor: "text-blue-500",
    showAtEnd: true,
  },
  {
    variant: "end",
    label: "End",
    description: "End of story path",
    icon: <Flag className="h-4 w-4" />,
    iconColor: "text-red-500",
    showAtEnd: true,
  },
];

// ============================================================================
// Component
// ============================================================================

const DropdownVisualNovelNodes: React.FC<DropdownVisualNovelNodesProps> = ({
  parentNodeId,
  isEndOfPath = true,
  onSelect,
  className,
  size = "md",
}) => {
  const handleSelect = (variant: NodeVariant) => {
    onSelect?.(variant);
  };

  // Filter options based on whether we're at end of path
  const mainOptions = NODE_OPTIONS.filter((opt) => !opt.showAtEnd);
  const endOptions = NODE_OPTIONS.filter((opt) => opt.showAtEnd);

  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-12 w-12",
  };

  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
  };

  return (
    <Dropdown>
      <DropdownButton
        as="div"
        className={clsx(
          "flex cursor-pointer items-center justify-center rounded-full transition-colors",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "focus:ring-primary shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none",
          sizeClasses[size],
          className,
        )}
        aria-label="Add node"
        data-parent-id={parentNodeId}
      >
        <Plus className={iconSizeClasses[size]} />
      </DropdownButton>
      <DropdownMenu anchor="bottom start">
        {/* Main Options (Scene, Branch) */}
        {mainOptions.map((option) => (
          <DropdownItem
            key={option.variant}
            onClick={() => handleSelect(option.variant)}
          >
            <span data-slot="icon" className={option.iconColor}>
              {option.icon}
            </span>
            <DropdownLabel>{option.label}</DropdownLabel>
            <DropdownDescription>{option.description}</DropdownDescription>
          </DropdownItem>
        ))}

        {/* End Options (Jump, End) - only shown at end of path */}
        {isEndOfPath && endOptions.length > 0 && (
          <>
            <DropdownDivider />
            {endOptions.map((option) => (
              <DropdownItem
                key={option.variant}
                onClick={() => handleSelect(option.variant)}
              >
                <span data-slot="icon" className={option.iconColor}>
                  {option.icon}
                </span>
                <DropdownLabel>{option.label}</DropdownLabel>
                <DropdownDescription>{option.description}</DropdownDescription>
              </DropdownItem>
            ))}
          </>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropdownVisualNovelNodes;
