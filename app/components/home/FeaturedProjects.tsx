import Link from "next/link";
import { projects } from "../../lib/content";
import ProjectCard from "../ProjectCard";
import Reveal from "../ui/Reveal";
import SectionLabel from "../ui/SectionLabel";

export default function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured);
  return (
    <section className="border-t border-[var(--border)] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Projekte</SectionLabel>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ausgewählte Projekte
              </h2>
            </div>
            <Link
              href="/projekte"
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Alle Projekte ansehen →
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
