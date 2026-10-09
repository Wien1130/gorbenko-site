import type { Metadata } from "next";
import { fetchPitchBySlug } from "../../lib/crm/db";
import PitchView from "./PitchView";
import { YOUTUBE_URL } from "../../lib/crm/pitch";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pitch = await fetchPitchBySlug(slug).catch(() => null);
  const title = pitch ? `Für ${pitch.business_name} — Andrii Gorbenko` : "Persönliche Seite — Gorbenko";
  return {
    title,
    description: pitch?.content.subline ?? "",
    robots: { index: false, follow: false },
    openGraph: { title, description: pitch?.content.subline ?? "", images: ["/hero-portrait.png"] },
  };
}

export default async function PitchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pitch = /^[a-z0-9]{6,20}$/.test(slug) ? await fetchPitchBySlug(slug).catch(() => null) : null;

  if (!pitch) {
    return (
      <div className="pt-locked">
        <div>
          <p className="pt-kicker">Gorbenko</p>
          <h1 className="pt-serif">Diese Seite gibt es nicht mehr.</h1>
          <p>Bitte öffnen Sie den Link, den Andrii Ihnen geschickt hat — oder schreiben Sie ihm direkt.</p>
        </div>
      </div>
    );
  }

  return (
    <PitchView
      slug={pitch.slug}
      businessName={pitch.business_name}
      contactName={pitch.contact_name}
      focus={pitch.focus}
      content={pitch.content}
      createdAt={pitch.created_at}
      youtubeUrl={YOUTUBE_URL}
    />
  );
}
