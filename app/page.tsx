'use client';

import { useEffect, useState } from 'react';
import { defaultSettings, Settings } from '@/lib/settings';
import { WidgetCard } from '@/components/WidgetCard';
import { MobileShell } from '@/components/MobileShell';

export default function Page() {
  const [s] = useState<Settings>(defaultSettings);

  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/api/muse', { method: 'POST' })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  // ✅ SAFE parsing
  const d =
    data?.[0]?.variations?.[0]?.payload?.data || {
      assistant: '',
      widgets: [],
    };

  return (
    <MobileShell
      title="McDonald's Assistant"
      loyaltyPoints={s.loyaltyPoints}
      language={s.language}
    >
      {/* ✅ Assistant */}
      <p>{d.assistant}</p>

      {/* ✅ Widgets */}
      {d.widgets?.map((w: any, i: number) => (
        <WidgetCard
          key={i}
          widget={w}
          settings={s}
        />
      ))}
    </MobileShell>
  );
}
