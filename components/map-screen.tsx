"use client"

import RatMap from "./RatMap"

export default function MapScreen() {
  const reports = [
    { id: 1, location: "ここ", user: "新人ハンター" },
    { id: 2, location: "新宿駅東口", user: "ベテランハンター" },
    { id: 3, location: "歌舞伎町一丁目", user: "市民パトロール" },
  ]

  return (
    <div className="flex flex-col h-full bg-[#f5f5f5]">
      {/* ヘッダー：高さを少し抑えてマップを広くします */}
      <div className="p-3 bg-white border-b-2 border-black">
        <h2 className="text-lg font-bold">ネズミ出没マップ</h2>
      </div>
      
      {/* マップエリア：高さを [300px] から [400px] に広げ、下の余白 (mb-6) を追加 */}
      <div className="h-[450px] w-full border-b-4 border-black relative z-0 mb-6 shadow-md">
        <RatMap />
      </div>

      {/* 報告リストエリア：タイトルの上に少し余白を追加 */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <h3 className="font-bold text-sm mb-4 text-gray-600 uppercase tracking-widest">
          — 最近の報告リスト —
        </h3>
        
        <div className="space-y-4">
          {reports.map((report) => (
            <div 
              key={report.id} 
              className="flex items-center justify-between bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">📍</div>
                <div>
                  <div className="font-bold text-base">{report.location}</div>
                  <div className="text-xs text-gray-400">{report.user}</div>
                </div>
              </div>
              <button className="px-5 py-1 border-2 border-black bg-yellow-300 text-xs font-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none">
                詳細
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}