import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { cronWouldSend, parseSendAt } from "./vienna.ts";
import { canSendLang } from "./mail-lang.ts";
import { boothsOf, exhibitorsForTab, isBoothQuery, matchBooth, readSpoken, withSpoken } from "./messe/filter.ts";
import { messeLetterSystem } from "./messe/letters-prompt.ts";

const root = new URL("./messe/", import.meta.url);

test("Вена: ноябрь CET и июль CEST, не фиксированный +01", () => {
  const winter = parseSendAt("2026-11-09");
  const summer = parseSendAt("2026-07-09");
  assert.ok(winter && summer);
  assert.equal(winter.toISOString(), "2026-11-09T08:00:00.000Z");
  assert.equal(summer.toISOString(), "2026-07-09T07:00:00.000Z");
});

test("cron не берёт needs_review и пустую дату", () => {
  const now = new Date("2026-11-09T08:00:00.000Z");
  assert.equal(cronWouldSend("needs_review", null, now), false);
  assert.equal(cronWouldSend("scheduled", null, now), false);
  assert.equal(cronWouldSend("sending", new Date("2026-11-09T07:00:00.000Z"), now), false);
  assert.equal(cronWouldSend("sent", new Date("2026-11-09T07:00:00.000Z"), now), false);
  assert.equal(cronWouldSend("scheduled", new Date("2026-11-09T08:00:00.000Z"), now), true);
  assert.equal(cronWouldSend("scheduled", new Date("2026-11-09T09:00:00.000Z"), now), false);
});

test("каталоги выставок не смешиваются", () => {
  const blick = JSON.parse(fs.readFileSync(new URL("blickfang-2026.json", root), "utf8"));
  const erste = JSON.parse(fs.readFileSync(new URL("erste-wohnmesse-2026.json", root), "utf8"));
  assert.equal(blick.event, "blickfang-2026");
  assert.equal(blick.rows.length, 156);
  assert.equal(blick.route1.length, 28);
  assert.equal(blick.rows.filter((r: { site_priority?: string }) => ["A", "B", "U"].includes(r.site_priority || "")).length, 80);
  assert.equal(blick.rows.filter((r: { imprint_name?: string }) => r.imprint_name).length, 37);
  assert.equal(erste.event, "erste-wohnmesse-2026");
  assert.equal(erste.rows.length, 48);
  assert.equal(erste.venue, "Erste Campus");
  assert.equal(erste.address, "Am Belvedere 1, 1100 Wien");
  assert.equal(erste.rows.filter((r: { fetch_status?: string }) => r.fetch_status === "partial").length, 16);
  assert.equal(erste.rows.filter((r: { verified?: boolean }) => r.verified).length, 0);
  assert.equal(JSON.stringify(erste).includes("MAK"), false);
  const floors = new Set(erste.rows.map((r: { floor: string }) => r.floor));
  assert.equal(floors.has("EG") || floors.has("OG"), false);
  const ids = new Set(erste.rows.map((r: { id: string }) => r.id));
  assert.equal(ids.size, 48);
  const tabs = erste.tabs.map((t: { id: string }) => t.id);
  assert.deepEqual(tabs, ["first", "video", "pages", "three", "all"]);
  assert.equal(tabs.includes("vienna"), false);
});

test("черновик Erste не говорит, что разговор был в MAK", () => {
  const system = messeLetterSystem({
    fairTitle: "Erste Wohnmesse 2026",
    venue: "Erste Campus",
    booth: "EH04",
    exhibitor: "Tom Krauss Immobilien",
    city: "",
    offer: "Видео одного объекта",
    openingDe: "",
    contactName: "",
    talk: "",
    secondDate: "2026-11-09",
    secondWeekdayDe: "am Montag",
    talkDateLabel: "Sonntag, 08.11.2026",
  });
  assert.match(system, /Erste Wohnmesse 2026/);
  assert.match(system, /Erste Campus/);
  assert.match(system, /Sonntag, 08\.11\.2026/);
  assert.equal(system.includes("im MAK"), false);
  assert.equal(system.includes("auf der BLICKFANG"), false);
  assert.match(system, /само не отправляется|не обещай день/i);
});

test("Enlit не смешивается с BLICKFANG и Erste", () => {
  const blick = JSON.parse(fs.readFileSync(new URL("blickfang-2026.json", root), "utf8"));
  const erste = JSON.parse(fs.readFileSync(new URL("erste-wohnmesse-2026.json", root), "utf8"));
  const enlit = JSON.parse(fs.readFileSync(new URL("enlit-europe-2026.json", root), "utf8"));
  assert.equal(blick.rows.length, 156);
  assert.equal(erste.rows.length, 48);
  assert.equal(enlit.event, "enlit-europe-2026");
  assert.equal(enlit.rows.length, 39);
  assert.equal(enlit.rows.filter((r: { tier?: string }) => r.tier === "shortlist").length, 15);
  assert.equal(enlit.rows.filter((r: { tier?: string }) => r.tier === "reviewed").length, 24);
  assert.equal(enlit.venue.includes("VIECON"), true);
  assert.equal(enlit.address.includes("Messeplatz 1"), true);
  assert.equal(JSON.stringify(enlit).includes("MAK"), false);
  assert.equal(JSON.stringify(enlit).includes("Mittwoch"), false);
  assert.equal(enlit.talkDateLabel, undefined);
  assert.equal(enlit.rows.some((r: { city?: string }) => r.city === "München"), false);
  const ids = enlit.rows.map((r: { id: string }) => r.id);
  assert.equal(new Set(ids).size, 39);
  const a40 = enlit.rows.filter((r: { booth: string }) => r.booth === "A.a40");
  assert.equal(a40.length, 8);
  const a40short = a40.filter((r: { tier?: string }) => r.tier === "shortlist");
  assert.deepEqual(a40short.map((r: { id: string }) => r.id).sort(), [
    "enlit26-alitiq-gmbh",
    "enlit26-bayern-international",
    "enlit26-fa-battery-engineering",
  ]);
  const jooby = enlit.rows.find((r: { id: string }) => r.id === "enlit26-jooby");
  const aug = enlit.rows.find((r: { id: string }) => r.id === "enlit26-augmenterra-gmbh");
  assert.equal(jooby.booth, "B.l90");
  assert.equal(aug.booth, "C.g10-P11");
  assert.equal(JSON.stringify(enlit).includes("B.190"), false);
  const ru = enlit.rows.filter((r: { language_group?: string }) => r.language_group === "RU-public").map((r: { id: string }) => r.id);
  assert.deepEqual(ru.sort(), ["enlit26-add-grup", "enlit26-jooby"]);
  const unknown = enlit.rows.filter((r: { language_group?: string }) => r.language_group === "unknown");
  assert.equal(unknown.filter((r: { tier?: string }) => r.tier === "shortlist").length, 1);
  assert.equal(unknown.find((r: { tier?: string }) => r.tier === "shortlist").id, "enlit26-nik-central-europe");
  assert.equal(enlit.rows.filter((r: { tier?: string; language_group?: string }) => r.tier === "reviewed" && r.language_group === "RU-public").length, 0);
  const ordered = enlit.route.map((id: string) => enlit.rows.find((r: { id: string }) => r.id === id));
  assert.deepEqual(exhibitorsForTab("ru", ordered, enlit.rows, enlit.route1, true).map((r: { id: string }) => r.id), ru.sort()[0] === "enlit26-add-grup" ? ["enlit26-jooby", "enlit26-add-grup"] : ru);
  assert.equal(exhibitorsForTab("de", ordered, enlit.rows, enlit.route1, true).some((r: { language_group?: string }) => r.language_group !== "DE-market"), false);
  assert.equal(exhibitorsForTab("de", ordered, enlit.rows, enlit.route1, true).some((r: { id: string }) => r.id === "enlit26-nik-central-europe"), false);
  assert.equal(exhibitorsForTab("three", ordered, enlit.rows, enlit.route1, true).every((r: { services: string[] }) => r.services.includes("3D")), true);
  assert.equal(exhibitorsForTab("no-such-tab", ordered, enlit.rows, enlit.route1, true).length, 0);
  assert.equal(exhibitorsForTab("all", ordered, enlit.rows, enlit.route1, true).length, 15);
  assert.equal(matchBooth("B.l90", "B.l90"), true);
  assert.equal(matchBooth("B.190", "B.l90"), false);
  assert.equal(matchBooth("l90", "B.l90"), true);
  assert.equal(matchBooth("C.g10-P11", "C.g10-P11"), true);
  assert.equal(matchBooth("g10-P11", "C.g10-P11"), true);
  assert.equal(matchBooth("18", "018"), true);
  assert.equal(matchBooth("18", "118"), false);
  assert.equal(isBoothQuery("B.l90"), true);
  assert.equal(isBoothQuery("C.g10-P11"), true);
  const hits = enlit.rows.filter((r: { booth: string; booths?: string[] }) => boothsOf(r).some((b: string) => matchBooth("A.a40", b)));
  assert.equal(hits.length, 8);
  assert.equal(new Set(hits.map((r: { id: string }) => r.id)).size, 8);
  assert.equal(withSpoken("факт", "de"), "Язык разговора: DE\nфакт");
  assert.equal(readSpoken(withSpoken("факт", "ru")), "ru");
  assert.equal(canSendLang("de"), true);
  assert.equal(canSendLang("ru"), true);
  assert.equal(canSendLang("en"), false);
});

test("черновик Enlit берёт фактическую дату и не шлёт английский", () => {
  const base = {
    fairTitle: "Enlit Europe 2026",
    venue: "VIECON – Vienna Congress & Convention Center",
    booth: "B.l90",
    exhibitor: "Jooby",
    city: "",
    offer: "Ролик одного устройства",
    openingDe: "",
    contactName: "",
    talk: "",
    secondDate: "2026-11-16",
    secondWeekdayDe: "am Montag",
    talkDateLabel: "Donnerstag, 12.11.2026",
  };
  const de = messeLetterSystem(base);
  assert.match(de, /Donnerstag, 12\.11\.2026/);
  assert.match(de, /VIECON/);
  assert.equal(de.includes("Mittwoch"), false);
  assert.equal(de.includes("im MAK"), false);
  assert.match(de, /само не отправляется/);
  const en = messeLetterSystem({ ...base, lang: "en" });
  assert.match(en, /will not send/i);
  assert.match(en, /will not be sent automatically/i);
  assert.match(en, /Donnerstag, 12\.11\.2026/);
  const ru = messeLetterSystem({ ...base, lang: "ru" });
  assert.match(ru, /ПО-РУССКИ/);
  assert.match(ru, /само не отправляется/);
  assert.match(ru, /не доказательство/);
  const page = fs.readFileSync(new URL("../../../crm/messe/page.tsx", root), "utf8");
  assert.match(page, /key=\{fair\.event\}/);
  assert.match(page, /WHERE event = \$\{fair\.event\}/);
  const send = fs.readFileSync(new URL("../send-email.ts", root), "utf8");
  assert.match(send, /lang IN \('ru', 'de'\)/);
});
