
"use client";

import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { defaultSettings, loadSettings, saveSettings } from "@/lib/settings";
import { MuseSettings } from "@/lib/types";
import { t } from "@/lib/i18n";

export default function SettingsPage() {
  const [s, setS] = useState<MuseSettings>(defaultSettings);

  useEffect(() => {
    setS(loadSettings());
  }, []);

  async function captureGeo() {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setS((prev) => ({
          ...prev,
          geoEnabled: true,
          geo: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          },
        }));
      },
      (err) => alert(err.message),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  function save() {
    try {
      JSON.parse(s.selectorJson);
    } catch {
      alert("Selector JSON is invalid. Please fix it before saving.");
      return;
    }
    saveSettings(s);
    alert("Saved");
  }

  const lang = s.language;

  return (
    <MobileShell title={t(lang, "settings")}>
      <div className="space-y-4">
        <Section title={t(lang, "language")}>
          <select className="w-full rounded-xl border px-3 py-2" value={s.language} onChange={(e) => setS({ ...s, language: e.target.value as any })}>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </Section>

        <Section title={t(lang, "loyaltyPoints")}>
          <input type="number" className="w-full rounded-xl border px-3 py-2" value={s.loyaltyPoints} onChange={(e) => setS({ ...s, loyaltyPoints: Number(e.target.value) })} />
        </Section>

        <Section title={t(lang, "widgetCount")}>
          <input type="number" min={1} max={10} className="w-full rounded-xl border px-3 py-2" value={s.widgetCount} onChange={(e) => setS({ ...s, widgetCount: Number(e.target.value) })} />
          <p className="mt-2 text-xs text-neutral-600">This controls how many widgets from the response are displayed.</p>
        </Section>

        <Section title="Context: geo ubicación">
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={s.geoEnabled} onChange={(e) => setS({ ...s, geoEnabled: e.target.checked })} />
              Enabled
            </label>
            <button className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white" onClick={captureGeo} type="button">
              {t(lang, "geoCapture")}
            </button>
          </div>
          {s.geoEnabled && s.geo && (
            <p className="mt-2 text-xs text-neutral-600">lat={s.geo.lat.toFixed(5)} lng={s.geo.lng.toFixed(5)} (±{Math.round(s.geo.accuracy ?? 0)}m)</p>
          )}
        </Section>

        <Section title={t(lang, "promptTemplate")}>
          <textarea className="w-full rounded-xl border px-3 py-2" rows={4} value={s.promptTemplate} onChange={(e) => setS({ ...s, promptTemplate: e.target.value })} />
          <div className="mt-2 flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={s.appendWidgetCount} onChange={(e) => setS({ ...s, appendWidgetCount: e.target.checked })} />
              {t(lang, "appendWidgetCount")}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={s.appendLoyaltyPoints} onChange={(e) => setS({ ...s, appendLoyaltyPoints: e.target.checked })} />
              {t(lang, "appendLoyaltyPoints")}
            </label>
          </div>
        </Section>

        <Section title="Shopping Muse">
          <label className="text-xs text-neutral-600">{t(lang, "apiBaseUrl")}</label>
          <input className="w-full rounded-xl border px-3 py-2" value={s.apiBaseUrl} onChange={(e) => setS({ ...s, apiBaseUrl: e.target.value })} />

          <label className="mt-3 block text-xs text-neutral-600">{t(lang, "selectorJson")}</label>
          <textarea className="w-full rounded-xl border px-3 py-2 font-mono text-xs" rows={6} value={s.selectorJson} onChange={(e) => setS({ ...s, selectorJson: e.target.value })} />
          <p className="mt-2 text-xs text-neutral-600">Provide the exact selector object expected by your account/campaign (JSON).</p>

          <label className="mt-3 block text-xs text-neutral-600">{t(lang, "apiKeyOverride")}</label>
          <input className="w-full rounded-xl border px-3 py-2" value={s.apiKeyOverride ?? ""} onChange={(e) => setS({ ...s, apiKeyOverride: e.target.value })} placeholder="Leave blank in production (use DY_API_KEY on Vercel)" />
          <p className="mt-2 text-xs text-amber-700">Avoid storing real API keys in the browser. Prefer server env vars.</p>
        </Section>

        <button className="w-full rounded-2xl bg-mcdRed px-4 py-3 font-semibold text-white" onClick={save} type="button">
          {t(lang, "save")}
        </button>
      </div>
    </MobileShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5">
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}
