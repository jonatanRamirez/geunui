'use client'
import {useEffect,useState} from 'react'
import {defaultSettings} from '@/lib/settings'
import {WidgetCard} from '@/components/WidgetCard'

export default function Page(){
 const[s]=useState(defaultSettings)
 const[data,setData]=useState(null)
 useEffect(()=>{
  fetch('/api/muse',{method:'POST'}).then(r=>r.json()).then(setData)
 },[])
 if(!data)return null
 const d=data[0].variations[0].payload.data
 return(<div>
  <h2>McDonalds Assistant</h2>
  <div>{s.loyaltyPoints} points</div>
  {d.widgets.map((w,i)=>(
    <WidgetCard key={i} widget={w} settings={s} language={s.language}/>
  ))}
 </div>)
}
