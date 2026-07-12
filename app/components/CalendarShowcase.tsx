export default function CalendarShowcase({ confirmedCount }: { confirmedCount: number }) {
  return (
    <div className="card calendar-showcase">
      <div className="card-title">📅 Google Calendar — само, без единого клика</div>
      <p className="calendar-showcase-sub">
        Как только в переписке с ботом появляется точная дата и время встречи —
        событие само создаётся в моём личном Google Calendar. Я просто говорю боту
        "договорились на вторник в 14:00" — дальше он берёт это на себя: парсит дату,
        создаёт событие на час, ничего вручную открывать не нужно.
      </p>
      <div className="calendar-showcase-stat">
        <span className="calendar-showcase-num">{confirmedCount}</span>
        <span>{confirmedCount === 1 ? "встреча" : "встреч(и)"} уже так создано автоматически за кампанию — смотри строки со стадией «встреча (подтв.)» в таблице выше.</span>
      </div>
    </div>
  );
}
