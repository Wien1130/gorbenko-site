import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import CTASection from "../../components/ui/CTASection";
import Link from "next/link";

export default function ArtikelLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />
      <article className="relative overflow-hidden pb-20 pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,var(--accent-dim),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-6">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Alle Artikel
          </Link>
          {children}
        </div>
      </article>
      <CTASection />
      <SiteFooter />
    </main>
  );
}
