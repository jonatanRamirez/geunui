"use client";

// ✅ Define proper types
type WidgetProps = {
  widget: any;
  settings: any;
  language: "en" | "es";
};

export function WidgetCard({ widget, settings, language }: WidgetProps) {
  if (!widget) return null;

  return (
    <div className="p-4 bg-white rounded">
      <h3>{widget.title}</h3>

      <div className="grid grid-cols-2 gap-2">
        {widget.slots?.map((s: any, i: number) => {
          const p = s.productData || {};
          const isOffer = p.asset_type === "offer";

          return (
            <div key={i} className="border p-2 rounded">

              {/* ✅ IMAGE */}
              {settings.widgetFieldsProduct.includes("image_url") &&
                p.image_url && (
                  <img
                    src={p.image_url}
                    className="w-full h-24 object-cover rounded"
                  />
                )}

              {/* ✅ NAME */}
              <div className="text-sm font-semibold">{p.name}</div>

              {/* ✅ PRODUCT PRICE */}
              {!isOffer &&
                settings.widgetFieldsProduct.includes("display_price") && (
                  <div className="text-xs text-neutral-600">
                    {p.display_price}
                  </div>
                )}

              {/* ✅ OFFER POINTS */}
              {isOffer && (
                <div className="text-green-600 text-xs font-semibold">
                  🎁 {p.offer_points || "—"}{" "}
                  {language === "es" ? "pts" : "pts"}
                </div>
              )}

              {/* ✅ LOCKED STATE */}
              {isOffer && settings.loyaltyPoints <= 0 && (
                <div className="text-red-500 text-xs">
                  {language === "es"
                    ? "No tienes suficientes puntos"
                    : "Not enough points"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
