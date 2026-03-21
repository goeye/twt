import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8")
) as { name: string };

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  base: command === "build" ? `/${packageJson.name}/` : "/"
}));
