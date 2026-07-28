import ScoreGauge from "./ui/ScoreGauge";
import scores from "../lib/lighthouse-scores.json";

type Score = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  date: string;
  url: string;
};

const labels: [keyof Omit<Score, "date" | "url">, string][] = [
  ["performance", "Performance"],
  ["accessibility", "Barrierefreiheit"],
  ["bestPractices", "Best Practices"],
  ["seo", "SEO"],
];

/** Real Lighthouse scores for a measured site. Renders nothing if not measured yet. */
export default function LighthouseRow({ slug, title }: { slug: string; title?: string }) {
  const s = (scores as Record<string, Score>)[slug];
  if (!s) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
      {title && <p className="mb-6 text-center font-semibold">{title}</p>}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {labels.map(([key, label]) => (
          <ScoreGauge key={key} score={s[key]} label={label} />
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-[var(--muted)]">
        Gemessen mit Google Lighthouse am {s.date} — {s.url}
      </p>
    </div>
  );
}
