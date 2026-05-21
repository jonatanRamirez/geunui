export type Language = "en" | "es";

export type Settings = {
  language: Language;
  loyaltyPoints: number;
  widgetCount: number;
  widgetFieldsProduct: string[];
  widgetFieldsOffer: string[];
};

export const defaultSettings: Settings = {
  language: "en",
  loyaltyPoints: 0,
  widgetCount: 2,
  widgetFieldsProduct: ["name", "image_url", "display_price"],
  widgetFieldsOffer: ["name", "image_url", "offer_points"],
};
