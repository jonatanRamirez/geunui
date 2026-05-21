
"use client";

export default function WidgetCard({widget,fields}:{widget:any,fields:string[]}){
  const slots=widget?.slots||[];

  return (
    <div className="p-4 bg-white rounded-xl">
      <h3 className="font-semibold mb-2">{widget.title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {slots.map((slot:any,i:number)=>{
          const p=slot.productData||{};
          return (
            <div key={i} className="border p-2 rounded">
              {fields.includes("image_url") && p.image_url && (
                <img src={p.image_url} className="h-24 w-full object-cover rounded" />
              )}

              {fields.includes("name") && <div className="text-sm font-semibold">{p.name}</div>}
              {fields.includes("price") && p.display_price && <div className="text-xs">£{p.display_price}</div>}
              {fields.includes("description") && <div className="text-xs">{p.description}</div>}
              {fields.includes("categories") && <div className="text-xs">{(p.categories||[]).join(', ')}</div>}
              {fields.includes("keywords") && <div className="text-xs italic">{(p.keywords||[]).join(', ')}</div>}
              {fields.includes("nutricion_calorias_kcal") && <div className="text-xs">🍔 {p.nutricion_calorias_kcal}</div>}
              {fields.includes("informacion_alergenos_lista") && <div className="text-xs">⚠️ {p.informacion_alergenos_lista}</div>}
            </div>
          )
        })}
      </div>
    </div>
  );
}
