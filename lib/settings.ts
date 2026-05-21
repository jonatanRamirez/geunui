
import { MuseSettings } from "./types";

export const SETTINGS_KEY = "museSettings";
export const CHAT_KEY = "museChatId";

export const defaultSettings: MuseSettings = {
  language: "en",
  loyaltyPoints: 0,
  widgetCount: 3,
  geoEnabled: false,
  geo: undefined,
  promptTemplate:
    "You are a helpful assistant. Recommend items concisely and ask one short follow-up question if needed.",
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

export function buildFinalPrompt(userPrompt: string, s: MuseSettings) {
  const parts = [s.promptTemplate.trim(), userPrompt.trim()].filter(Boolean);
  const suffix: string[] = [];
  if (s.appendWidgetCount) suffix.push(`widgets_to_display=${s.widgetCount}`);
  if (s.appendLoyaltyPoints) suffix.push(`loyalty_points=${s.loyaltyPoints}`);
  if (s.geoEnabled && s.geo)
    suffix.push(`geo_lat=${s.geo.lat}, geo_lng=${s.geo.lng}`);
  if (suffix.length) parts.push(`Context: ${suffix.join(" | ")}`);
  return parts.join("

").trim();
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
