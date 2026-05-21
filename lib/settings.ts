import { MuseSettings } from "./types";

export const SETTINGS_KEY = "museSettings";
export const CHAT_KEY = "museChatId";

/**
 * Default instruction per your requirement:
 * "use user context to produce widgets, including amount of avaiable loyalty points,
 *  if not point don't suggest any offers"
 */
export const DEFAULT_HOME_INSTRUCTION =
  "use user context to produce widgets, including amount of avaiable loyalty points, if not point don't suggest any offers";

export const defaultSettings: MuseSettings = {
  language: "en",
  loyaltyPoints: 0,
  widgetCount: 2, // ✅ default 2 widgets

  // ✅ default to true so the page-load request attempts geo immediately
  geoEnabled: true,
  geo: undefined,

  // Used as default prompt text when user prompt textbox is empty
  promptTemplate: DEFAULT_HOME_INSTRUCTION,

  appendWidgetCount: true,
  appendLoyaltyPoints: true,

  apiBaseUrl: "https://dy-api.com",
  selectorJson: JSON.stringify({ name: "Shopping Muse" }, null, 2),
  apiKeyOverride: "",
};

export function loadSettings(): MuseSettings {
  if (typeof window === "undefined") return defaultSettings;
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings;
  try {
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(s: MuseSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

/**
 * Constructs the prompt in your required format:
 *   #widgets [default 2] + "widgets" + "user prompt (captured on home)"
 *   [default: use user context..., ...] + loyalty points [default 0]
 *
 * Example:
 *   #2 widgets I want burgers loyalty_points=0
 */
export function buildMusePrompt(userPrompt: string, s: MuseSettings) {
  const widgets = Number.isFinite(s.widgetCount) ? s.widgetCount : 2;
  const lp = Number.isFinite(s.loyaltyPoints) ? s.loyaltyPoints : 0;

  const baseUserPrompt =
    (userPrompt || "").trim() ||
    (s.promptTemplate || "").trim() ||
    DEFAULT_HOME_INSTRUCTION;

  const parts: string[] = [];
  parts.push(`#${widgets} widgets`);
  parts.push(baseUserPrompt);
  parts.push(`loyalty_points=${lp}`);

  return parts.join(" ").trim();
}

export function loadChatId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem(CHAT_KEY) || undefined;
}

export function saveChatId(chatId: string) {
  if (!chatId) return;
  localStorage.setItem(CHAT_KEY, chatId);
}

export function clearChatId() {
  localStorage.removeItem(CHAT_KEY);
}
