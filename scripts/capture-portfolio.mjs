/**
 * Скриншоты клиентских сайтов для портфолио.
 * Запуск: node scripts/capture-portfolio.mjs
 * Результат: public/portfolio/<slug>/desktop.png + mobile.png
 * (конвертация в webp — отдельно через ffmpeg, см. README внизу файла)
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const targets = [
  { slug: "nagl", url: "https://custom.nagl-messer.at" },
  { slug: "gbike", url: "https://gbikewien.at" },
  { slug: "zum-eisbaeren", url: "https://zum-eisbaeren.at" },
];

const browser = await chromium.launch();

/** Закрыть cookie-баннеры и попапы рассылки перед снимком. */
async function dismissOverlays(page) {
  const clickTargets = [
    'button:has-text("Akzeptieren")',
    'button:has-text("Accept")',
    'button:has-text("Alle akzeptieren")',
    '.shopify-pc__banner__btn-accept',
    'button[name="accept"]',
  ];
  for (const sel of clickTargets) {
    await page
      .locator(sel)
      .first()
      .click({ timeout: 1500 })
      .catch(() => {});
  }
  const closeTargets = [
    '[aria-label="Close"]',
    '[aria-label="Schließen"]',
    '[aria-label="close"]',
    ".modal__close-button",
    'button:has-text("×")',
  ];
  for (const sel of closeTargets) {
    await page
      .locator(sel)
      .first()
      .click({ timeout: 1500 })
      .catch(() => {});
  }
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(800);
}

for (const t of targets) {
  const dir = join(root, "public", "portfolio", t.slug);
  mkdirSync(dir, { recursive: true });

  // Desktop 1440x900
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    locale: "de-AT",
  });
  const dp = await desktop.newPage();
  await dp.goto(t.url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await dp.waitForTimeout(3500);
  await dismissOverlays(dp);
  await dp.screenshot({ path: join(dir, "desktop.png") });
  await desktop.close();
  console.log(`✓ ${t.slug} desktop`);

  // Mobile (iPhone 13)
  const mobile = await browser.newContext({
    ...devices["iPhone 13"],
    locale: "de-AT",
  });
  const mp = await mobile.newPage();
  await mp.goto(t.url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await mp.waitForTimeout(3500);
  await dismissOverlays(mp);
  await mp.screenshot({ path: join(dir, "mobile.png") });
  await mobile.close();
  console.log(`✓ ${t.slug} mobile`);
}

await browser.close();
console.log("Done. Convert to webp:");
console.log(
  'for f in public/portfolio/*/*.png; do ffmpeg -y -i "$f" -quality 82 "${f%.png}.webp"; done'
);
