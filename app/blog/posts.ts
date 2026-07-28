export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  dateLabel: string;
  tag: string;
  readingMinutes: number;
};

export const posts: Post[] = [
  {
    slug: "was-kostet-ein-ki-chatbot",
    title: "Was kostet ein KI-Chatbot für ein KMU wirklich?",
    description:
      "Pauschalpreise führen in die Irre. Diese Faktoren bestimmen, was ein KI-Assistent wirklich kostet — und wo billige Lösungen teuer werden.",
    date: "2026-07-20",
    dateLabel: "20. Juli 2026",
    tag: "KI-Chatbots",
    readingMinutes: 5,
  },
  {
    slug: "geo-statt-seo",
    title: "GEO statt SEO: Wie Ihr Betrieb von ChatGPT empfohlen wird",
    description:
      "Immer mehr Kunden fragen KI statt Google. Was Generative Engine Optimization ist, was KI-Crawler lesen — und eine Checkliste für Ihren Betrieb.",
    date: "2026-07-24",
    dateLabel: "24. Juli 2026",
    tag: "GEO / AI-Sichtbarkeit",
    readingMinutes: 6,
  },
  {
    slug: "virale-reels-fuer-lokale-betriebe",
    title: "Virale Reels für lokale Betriebe: Learnings aus einer Wiener Messerschmiede",
    description:
      "Funken, Handwerk, echte Geschichten: Was beim Reel-Dreh in einer Messerschmiede funktioniert hat — und was Sie für Ihren Betrieb übernehmen können.",
    date: "2026-07-27",
    dateLabel: "27. Juli 2026",
    tag: "Content & Reels",
    readingMinutes: 5,
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
