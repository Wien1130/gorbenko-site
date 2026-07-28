import Link from "next/link";
import { services, projects, CONTACT } from "../lib/content";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg font-bold">
              Gorbenko<span className="text-[var(--accent)]">.</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
              KI-Automatisierung, Websites, Content und Werbung für Betriebe in
              Wien — alles aus einer Hand.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={CONTACT.instagramPersonal}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
              <a
                href={CONTACT.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
                </svg>
              </a>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.122 1.528 5.854L0 24l6.335-1.495A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.893 0-3.693-.508-5.27-1.475l-.378-.224-3.916.924.987-3.607-.247-.393A9.715 9.715 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">Leistungen</p>
            <ul className="mt-4 space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/leistungen/${s.slug}`}
                    className="text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Projekte</p>
            <ul className="mt-4 space-y-2.5">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projekte/${p.slug}`}
                    className="text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
                  >
                    {p.client}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Kontakt</p>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
              <li>
                <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="transition hover:text-[var(--accent)]">
                  WhatsApp: {CONTACT.whatsappLabel}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="transition hover:text-[var(--accent)]">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" className="transition hover:text-[var(--accent)]">
                  Telegram: {CONTACT.telegramLabel}
                </a>
              </li>
              <li>Wien, Österreich</li>
            </ul>
            <div className="mt-5 flex gap-4 text-xs text-[var(--muted)]">
              <Link href="/impressum" className="transition hover:text-[var(--accent)]">
                Impressum
              </Link>
              <Link href="/datenschutz" className="transition hover:text-[var(--accent)]">
                Datenschutz
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} Andrii Gorbenko · Made in Wien
        </p>
      </div>
    </footer>
  );
}
