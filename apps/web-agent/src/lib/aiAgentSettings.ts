export const AI_AGENT_SETTINGS_STORAGE_KEY = "twt:ai-agent-settings";
export const DEFAULT_AI_AGENT_NAME = "AI Agent";

export interface StoredAiAgentSettings {
  agentEnabled?: boolean;
  agentResponseMode?: string;
  visitorAudience?: string;
  showMessageAgentLabel?: boolean;
  botAvatarUrl?: string;
  botName?: string;
  botIntro?: string;
  selectedTone?: string;
  defaultLanguage?: string;
  visitorInactiveMinutes?: number;
  visitorInactiveHours?: number;
  inactiveTimeValue?: number;
  inactiveTimeUnit?: string;
  idleHours?: number;
  idleMinutes?: number;
  idleSeconds?: number;
  followUpEnabled?: boolean;
  followUpMessage?: string;
  replyMode?: string;
  offlineMessage?: string;
  transferEnabled?: boolean;
  transferMessage?: string;
  unsupportedQuestionMessage?: string;
}

export interface AiAgentProfile {
  name: string;
  avatarUrl: string;
  avatarText: string;
  avatarColor: string;
}

export const loadStoredAiAgentSettings = (): StoredAiAgentSettings => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(AI_AGENT_SETTINGS_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    return JSON.parse(raw) as StoredAiAgentSettings;
  } catch {
    return {};
  }
};

export const persistStoredAiAgentSettings = (settings: StoredAiAgentSettings) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AI_AGENT_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

export const getAiAgentAvatarText = (name: string) => {
  const plainName = name.trim();
  if (!plainName) {
    return "A";
  }

  return plainName[0] ?? "A";
};

export const getAiAgentAvatarGradient = (seed: string) => {
  const palette = [
    ["#2F6BFF", "#69A1FF"],
    ["#00B578", "#00C2B8"],
    ["#7C3AED", "#A78BFA"],
    ["#F97316", "#FB923C"]
  ];

  const score = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const [start, end] = palette[score % palette.length];
  return `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
};

export const resolveAiAgentProfile = (settings: StoredAiAgentSettings = loadStoredAiAgentSettings()): AiAgentProfile => {
  const name = settings.botName?.trim() || DEFAULT_AI_AGENT_NAME;

  return {
    name,
    avatarUrl: settings.botAvatarUrl ?? "",
    avatarText: getAiAgentAvatarText(name),
    avatarColor: getAiAgentAvatarGradient(name)
  };
};
