"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function WebGLErrorBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return fallback ? (
    <>
      {children}
      {fallback}
    </>
  ) : (
    children
  );
}

export function WebGLFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    />
  );
}
