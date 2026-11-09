/**
 * Скриншоты клиентских сайтов для портфолио.
 * Запуск: node scripts/capture-portfolio.mjs
 * Результат: public/portfolio/<slug>/<name>.png
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const targets = [
  { slug: "nagl", name: "desktop", url: "https://custom.nagl-messer.at", viewport: "desktop" },
  { slug: "nagl", name: "mobile", url: "https://custom.nagl-messer.at", viewport: "mobile" },
  { slug: "nagl", name: "shop", url: "https://custom.nagl-messer.at/messer/", viewport: "desktop" },
  { slug: "nagl-service", name: "desktop", url: "https://service.nagl-messer.at", viewport: "desktop" },
  { slug: "nagl-service", name: "mobile", url: "https://service.nagl-messer.at", viewport: "mobile" },
  { slug: "nagl-service", name: "gastro", url: "https://service.nagl-messer.at/gastro/", viewport: "desktop" },
  { slug: "gbike", name: "desktop", url: "https://gbikewien.at", viewport: "desktop" },
  { slug: "gbike", name: "mobile", url: "https://gbikewien.at", viewport: "mobile" },
  { slug: "zum-eisbaeren", name: "desktop", url: "https://zum-eisbaeren.at", viewport: "desktop" },
  { slug: "zum-eisbaeren", name: "mobile", url: "https://zum-eisbaeren.at", viewport: "mobile" },
];

const browser = await chromium.launch();

async function dismissOverlays(page) {
  const clickTargets = [
    'button:has-text("Akzeptieren")',
    'button:has-text("Alle akzeptieren")',
    'button:has-text("Accept")',
    'button:has-text("Zustimmen")',
    'button:has-text("Einverstanden")',
    ".shopify-pc__banner__btn-accept",
    'button[name="accept"]',
  ];
  for (const sel of clickTargets) {
    await page.locator(sel).first().click({ timeout: 1500 }).catch(() => {});
  }
  const closeTargets = [
    '[aria-label="Close"]',
    '[aria-label="Schließen"]',
    '[aria-label="close"]',
    ".modal__close-button",
    'button:has-text("×")',
  ];
  for (const sel of closeTargets) {
    await page.locator(sel).first().click({ timeout: 1500 }).catch(() => {});
  }
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(600);
}

for (const t of targets) {
  const dir = join(root, "public", "portfolio", t.slug);
  mkdirSync(dir, { recursive: true });

  const context =
    t.viewport === "mobile"
      ? await browser.newContext({ ...devices["iPhone 13"], locale: "de-AT" })
      : await browser.newContext({
          viewport: { width: 1440, height: 900 },
          deviceScaleFactor: 2,
          locale: "de-AT",
        });
  const page = await context.newPage();
  await page.goto(t.url, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(4000);
  await dismissOverlays(page);
  await page.screenshot({ path: join(dir, `${t.name}.png`) });
  await context.close();
  console.log(`✓ ${t.slug}/${t.name}`);
}

await browser.close();
console.log("Done.");
