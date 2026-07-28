import Link from "next/link";
import ChatDemo from "./ChatDemo";

export default function HomeHero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pb-12 pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--accent-dim),transparent_60%)]" />
      <div className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent)]/3 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              KI-Automatisierung &amp; Marketing &middot; Wien
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.4rem]">
              Ihr Business,
              <br />
              digital auf{" "}
              <span className="text-[var(--accent)]">Autopilot</span>.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--muted)]">
              Ich baue Websites, KI-Chatbots, Content und Werbung für Wiener
              Betriebe — alles aus einer Hand. Sie kümmern sich um Ihr
              Geschäft, die Technik übernehme ich.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/kontakt"
                className="rounded-full bg-[var(--accent)] px-8 py-4 font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Kostenlose Beratung
              </Link>
              <Link
                href="/projekte"
                className="rounded-full border border-[var(--border)] px-8 py-4 font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Projekte ansehen
              </Link>
            </div>

            <div className="mt-10 flex flex-col gap-2.5 text-sm text-[var(--muted)] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
              <span className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)] pulse-dot" />
                Online oder bei Ihnen im Betrieb in Wien
              </span>
              <span>Unverbindlich</span>
              <span>Antwort in 24 h</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <ChatDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
