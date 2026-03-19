import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

interface VersionPluginOptions {
  /** 更新说明：传入字符串手动指定，或 'git' 自动从最近 commit 读取（默认） */
  notes?: string | "git";
  /** 自动从 git 读取时取最近几条 commit，默认 5 */
  gitLogCount?: number;
}

export function versionPlugin(options: VersionPluginOptions = {}): Plugin {
  const hash = Date.now().toString(16);
  const buildTime = new Date().toISOString();

  let outDir = "dist";

  function resolveNotes(): string {
    if (options.notes && options.notes !== "git") {
      return options.notes;
    }
    try {
      const count = options.gitLogCount ?? 5;
      return execSync(`git log --oneline -${count} --no-decorate`, {
        encoding: "utf-8",
      }).trim();
    } catch {
      return "";
    }
  }

  return {
    name: "twt-version",
    apply: "build",

    config() {
      return {
        define: {
          __APP_VERSION_HASH__: JSON.stringify(hash),
          __APP_BUILD_TIME__: JSON.stringify(buildTime),
        },
      };
    },

    configResolved(config) {
      outDir = config.build.outDir;
    },

    closeBundle() {
      const versionData = {
        hash,
        buildTime,
        notes: resolveNotes(),
      };
      writeFileSync(
        resolve(outDir, "version.json"),
        JSON.stringify(versionData, null, 2),
      );
    },
  };
}
