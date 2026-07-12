export interface ConsultationRequest {
  name: string;
  business: string;
  request: string;
  phone: string;
  email: string;
}

const GITHUB_REPO = process.env.COLD_LEADS_GITHUB_REPO ?? "Wien1130/entrepreneur-os";
const CSV_PATH = "knowledge/consultation_requests.csv";
const CSV_HEADER = "timestamp,name,business,request,phone,email";

function csvEscape(value: string): string {
  const v = (value ?? "").replace(/\r?\n/g, " ").trim();
  return /[",]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** Уведомление в Telegram — тот же бот, которым Андрей пользуется для холодных продаж. */
export async function notifyTelegram(data: ConsultationRequest): Promise<boolean> {
  const token = process.env.TELEGRAM_NOTIFY_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_NOTIFY_CHAT_ID;
  if (!token || !chatId) return false;

  const text =
    `🎁 *Заявка на консультацию с сайта!*\n\n` +
    `👤 Имя: ${data.name}\n` +
    `💼 Бизнес: ${data.business}\n` +
    `🎯 Запрос: ${data.request}\n` +
    `📞 Телефон: ${data.phone}\n` +
    `✉️ Email: ${data.email}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Резервная запись в GitHub CSV — на случай если Telegram недоступен. */
export async function appendConsultationRow(data: ConsultationRequest): Promise<boolean> {
  const token = process.env.COLD_LEADS_GITHUB_TOKEN;
  if (!token) return false;

  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${CSV_PATH}`;
  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  try {
    let existingContent = CSV_HEADER + "\n";
    let sha: string | undefined;

    const getRes = await fetch(url, { headers, cache: "no-store" });
    if (getRes.ok) {
      const json = await getRes.json();
      sha = json.sha;
      existingContent = Buffer.from(json.content, "base64").toString("utf-8");
      if (!existingContent.endsWith("\n")) existingContent += "\n";
    }

    const row = [
      new Date().toISOString(),
      csvEscape(data.name),
      csvEscape(data.business),
      csvEscape(data.request),
      csvEscape(data.phone),
      csvEscape(data.email),
    ].join(",");

    const newContent = existingContent + row + "\n";

    const putRes = await fetch(url, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Заявка на консультацию: ${data.name}`,
        content: Buffer.from(newContent, "utf-8").toString("base64"),
        ...(sha ? { sha } : {}),
      }),
    });
    return putRes.ok;
  } catch {
    return false;
  }
}
