import Reveal from "../ui/Reveal";
import SectionLabel from "../ui/SectionLabel";

const steps = [
  {
    n: "1",
    title: "Sie erzählen — ich höre zu",
    text: "30 Minuten, online oder direkt bei Ihnen im Betrieb in Wien. Sie erzählen von Ihrem Geschäft, Ihren Kunden und dem, was Zeit frisst.",
  },
  {
    n: "2",
    title: "Sie bekommen einen konkreten Plan",
    text: "Was sich in Ihrem Betrieb automatisieren lässt, was es bringen kann und womit man am besten startet — verständlich erklärt, ohne Fachchinesisch.",
  },
  {
    n: "3",
    title: "Ich setze um — Sie sehen Ergebnisse",
    text: "Website, Assistent oder erste Kampagne: erste Resultate in 2–4 Wochen. Sie sehen jeden Schritt.",
  },
];

export default function ConsultationSteps() {
  return (
    <section className="border-t border-[var(--border)] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionLabel>So starten wir</SectionLabel>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Wie die kostenlose Beratung abläuft
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7">
                <span className="font-display text-4xl font-bold text-[var(--accent)]/30">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-6 py-4 text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>
              Ich komme gerne persönlich in Ihren Betrieb — überall in Wien.
              Kaffee genügt.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
