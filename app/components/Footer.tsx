export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="font-display text-sm font-bold">
              <span className="text-[var(--accent)]">G</span>orbenko
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              KI-Automatisierung f&uuml;r Wiener Unternehmen
            </p>
          </div>
          <p className="text-xs text-[var(--muted)]">
            &copy; {new Date().getFullYear()} Gorbenko Marketing &amp; Traffic.
            Wien, &Ouml;sterreich.
          </p>
        </div>
      </div>
    </footer>
  );
}
