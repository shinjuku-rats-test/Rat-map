"use client"

import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown, Flag, User, Filter } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { DataStore, Report } from "@/lib/data-store"

type FilterMode = "all" | "my" | "review"

export default function ReviewScreen() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [reports, setReports] = useState<Report[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filterMode, setFilterMode] = useState<FilterMode>("review")

  useEffect(() => {
    loadReports()
  }, [filterMode])

  const loadReports = () => {
    let loadedReports: Report[] = []
    if (filterMode === "all") {
      loadedReports = DataStore.getReports()
    } else if (filterMode === "my") {
      loadedReports = DataStore.getUserReports()
    } else {
      loadedReports = DataStore.getReportsToReview()
    }
    setReports(loadedReports)
    setCurrentIndex(0)
  }

  const currentReport = reports[currentIndex]

  const handleVote = (isValid: boolean) => {
    if (!currentReport) return

    const user = DataStore.getUserProfile()
    DataStore.reviewReport(currentReport.id, isValid, user.id)

    toast({
      title: isValid ? t.reviewApproved : t.reviewRejected,
      description: t.reviewPoints,
    })

    if (currentIndex < reports.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      loadReports()
    }
  }

  const handleReport = () => {
    toast({
      title: t.reviewReported,
      description: t.reviewReportedDesc,
      variant: "destructive",
    })
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}日前`
    if (hours > 0) return `${hours}時間前`
    return "たった今"
  }

  const getStatusBadge = (status: string) => {
    if (status === "approved") {
      return (
        <span className="rounded border-2 border-game-border bg-game-primary px-2 py-1 font-bold text-white text-xs">
          {t.detailStatusApproved}
        </span>
      )
    }
    if (status === "rejected") {
      return (
        <span className="rounded border-2 border-game-border bg-destructive px-2 py-1 font-bold text-white text-xs">
          {t.detailStatusRejected}
        </span>
      )
    }
    return (
      <span className="rounded border-2 border-game-border bg-game-accent px-2 py-1 font-bold text-game-text text-xs">
        {t.detailStatusPending}
      </span>
    )
  }

  if (!currentReport) {
    return (
      <div className="flex min-h-full flex-col bg-game-bg p-4">
        <header className="mb-6 rounded-lg border-4 border-game-border bg-game-header p-4 shadow-pixel">
          <h1 className="text-center font-bold text-2xl text-game-text">{t.reviewTitle}</h1>
        </header>

        <div className="mb-4 flex gap-2">
          <Button
            onClick={() => setFilterMode("review")}
            variant={filterMode === "review" ? "default" : "outline"}
            className="flex-1 border-2 border-game-border font-bold shadow-pixel"
          >
            {t.reviewPending}
          </Button>
          <Button
            onClick={() => setFilterMode("all")}
            variant={filterMode === "all" ? "default" : "outline"}
            className="flex-1 border-2 border-game-border font-bold shadow-pixel"
          >
            {t.reviewAllReports}
          </Button>
          <Button
            onClick={() => setFilterMode("my")}
            variant={filterMode === "my" ? "default" : "outline"}
            className="flex-1 border-2 border-game-border font-bold shadow-pixel"
          >
            {t.reviewMyReports}
          </Button>
        </div>

        <Card className="border-4 border-game-border bg-game-card p-8 text-center shadow-pixel">
          <p className="font-bold text-game-text text-lg">{t.reviewNoReports}</p>
        </Card>
      </div>
    )
  }

  const canVote = filterMode === "review"
  const isOwnReport = currentReport.userId === DataStore.getUserProfile().id

  return (
    <div className="min-h-full bg-game-bg p-4">
      <header className="mb-6 rounded-lg border-4 border-game-border bg-game-header p-4 shadow-pixel">
        <h1 className="text-center font-bold text-2xl text-game-text">{t.reviewTitle}</h1>
        <p className="text-center text-game-text-secondary text-sm">
          {currentIndex + 1} / {reports.length}
        </p>
      </header>

      <div className="mb-4 flex gap-2">
        <Button
          onClick={() => setFilterMode("review")}
          variant={filterMode === "review" ? "default" : "outline"}
          className="flex-1 border-2 border-game-border font-bold shadow-pixel"
          size="sm"
        >
          {t.reviewPending}
        </Button>
        <Button
          onClick={() => setFilterMode("all")}
          variant={filterMode === "all" ? "default" : "outline"}
          className="flex-1 border-2 border-game-border font-bold shadow-pixel"
          size="sm"
        >
          {t.reviewAllReports}
        </Button>
        <Button
          onClick={() => setFilterMode("my")}
          variant={filterMode === "my" ? "default" : "outline"}
          className="flex-1 border-2 border-game-border font-bold shadow-pixel"
          size="sm"
        >
          {t.reviewMyReports}
        </Button>
      </div>

      <Card className="mb-4 border-4 border-game-border bg-game-card shadow-pixel">
        {/* User Info */}
        <div className="flex items-center justify-between gap-3 border-b-4 border-game-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-game-border bg-game-accent">
              <User className="h-6 w-6 text-game-text-secondary" strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-game-text">{currentReport.userName}</p>
              <p className="text-game-text-secondary text-xs">{formatTime(currentReport.timestamp)}</p>
            </div>
          </div>
          {getStatusBadge(currentReport.status)}
        </div>

        {/* Image */}
        <div className="p-4">
          <img
            src={currentReport.photo || "/placeholder.svg?height=400&width=400&query=brown rat sighting"}
            alt="Report"
            className="h-64 w-full rounded-lg border-2 border-game-border object-cover"
          />
        </div>

        {/* Details */}
        <div className="border-t-4 border-game-border p-4">
          <div className="mb-3">
            <p className="mb-1 font-bold text-game-text text-sm">{t.reviewLocation}</p>
            <p className="text-game-text-secondary">{currentReport.location}</p>
          </div>
          <div className="mb-3">
            <p className="mb-1 font-bold text-game-text text-sm">{t.reviewDetails}</p>
            <p className="text-game-text-secondary">{currentReport.description}</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4 text-game-primary" />
              <span className="font-bold text-game-text text-sm">{currentReport.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="h-4 w-4 text-destructive" />
              <span className="font-bold text-game-text text-sm">{currentReport.dislikes}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="mb-3 flex gap-2">
        <Button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          variant="outline"
          className="flex-1 border-2 border-game-border bg-game-card font-bold text-game-text shadow-pixel hover:bg-game-card-hover disabled:opacity-50"
        >
          ← 前へ
        </Button>
        <Button
          onClick={() => setCurrentIndex(Math.min(reports.length - 1, currentIndex + 1))}
          disabled={currentIndex === reports.length - 1}
          variant="outline"
          className="flex-1 border-2 border-game-border bg-game-card font-bold text-game-text shadow-pixel hover:bg-game-card-hover disabled:opacity-50"
        >
          次へ →
        </Button>
      </div>

      {canVote && !isOwnReport && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleVote(false)}
              className="h-16 border-4 border-game-border bg-destructive font-bold text-white shadow-pixel hover:bg-destructive/90"
            >
              <ThumbsDown className="mr-2 h-6 w-6" strokeWidth={3} />
              {t.reviewReject}
            </Button>
            <Button
              onClick={() => handleVote(true)}
              className="h-16 border-4 border-game-border bg-game-primary font-bold text-white shadow-pixel hover:bg-game-primary-hover"
            >
              <ThumbsUp className="mr-2 h-6 w-6" strokeWidth={3} />
              {t.reviewApprove}
            </Button>
          </div>

          <Button
            onClick={handleReport}
            variant="outline"
            className="mt-3 w-full border-2 border-game-border bg-game-card font-bold text-game-text shadow-pixel hover:bg-game-card-hover"
          >
            <Flag className="mr-2 h-5 w-5" strokeWidth={3} />
            {t.reviewReport}
          </Button>
        </>
      )}
    </div>
  )
}
