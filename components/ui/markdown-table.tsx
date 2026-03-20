"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface MarkdownTableColumn {
  header: string;
  accessor: string;
  align?: "left" | "center" | "right";
  width?: string;
}

interface MarkdownTableProps {
  headers: string[];
  rows: string[][];
  columns?: MarkdownTableColumn[];
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  animate?: boolean;
  animationDelay?: number;
  variant?: "default" | "bordered" | "minimal" | "fancy";
}

export function MarkdownTable({
  headers,
  rows,
  columns,
  className,
  striped = true,
  hoverable = true,
  animate = true,
  animationDelay = 30,
  variant = "default",
  ...props
}: MarkdownTableProps) {
  const [mounted, setMounted] = useState(false);
  const [visibleRows, setVisibleRows] = useState<Set<number>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    if (animate && rows.length > 0) {
      const timers: NodeJS.Timeout[] = [];
      rows.forEach((_, index) => {
        const timer = setTimeout(() => {
          setVisibleRows((prev) => new Set([...prev, index]));
        }, index * animationDelay);
        timers.push(timer);
      });
      return () => timers.forEach(clearTimeout);
    } else {
      setVisibleRows(new Set(rows.map((_, i) => i)));
    }
  }, [animate, rows.length, animationDelay]);

  const variantStyles = {
    default: "bg-card border-border rounded-lg overflow-hidden",
    bordered: "border border-border rounded-lg overflow-hidden",
    minimal: "bg-transparent",
    fancy: "glass rounded-xl overflow-hidden shadow-xl",
  };

  const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const getColumnAlign = (index: number) => {
    return columns?.[index]?.align || "left";
  };

  const getColumnWidth = (index: number) => {
    return columns?.[index]?.width;
  };

  if (!mounted) {
    return (
      <div className={cn("border", variantStyles[variant], className)}>
        <div className="animate-pulse">
          <div className="flex border-b border-border bg-muted/50">
            {headers.map((_, i) => (
              <div key={i} className="flex-1 p-3 font-semibold text-sm" />
            ))}
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex border-b border-border/30 p-3">
              {headers.map((_, j) => (
                <div key={j} className="flex-1 h-5 bg-muted/30 rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(variantStyles[variant], className)} {...props}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={cn(
                    "px-4 py-3 font-semibold text-sm text-muted-foreground uppercase tracking-wider",
                    alignStyles[getColumnAlign(index)]
                  )}
                  style={{ width: getColumnWidth(index) }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const isVisible = visibleRows.has(rowIndex);
              const isStriped = striped && rowIndex % 2 === 1;
              const isHovered = hoveredRow === rowIndex;

              return (
                <tr
                  key={rowIndex}
                  onMouseEnter={() => hoverable && setHoveredRow(rowIndex)}
                  onMouseLeave={() => hoverable && setHoveredRow(null)}
                  className={cn(
                    "border-b border-border/30 transition-all duration-200",
                    isStriped && "bg-muted/10",
                    hoverable && "hover:bg-primary/5",
                    isHovered && "bg-primary/5 scale-[1.002]",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                  )}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={cn(
                        "px-4 py-3 text-sm",
                        alignStyles[getColumnAlign(cellIndex)]
                      )}
                    >
                      {cell}
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

export function parseMarkdownTable(markdown: string): { headers: string[]; rows: string[][] } | null {
  const lines = markdown.trim().split("\n");
  if (lines.length < 2) return null;

  const headerLine = lines[0];
  const separatorLine = lines[1];

  const headers = headerLine
    .split("|")
    .filter((cell) => cell.trim())
    .map((cell) => cell.trim());

  const separatorCells = separatorLine.split("|").filter((cell) => cell.trim());
  if (headers.length !== separatorCells.length) return null;

  const rows = lines.slice(2).map((line) =>
    line
      .split("|")
      .filter((cell) => cell.trim())
      .map((cell) => cell.trim())
  );

  return { headers, rows };
}
