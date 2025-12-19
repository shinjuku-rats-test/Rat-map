"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { User, Award, TrendingUp, Star, Settings, Camera, X, Check, RotateCcw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { DataStore } from "@/lib/data-store"
import { useToast } from "@/hooks/use-toast"

export default function ProfileScreen() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState(DataStore.getUserProfile())
  const [editName, setEditName] = useState(userProfile.name)
  const [editAvatar, setEditAvatar] = useState<string | null>(userProfile.avatar || null)
  const [showResetDialog, setShowResetDialog] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = () => {
    const profile = DataStore.getUserProfile()
    setUserProfile(profile)
    setEditName(profile.name)
    setEditAvatar(profile.avatar || null)
  }

  const level = Math.floor(userProfile.points / 50) + 1
  const nextLevelPoints = level * 50
  const accuracy =
    userProfile.reviewsCount > 0 ? Math.round((userProfile.reportsCount / userProfile.reviewsCount) * 100) : 0

  const achievements = [
    {
      id: 1,
      name: t.achievementFirstReport,
      description: t.achievementFirstReportDesc,
      unlocked: userProfile.reportsCount >= 1,
    },
    {
      id: 2,
      name: t.achievementReviewer,
      description: t.achievementReviewerDesc,
      unlocked: userProfile.reviewsCount >= 10,
    },
    {
      id: 3,
      name: t.achievementExpert,
      description: t.achievementExpertDesc,
      unlocked: level >= 5,
    },
  ]

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    DataStore.updateUserProfile({
      name: editName,
      avatar: editAvatar || undefined,
    })
    loadProfile()
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditName(userProfile.name)
    setEditAvatar(userProfile.avatar || null)
    setIsEditing(false)
  }

  const handleResetData = () => {
    DataStore.resetAllData()
    loadProfile()
    setShowResetDialog(false)
    toast({
      title: t.profileResetSuccess || "データをリセットしました",
      description: t.profileResetSuccessDesc || "すべてのデータが初期状態に戻りました",
    })
  }

  return (
    <div className="min-h-full bg-game-bg p-4">
      <header className="mb-6 rounded-lg border-4 border-game-border bg-game-header p-4 shadow-pixel">
        <h1 className="text-center font-bold text-2xl text-game-text">{t.profileTitle}</h1>
      </header>

      {/* User Card */}
      <Card className="mb-4 border-4 border-game-border bg-game-card p-6 shadow-pixel">
        <div className="mb-4 flex items-center gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-game-border bg-game-accent">
              {editAvatar ? (
                <img src={editAvatar || "/placeholder.svg"} alt="User avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-game-text-secondary" strokeWidth={2} />
              )}
            </div>
            {isEditing && (
              <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-game-border bg-game-primary shadow-pixel hover:bg-game-primary-hover">
                <Camera className="h-4 w-4 text-white" strokeWidth={3} />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mb-2 border-2 border-game-border bg-game-accent font-bold text-game-text"
                placeholder={t.profileUsernamePlaceholder}
              />
            ) : (
              <p className="mb-1 font-bold text-game-text text-xl">{userProfile.name}</p>
            )}
            <div className="flex items-center gap-2">
              <div className="rounded-full border-2 border-game-border bg-game-primary px-3 py-1">
                <span className="font-bold text-white text-sm">
                  {t.profileLevel}
                  {level}
                </span>
              </div>
              {isEditing ? (
                <div className="flex gap-1">
                  <Button
                    onClick={handleSaveProfile}
                    size="icon"
                    className="h-8 w-8 border-2 border-game-border bg-game-primary shadow-pixel hover:bg-game-primary-hover"
                  >
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 border-2 border-game-border bg-game-button shadow-pixel hover:bg-game-button-hover"
                  >
                    <X className="h-4 w-4 text-game-text" strokeWidth={3} />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-game-accent"
                >
                  <Settings className="h-5 w-5 text-game-text-secondary" strokeWidth={2} />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mb-2">
          <div className="mb-1 flex justify-between text-game-text-secondary text-sm">
            <span>{t.profileExperience}</span>
            <span>
              {userProfile.points} / {nextLevelPoints}
            </span>
          </div>
          <Progress value={(userProfile.points / nextLevelPoints) * 100} className="h-3 border-2 border-game-border" />
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Card className="border-4 border-game-border bg-game-card p-3 shadow-pixel">
          <div className="flex flex-col items-center gap-1">
            <TrendingUp className="h-6 w-6 text-game-primary" strokeWidth={3} />
            <p className="font-bold text-game-text text-xs">{t.profileReports}</p>
            <p className="font-bold text-game-text text-xl">{userProfile.reportsCount}</p>
          </div>
        </Card>
        <Card className="border-4 border-game-border bg-game-card p-3 shadow-pixel">
          <div className="flex flex-col items-center gap-1">
            <Star className="h-6 w-6 text-game-primary" strokeWidth={3} />
            <p className="font-bold text-game-text text-xs">{t.profileReviews}</p>
            <p className="font-bold text-game-text text-xl">{userProfile.reviewsCount}</p>
          </div>
        </Card>
        <Card className="border-4 border-game-border bg-game-card p-3 shadow-pixel">
          <div className="flex flex-col items-center gap-1">
            <Award className="h-6 w-6 text-game-primary" strokeWidth={3} />
            <p className="font-bold text-game-text text-xs">{t.profileAccuracy}</p>
            <p className="font-bold text-game-text text-xl">{accuracy}%</p>
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="border-4 border-game-border bg-game-card p-4 shadow-pixel">
        <h2 className="mb-4 font-bold text-game-text text-lg">{t.profileAchievements}</h2>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center gap-3 rounded-lg border-2 border-game-border p-3 ${
                achievement.unlocked ? "bg-game-accent" : "bg-game-card opacity-50"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-game-border ${
                  achievement.unlocked ? "bg-game-primary" : "bg-game-button"
                }`}
              >
                <Award
                  className={`h-6 w-6 ${achievement.unlocked ? "text-white" : "text-game-text-secondary"}`}
                  strokeWidth={3}
                />
              </div>
              <div className="flex-1">
                <p className="font-bold text-game-text text-sm">{achievement.name}</p>
                <p className="text-game-text-secondary text-xs">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reset Button */}
      <div className="mt-4">
        <Button
          onClick={() => setShowResetDialog(true)}
          variant="outline"
          className="w-full border-4 border-game-border bg-game-card shadow-pixel hover:bg-game-accent"
        >
          <RotateCcw className="mr-2 h-5 w-5" strokeWidth={2} />
          {t.profileResetData || "データをリセット"}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md border-4 border-game-border bg-game-card p-6 shadow-pixel">
            <h3 className="mb-4 font-bold text-game-text text-xl">
              {t.profileResetConfirmTitle || "データをリセットしますか？"}
            </h3>
            <p className="mb-6 text-game-text-secondary text-sm">
              {t.profileResetConfirmDesc ||
                "すべての報告、レビュー、ポイントが削除され、初期状態に戻ります。この操作は取り消せません。"}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleResetData}
                className="flex-1 border-2 border-game-border bg-red-500 shadow-pixel hover:bg-red-600"
              >
                {t.profileResetConfirm || "リセットする"}
              </Button>
              <Button
                onClick={() => setShowResetDialog(false)}
                variant="outline"
                className="flex-1 border-2 border-game-border bg-game-button shadow-pixel hover:bg-game-button-hover"
              >
                {t.profileResetCancel || "キャンセル"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
