"use client";

export type ToastKind = "busy" | "ok" | "err";

/** Короткий статус внизу экрана (над панелью Safari) — чтобы было видно, что нажатие сработало. */
export function toast(kind: ToastKind, text: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("messe-toast", { detail: { kind, text } }));
}
