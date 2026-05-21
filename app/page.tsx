
"use client";

import { useEffect, useMemo, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import {
  buildFinalPrompt,
  clearChatId,
  loadChatId,
  loadSettings,
  saveChatId,
} from "@/lib/settings";
import { MuseRequestBody, MuseSettings } from "@/lib/types";
import { t } from "@/lib/i18n";

type MuseResponse = any;

export default function HomePage() {
  const [settings, setSettings] = useState<MuseSettings | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MuseResponse | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const lang = settings?.language ?? "en";

  const finalPrompt = useMemo(() => {
    if (!settings) return "";
    return buildFinalPrompt(prompt, settings);
  }, [prompt, settings]);

  async function send() {
    if (!settings) return;
    setLoading(true);
    setError("");

    const chatId = loadChatId();

    const body: MuseRequestBody = {
      prompt: finalPrompt,
      language: settings.language,
      widgetCount: settings.widgetCount,
      geo: settings.geoEnabled ? settings.geo : undefined,
      apiBaseUrl: settings.apiBaseUrl,
      selectorJson: settings.selectorJson,
      apiKeyOverride: settings.apiKeyOverride || undefined,
      chatId,
    };

    try {
      const res = await fetch("/api/muse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Request failed");

      // Persist chatId for continuity
      const newChatId =
        json?.choices?.[0]?.variations?.[0]?.payload?.data?.chatId;
      if (typeof newChatId === "string" && newChatId.length > 0) {
        saveChatId(newChatId);
      }

      setData(json);
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  function resetConversation() {
    clearChatId();
    setData(null);
  }

  const widgets = data?.choices?.[0]?.variations?.[0]?.payload?.data?.widgets ?? [];
  const assistantText =
    data?.choices?.[0]?.variations?.[0]?.payload?.data?.assistant ?? "";

  return (
    <MobileShell title={t(lang, "home")}>
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-neutral-600">Muse prompt</div>
            <button
              className="text-xs font-semibold text-neutral-700 underline"
              onClick={resetConversation}
              type="button"
            >
              {t(lang, "resetChat")}
            </button>
          </div>

          <textarea
            className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
            rows={3}
            placeholder={t(lang, "promptPlaceholder")}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            className="mt-3 w-full rounded-2xl bg-mcdYellow px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
            onClick={send}
            disabled={loading || !prompt.trim() || !settings}
          >
            {loading ? t(lang, "loading") : t(lang, "send")}
          </button>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          {settings && (
            <details className="mt-3 text-xs text-neutral-600">
              <summary className="cursor-pointer select-none">Request preview</summary>
              <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-neutral-50 p-3 ring-1 ring-black/5">
                {finalPrompt}
              </pre>
            </details>
          )}
        </div>

        {data && (
          <div className="space-y-3">
            {assistantText && (
              <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5">
                <div className="text-xs font-semibold text-neutral-600">Muse</div>
                <p className="mt-1 whitespace-pre-wrap text-sm">{assistantText}</p>
              </div>
            )}

            {widgets.slice(0, settings?.widgetCount ?? 3).map((w: any, idx: number) => (
              <WidgetCard key={idx} widget={w} />
            ))}

            {Array.isArray(data?.warnings) && data.warnings.length > 0 && (
              <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
                <div className="text-xs font-semibold text-amber-900">Warnings</div>
                <pre className="mt-2 text-xs text-amber-900 whitespace-pre-wrap">
                  {JSON.stringify(data.warnings, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </MobileShell>
  );
}

function WidgetCard({ widget }: { widget: any }) {
  const title = widget?.title ?? "Widget";
  const slots = widget?.slots ?? [];

  return (
    <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {slots.slice(0, 6).map((slot: any, i: number) => {
          const p = slot?.productData ?? slot?.product ?? {};
          const name = p?.name || slot?.sku || "Item";
          const img = p?.image_url || p?.imageUrl;
          const url = p?.url;
          const price = p?.price;

          const Card = (
            <div className="rounded-xl border p-2">
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img}
                  alt={name}
                  className="h-28 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-28 w-full items-center justify-center rounded-lg bg-neutral-100 text-[10px] text-neutral-500">
                  No image
                </div>
              )}
              <div className="mt-2 text-xs font-semibold line-clamp-2">{name}</div>
              {price && <div className="text-xs text-neutral-600">{price}</div>}
              {!p?.name && slot?.sku && (
                <div className="text-[10px] text-neutral-500">SKU: {slot.sku}</div>
              )}
            </div>
          );

          return url ? (
            <a key={i} href={url} target="_blank" rel="noreferrer">
              {Card}
            </a>
          ) : (
            <div key={i}>{Card}</div>
          );
        })}
      </div>
    </div>
  );
}
