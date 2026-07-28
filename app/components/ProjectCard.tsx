import Image from "next/image";
import Link from "next/link";
import type { Project } from "../lib/content";
import TiltGlowCard from "./ui/TiltGlowCard";

/** Card used on homepage (featured) and /projekte overview. */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projekte/${project.slug}`} className="block h-full">
      <TiltGlowCard className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] transition hover:border-[var(--foreground)]/15">
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl border-b border-[var(--border)]">
          {project.screenshots.desktop ? (
            <Image
              src={project.screenshots.desktop}
              alt={`Website von ${project.client}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--accent-dim),transparent_70%)]">
              <span className="font-display px-6 text-center text-2xl font-bold tracking-tight text-[var(--foreground)]/50">
                {project.client}
              </span>
            </div>
          )}
          {project.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-[var(--background)]">
              {project.badge}
            </span>
          )}
        </div>
        <div className="p-6">
          <p className="text-xs text-[var(--muted)]">
            {project.branch} · {project.location}
          </p>
          <h3 className="mt-1.5 text-lg font-semibold">{project.client}</h3>
          <p className="mt-1 text-sm font-medium text-[var(--accent)]">
            {project.headline}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] text-[var(--muted)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </TiltGlowCard>
    </Link>
  );
}
