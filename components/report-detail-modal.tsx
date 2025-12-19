"use client"

import { X, MapPin, Calendar, User, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Report } from "@/lib/data-store"
import { useLanguage } from "@/contexts/language-context"

interface ReportDetailModalProps {
  report: Report
  onClose: () => void
}

export default function ReportDetailModal({ report, onClose }: ReportDetailModalProps) {
  const { t } = useLanguage()

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}日前`
    if (hours > 0) return `${hours}時間前`
    return "たった今"
  }

  const getStatusColor = () => {
    switch (report.status) {
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  const getStatusText = () => {
    switch (report.status) {
      case "approved":
        return "承認済み"
      case "rejected":
        return "却下済み"
      default:
        return "審査中"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border-4 border-game-border bg-game-bg shadow-pixel">
        {/* Close Button */}
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full border-2 border-game-border bg-game-card p-0 shadow-pixel hover:bg-game-card-hover"
        >
          <X className="h-6 w-6 text-game-text" strokeWidth={3} />
        </Button>

        {/* Header */}
        <div className="border-b-4 border-game-border bg-game-header p-6">
          <div className="mb-2 flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 font-bold text-white text-xs ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          <h2 className="font-bold text-2xl text-game-text">{t.reportDetailsTitle || "報告詳細"}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-game-border bg-game-accent">
              <User className="h-6 w-6 text-game-text-secondary" strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-game-text">{report.userName}</p>
              <p className="text-game-text-secondary text-sm">{formatTime(report.timestamp)}</p>
            </div>
          </div>

          {/* Photo */}
          {report.photo && (
            <div className="mb-6">
              <img
                src={report.photo || "/placeholder.svg"}
                alt="Report"
                className="h-auto w-full rounded-lg border-4 border-game-border object-cover"
              />
            </div>
          )}

          {/* Location */}
          <div className="mb-4 flex items-start gap-3 rounded-lg border-2 border-game-border bg-game-card p-4">
            <MapPin className="mt-1 h-5 w-5 text-game-primary" strokeWidth={3} />
            <div>
              <p className="mb-1 font-bold text-game-text text-sm">{t.reportLocation || "場所"}</p>
              <p className="text-game-text-secondary">{report.location}</p>
              <p className="text-game-text-secondary text-xs">
                緯度: {report.lat.toFixed(4)}, 経度: {report.lng.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4 rounded-lg border-2 border-game-border bg-game-card p-4">
            <p className="mb-2 font-bold text-game-text text-sm">{t.reportDetails || "詳細"}</p>
            <p className="text-game-text-secondary">{report.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border-2 border-game-border bg-game-card p-4 text-center">
              <ThumbsUp className="mx-auto mb-2 h-6 w-6 text-green-500" strokeWidth={3} />
              <p className="font-bold text-2xl text-game-text">{report.likes}</p>
              <p className="text-game-text-secondary text-sm">承認</p>
            </div>
            <div className="rounded-lg border-2 border-game-border bg-game-card p-4 text-center">
              <ThumbsDown className="mx-auto mb-2 h-6 w-6 text-red-500" strokeWidth={3} />
              <p className="font-bold text-2xl text-game-text">{report.dislikes}</p>
              <p className="text-game-text-secondary text-sm">却下</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-game-border bg-game-header p-6">
          <Button
            onClick={onClose}
            className="w-full border-2 border-game-border bg-game-primary font-bold text-white shadow-pixel hover:bg-game-primary-hover"
          >
            {t.close || "閉じる"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
