// @ts-nocheck
"use client"
import { useState, useEffect } from "react"

// Sparklesがもしlucide-reactなどの部品ならここでインポートが必要ですが、
// 見当たらない場合は、とりあえず簡単な星マーク★で代用するか定義します。
const Sparkles = ({ className, style }: any) => (
  <span className={className} style={style}>★</span>
)

// 引数に { onStart } を追加して、荷物を受け取れるようにします
export default function TitleScreen({ onStart }: { onStart: () => void }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative h-screen w-full bg-slate-900 flex items-center justify-center overflow-hidden">
      {/* キラキラエフェクト */}
      <div className="absolute inset-0">
        {mounted && [...Array(20)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-yellow-300 opacity-50 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* 開始ボタン */}
      <button 
        onClick={onStart}
        className="z-10 px-8 py-4 bg-yellow-500 text-white font-bold rounded-full shadow-lg hover:bg-yellow-400 transition-all"
      >
        START GAME
      </button>
    </div>
  )
}