export type Language = "en" | "es";
export type Geo = { lat: number; lng: number; accuracy?: number };

export type MuseSettings = {
  language: Language;
  loyaltyPoints: number;
  widgetCount: number;

  geoEnabled: boolean;
  geo?: Geo;

  /**
   * Used as the default user prompt when the Home textbox is empty.
   * (Matches your requested default behaviour.)
   */
  promptTemplate: string;

  /**
   * Kept for backwards compatibility with previous settings UI.
   * If false, the value will not be appended in the prompt string.
   */
  appendWidgetCount: boolean;
  appendLoyaltyPoints: boolean;

  apiBaseUrl: string;
  selectorJson: string;

  /** Optional. Avoid in production; prefer DY_API_KEY env var */
  apiKeyOverride?: string;
};

export type MuseRequestBody = {
  prompt: string;
  language: Language;

  widgetCount: number;
  loyaltyPoints: number;

  geo?: Geo;

  apiBaseUrl: string;
  selectorJson: string;
  apiKeyOverride?: string;

  chatId?: string;

  // Page context
  pageType?: string;
  pageLocation?: string;
  pageData?: string[]; // ✅ context.page.data (e.g., [] for HOMEPAGE)
};
