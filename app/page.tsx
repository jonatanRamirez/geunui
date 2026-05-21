'use client';

import { useEffect, useState } from 'react';
import { defaultSettings } from '@/lib/settings';
import { WidgetCard } from '@/components/WidgetCard';

export default function Page() {
  const [s] = useState(defaultSettings);

  // ✅ FIXED: add proper typing
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/api/muse', { method: 'POST' })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  // ✅ FIX: protect against null + undefined structure
  const d =
    data?.[0]?.variations?.[0]?.payload?.data || {
      assistant: '',
      widgets: [],
    };

  return (
    <div>
      <h2>McDonalds Assistant</h2>

      {/* ✅ Points display */}
      <div>
        {s.loyaltyPoints} {s.language === 'es' ? 'puntos' : 'points'}
      </div>

      {/* ✅ Assistant response */}
      <p>{d.assistant}</p>

      {/* ✅ Widgets rendering */}
      {d.widgets?.map((w: any, i: number) => (
        <WidgetCard
          key={i}
          widget={w}
          settings={s}
          language={s.language}
        />
      ))}
    </div>
  );
}
