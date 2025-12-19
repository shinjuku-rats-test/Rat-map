"use client"

import { useState } from "react"
import { Home, Map, PenLine, BookOpen, User } from 'lucide-react'
import { useLanguage } from "@/contexts/language-context"
import TitleScreen from "@/components/title-screen"
import HomeScreen from "@/components/home-screen"
import ReportScreen from "@/components/report-screen"
import MapScreen from "@/components/map-screen"
import ReviewScreen from "@/components/review-screen"
import ProfileScreen from "@/components/profile-screen"

type Screen = "title" | "home" | "report" | "map" | "review" | "profile"

export default function RatReportApp() {
  const { t } = useLanguage()
  const [currentScreen, setCurrentScreen] = useState<Screen>("title")

  const renderScreen = () => {
    switch (currentScreen) {
      case "title":
        return <TitleScreen onStart={() => setCurrentScreen("home")} />
      case "home":
        return <HomeScreen onStartReport={() => setCurrentScreen("report")} />
      case "report":
        return <ReportScreen />
      case "map":
        return <MapScreen />
      case "review":
        return <ReviewScreen />
      case "profile":
        return <ProfileScreen />
      default:
        return <TitleScreen onStart={() => setCurrentScreen("home")} />
    }
  }

  const showNavigation = currentScreen !== "title"

  return (
    <div className="flex h-screen flex-col bg-game-bg">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">{renderScreen()}</main>

      {/* Bottom Navigation Bar */}
      {showNavigation && (
        <nav className="fixed bottom-0 left-0 right-0 border-t-4 border-game-border bg-game-nav shadow-pixel">
          <div className="flex items-center justify-around px-2 py-3">
            <button
              onClick={() => setCurrentScreen("report")}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-all ${
                currentScreen === "report" ? "text-game-primary" : "text-game-text-secondary hover:text-game-text"
              }`}
            >
              <PenLine className="h-6 w-6" strokeWidth={3} />
              <span className="text-xs font-bold">{t.navReport}</span>
            </button>

            <button
              onClick={() => setCurrentScreen("map")}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-all ${
                currentScreen === "map" ? "text-game-primary" : "text-game-text-secondary hover:text-game-text"
              }`}
            >
              <Map className="h-6 w-6" strokeWidth={3} />
              <span className="text-xs font-bold">{t.navMap}</span>
            </button>

            <button
              onClick={() => setCurrentScreen("home")}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-all ${
                currentScreen === "home" ? "text-game-primary" : "text-game-text-secondary hover:text-game-text"
              }`}
            >
              <Home className="h-7 w-7" strokeWidth={3} />
              <span className="text-xs font-bold">{t.navHome}</span>
            </button>

            <button
              onClick={() => setCurrentScreen("review")}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-all ${
                currentScreen === "review" ? "text-game-primary" : "text-game-text-secondary hover:text-game-text"
              }`}
            >
              <BookOpen className="h-6 w-6" strokeWidth={3} />
              <span className="text-xs font-bold">{t.navReview}</span>
            </button>

            <button
              onClick={() => setCurrentScreen("profile")}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-all ${
                currentScreen === "profile" ? "text-game-primary" : "text-game-text-secondary hover:text-game-text"
              }`}
            >
              <User className="h-6 w-6" strokeWidth={3} />
              <span className="text-xs font-bold">{t.navProfile}</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  )
}
