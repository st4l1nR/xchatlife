"use client";

import React, { Component, type ReactNode } from "react";
import { Button } from "../atoms/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// ============================================================================
// Types
// ============================================================================

type FlowErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
};

type FlowErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

// ============================================================================
// Default Fallback Component
// ============================================================================

const DefaultFallback: React.FC<{
  error: Error | null;
  onReset?: () => void;
}> = ({ error, onReset }) => {
  return (
    <div className="border-destructive/20 bg-destructive/5 flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg border p-8">
      <div className="bg-destructive/10 flex size-16 items-center justify-center rounded-full">
        <ExclamationTriangleIcon className="text-destructive size-8" />
      </div>
      <div className="text-center">
        <h3 className="text-foreground text-lg font-semibold">
          Something went wrong
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          An error occurred while rendering the flow canvas.
        </p>
        {error && (
          <details className="mt-4 text-left">
            <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-sm">
              Error details
            </summary>
            <pre className="bg-muted text-foreground mt-2 max-w-md overflow-auto rounded-md p-3 text-xs">
              {error.message}
            </pre>
          </details>
        )}
      </div>
      {onReset && (
        <Button onClick={onReset} color="primary">
          Try again
        </Button>
      )}
    </div>
  );
};

// ============================================================================
// Error Boundary Component
// ============================================================================

class FlowErrorBoundary extends Component<
  FlowErrorBoundaryProps,
  FlowErrorBoundaryState
> {
  constructor(props: FlowErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): FlowErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    console.error("FlowCanvas Error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <DefaultFallback error={this.state.error} onReset={this.handleReset} />
      );
    }

    return this.props.children;
  }
}

export default FlowErrorBoundary;
