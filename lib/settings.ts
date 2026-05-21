"use client";

import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { defaultSettings, loadSettings, saveSettings } from "@/lib/settings";
import { MuseSettings } from "@/lib/types";
import { t } from "@/lib/i18n";
import WidgetConfig from "./widget-config";

export default function SettingsPage() {
  const [s, setS] = useState<MuseSettings & { widgetFields?: string[] }>({
    ...defaultSettings,
    widgetFields: ["name", "image_url", "price"],
  });

  useEffect(() => {
    const loaded = loadSettings() as any;
    setS({
      ...loaded,
      widgetFields: loaded.widgetFields || ["name", "image_url", "price"],
    });
  }, []);

  function save() {
    try {
      JSON.parse(s.selectorJson);
    } catch {
      alert("Selector JSON is invalid");
      return;
    }

    saveSettings(s);
    alert("Saved");
  }

  const lang = s.language;

  return (
    <MobileShell title={t(lang, "settings")}>
      <div className="space-y-4">

        {/* ✅ NEW SECTION: Widget metadata selector */}
        <section className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <h2 className="mb-3 text-sm font-semibold">
            Widget metadata display
          </h2>

          <WidgetConfig
            value={s.widgetFields || []}
            setValue={(v) =>
              setS((prev) => ({
                ...prev,
                widgetFields: v,
              }))
            }
          />

          <p className="mt-2 text-xs text-neutral-500">
            Select which fields from the Shopping Muse response are displayed
            in widgets.
          </p>
        </section>

        {/* Save button */}
        <button
          className="w-full rounded-2xl bg-mcdRed px-4 py-3 font-semibold text-white"
          onClick={save}
        >
          Save
        </button>
      </div>
    </MobileShell>
  );
}
