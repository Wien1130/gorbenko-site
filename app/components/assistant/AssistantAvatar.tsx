"use client";

export type AvatarState = "idle" | "thinking" | "speaking" | "listening";

export default function AssistantAvatar({
  state = "idle",
  size = 40,
}: {
  state?: AvatarState;
  size?: number;
}) {
  const ring =
    state === "thinking"
      ? "animate-pulse border-[var(--accent)]"
      : state === "speaking"
        ? "border-[var(--accent)] shadow-[0_0_0_3px_var(--accent-dim)]"
        : state === "listening"
          ? "border-emerald-400"
          : "border-[var(--accent)]/30";

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full border-2 bg-[var(--accent)]/10 ${ring}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 48 48"
        fill="none"
        className="text-[var(--accent)]"
      >
        {/* Head silhouette */}
        <ellipse cx="24" cy="18" rx="11" ry="12" fill="currentColor" opacity="0.9" />
        {/* Shoulders hint */}
        <path
          d="M8 42 C10 30 18 26 24 26 C30 26 38 30 40 42"
          fill="currentColor"
          opacity="0.55"
        />
        {state === "speaking" && (
          <>
            <circle cx="24" cy="18" r="14" stroke="currentColor" strokeWidth="1" opacity="0.35">
              <animate attributeName="r" values="12;16;12" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </svg>
      <span
        className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--card)] ${
          state === "listening" ? "bg-emerald-400" : "bg-emerald-400"
        }`}
      />
    </div>
  );
}
