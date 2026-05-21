
"use client";
import { AVAILABLE_FIELDS } from "@/lib/widgetConfig";

export default function WidgetConfig({value,setValue}:{value:string[],setValue:(v:string[])=>void}){
  function toggle(field:string){
    if(value.includes(field)) setValue(value.filter(f=>f!==field));
    else setValue([...value,field]);
  }

  return (
    <div className="space-y-2 text-sm">
      {AVAILABLE_FIELDS.map(f=> (
        <label key={f.name} className="flex items-center gap-2">
          <input type="checkbox" checked={value.includes(f.name)} onChange={()=>toggle(f.name)}/>
          {f.label}
        </label>
      ))}
    </div>
  );
}
