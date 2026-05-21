// ✅ Define language type
export type Language = "en" | "es";

// ✅ Define text structure
export const TEXT = {
  en: {
    points: "points",
    send: "Send",
  },
  es: {
    points: "puntos",
    send: "Enviar",
  },
} as const;

// ✅ Key type derived automatically
type TextKey = keyof typeof TEXT.en;

// ✅ Properly typed function
