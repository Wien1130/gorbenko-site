"use client";

import { useCallback, useEffect, useState } from "react";

/** Аналог useCanvasState из Cursor-канвы, но для обычного браузера — хранит в localStorage. */
export function usePersistedState(key: string, initialValue: string): [string, (v: string) => void] {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) setValue(stored);
    } catch {
      // localStorage недоступен (приватный режим и т.п.) — просто остаёмся на дефолте
    }
  }, [key]);

  const update = useCallback(
    (v: string) => {
      setValue(v);
      try {
        window.localStorage.setItem(key, v);
      } catch {
        // ignore
      }
    },
    [key],
  );

  return [value, update];
}
