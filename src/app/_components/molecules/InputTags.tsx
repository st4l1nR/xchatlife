"use client";

import React, { useState, useCallback, useMemo } from "react";
import * as Headless from "@headlessui/react";
import clsx from "clsx";
import { X, ChevronDown } from "lucide-react";

export type TagOption = {
  value: string;
  label: string;
};

export type InputTagsProps = {
  className?: string;
  options: TagOption[];
  value: string[];
  onChange: (value: string[]) => void;
  maxItems?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
};

const InputTags: React.FC<InputTagsProps> = ({
  className,
  options,
  value = [],
  onChange,
  maxItems = 3,
  placeholder = "Select options...",
  disabled = false,
  error,
}) => {
  const [query, setQuery] = useState("");

  const availableOptions = useMemo(() => {
    const selectedSet = new Set(value);
    return options.filter((option) => !selectedSet.has(option.value));
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    if (query === "") return availableOptions;
    return availableOptions.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [availableOptions, query]);

  const selectedOptions = useMemo(() => {
    return options.filter((option) => value.includes(option.value));
  }, [options, value]);

  const handleSelect = useCallback(
    (optionValue: string | null) => {
      if (!optionValue || value.length >= maxItems) return;
      onChange([...value, optionValue]);
      setQuery("");
    },
    [onChange, value, maxItems]
  );

  const handleRemove = useCallback(
    (optionValue: string) => {
      onChange(value.filter((v) => v !== optionValue));
    },
    [onChange, value]
  );

  const isMaxReached = value.length >= maxItems;

  return (
    <div data-slot="control" className={clsx("w-full", className)}>
      {/* Combobox Input */}
      <Headless.Combobox
        value={null}
        onChange={handleSelect}
        disabled={disabled || isMaxReached}
      >
        <div className="relative">
          <span
            data-slot="control"
            className={clsx([
              // Basic layout
              "relative block w-full",
              // Background color + shadow applied to inset pseudo element
              "before:bg-background before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-sm",
              // Focus ring
              "sm:focus-within:after:ring-ring after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset sm:focus-within:after:ring-2",
              // Disabled state
              "has-data-disabled:before:bg-muted has-data-disabled:opacity-50 has-data-disabled:before:shadow-none",
              // Error state
              error && "before:shadow-destructive/10",
            ])}
          >
            <Headless.ComboboxInput
              placeholder={
                isMaxReached ? `Maximum ${maxItems} selected` : placeholder
              }
              onChange={(event) => setQuery(event.target.value)}
              displayValue={() => query}
              className={clsx([
                // Basic layout
                "relative block w-full appearance-none rounded-lg py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
                // Horizontal padding
                "pr-[calc(--spacing(10)-1px)] pl-[calc(--spacing(3.5)-1px)] sm:pr-[calc(--spacing(9)-1px)] sm:pl-[calc(--spacing(3)-1px)]",
                // Typography
                "text-foreground placeholder:text-muted-foreground text-base/6 sm:text-sm/6",
                // Border
                error
                  ? "border-destructive"
                  : "border-foreground/20 data-hover:border-foreground/30",
                "border",
                // Background color
                "bg-input",
                // Hide default focus styles
                "focus:outline-hidden",
                // Disabled state
                "data-disabled:border-border data-disabled:bg-muted data-hover:data-disabled:border-border",
              ])}
            />
            <Headless.ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2">
              <ChevronDown
                className={clsx(
                  "size-5 sm:size-4",
                  "text-muted-foreground",
                  disabled && "opacity-50"
                )}
              />
            </Headless.ComboboxButton>
          </span>

          <Headless.ComboboxOptions
            transition
            anchor="bottom"
            className={clsx(
              // Anchor positioning
              "[--anchor-gap:--spacing(2)] [--anchor-padding:--spacing(4)]",
              // Base styles
              "isolate min-w-[calc(var(--input-width)+8px)] scroll-py-1 rounded-xl p-1 select-none empty:invisible",
              // Invisible border for accessibility
              "outline outline-transparent focus:outline-hidden",
              // Handle scrolling
              "max-h-60 overflow-y-auto overscroll-contain",
              // Popover background
              "bg-card/75 backdrop-blur-xl",
              // Shadows
              "ring-border shadow-lg ring-1",
              // Transitions
              "transition-opacity duration-100 ease-in data-closed:data-leave:opacity-0 data-transition:pointer-events-none"
            )}
          >
            {filteredOptions.length === 0 ? (
              <div className="text-muted-foreground px-3 py-2 text-sm">
                No options available
              </div>
            ) : (
              filteredOptions.map((option) => (
                <Headless.ComboboxOption
                  key={option.value}
                  value={option.value}
                  className={clsx(
                    // Basic layout
                    "cursor-default rounded-lg px-3 py-2",
                    // Typography
                    "text-foreground text-base/6 sm:text-sm/6",
                    // Focus
                    "data-focus:bg-primary data-focus:text-primary-foreground outline-hidden",
                    // Disabled
                    "data-disabled:opacity-50"
                  )}
                >
                  {option.label}
                </Headless.ComboboxOption>
              ))
            )}
          </Headless.ComboboxOptions>
        </div>
      </Headless.Combobox>

      {/* Selected Tags */}
      {selectedOptions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className={clsx(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm",
                "bg-primary/10 text-primary",
                disabled && "opacity-50"
              )}
            >
              {option.label}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(option.value)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="size-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default InputTags;
