const BOT_URL = "https://t.me/andrii_assistant_bot?start=fear";

export default function FearCard({ count, variant }: { count: number; variant: "public" | "private" }) {
  const isPublic = variant === "public";

  return (
    <div className="card fear-card">
      <div className="fear-text">
        <div className="fear-title">😨 {isPublic ? "Иногда страшно — и это нормально" : "Мне страшно — поддержка"}</div>
        <p className="fear-sub">
          {isPublic
            ? "Перед каждым заходом иногда есть сопротивление. Вместо того чтобы отложить — наговариваю боту, что чувствую в теле, и иду. "
            : "Нажми и наговори голосом, что чувствуешь прямо сейчас — где в теле, чего боишься. Никуда, кроме этой CRM, не уйдёт. "}
          Счётчик: <span className="fear-count">{count}</span> {isPublic ? "раз(а) из 100 касаний" : "проработок за кампанию"}.
        </p>
      </div>
      <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="fear-btn">
        {isPublic ? "Тоже попробовать →" : "Открыть в Telegram →"}
      </a>
    </div>
  );
}
