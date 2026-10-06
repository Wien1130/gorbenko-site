import StreetClient from "./StreetClient";

export default async function StrassePage({
  searchParams,
}: {
  searchParams: Promise<{ l?: string }>;
}) {
  const { l } = await searchParams;
  return <StreetClient lessonId={l} />;
}
