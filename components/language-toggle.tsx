"use client"

import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "ja" ? "en" : "ja")
  }

  return (
    <Button
      onClick={toggleLanguage}
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-full border-2 border-game-border bg-game-card shadow-pixel hover:bg-game-card-hover"
      aria-label="Toggle language"
    >
      <Languages className="h-5 w-5 text-game-text" strokeWidth={2.5} />
      <span className="ml-1 font-bold text-game-text text-xs">{language.toUpperCase()}</span>
    </Button>
  )
}
