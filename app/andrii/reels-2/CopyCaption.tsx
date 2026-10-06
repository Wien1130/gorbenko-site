"use client";
import { useState } from "react";

export default function CopyCaption({ text, label = "Скопировать" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  }

  return (
    <button type="button" onClick={copy} className={`copy-btn${done ? " done" : ""}`}>
      {done ? "✓ Скопировано" : label}
    </button>
  );
}
