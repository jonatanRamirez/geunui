"use client";

type Props = {
  widget: any;
  settings: any;
};

export function WidgetCard({ widget, settings }: Props) {
  if (!widget) return null;

  return (
    <div style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}>
      <h3>{widget.title}</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {widget.slots?.map((s: any, i: number) => {
          const p = s.productData || {};
          const isOffer = p.asset_type === "offer";

          return (
            <div key={i} style={{ border: "1px solid #ccc", padding: 8 }}>

              {/* IMAGE */}
              {p.image_url && (
                <img
                  src={p.image_url}
                  style={{ width: "100%", height: 120, objectFit: "cover" }}
                />
              )}

              {/* NAME */}
              <div style={{ fontWeight: "bold" }}>{p.name}</div>

              {/* PRODUCT PRICE */}
              {!isOffer && <div>{p.display_price}</div>}

              {/* ✅ OFFER POINTS */}
              {isOffer && (
                <div style={{ color: "green" }}>
                  🎁 {p.offer_points || "-"} pts
                </div>
              )}

              {/* ✅ LOCKED */}
              {isOffer && settings.loyaltyPoints <= 0 && (
                <div style={{ color: "red" }}>
                  Not enough points
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
