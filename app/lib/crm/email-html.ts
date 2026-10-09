import { PHONE_DISPLAY, SITE } from "./pitch";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Текст → абзацы; голые URL → ссылки. Ссылка на персональную страницу выносится в кнопку. */
function paragraphs(body: string, pitchUrl?: string): string {
  const lines = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return lines
    .map((p) => {
      if (pitchUrl && p.includes(pitchUrl)) {
        // строка с URL страницы — убираем сам URL, кнопка ниже
        const text = p.replace(pitchUrl, "").replace(/\s{2,}/g, " ").trim();
        return text ? `<p style="margin:0 0 14px">${esc(text)}</p>` : "";
      }
      const html = esc(p).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#161412">$1</a>').replace(/\n/g, "<br>");
      return `<p style="margin:0 0 14px">${html}</p>`;
    })
    .join("");
}

/**
 * HTML-версия письма: бумажный стиль как у персональной страницы.
 * Один акцент — кнопка на страницу. Подпись и юридический футер программно.
 */
export function buildEmailHtml(opts: {
  body: string;
  lang: "ru" | "de";
  pitchUrl?: string;
  businessName: string;
}): string {
  const de = opts.lang === "de";
  const btn = de ? "Ihre persönliche Seite öffnen" : "Открыть вашу персональную страницу";
  const kicker = de ? `Persönlich für ${opts.businessName}` : `Лично для ${opts.businessName}`;
  const signName = de ? "Andrii Gorbenko" : "Андрей Горбенко";
  const signRole = de ? "Werbeagentur · Wien" : "Рекламное агентство · Вена";
  const closing = de ? "Mit freundlichen Grüßen" : "С уважением,";
  const footer = de
    ? `Sie erhalten diese E-Mail, weil wir uns persönlich in Ihrem Betrieb unterhalten haben. Kein Newsletter. · <a href="${SITE}/impressum" style="color:#6b6558">Impressum</a> · <a href="${SITE}/datenschutz" style="color:#6b6558">Datenschutz</a>`
    : `Это письмо после нашего личного разговора в вашем заведении. Это не рассылка. · <a href="${SITE}/impressum" style="color:#6b6558">Impressum</a> · <a href="${SITE}/datenschutz" style="color:#6b6558">Datenschutz</a>`;

  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4efe6">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4efe6;padding:28px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#fbf7ef;border:1px solid #d8d0c2">
<tr><td style="padding:26px 30px 0;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#161412">
  <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6b6558;margin-bottom:18px">${esc(kicker)}</div>
  <div style="font-size:16px;line-height:1.6">${paragraphs(opts.body, opts.pitchUrl)}</div>
  ${
    opts.pitchUrl
      ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:6px 0 22px"><tr><td style="background:#161412">
      <a href="${esc(opts.pitchUrl)}" style="display:inline-block;padding:13px 22px;color:#f4efe6;text-decoration:none;font-size:15px;font-weight:600">${esc(btn)} →</a>
      </td></tr></table>
      <div style="font-size:12px;color:#6b6558;margin:-12px 0 22px">${esc(opts.pitchUrl)}</div>`
      : ""
  }
  <div style="font-size:15px;line-height:1.55;margin-top:6px">${esc(closing)}<br><b>${esc(signName)}</b><br><span style="color:#6b6558">${esc(signRole)}</span><br>
    <a href="tel:${PHONE_DISPLAY.replace(/\s/g, "")}" style="color:#161412;text-decoration:none">${esc(PHONE_DISPLAY)}</a><br>
    <a href="${SITE}" style="color:#161412">gorbenko.at</a></div>
</td></tr>
<tr><td style="padding:18px 30px 24px;border-top:1px solid #d8d0c2;margin-top:22px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;color:#6b6558">${footer}</td></tr>
</table>
</td></tr></table></body></html>`;
}
