"use client"

import { useState, useEffect } from "react"
import { Rat, TrendingUp, Users, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { LanguageToggle } from "@/components/language-toggle"
import { DataStore } from "@/lib/data-store"

interface HomeScreenProps {
  onStartReport: () => void
}

export default function HomeScreen({ onStartReport }: HomeScreenProps) {
  const { t } = useLanguage()
  const [stats, setStats] = useState({ reports: 0, points: 0, level: 1 })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = () => {
    const user = DataStore.getUserProfile()
    const level = Math.floor(user.points / 50) + 1
    setStats({
      reports: user.reportsCount,
      points: user.points,
      level,
    })
  }

  return (
    <div className="min-h-full bg-game-bg p-4">
      {/* Header */}
      <header className="mb-6 rounded-lg border-4 border-game-border bg-game-header p-4 shadow-pixel relative">
        <div className="absolute right-4 top-4">
          <LanguageToggle />
        </div>
        <h1 className="mb-1 text-center font-bold text-2xl text-game-text">{t.homeTitle}</h1>
        <p className="text-center text-game-text-secondary text-sm">{t.homeSubtitle}</p>
      </header>

      {/* Mascot Section */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div className="flex h-48 w-48 items-center justify-center rounded-full border-4 border-game-border bg-game-card shadow-pixel">
            <Rat className="h-32 w-32 text-game-text-secondary" strokeWidth={2} />
          </div>
          <div className="absolute -right-2 -top-2 rounded-full border-4 border-game-border bg-game-primary px-3 py-1 shadow-pixel">
            <span className="font-bold text-white text-xs">Lv.{stats.level}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Card className="border-4 border-game-border bg-game-card p-3 shadow-pixel">
          <div className="flex flex-col items-center gap-1">
            <TrendingUp className="h-6 w-6 text-game-primary" strokeWidth={3} />
            <p className="font-bold text-game-text text-xs">{t.homeReportCount}</p>
            <p className="font-bold text-game-text text-xl">{stats.reports}</p>
          </div>
        </Card>
        <Card className="border-4 border-game-border bg-game-card p-3 shadow-pixel">
          <div className="flex flex-col items-center gap-1">
            <Users className="h-6 w-6 text-game-primary" strokeWidth={3} />
            <p className="font-bold text-game-text text-xs">{t.homePoints}</p>
            <p className="font-bold text-game-text text-xl">{stats.points}</p>
          </div>
        </Card>
        <Card className="border-4 border-game-border bg-game-card p-3 shadow-pixel">
          <div className="flex flex-col items-center gap-1">
            <MapPin className="h-6 w-6 text-game-primary" strokeWidth={3} />
            <p className="font-bold text-game-text text-xs">{t.homeArea}</p>
            <p className="font-bold text-game-text text-xl">{t.homeAreaValue}</p>
          </div>
        </Card>
      </div>

      {/* Main Action Button */}
      <Button
        onClick={onStartReport}
        className="mb-4 h-16 w-full border-4 border-game-border bg-game-primary font-bold text-white text-xl shadow-pixel hover:bg-game-primary-hover"
      >
        {t.homeMainButton}
      </Button>

      {/* Info Section */}
      <Card className="border-4 border-game-border bg-game-card p-4 shadow-pixel">
        <h2 className="mb-3 font-bold text-game-text text-lg">{t.homeHowToTitle}</h2>
        <ul className="space-y-2 text-game-text-secondary text-sm">
          <li className="flex items-start gap-2">
            <span className="font-bold text-game-primary">1.</span>
            <span>{t.homeStep1}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-game-primary">2.</span>
            <span>{t.homeStep2}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-game-primary">3.</span>
            <span>{t.homeStep3}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-game-primary">4.</span>
            <span>{t.homeStep4}</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
