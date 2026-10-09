export const EMAIL_SIGNATURE_RU = "\n\nС уважением,\nАндрей Горбенко\n+43 676 59 202 59\nhttps://gorbenko.at";
export const EMAIL_SIGNATURE_DE = "\n\nMit freundlichen Grüßen\nAndrii Gorbenko\n+43 676 59 202 59\nhttps://gorbenko.at";

export function withSignature(body: string, lang: "ru" | "de"): string {
  return body.trimEnd() + (lang === "de" ? EMAIL_SIGNATURE_DE : EMAIL_SIGNATURE_RU);
}
