import KartenClient from "./KartenClient";

export default async function KartenPage({
  searchParams,
}: {
  searchParams: Promise<{ l?: string }>;
}) {
  const { l } = await searchParams;
  return <KartenClient lessonId={l} />;
}
