import { requireAndriiAuth } from "../auth-check";
import AndriiShell from "../AndriiShell";

export const metadata = { robots: { index: false, follow: false } };

export default async function AndriiSystem() {
  await requireAndriiAuth("/andrii/system");

  return (
    <AndriiShell>
      <div className="page-label">Конвейер</div>
      <h1 className="page-title">Автопостинг: одно видео → 5 площадок</h1>
      <p className="page-sub">Поэтапно: сначала руками и просто, автоматизация — когда есть что автоматизировать</p>

      <section className="section">
        <h2 className="section-title">🚦 Этапы</h2>
        <div className="card">
          <div className="card-head"><span>Этап 1 · сейчас (неделя 1–2)</span><span className="badge green">активен</span></div>
          <div className="card-body">
            <p><strong>Instagram руками + бесплатные кросспосты.</strong> Публикуем в IG, в настройках включаем
            автошеринг в <strong>Facebook Reels</strong> (галочка «Auf Facebook teilen» — ноль усилий, DACH-аудитория 40+).
            TikTok и Shorts — заливаем те же файлы руками, 5 минут на ролик. Смысл этапа: набрать статистику,
            какие форматы живут на какой площадке, до того как строить автоматику.</p>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><span>Этап 2 · планировщик (неделя 3+)</span><span className="badge amber">дальше</span></div>
          <div className="card-body">
            <p><strong>Один интерфейс на все площадки.</strong> Два кандидата:</p>
            <p><strong>Metricool</strong> (~€20–50/мес) — самый простой: IG + TikTok + Shorts + FB + Pinterest + LinkedIn
            из одного окна, календарь, статистика. Рекомендую начать с него — за вечер настраивается.</p>
            <p><strong>Postiz</strong> (open source) — то же самое, но self-hosted на нашем Railway, бесплатно и своё.
            Ставим, если Metricool понравится как процесс, но захочется убрать подписку.</p>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><span>Этап 3 · свой конвейер (месяц 2–3)</span><span className="badge blue">цель</span></div>
          <div className="card-body">
            <p><strong>Telegram-бот становится пультом.</strong> Кидаешь готовое видео + номер сценария в бота →
            он через API раскладывает по площадкам: <strong>IG Reels</strong> (Meta Graph API — вечный системный токен и
            Instagram Account ID уже лежат в <code>clients/gorbenko-agency/.env</code>, можно включить в любой момент), <strong>YouTube Shorts</strong> (YouTube Data API — просто), <strong>TikTok</strong>
            (Content Posting API требует ревью приложения — либо ждём аппрув, либо оставляем TikTok в Metricool),
            <strong> Facebook</strong> (кросспост из IG автоматом). Заодно бот пишет в банк: ролик N опубликован, дата, ссылки.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">🗺 Приоритет площадок</h2>
        <div className="card">
          <table>
            <thead>
              <tr><th>Площадка</th><th>Приоритет</th><th>Комментарий</th></tr>
            </thead>
            <tbody>
              <tr><td>Instagram Reels</td><td>№1</td><td>ядро: подписчики, био-ссылка на KI-Check, DM-диалоги</td></tr>
              <tr><td>TikTok</td><td>№2</td><td>обязателен для 1M: самый быстрый органический охват DACH, прощает сырость</td></tr>
              <tr><td>YouTube Shorts</td><td>№3</td><td>долгий хвост, поиск, + видео цитируются ИИ (наш GEO-тезис работает на нас)</td></tr>
              <tr><td>Facebook Reels</td><td>№4</td><td>бесплатно галочкой из IG; именно там владельцы бизнеса 45+</td></tr>
              <tr><td>LinkedIn</td><td>№5</td><td>2–3 лучших ролика в неделю + текст тем же смыслом — B2B-канал из плана 90 дней</td></tr>
              <tr><td>Pinterest</td><td>скип</td><td>для говорящих reels в DACH почти мёртв; вернёмся, если пойдут карусели/чек-листы</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">📋 Дисциплина публикации</h2>
        <div className="callout neutral">
          <strong>Каждый ролик:</strong> вертикаль 9:16 · DE-субтитры (первая строка = хук) · описание 1–2 фразы DE
          с вопросом (комментарии!) · масс-ролики в IG публиковать с выключенным «Показать в ленте профиля» — сетка
          остаётся чистой, ролик живёт во вкладке Reels · хиты закреплять вручную. <strong>Ответы на комментарии
          в первый час</strong> — самый дешёвый буст охвата.
        </div>
        <div className="callout amber">
          <strong>Учёт:</strong> после публикации — отметить в банке (пока руками/через бота голосом «ролик 2 снят и
          опубликован»). Раз в неделю смотрим: удержание 3 сек, досматываемость, пересылки по пиларам → корректируем доли.
        </div>
      </section>
    </AndriiShell>
  );
}
