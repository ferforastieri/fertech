"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface ExpandableSectionProps {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ExpandableSection({ 
  title, 
  badge, 
  children, 
  defaultExpanded = false,
  className,
  style
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const [shouldRender, setShouldRender] = React.useState(defaultExpanded);

  React.useEffect(() => {
    if (isExpanded) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  return (
    <div className={cn("border rounded-lg overflow-hidden transition-all duration-700 ease-out hover:border-primary/50 hover:shadow-lg", className)} style={style}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex w-full items-center justify-between px-4 py-3 font-medium text-left transition-all duration-300 hover:no-underline",
          isExpanded && "border-primary/30 shadow-md"
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold transition-all duration-300">{title}</span>
          {badge}
        </div>
        <ChevronDown 
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-300",
            isExpanded && "rotate-180"
          )} 
        />
      </button>
      
      {shouldRender && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-400 ease-out",
            isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-4 pb-2 pt-0">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

