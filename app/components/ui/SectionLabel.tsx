export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
      {children}
    </p>
  );
}
