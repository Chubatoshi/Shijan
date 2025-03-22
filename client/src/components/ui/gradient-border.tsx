import { cn } from "@/lib/utils";
import React from "react";

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientBorder({ children, className }: GradientBorderProps) {
  return (
    <div className={cn("relative rounded-lg", className)}>
      <div 
        className="absolute -inset-0.5 bg-gradient-to-r from-accent-purple via-accent-pink to-accent-teal rounded-lg blur-sm opacity-75 animate-pulse-slow" 
        aria-hidden="true"
      />
      <div className="relative bg-background rounded-lg">
        {children}
      </div>
    </div>
  );
}
