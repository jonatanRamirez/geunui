"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import {
  buildMusePrompt,
  clearChatId,
  loadChatId,
  loadSettings,
  saveChatId,
  saveSettings,
} from "@/lib/settings";
import { MuseRequestBody, MuseSettings } from "@/lib/types";
import { t } from "@/lib/i18n";

type MuseResponse = any;

function normaliseMuse(json: any) {
  const decision = Array.isArray(json) ? json[0] : json;

  const variation =
    decision?.variations?.[0] ??
    json?.choices?.[0]?.variations?.[0];

  const payloadData = variation?.payload?.data;

  return {
    assistant: payloadData?.assistant ?? "",
    chatId: payloadData?.chatId ?? "",
    widgets: Array.isArray(payloadData?.widgets)
      ? payloadData.widgets
      : [],
  };
}

export default function HomePage() {
  const [settings, setSettings] =
    useState<(MuseSettings & { widgetFields?: string[] }) | null>(null);

  const [userPrompt, setUserPrompt] = useState("");
  const [data, setData] = useState<MuseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const autoLoadedRef = useRef(false);

  useEffect(() => {
    const s = loadSettings() as any;
    setSettings({
      ...s,
      widgetFields: s.widgetFields || ["name", "image_url", "price"],
    });
  }, []);

  const lang = settings?.language ?? "en";

  const musePrompt = useMemo(() => {
    if (!settings) return "";
    return buildMusePrompt(userPrompt, settings);
  }, [userPrompt, settings]);

  const muse = data ? normaliseMuse(data) : null;
  const assistantText = muse?.assistant ?? "";
  const widgets = muse?.widgets ?? [];

  async function callMuse(promptOverride?: string, geoOverride?: any) {
    if (!settings) return;

    setLoading(true);
    setError("");

    const chatId = loadChatId();
    const finalPrompt = promptOverride ?? musePrompt;

    const body: MuseRequestBody = {
      prompt: finalPrompt,
      language: settings.language,

      widgetCount: settings.widgetCount,
      loyaltyPoints: settings.loyaltyPoints,
      geo: geoOverride ?? settings.geo,

      apiBaseUrl: settings.apiBaseUrl,
      selectorJson: settings.selectorJson,
      apiKeyOverride: settings.apiKeyOverride || undefined,

      chatId,
      pageType: "HOMEPAGE",
      pageLocation: window.location.href,
      pageData: [],
    };

    try {
      const res = await fetch("/api/muse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) throw new Error("Request failed");

      const parsed = normaliseMuse(json);
      if (parsed.chatId) saveChatId(parsed.chatId);

      setData(json);
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  // ✅ GEO-based initial load
  useEffect(() => {
    if (!settings) return;
    if (autoLoadedRef.current) return;
    autoLoadedRef.current = true;

    const defaultPrompt = buildMusePrompt("", settings);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const geo = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        const updated = { ...settings, geo };
        saveSettings(updated);

        callMuse(defaultPrompt, geo);
      },
      () => callMuse(defaultPrompt),
      { timeout: 8000 }
    );
  }, [settings]);

  function resetConversation() {
    clearChatId();
    setData(null);
    if (settings) {
      callMuse(buildMusePrompt("", settings));
    }
  }

  return (
    <MobileShell title={t(lang, "home")}>
      <div className="space-y-4">

        {/* Assistant */}
        <div className="p-4 bg-white rounded">
          <div className="flex justify-between">
            <div>McDonald's Assistant</div>
            <button onClick={resetConversation}>Reset</button>
          </div>

          {assistantText && <p>{assistantText}</p>}
        </div>

        {/* Widgets */}
        {widgets.map((w: any, i: number) => (
          <WidgetCard
            key={i}
            widget={w}
            fields={settings?.widgetFields || []}
          />
        ))}

        {/* Prompt */}
        <div className="p-4 bg-white rounded">
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
          />
          <button onClick={() => callMuse()}>
            Send
          </button>
        </div>
      </div>
    </MobileShell>
  );
}

function WidgetCard({
  widget,
  fields,
}: {
  widget: any;
  fields: string[];
}) {
  return (
    <div className="p-4 bg-white rounded">
      <h3>{widget.title}</h3>

      <div className="grid grid-cols-2 gap-2">
        {widget.slots?.map((slot: any, i: number) => {
          const p = slot.productData || {};

          return (
            <div key={i}>
              {fields.includes("image_url") && p.image_url && (
                <img src={p.image_url} />
              )}

              {fields.includes("name") && <div>{p.name}</div>}

              {fields.includes("price") && <div>{p.display_price}</div>}

              {fields.includes("description") && (
                <div>{p.description}</div>
              )}

              {fields.includes("categories") && (
                <div>{p.categories?.join(", ")}</div>
              )}

              {fields.includes("keywords") && (
                <div>{p.keywords?.join(", ")}</div>
              )}

              {fields.includes("nutricion_calorias_kcal") && (
                <div>{p.nutricion_calorias_kcal}</div>
              )}

              {fields.includes("informacion_alergenos_lista") && (
                <div>{p.informacion_alergenos_lista}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
``
