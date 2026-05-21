export function WidgetCard({widget,settings,language}){
 return<div>
  {widget.slots?.map((s,i)=>{
   const p=s.productData||{}
   const isOffer=p.asset_type==='offer'
   return<div key={i}>
     {settings.widgetFieldsProduct.includes('image_url')&&p.image_url&&<img src={p.image_url}/>}
     {p.name}
     {!isOffer&&p.display_price}
     {isOffer&&<div>🎁 {p.offer_points} pts</div>}
   </div>
  })}
 </div>
}
