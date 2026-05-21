'use client';

import { useEffect, useState } from 'react';
import { defaultSettings } from '@/lib/settings';
import { WidgetCard } from '@/components/WidgetCard';

// ✅ Define type for language
type Language = 'en' | 'es';

// ✅ Define typed settings
type Settings = {
  language: Language;
  loyaltyPoints: number;
  widgetCount: number;
  widgetFieldsProduct: string[];
  widgetFieldsOffer: string[];
};

export default function Page() {
  // ✅ Apply correct type here
  const [s] = useState<Settings>(defaultSettings);

  // ✅ Correct typing to avoid "never"
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/api/muse', { method: 'POST' })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  // ✅ Safe parsing
  const d =
    data?.[0]?.variations?.[0]?.payload?.data || {
      assistant: '',
      widgets: [],
    };

  return (
    <div>
      <h2>McDonalds Assistant</h2>

      {/* ✅ Language-safe usage */}
      <div>
        {s.loyaltyPoints} {s.language === 'es' ? 'puntos' : 'points'}
      </div>

      {/* ✅ Assistant */}
      <p>{d.assistant}</p>

      {/* ✅ Widgets */}
      {d.widgets?.map((w: any, i: number) => (
        <WidgetCard
          key={i}
          widget={w}
          settings={s}
          language={s.language} // ✅ no error anymore
        />
      ))}
    </div>
  );
}
``
