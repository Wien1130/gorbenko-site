import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { cronWouldSend, parseSendAt } from "./vienna.ts";
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
