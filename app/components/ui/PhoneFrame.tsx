import type { ReactNode } from "react";

export default function PhoneFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[300px] overflow-hidden rounded-[2.4rem] border-[6px] border-[#1c1c24] bg-[var(--card)] shadow-2xl shadow-black/50 ${className}`}
    >
      <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[#1c1c24]" />
      <div className="relative min-h-[420px] pt-9">{children}</div>
    </div>
  );
}
