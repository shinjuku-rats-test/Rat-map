"use client"

import { MapPin, Trash2 } from "lucide-react"
import { useState } from "react"
import { DataStore } from "@/lib/data-store"

interface Report {
  id: number
  location: string
  count: number
  lat: number
  lng: number
}

interface MapComponentProps {
  reports: Report[]
  center: [number, number]
}

export default function MapComponent({ reports, center }: MapComponentProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  // 緯度経度を画面上の位置（%）に変換する関数
  const latLngToPixel = (lat: number, lng: number) => {
    const centerLat = center[0]
    const centerLng = center[1]
    const scale = 8000 
    const x = (lng - centerLng) * scale + 50
    const y = (centerLat - lat) * scale + 50
    return { x: `${x}%`, y: `${y}%` }
  }

  // 削除処理の関数
  const handleDelete = (e: React.MouseEvent, reportId: number) => {
    e.stopPropagation() // 親要素のクリックイベント（選択解除など）を防ぐ
    if (confirm("この報告を削除しますか？")) {
      // DataStoreに削除命令を送る（localStorageから消去）
      DataStore.deleteReport(reportId)
      setSelectedReport(null)
      // 画面をリロードして反映させる
      window.location.reload()
    }
  }

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-[#e8f4f8] to-[#b8d4e0]">
      {/* グリッド（地図の背景） */}
      <svg className="absolute inset-0 h-full w-full opacity-20">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#666" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* 道路風の線 */}
      <svg className="absolute inset-0 h-full w-full opacity-30">
        <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#888" strokeWidth="2" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#888" strokeWidth="3" />
        <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#888" strokeWidth="2" />
        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#888" strokeWidth="2" />
        <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#888" strokeWidth="3" />
        <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#888" strokeWidth="2" />
      </svg>

      {/* 地名ラベル */}
      <div className="absolute left-[15%] top-[20%] rounded border-2 border-game-border bg-white/80 px-2 py-1 text-xs font-bold shadow-sm">
        新宿駅
      </div>
      <div className="absolute left-[45%] top-[35%] rounded border-2 border-game-border bg-white/80 px-2 py-1 text-xs font-bold shadow-sm">
        歌舞伎町
      </div>
      <div className="absolute left-[60%] top-[70%] rounded border-2 border-game-border bg-white/80 px-2 py-1 text-xs font-bold shadow-sm">
        新宿御苑
      </div>

      {/* 報告マーカーの一覧表示 */}
      {reports.map((report, index) => {
        // 固定の位置計算（元のコードのロジックを維持）
        const offsetX = index * 15 + 20
        const offsetY = index * 20 + 25

        return (
          <div
            key={report.id}
            className="absolute cursor-pointer transition-transform hover:scale-110"
            style={{
              left: `${offsetX}%`,
              top: `${offsetY}%`,
              transform: "translate(-50%, -100%)",
            }}
            onClick={() => setSelectedReport(report)}
          >
            <div className="relative">
              <MapPin className="h-10 w-10 text-game-primary drop-shadow-lg" fill="currentColor" strokeWidth={2} />
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-game-border bg-game-primary shadow-lg">
                <span className="font-bold text-white text-xs">{report.count}</span>
              </div>
            </div>

            {/* ポップアップ（削除ボタン付き） */}
            {selectedReport?.id === report.id && (
              <div className="absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 rounded-lg border-4 border-game-border bg-white p-3 shadow-pixel z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedReport(null)
                  }}
                  className="absolute right-1 top-1 text-game-text-secondary hover:text-game-text"
                >
                  ×
                </button>
                <p className="mb-1 font-bold text-game-text text-sm">{report.location}</p>
                <p className="text-game-text-secondary text-xs">{report.count}件の報告</p>
                
                {/* 削除ボタン */}
                <button
                  onClick={(e) => handleDelete(e, report.id)}
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded border-2 border-red-500 bg-white py-1 text-[10px] font-bold text-red-500 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                  報告を削除する
                </button>
              </div>
            )}
          </div>
        )
      })}

      <div className="absolute bottom-2 right-2 rounded bg-white/90 px-2 py-1 text-[10px] text-gray-600">
        新宿区マップ
      </div>
    </div>
  )
}