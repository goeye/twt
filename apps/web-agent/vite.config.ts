import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8")
) as { name: string };

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  // Keep dev at root, but prefix build assets with the project name.
  base: command === "build" ? `/${packageJson.name}/` : "/"
}));
