/**
 * Отправка писем через Gmail API (свой OAuth refresh token, scope gmail.compose —
 * он покрывает и отправку). Тот же клиент/токен, что использовал старый бот для черновиков.
 */

async function gmailAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_GMAIL_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) throw new Error("Gmail OAuth env не заданы");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Gmail token refresh failed: ${res.status}`);
  const json = await res.json();
  return json.access_token as string;
}

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** RFC 2047 кодирование темы (кириллица/умляуты). */
function encodeSubject(subject: string): string {
  return `=?UTF-8?B?${Buffer.from(subject, "utf-8").toString("base64")}?=`;
}

export async function sendGmail(opts: {
  to: string;
  subject: string;
  body: string;
}): Promise<{ id: string }> {
  const token = await gmailAccessToken();

  const mime = [
    `To: ${opts.to}`,
    `Subject: ${encodeSubject(opts.subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(opts.body, "utf-8").toString("base64"),
  ].join("\r\n");

  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: b64url(Buffer.from(mime, "utf-8")) }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Gmail send ${res.status}: ${detail.slice(0, 300)}`);
  }
  const json = await res.json();
  return { id: json.id as string };
}

/** Событие в Google Calendar при подтверждённой встрече (отдельный refresh token со scope calendar.events). */
export async function createCalendarEvent(opts: {
  businessName: string;
  meetingDatetime: string; // строго YYYY-MM-DD HH:MM
  notes?: string;
}): Promise<boolean> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return false;

  const m = opts.meetingDatetime.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})$/);
  if (!m) return false;

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
    if (!tokenRes.ok) return false;
    const { access_token } = await tokenRes.json();

    const start = `${m[1]}T${m[2]}:00`;
    const endHour = String((parseInt(m[2].slice(0, 2), 10) + 1) % 24).padStart(2, "0");
    const end = `${m[1]}T${endHour}${m[2].slice(2)}:00`;

    const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: `Встреча: ${opts.businessName}`,
        description: opts.notes ?? "Из Cold Sales CRM",
        start: { dateTime: start, timeZone: "Europe/Vienna" },
        end: { dateTime: end, timeZone: "Europe/Vienna" },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
