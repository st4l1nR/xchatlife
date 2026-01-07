import type React from "react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col p-2">
      <div className="lg:ring-border text-foreground flex grow items-center justify-center p-6 lg:rounded-lg lg:p-10 lg:shadow-xs lg:ring-1">
        {children}
      </div>
    </main>
  );
}
