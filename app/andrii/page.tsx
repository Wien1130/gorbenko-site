import { requireAndriiAuth } from "./auth-check";
import AndriiShell from "./AndriiShell";
import Link from "next/link";

export const metadata = { robots: { index: false, follow: false } };

export default async function AndriiOverview() {
  await requireAndriiAuth("/andrii");

  return (
    <AndriiShell>
      <div className="page-label">Обзор проекта</div>
      <h1 className="page-title">DACH Million — reels на немецком</h1>
      <p className="page-sub">Старт: 27.07.2026 · 3 reels в день · Вена как декорация · немецкий подтягиваем в процессе</p>

      <div className="stat-strip">
        <div className="stat-box">
          <div className="stat-label">Цель 1 · спринт</div>
          <div className="stat-val">10 000</div>
          <div className="stat-note">подписчиков · 3–5 мес</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Цель 2 · марафон</div>
          <div className="stat-val">1 000 000</div>
          <div className="stat-note">DACH · 24–36 мес</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Темп</div>
          <div className="stat-val">3 / день</div>
          <div className="stat-note">≈ 90 reels в месяц</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Бизнес-цель</div>
          <div className="stat-val">Inbound</div>
          <div className="stat-note">лиды на KI-Check €490+</div>
        </div>
      </div>

      <div className="callout purple">
        <strong>Аккаунт:</strong> Instagram <strong>@ki.mit.andrii</strong> (бывш. kiagenten_fur_unternehmen_wien, переименован 27.07) ·
        API-доступ для автопостинга уже есть: системный токен Meta в <code>clients/gorbenko-agency/.env</code>.
      </div>

      <div className="callout green">
        <strong>Сегодня, 27.07:</strong> снять первые 3 ролика — №1 «Ausländer-манифест» +
        №2 «Live-Check: Café Wien» + №31 «Blick auf Wien» (со ступенек) → <Link href="/andrii/reels" style={{ color: "inherit", fontWeight: 700 }}>Банк reels</Link>.
        Плюс один раз снять 3 CTA-блока — они клеятся в монтаже. «Brief vom Amt» — завтра первым.
      </div>

      <section className="section">
        <h2 className="section-title">🎯 Зачем этот Instagram</h2>
        <div className="card">
          <div className="card-body">
            <p><strong>Двухслойная модель.</strong> Виральный слой (70%) — «KI löst das»: простые немецкие ролики,
            как ИИ решает бытовые и бизнес-задачи за минуты. Это широкая аудитория всего DACH — путь к большим цифрам.</p>
            <p><strong>Монетизационный слой (30%)</strong> — Live-Check, маркетинг, продажи, сайты: контент, который
            приводит владельцев бизнеса на KI-Sichtbarkeits-Check и услуги агентства (план «90 дней → €25k»).</p>
            <p><strong>Лайфстайл-нить</strong> через всё: я строю бизнес в Вене, хожу к клиентам ногами, красивые венские
            фоны — лицо и история, за которыми возвращаются.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">🧱 Формула каждого ролика</h2>
        <div className="grid-3">
          <div className="card"><div className="card-head">Хук · 0–3 сек</div><div className="card-body">
            Боль / шок / интрига на немецком. Без приветствий и представлений — это убивает виральность.
          </div></div>
          <div className="card"><div className="card-head">Польза · 20–30 сек</div><div className="card-body">
            ОДНА мысль на ролик. Механика, а не вдохновение: показать, как именно решается задача.
          </div></div>
          <div className="card"><div className="card-head">CTA · 5 сек</div><div className="card-body">
            Готовый блок (A/B/C), снят один раз, клеится в монтаже. Представление себя — только здесь.
          </div></div>
        </div>
        <div className="callout neutral" style={{ marginTop: 14 }}>
          Главная метрика виральности — <strong>пересылки</strong>. Тест каждой темы: «перешлёт ли житель Вены этот
          ролик другу со словами „смотри, как просто“?» Вертикаль 9:16 · субтитры DE обязательно (первая строка = хук).
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">📅 Ежедневный ритм</h2>
        <div className="card">
          <div className="card-body">
            <p><strong>1 ·</strong> Открыть «Банк reels» → взять верхние 3 несснятых сценария (рубрики чередуются автоматически).</p>
            <p><strong>2 ·</strong> Прогнать немецкий текст вслух 2–3 раза (перевод в скобках — понять, а не зазубрить). Говорить своими словами по опорным фразам.</p>
            <p><strong>3 ·</strong> Снять батчем: все 3 ролика за одну сессию 60–90 мин, по локациям. B-roll — в конце сессии.</p>
            <p><strong>4 ·</strong> Идеи в течение дня — наговаривать в Telegram-бот (можно по-русски, он вернёт сценарий DE+RU) → вкладка «Идеи».</p>
            <p><strong>5 ·</strong> Публикация: пока вручную IG (+автокросспост в Facebook), дальше — конвейер из вкладки «Автопостинг».</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">🇩🇪 Немецкий — фича, а не баг</h2>
        <div className="callout blue">
          Неидеальный немецкий с акцентом — <strong>часть позиционирования</strong>: «Ausländer строит бизнес в Вене на вашем
          языке» — самоирония с заряженным словом, которую нельзя обернуть против нас (мы говорим это про себя).
          В Вене ~40% жителей с миграционным бэкграундом — они узнают в этом себя. DACH-аудитория прощает акцент и любит усилие. Каждый ролик = урок немецкого для тебя: 3 ролика в день ≈
          90 отрепетированных живых фраз в месяц. Ошибку в кадре не переснимаем — исправился и пошёл дальше, это добавляет
          человечности и удержания.
        </div>
      </section>
    </AndriiShell>
  );
}
