import Counter from "../ui/Counter";
import Reveal from "../ui/Reveal";

const stats = [
  { value: 5, suffix: "+", label: "laufende Kundenprojekte in Wien" },
  { value: 24, suffix: "/7", label: "KI-Assistenten im Einsatz" },
  { value: 3, label: "Werbeplattformen: Meta, Google, TikTok" },
  { value: 15, suffix: "+", label: "Jahre eigene Unternehmer-Erfahrung" },
];

export default function StatsRow() {
  return (
    <section className="border-t border-[var(--border)] py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-[var(--accent)] sm:text-5xl">
                  <Counter value={s.value} suffix={s.suffix ?? ""} />
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
