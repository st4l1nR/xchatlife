import clsx from "clsx";
import React, { forwardRef } from "react";

export type SliderProps = {
  className?: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  showValue?: boolean;
  valueLabel?: string;
  minLabel?: string;
  maxLabel?: string;
};

export const Slider = forwardRef(function Slider(
  {
    className,
    min,
    max,
    value,
    onChange,
    step = 1,
    showValue = true,
    valueLabel,
    minLabel,
    maxLabel,
  }: SliderProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={clsx("w-full", className)}>
      {showValue && (
        <div className="mb-4 flex justify-center">
          <span className="border-border bg-muted text-foreground rounded-lg border px-4 py-2 text-sm font-medium">
            {value} {valueLabel}
          </span>
        </div>
      )}

      <div className="flex items-center gap-4">
        {minLabel && (
          <span className="text-muted-foreground text-sm">{minLabel}</span>
        )}

        <div className="relative flex-1">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={clsx(
              "h-2 w-full cursor-pointer appearance-none rounded-full",
              "bg-muted",
              // Track styling
              "[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full",
              "[&::-moz-range-track]:bg-muted [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full",
              // Thumb styling - mt-[-6px] centers the 20px thumb on the 8px track: (20-8)/2 = 6px
              "[&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
              "[&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110",
              // Focus styling
              "focus-visible:ring-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            )}
            style={{
              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, var(--color-muted) ${percentage}%, var(--color-muted) 100%)`,
            }}
          />
        </div>

        {maxLabel && (
          <span className="text-muted-foreground text-sm">{maxLabel}</span>
        )}
      </div>
    </div>
  );
});
