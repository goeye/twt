import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve(process.cwd(), "dist");
const distIndex = resolve(distDir, "index.html");

if (!existsSync(distIndex)) {
  throw new Error(`Missing build output: ${distIndex}`);
}

const staticRoutes = ["/links", "/email-previews/autopilot-launch"];

// Detail page slugs (keep in sync with mock/resources.ts)
const detailSlugs = [
  "cliproxy",
  "swiftproxy",
  "ipwo",
  "ipipgo",
  "smartproxy",
  "proxy-quick",
  "thordata",
  "sx-org",
  "b2proxy",
  "kookeey",
  "luminati",
  "hubstudio",
  "adspower",
  "vmlogin",
  "tiktok-shop",
  "qbit",
  "payoneer",
  "vmcard",
  "inboxkitten",
  "tempmail",
  "ame123",
  "marketing-tools",
];

for (const route of staticRoutes) {
  const routePath = route.replace(/^\/+|\/+$/g, "");
  if (!routePath) continue;
  const routeDir = resolve(distDir, routePath);
  mkdirSync(routeDir, { recursive: true });
  copyFileSync(distIndex, resolve(routeDir, "index.html"));
}

for (const slug of detailSlugs) {
  const slugDir = resolve(distDir, "links", slug);
  mkdirSync(slugDir, { recursive: true });
  copyFileSync(distIndex, resolve(slugDir, "index.html"));
}

// Also generate numeric ID fallbacks (1.html through 30.html)
for (let i = 1; i <= 30; i++) {
  const idDir = resolve(distDir, "links", `${i}.html`);
  mkdirSync(idDir, { recursive: true });
  copyFileSync(distIndex, resolve(idDir, "index.html"));
}

console.log(
  `Generated history fallback pages: ${staticRoutes.length} static + ${detailSlugs.length} slugs + 30 id pages`
);
