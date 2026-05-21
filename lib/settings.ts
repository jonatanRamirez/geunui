// ✅ Define Language type centrally
export type Language = "en" | "es";

// ✅ Define Settings type centrally
export type Settings = {
  language: Language;
  loyaltyPoints: number;
  widgetCount: number;
  widgetFieldsProduct: string[];
  widgetFieldsOffer: string[];
};

// ✅ ✅ IMPORTANT: Explicit typing here fixes your error
export const defaultSettings: Settings = {
  language: "en", // ✅ now correctly typed
  loyaltyPoints: 0,
  widgetCount: 2,
  widgetFieldsProduct: ["name", "image_url", "display_price"],
  widgetFieldsOffer: ["name", "image_url", "offer_points"],
};
