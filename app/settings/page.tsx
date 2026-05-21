'use client'
import {useState} from 'react'
import {defaultSettings} from '@/lib/settings'

export default function Page(){
 const[s,setS]=useState(defaultSettings)
 return(<div>
  <h2>Widget fields</h2>
  {['name','image_url','display_price','offer_points','description'].map(f=>(
    <label key={f}><input type='checkbox'
      checked={s.widgetFieldsProduct.includes(f)}
      onChange={()=>{}}
    />{f}</label>
  ))}
 </div>)
}
