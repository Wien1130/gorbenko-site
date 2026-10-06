import HomeworkClient from "./HomeworkClient";

export default async function HausaufgabePage({
  searchParams,
}: {
  searchParams: Promise<{ l?: string }>;
}) {
  const { l } = await searchParams;
  return <HomeworkClient lessonId={l} />;
}
