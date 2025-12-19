// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import "leaflet/dist/leaflet.css"

// 地図パーツを読み込む
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

export default function RatMap() {
  const [mounted, setMounted] = useState(false)

  // マーカー用の座標データ
  const positions = [
    { id: 1, pos: [35.6938, 139.7034], name: "新宿駅" },
    { id: 2, pos: [35.6950, 139.7020], name: "歌舞伎町" },
    { id: 3, pos: [35.6910, 139.7060], name: "新宿御苑付近" },
  ]

  useEffect(() => {
    setMounted(true)
    // Leafletのアイコンバグ修正
    import("leaflet").then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    });
  }, [])

  if (!mounted) return <div className="h-full w-full bg-slate-100" />

  return (
    <MapContainer 
      center={[35.6938, 139.7034]} 
      zoom={15} 
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* マーカーをループで表示 */}
      {positions.map((p) => (
        <Marker key={p.id} position={p.pos}>
          <Popup>{p.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}