"use client";

import React, { useState, useMemo } from "react";
import clsx from "clsx";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogTitle,
  DialogActions,
} from "../atoms/dialog";
import { Button } from "../atoms/button";
import { Input, InputGroup } from "../atoms/input";

type DialogCreateCharacterKinksProps = {
  open: boolean;
  onClose: () => void;
  value: string[];
  onChange: (value: string[]) => void;
  kinksList: readonly string[];
  containerRef?: React.RefObject<HTMLElement | null>;
};

const INITIAL_SHOW_COUNT = 15;
const MAX_KINKS = 3;

const DialogCreateCharacterKinks: React.FC<DialogCreateCharacterKinksProps> = ({
  open,
  onClose,
  value,
  onChange,
  kinksList,
  containerRef,
}) => {
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Sync local state with prop when dialog opens
  React.useEffect(() => {
    if (open) {
      setLocalValue(value);
      setSearchQuery("");
      setShowAll(false);
    }
  }, [open, value]);

  const filteredKinks = useMemo(() => {
    if (!searchQuery) return kinksList;
    return kinksList.filter((kink) =>
      kink.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, kinksList]);

  const visibleKinks = showAll
    ? filteredKinks
    : filteredKinks.slice(0, INITIAL_SHOW_COUNT);

  const handleToggleKink = (kink: string) => {
    if (localValue.includes(kink)) {
      setLocalValue(localValue.filter((k) => k !== kink));
    } else if (localValue.length < MAX_KINKS) {
      setLocalValue([...localValue, kink]);
    }
  };

  const handleRemoveKink = (kink: string) => {
    setLocalValue(localValue.filter((k) => k !== kink));
  };

  const handleSave = () => {
    onChange(localValue);
    onClose();
  };

  const handleCancel = () => {
    setLocalValue(value);
    onClose();
  };

  // Prevent closing on backdrop click
  const handleClose = () => {
    // Do nothing - only buttons can close
  };

  return (
    <Dialog open={open} onClose={handleClose} size="4xl" containerRef={containerRef}>
      <DialogTitle className="text-center text-xl! sm:text-2xl!">Edit Kinks</DialogTitle>

      <DialogBody>
        {/* Search Input */}
        <div className="mb-4">
          <InputGroup>
            <Search data-slot="icon" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </div>

        {/* Selected Kinks Tags */}
        {localValue.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {localValue.map((kink) => (
              <span
                key={kink}
                className="bg-muted text-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
              >
                {kink}
                <button
                  type="button"
                  onClick={() => handleRemoveKink(kink)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Kinks Grid */}
        <div className="flex flex-wrap gap-3">
          {visibleKinks.map((kink) => {
            const isSelected = localValue.includes(kink);
            const isDisabled = !isSelected && localValue.length >= MAX_KINKS;

            return (
              <button
                key={kink}
                type="button"
                onClick={() => handleToggleKink(kink)}
                disabled={isDisabled}
                className={clsx(
                  "rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted text-foreground hover:border-muted-foreground",
                  isDisabled && "cursor-not-allowed opacity-50",
                )}
              >
                {kink}
              </button>
            );
          })}
        </div>

        {/* Show All/Less Toggle */}
        {filteredKinks.length > INITIAL_SHOW_COUNT && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="bg-muted text-muted-foreground hover:bg-muted/80 mt-4 w-full rounded-xl py-3 text-sm font-medium transition-colors"
          >
            {showAll ? "Show less" : "Show all"}
          </button>
        )}

        {/* No Results */}
        {filteredKinks.length === 0 && (
          <p className="text-muted-foreground py-8 text-center">
            No kinks found matching &quot;{searchQuery}&quot;
          </p>
        )}
      </DialogBody>

      <DialogActions>
        <Button plain onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogCreateCharacterKinks;
