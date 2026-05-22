
import { Language } from "./types";

export const strings: Record<Language, Record<string, string>> = {
  en: {
    home: "Home",
    settings: "Settings",
    promptPlaceholder: "Type what you want (e.g., 'I want a quick lunch under £10')",
    send: "Send",
    loading: "Thinking…",
    geoCapture: "Capture location",
    language: "Language",
    loyaltyPoints: "Loyalty points",
    widgetCount: "Widgets to display",
    promptTemplate: "Pre-defined prompt",
    appendWidgetCount: "Append widgets count",
    appendLoyaltyPoints: "Append loyalty points",
    apiBaseUrl: "DY API Base URL",
    selectorJson: "Selector JSON (required)",
    apiKeyOverride: "API key override (dev only)",
    save: "Save",
    resetChat: "Reset conversation",
  },
  es: {
    home: "Inicio",
    settings: "Configuración",
    promptPlaceholder: "Escribe lo que quieres (p.ej. 'quiero un almuerzo rápido por menos de £10')",
    send: "Enviar",
    loading: "Pensando…",
    geoCapture: "Capturar ubicación",
    language: "Idioma",
    loyaltyPoints: "Puntos de lealtad",
    widgetCount: "Widgets a mostrar",
    promptTemplate: "Prompt predefinido",
    appendWidgetCount: "Agregar cantidad de widgets",
    appendLoyaltyPoints: "Agregar puntos de lealtad",
    apiBaseUrl: "Base URL de DY API",
    selectorJson: "JSON del selector (requerido)",
    apiKeyOverride: "Override de API key (solo dev)",
    save: "Guardar",
    resetChat: "Reiniciar conversación",
  },
};

export function t(lang: Language, key: string) {
  return strings[lang][key] ?? key;
}
