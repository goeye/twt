import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve(process.cwd(), "dist");
const distIndex = resolve(distDir, "index.html");

if (!existsSync(distIndex)) {
  throw new Error(`Missing build output: ${distIndex}`);
}

// Keep this list aligned with apps/web-agent/src/router.ts static paths.
const staticRoutes = [
  "/home",
  "/conversation",
  "/files",
  "/visitors",
  "/customer",
  "/campaign",
  "/report",
  "/ai-agent",
  "/settings"
];

for (const route of staticRoutes) {
  const routePath = route.replace(/^\/+|\/+$/g, "");
  if (!routePath) continue;

  const routeDir = resolve(distDir, routePath);
  mkdirSync(routeDir, { recursive: true });
  copyFileSync(distIndex, resolve(routeDir, "index.html"));
}

console.log(`Generated history fallback pages: ${staticRoutes.length}`);
