
export type Language = "en" | "es";
export type Geo = { lat: number; lng: number; accuracy?: number };

export type MuseSettings = {
  language: Language;
  loyaltyPoints: number;
  widgetCount: number;
  geoEnabled: boolean;
  geo?: Geo;
  promptTemplate: string;
  appendWidgetCount: boolean;
  appendLoyaltyPoints: boolean;
  apiBaseUrl: string;
  selectorJson: string;
  apiKeyOverride?: string;
};

export type MuseRequestBody = {
  prompt: string;
  language: Language;
  widgetCount: number;
  geo?: Geo;
  apiBaseUrl: string;
  selectorJson: string;
  apiKeyOverride?: string;
  chatId?: string;
};
