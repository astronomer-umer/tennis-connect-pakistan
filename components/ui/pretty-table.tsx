"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface PrettyTableColumn<T> {
  key: string;
  header: string;
  width?: string;
  render?: (item: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface PrettyTableProps<T> {
  columns: PrettyTableColumn<T>[];
  data: T[];
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  animate?: boolean;
  animationDelay?: number;
  variant?: "default" | "glass" | "minimal";
  emptyMessage?: string;
  keyExtractor?: (item: T) => string;
}

export function PrettyTable<T>({
  columns,
  data,
  className,
  striped = true,
  hoverable = true,
  animate = true,
  animationDelay = 50,
  variant = "default",
  emptyMessage = "No data available",
  keyExtractor,
}: PrettyTableProps<T>) {
  const [mounted, setMounted] = useState(false);
  const [visibleRows, setVisibleRows] = useState<Set<number>>(new Set());

  useEffect(() => {
    setMounted(true);
    if (animate && data.length > 0) {
      const timers: NodeJS.Timeout[] = [];
      data.forEach((_, index) => {
        const timer = setTimeout(() => {
          setVisibleRows((prev) => new Set([...prev, index]));
        }, index * animationDelay);
        timers.push(timer);
      });
      return () => timers.forEach(clearTimeout);
    } else {
      setVisibleRows(new Set(data.map((_, i) => i)));
    }
  }, [animate, data.length, animationDelay]);

  const variantStyles = {
    default: "bg-card border-border",
    glass: "glass border-white/10",
    minimal: "bg-transparent border-border/50",
  };

  const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  if (!mounted) {
    return (
      <div className={cn("rounded-xl overflow-hidden border", variantStyles[variant], className)}>
        <div className="animate-pulse">
          <div className="h-12 bg-muted" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 border-t border-border/30 bg-muted/30" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("rounded-xl border p-8 text-center", variantStyles[variant], className)}>
        <div className="text-muted-foreground">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl overflow-hidden border", variantStyles[variant], className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 font-semibold text-sm text-muted-foreground uppercase tracking-wider",
                    alignStyles[col.align || "left"]
                  )}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const isVisible = visibleRows.has(index);
              const isStriped = striped && index % 2 === 1;

              return (
                <tr
                  key={keyExtractor ? keyExtractor(item) : index}
                  className={cn(
                    "border-b border-border/30 transition-all duration-300",
                    isStriped && "bg-muted/20",
                    hoverable && "hover:bg-primary/5 hover:scale-[1.005] cursor-pointer",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-4 py-3", alignStyles[col.align || "left"])}
                    >
                      {col.render
                        ? col.render(item, index)
                        : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
