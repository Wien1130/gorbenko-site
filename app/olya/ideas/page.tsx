import { requireOlyaAuth } from "../auth-check";
import OlyaShell from "../OlyaShell";
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
  mid?: string;
  cta?: string;
  shots?: Shot[];
  status: "raw" | "ready" | "done";
}

async function loadIdeas(): Promise<Idea[]> {
  const botUrl = process.env.OLYA_BOT_URL;
  if (botUrl) {
    try {
      const res = await fetch(`${botUrl}/ideas`, { next: { revalidate: 30 } });
      if (res.ok) return await res.json() as Idea[];
    } catch {
      // fallback ниже
    }
  }
  // Локальный файл (резерв)
  try {
    const filePath = path.join(process.cwd(), "private-reports", "olya-ideas.json");
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

export default async function OlyaIdeas() {
  await requireOlyaAuth("/olya/ideas");
  const ideas = await loadIdeas();

  return (
    <OlyaShell>
      <div className="page-label">Банк идей · Telegram-бот</div>
      <h1 className="page-title">Голосовые идеи</h1>
      <p className="page-sub">Оля отправляет голосовые в бот → Whisper транскрибирует → идея попадает сюда</p>

      <div className="callout blue" style={{ marginBottom: 28 }}>
        <strong>Как пользоваться ботом:</strong><br />
        1 · Найди бота в Telegram (ссылка у Андрея)<br />
        2 · Отправь <code>/start nesmotrivglaza</code> чтобы активировать<br />
        3 · Отправляй голосовые — бот расшифрует и вернёт сценарий<br />
        4 · Идея сохраняется в этот список
      </div>

      {ideas.length === 0 ? (
        <div className="callout neutral" style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎙️</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>Идей пока нет</p>
          <p style={{ marginTop: 8 }}>Как только Оля отправит первое голосовое — оно появится здесь.</p>
        </div>
      ) : (
        <>
          <div className="stat-strip" style={{ marginBottom: 28 }}>
            <div className="stat-box">
              <div className="stat-label">Всего идей</div>
              <div className="stat-val">{ideas.length}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Готово к съёмке</div>
              <div className="stat-val">{ideas.filter((i) => i.status === "ready").length}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Снято</div>
              <div className="stat-val">{ideas.filter((i) => i.status === "done").length}</div>
            </div>
          </div>

          {ideas.map((idea) => (
            <div className="script-card" key={idea.id}>
              <div className="script-head">
                <div className="script-num">🎙️</div>
                <div style={{ flex: 1 }}>
                  <div className="script-title">{idea.date}</div>
                </div>
                <span className={`badge ${STATUS_BADGE[idea.status]}`}>
                  {STATUS_LABEL[idea.status]}
                </span>
              </div>
              <div className="script-body">
                <div className="script-row">
                  <div className="script-row-label">Текст</div>
                  <div className="script-row-val">{idea.transcript}</div>
                </div>
                {idea.hook && (
                  <div className="script-row">
                    <div className="script-row-label">ХУК</div>
                    <div className="script-row-val"><em>«{idea.hook}»</em></div>
                  </div>
                )}
                {idea.mid && (
                  <div className="script-row">
                    <div className="script-row-label">СЕРЕДИНА</div>
                    <div className="script-row-val">{idea.mid}</div>
                  </div>
                )}
                {idea.cta && (
                  <div className="script-row">
                    <div className="script-row-label">CTA</div>
                    <div className="script-row-val"><strong>«{idea.cta}»</strong></div>
                  </div>
                )}
                {idea.shots && idea.shots.length > 0 && (
                  <div className="script-row">
                    <div className="script-row-label">Раскадровка</div>
                    <div className="script-row-val">
                      <div className="shots">
                        {idea.shots.map((shot, i) => (
                          <div className="shot" key={i}>
                            <div className="shot-num">{i + 1}</div>
                            <div className="shot-text">
                              <div className="shot-show">{shot.show}</div>
                              {shot.how && <div className="shot-how">🎥 {shot.how}</div>}
                            </div>
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
    </OlyaShell>
  );
}
