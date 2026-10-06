import FAQ from "../ui/FAQ";
import Reveal from "../ui/Reveal";

const faqs = [
  {
    q: "Was kostet das?",
    a: "Alle Einstiegspreise stehen offen auf der Preisseite: Marketing-Strategie ab 890 €, KI-Assistent ab 2.000 €, Landingpage ab 2.500 €, Reels ab 1.500 €/Monat, Werbung ab 600 € Setup. Den Fixpreis für Ihren Betrieb bekommen Sie schriftlich nach der kostenlosen Beratung.",
  },
  {
    q: "Für wen arbeiten Sie?",
    a: "Für kleine und mittlere Betriebe in Wien und Umgebung: Handwerk, Gastronomie, Handel, Dienstleistung. Vom Ein-Personen-Betrieb bis zum Familienunternehmen mit Team.",
  },
  {
    q: "Muss ich technisch fit sein?",
    a: "Nein. Ich baue alles auf, erkläre es verständlich und bringe Ihnen bei Bedarf bei, es selbst zu bedienen — ohne Fachchinesisch.",
  },
  {
    q: "Wie schnell sehe ich Ergebnisse?",
    a: "Erste Ergebnisse — eine fertige Website, ein laufender KI-Assistent oder die erste Kampagne — sehen Sie in der Regel innerhalb von 2 bis 4 Wochen.",
  },
  {
    q: "Was passiert in der kostenlosen Beratung?",
    a: "30 Minuten, online oder bei Ihnen im Betrieb in Wien: Sie erzählen von Ihrem Geschäft, ich zeige Ihnen konkret, was sich automatisieren lässt und was es bringen kann. Ohne Verpflichtung.",
  },
];

export default function HomeFaq() {
  return (
    <section className="border-t border-[var(--border)] py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <FAQ items={faqs} />
        </Reveal>
      </div>
    </section>
  );
}
