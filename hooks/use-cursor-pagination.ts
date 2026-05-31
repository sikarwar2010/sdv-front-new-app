"use client";

import { useCallback, useEffect, useState } from "react";

/** Cursor stack for Convex `.paginate()` — reset when `resetKey` changes. */
export function useCursorPagination(resetKey: string, pageSize: number) {
  const [pageIndex, setPageIndex] = useState(0);
  const [cursors, setCursors] = useState<(string | null)[]>([null]);

  useEffect(() => {
    setPageIndex(0);
    setCursors([null]);
  }, [resetKey, pageSize]);

  const cursor = cursors[pageIndex] ?? null;

  const goNext = useCallback(
    (continueCursor: string | null, isDone: boolean) => {
      if (isDone || continueCursor === null) return;
      setCursors((prev) => {
        const next = [...prev];
        next[pageIndex + 1] = continueCursor;
        return next;
      });
      setPageIndex((i) => i + 1);
    },
    [pageIndex],
  );

  const goPrev = useCallback(() => {
    setPageIndex((i) => Math.max(0, i - 1));
  }, []);

  return {
    pageIndex,
    cursor,
    pageSize,
    canGoPrev: pageIndex > 0,
    goNext,
    goPrev,
    pageNumber: pageIndex + 1,
  };
}
