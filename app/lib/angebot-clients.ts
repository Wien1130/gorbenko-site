import { HOMAYUNI_PACKAGES, type PricingPackage } from "./pricing";

export type AngebotClient = {
  slug: string;
  clientName: string;
  eyebrow: string;
  title: string;
  introDe: string;
  defaultPresetId: string;
  packages: PricingPackage[];
  notes: { de: string }[];
  formBusiness: string;
};

export const ANGEBOT_CLIENTS: AngebotClient[] = [
  {
    slug: "homayuni",
    clientName: "Praxis Dr. Reza Homayuni",
    eyebrow: "Angebot · 3 Monate · Wien",
    title: "Welches Tempo passt zur Praxis?",
    introDe:
      "Drei fixe Pakete — günstiger als die Summe der Bausteine. Unten können Sie Bausteine an- und abhaken; daraus wird Individuell. Werbebudget läuft über Ihr Konto und steht nie in unserer Summe. Ich verspreche keine Patientenzahl — ich verspreche eine messbare Spur und jede Woche Zahlen.",
    defaultPresetId: "wachstum",
    packages: HOMAYUNI_PACKAGES,
    notes: [
      {
        de: "Start: Domain 20–40 €/Jahr · SMS-Welle Kunden-Rückholung ca. 50–150 € an den Anbieter.",
      },
      {
        de: "Wachstum: dazu Google Ads mind. 800 €/Monat auf Ihr Werbekonto. Darunter wird die Suche nicht ernst.",
      },
      {
        de: "System: Google mind. 800 € + Meta mind. 500 € = ab 1.300 €/Monat auf Ihre Konten. Besser 1.500–2.000 €, wenn Implantate das Ziel sind.",
      },
      {
        de: "Keine Behandlungspreise öffentlich (WR-ÖZÄK). Patienten-Videos nur mit Einwilligung.",
      },
    ],
    formBusiness: "Praxis Dr. Homayuni",
  },
];

export function getAngebotClient(slug: string): AngebotClient | undefined {
  return ANGEBOT_CLIENTS.find((c) => c.slug === slug);
}

export function angebotSlugs(): string[] {
  return ANGEBOT_CLIENTS.map((c) => c.slug);
}
