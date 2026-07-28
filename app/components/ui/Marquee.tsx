import type { ReactNode } from "react";

/** CSS-only infinite marquee. Children are duplicated for a seamless loop. */
export default function Marquee({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div className="marquee-track flex w-max items-center gap-14 pr-14">
        {children}
        {children}
      </div>
    </div>
  );
}
