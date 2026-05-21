export async function POST(){
 return Response.json([{
  variations:[{payload:{data:{assistant:'Hi',widgets:[{title:'Demo',slots:[{productData:{name:'Big Mac',image_url:'',display_price:5,asset_type:'product'}},{productData:{name:'Offer Meal',offer_points:1200,asset_type:'offer'}}]}]}}}]
 }])
}
