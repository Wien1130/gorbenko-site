import { requireAndriiAuth } from "../auth-check";
import AndriiShell from "../AndriiShell";
import { readFile } from "fs/promises";
import path from "path";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

interface Shot {
  show?: string;
  how?: string;
}
interface Idea {
  id: string;
  date: string;
  transcript: string;
  hook?: string;
  hookRu?: string;
  mid?: string;
  midRu?: string;
  cta?: string;
  shots?: Shot[];
  status: "raw" | "ready" | "done";
}

async function loadIdeas(): Promise<Idea[]> {
  const botUrl = process.env.ANDRII_BOT_URL;
  if (botUrl) {
    try {
      const res = await fetch(`${botUrl}/ideas`, { next: { revalidate: 30 } });
      if (res.ok) return await res.json() as Idea[];
    } catch {
      // fallback ниже
    }
  }
  try {
    const filePath = path.join(process.cwd(), "private-reports", "andrii-ideas.json");
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as Idea[];
  } catch {
    return [];
  }
}

const STATUS_LABEL: Record<string, string> = {
  raw: "Транскрипт",
  ready: "Готов к съёмке",
  done: "Снято ✓",
};
const STATUS_BADGE: Record<string, string> = {
  raw: "neutral",
  ready: "amber",
  done: "green",
};

export default async function AndriiIdeas() {
  await requireAndriiAuth("/andrii/ideas");
  const ideas = await loadIdeas();

  return (
    <AndriiShell>
      <div className="page-label">Банк идей · Telegram-бот</div>
      <h1 className="page-title">Голосовые идеи</h1>
      <p className="page-sub">Наговорил идею в бот (можно по-русски) → Whisper расшифровал → Claude вернул сценарий DE+RU → идея здесь</p>

      <div className="callout blue" style={{ marginBottom: 28 }}>
        <strong>Как пользоваться ботом:</strong><br />
        1 · Бот: <a href="https://t.me/dachmillion_bot" style={{ color: "inherit", fontWeight: 700 }}>@dachmillion_bot</a><br />
        2 · Активируй: <code>/start dachmillion</code><br />
        3 · Голосовое или текст на любом языке → бот вернёт сценарий: хук/польза/CTA на немецком с русским переводом + раскадровку<br />
        4 · Идея сохраняется в этот список — бери на съёмку
      </div>

      {ideas.length === 0 ? (
        <div className="callout neutral" style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎙️</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>Идей пока нет</p>
          <p style={{ marginTop: 8 }}>Отправь первое голосовое — оно появится здесь.</p>
        </div>
      ) : (
        <>
          <div className="stat-strip">
            <div className="stat-box">
              <div className="stat-label">Всего идей</div>
              <div className="stat-val">{ideas.length}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Готовы к съёмке</div>
              <div className="stat-val">{ideas.filter((i) => i.status === "ready").length}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Снято</div>
              <div className="stat-val">{ideas.filter((i) => i.status === "done").length}</div>
            </div>
          </div>

          {ideas.map((idea, i) => (
            <div className="script-card" key={idea.id}>
              <div className="script-head">
                <div className="script-num">{ideas.length - i}</div>
                <div style={{ flex: 1 }}>
                  <div className="script-title">{idea.date}</div>
                </div>
                <span className={`badge ${STATUS_BADGE[idea.status] ?? "neutral"}`}>
                  {STATUS_LABEL[idea.status] ?? idea.status}
                </span>
              </div>
              <div className="script-body">
                <div className="script-row">
                  <div className="script-row-label">Идея</div>
                  <div className="script-row-val" style={{ color: "var(--text-3)", fontSize: 13 }}>{idea.transcript}</div>
                </div>
                {idea.hook && (
                  <div className="script-row">
                    <div className="script-row-label">Хук</div>
                    <div className="script-row-val">
                      <div className="de-line">«{idea.hook}»</div>
                      {idea.hookRu && <div className="ru-line">({idea.hookRu})</div>}
                    </div>
                  </div>
                )}
                {idea.mid && (
                  <div className="script-row">
                    <div className="script-row-label">Польза</div>
                    <div className="script-row-val">
                      <div className="de-line" style={{ fontWeight: 500 }}>{idea.mid}</div>
                      {idea.midRu && <div className="ru-line">({idea.midRu})</div>}
                    </div>
                  </div>
                )}
                {idea.cta && (
                  <div className="script-row">
                    <div className="script-row-label">CTA</div>
                    <div className="script-row-val"><strong>{idea.cta}</strong></div>
                  </div>
                )}
                {idea.shots && idea.shots.length > 0 && (
                  <div className="script-row">
                    <div className="script-row-label">🎥 Кадры</div>
                    <div className="script-row-val">
                      <div className="shots" style={{ display: "grid", gap: 8 }}>
                        {idea.shots.map((s, j) => (
                          <div key={j} style={{ fontSize: 13 }}>
                            <span style={{ color: "var(--accent)", fontWeight: 700 }}>{j + 1} · </span>
                            {s.show}
                            {s.how && <span style={{ color: "var(--text-3)" }}> — {s.how}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </AndriiShell>
  );
}
