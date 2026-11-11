/** Языки, для которых есть подпись и HTML. Английский черновик сюда не входит. */
export function canSendLang(lang: string): lang is "ru" | "de" {
  return lang === "ru" || lang === "de";
}
