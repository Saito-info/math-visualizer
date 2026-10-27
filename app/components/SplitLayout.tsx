"use client";

import React, { useEffect, useRef, useState } from "react";

export const SplitLayoutContext = React.createContext<{
  leftWidth: number;
  setLeftWidth: (n: number) => void;
} | null>(null);

export const SplitPane = ({ children }: { children: React.ReactNode }) => {
  const items = React.Children.toArray(children);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctx = React.useContext(SplitLayoutContext);
  const [localWidth, setLocalWidth] = useState(400);
  const [leftHeightPct, setLeftHeightPct] = useState(42);
  const leftWidth = ctx?.leftWidth ?? localWidth;
  const setLeftWidth = ctx?.setLeftWidth ?? setLocalWidth;
  const draggingRef = useRef<"h" | "v" | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el || !draggingRef.current) return;
      const rect = el.getBoundingClientRect();
      if (draggingRef.current === "h") {
        const next = e.clientX - rect.left;
        setLeftWidth(Math.round(Math.min(rect.width - 280, Math.max(260, next))));
      } else {
        const pct = ((e.clientY - rect.top) / rect.height) * 100;
        setLeftHeightPct(Math.min(78, Math.max(20, pct)));
      }
    };
    const onUp = () => {
      draggingRef.current = null;
      document.body.classList.remove("split-dragging", "split-dragging-row");
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [setLeftWidth]);

  const startDrag = (axis: "h" | "v") => (e: React.PointerEvent) => {
    e.preventDefault();
    draggingRef.current = axis;
    document.body.classList.add(axis === "h" ? "split-dragging" : "split-dragging-row");
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col md:flex-row w-full h-full min-h-0 animate-fade-in"
      style={{ ["--split-w" as string]: `${leftWidth}px`, ["--split-h" as string]: `${leftHeightPct}%` } as React.CSSProperties}
    >
      <div className="split-left overflow-auto min-h-0 pr-1">{items[0]}</div>
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label="パネルの高さを変更"
        onPointerDown={startDrag("v")}
        className="md:hidden h-2 shrink-0 cursor-row-resize bg-gray-200 hover:bg-blue-400 active:bg-blue-500 transition-colors flex items-center justify-center"
      >
        <span className="w-10 h-1 rounded-full bg-gray-400" />
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="パネルの幅を変更"
        onPointerDown={startDrag("h")}
        className="hidden md:flex w-2 shrink-0 cursor-col-resize bg-gray-200 hover:bg-blue-400 active:bg-blue-500 transition-colors items-center justify-center"
      >
        <span className="h-10 w-1 rounded-full bg-gray-400" />
      </div>
      <div className="flex-1 min-w-0 min-h-0 overflow-auto">{items[1]}</div>
    </div>
  );
};
