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

/**
 * Normalises Muse responses so we can render regardless of whether
 * the API returns an array of decisions (common) or another wrapper.
 */
function normaliseMuse(json: any) {
  const decision = Array.isArray(json) ? json[0] : json;

  const variation =
    decision?.variations?.[0] ??
    json?.choices?.[0]?.variations?.[0] ??
    decision?.choices?.[0]?.variations?.[0];

  const payloadData = variation?.payload?.data;

  return {
    assistant: payloadData?.assistant ?? "",
    chatId: payloadData?.chatId ?? "",
    widgets: Array.isArray(payloadData?.widgets) ? payloadData.widgets : [],
  };
}

export default function HomePage() {
  const [settings, setSettings] = useState<MuseSettings | null>(null);

  // The input textbox prompt (user prompt captured on home screen)
  const [userPrompt, setUserPrompt] = useState("");

  // Data returned from Muse
  const [data, setData] = useState<MuseResponse | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Prevent repeated auto-load calls
  const autoLoadedRef = useRef(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const lang = settings?.language ?? "en";

  // Construct the Muse prompt in the required format
  const musePrompt = useMemo(() => {
    if (!settings) return "";
    return buildMusePrompt(userPrompt, settings);
  }, [userPrompt, settings]);

  // Extract assistant + widgets from response
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

      // ✅ default to geo from settings unless override provided
      geo: geoOverride ?? (settings.geoEnabled ? settings.geo : undefined),

      apiBaseUrl: settings.apiBaseUrl,
      selectorJson: settings.selectorJson,
      apiKeyOverride: settings.apiKeyOverride || undefined,

      chatId,

      pageType: "HOMEPAGE",
      pageLocation:
        typeof window !== "undefined" ? window.location.href : undefined,
      pageData: [], // ✅ required: context.page.data:[]
    };

    try {
      const res = await fetch("/api/muse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok)
        throw new Error(json?.error?.message || json?.error || "Request failed");

      // Persist chatId for continuity
      const parsed = normaliseMuse(json);
      if (parsed.chatId) saveChatId(parsed.chatId);

      setData(json);
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Populate home screen with default data on page load, based on GEO context
  useEffect(() => {
    if (!settings) return;
    if (autoLoadedRef.current) return;
    autoLoadedRef.current = true;

    const defaultPrompt = buildMusePrompt("", settings);

    // If geo is disabled by user, fall back to normal default load
    if (!settings.geoEnabled) {
      callMuse(defaultPrompt);
      return;
    }

    // If geo already exists in settings, use it immediately
    if (settings.geo) {
      callMuse(defaultPrompt);
      return;
    }

    // Otherwise, request geo first, then load
    if (!navigator.geolocation) {
      // No geo support; fall back
      callMuse(defaultPrompt);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const geo = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };

        // Persist geo into settings for subsequent calls
        const updated: MuseSettings = { ...settings, geoEnabled: true, geo };
        saveSettings(updated);
        setSettings(updated);

        // Call Muse using geo immediately
        callMuse(defaultPrompt, geo);
      },
      () => {
        // Permission denied / timeout — fall back to non-geo default load
        callMuse(defaultPrompt);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  function resetConversation() {
    clearChatId();
    setData(null);
    setError("");
    // Reload default response again (geo-aware)
    if (settings) {
      const defaultPrompt = buildMusePrompt("", settings);
      callMuse(defaultPrompt);
    }
  }

  return (
    <MobileShell title={t(lang, "home")}>
      <div className="space-y-4">
        {/* 1) Assistant response first */}
        <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-neutral-600">
              McDonald&apos;s Assistant
            </div>
            <button
              className="text-xs font-semibold text-neutral-700 underline"
              onClick={resetConversation}
              type="button"
            >
              {t(lang, "resetChat")}
            </button>
          </div>

          {loading && !assistantText ? (
            <p className="mt-2 text-sm text-neutral-500">Loading…</p>
          ) : assistantText ? (
            <p className="mt-2 whitespace-pre-wrap text-sm">{assistantText}</p>
          ) : (
            <p className="mt-2 text-sm text-neutral-500">
              No assistant response yet.
            </p>
          )}

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        {/* 2) Widgets second */}
        {widgets.length > 0 && (
          <div className="space-y-3">
            {widgets.slice(0, settings?.widgetCount ?? 2).map((w: any, idx: number) => (
              <WidgetCard key={idx} widget={w} />
            ))}
          </div>
        )}

        {/* 3) Prompt input last */}
        <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5">
          <div className="text-xs font-semibold text-neutral-600">New prompt</div>

          <textarea
            className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
            rows={3}
            placeholder={t(lang, "promptPlaceholder")}
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
          />

          <button
            className="mt-3 w-full rounded-2xl bg-mcdYellow px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
            onClick={() => callMuse()}
            disabled={loading || !settings}
          >
            {loading ? t(lang, "loading") : t(lang, "send")}
          </button>

          <details className="mt-3 text-xs text-neutral-600">
            <summary className="cursor-pointer select-none">
              Prompt preview (sent to API)
            </summary>
            <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-neutral-50 p-3 ring-1 ring-black/5">
              {musePrompt}
            </pre>
            <p className="mt-2 text-[11px] text-neutral-500">
              Note: Muse query.text is clamped to 250 chars server-side.
            </p>
          </details>
        </div>
      </div>
    </MobileShell>
  );
}

function WidgetCard({ widget }: { widget: any }) {
  const title = widget?.title ?? "Widget";
  const slots = widget?.slots ?? [];

  return (
