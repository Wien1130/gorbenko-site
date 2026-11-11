"use client";

import { useEffect } from "react";

const STUDIO_VARS: Record<string, string> = {
  "--background": "#f3f0e9",
  "--foreground": "#20211f",
  "--accent": "#81502f",
  "--accent-dim": "rgba(129, 80, 47, 0.1)",
  "--muted": "#66645e",
  "--card": "#fffdf8",
  "--border": "#c7c0b5",
};

export default function StudioTheme({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previous = Object.keys(STUDIO_VARS).map((key) => [
      key,
      root.style.getPropertyValue(key),
    ]);
    const previousBody = body.style.background;
    for (const [key, value] of Object.entries(STUDIO_VARS)) {
      root.style.setProperty(key, value);
    }
    body.style.background = "#f3f0e9";
    return () => {
      for (const [key, value] of previous) {
        if (value) root.style.setProperty(key, value);
        else root.style.removeProperty(key);
      }
      body.style.background = previousBody;
    };
  }, []);

  return children;
}
