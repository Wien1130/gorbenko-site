import Marquee from "../ui/Marquee";
import { projects } from "../../lib/content";

export default function ClientMarquee() {
  return (
    <section className="border-t border-[var(--border)] py-14">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-8 text-center text-sm text-[var(--muted)]">
          Betriebe in Wien, die mir vertrauen
        </p>
        <Marquee>
          {projects.map((p) => (
            <span
              key={p.slug}
              className="font-display whitespace-nowrap text-xl font-bold tracking-tight text-[var(--foreground)]/40 transition hover:text-[var(--foreground)]/70 sm:text-2xl"
            >
              {p.client}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
