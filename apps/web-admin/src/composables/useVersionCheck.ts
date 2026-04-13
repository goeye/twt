import { reactive } from "vue";

declare const __APP_VERSION_HASH__: string;

const POLL_INTERVAL = 5 * 60 * 1000;
const INITIAL_DELAY = 30_000;

interface VersionState {
  hasUpdate: boolean;
  notes: string;
  buildTime: string;
  currentHash: string;
}

const state = reactive<VersionState>({
  hasUpdate: false,
  notes: "",
  buildTime: "",
  currentHash:
    typeof __APP_VERSION_HASH__ !== "undefined" ? __APP_VERSION_HASH__ : "",
});

let started = false;
let timer: ReturnType<typeof setInterval> | null = null;

async function checkVersion(): Promise<void> {
  try {
    const res = await fetch(
      `${import.meta.env.BASE_URL}version.json?t=${Date.now()}`,
      { cache: "no-store" },
    );
    if (!res.ok) return;

    const data = await res.json();
    if (data.hash && data.hash !== state.currentHash) {
      state.hasUpdate = true;
      state.notes = data.notes ?? "";
      state.buildTime = data.buildTime ?? "";
    }
  } catch {
    // 网络错误静默忽略
  }
}

function startPolling(): void {
  if (started || import.meta.env.DEV) return;
  started = true;
  setTimeout(() => {
    checkVersion();
    timer = setInterval(checkVersion, POLL_INTERVAL);
  }, INITIAL_DELAY);
}

export function useVersionCheck() {
  startPolling();

  function doRefresh(): void {
    window.location.href = window.location.href.split('?')[0] + '?_r=' + Date.now();
  }

  function dismissUpdate(): void {
    state.hasUpdate = false;
  }

  return { versionState: state, doRefresh, dismissUpdate };
}
