"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, MapPin, Upload, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { DataStore } from "@/lib/data-store"

export default function ReportScreen() {
  const { t } = useLanguage()
  const [photo, setPhoto] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [lat, setLat] = useState<number>(35.6895)
  const [lng, setLng] = useState<number>(139.7006)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const { toast } = useToast()

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setShowCamera(true)
      }
    } catch (err) {
      toast({
        title: t.reportCameraError,
        description: t.reportCameraErrorDesc,
        variant: "destructive",
      })
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg")
        setPhoto(imageData)
        stopCamera()
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const handleSubmit = () => {
    if (!photo || !description || !location) {
      toast({
        title: t.reportInputError,
        description: t.reportInputErrorDesc,
        variant: "destructive",
      })
      return
    }

    const user = DataStore.getUserProfile()
    DataStore.addReport({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      location,
      lat,
      lng,
      description,
      photo,
    })

    toast({
      title: t.reportSuccess,
      description: t.reportSuccessDesc,
    })

    // Reset form
    setPhoto(null)
    setDescription("")
    setLocation("")
    setLat(35.6895)
    setLng(139.7006)
  }

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude)
          setLng(position.coords.longitude)
          setLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`)
          toast({
            title: t.reportLocationSuccess,
            description: t.reportLocationSuccessDesc,
          })
        },
        () => {
          toast({
            title: t.reportLocationError,
            description: t.reportLocationErrorDesc,
            variant: "destructive",
          })
        },
      )
    }
  }

  return (
    <div className="min-h-full bg-game-bg p-4">
      <header className="mb-6 rounded-lg border-4 border-game-border bg-game-header p-4 shadow-pixel">
        <h1 className="text-center font-bold text-2xl text-game-text">{t.reportTitle}</h1>
      </header>

      <div className="space-y-4">
        {/* Photo Upload */}
        <Card className="border-4 border-game-border bg-game-card p-4 shadow-pixel">
          <h2 className="mb-3 font-bold text-game-text text-lg">{t.reportPhotoTitle}</h2>
          {showCamera ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-64 w-full rounded-lg border-2 border-game-border object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="mt-3 flex gap-2">
                <Button
                  onClick={capturePhoto}
                  className="flex-1 border-2 border-game-border bg-game-primary shadow-pixel hover:bg-game-primary-hover"
                >
                  <Camera className="mr-2 h-5 w-5" strokeWidth={3} />
                  {t.reportCaptureButton}
                </Button>
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  className="border-2 border-game-border bg-game-button shadow-pixel hover:bg-game-button-hover"
                >
                  <X className="h-5 w-5" strokeWidth={3} />
                </Button>
              </div>
            </div>
          ) : photo ? (
            <div className="relative">
              <img
                src={photo || "/placeholder.svg"}
                alt="Uploaded rat"
                className="h-48 w-full rounded-lg border-2 border-game-border object-cover"
              />
              <button
                onClick={() => setPhoto(null)}
                className="absolute right-2 top-2 rounded-full border-2 border-game-border bg-game-card p-1 shadow-pixel"
              >
                <X className="h-4 w-4 text-game-text" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-4 border-dashed border-game-border bg-game-accent hover:bg-game-card-hover">
                <Upload className="mb-2 h-10 w-10 text-game-text-secondary" strokeWidth={2} />
                <span className="font-bold text-game-text-secondary text-sm">{t.reportPhotoUpload}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
              <Button
                onClick={startCamera}
                className="w-full border-2 border-game-border bg-game-button shadow-pixel hover:bg-game-button-hover"
              >
                <Camera className="mr-2 h-5 w-5" strokeWidth={3} />
                {t.reportCameraButton}
              </Button>
            </div>
          )}
        </Card>

        {/* Location */}
        <Card className="border-4 border-game-border bg-game-card p-4 shadow-pixel">
          <h2 className="mb-3 font-bold text-game-text text-lg">{t.reportLocationTitle}</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t.reportLocationPlaceholder}
              className="flex-1 rounded-lg border-2 border-game-border bg-game-accent px-3 py-2 font-bold text-game-text text-sm focus:outline-none focus:ring-2 focus:ring-game-primary"
            />
            <Button
              onClick={getCurrentLocation}
              className="border-2 border-game-border bg-game-button shadow-pixel hover:bg-game-button-hover"
            >
              <MapPin className="h-5 w-5" strokeWidth={3} />
            </Button>
          </div>
        </Card>

        {/* Description */}
        <Card className="border-4 border-game-border bg-game-card p-4 shadow-pixel">
          <h2 className="mb-3 font-bold text-game-text text-lg">{t.reportDescriptionTitle}</h2>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.reportDescriptionPlaceholder}
            className="min-h-32 border-2 border-game-border bg-game-accent font-bold text-game-text text-sm focus:ring-2 focus:ring-game-primary"
          />
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="h-14 w-full border-4 border-game-border bg-game-primary font-bold text-white text-xl shadow-pixel hover:bg-game-primary-hover"
        >
          <Upload className="mr-2 h-6 w-6" strokeWidth={3} />
          {t.reportSubmitButton}
        </Button>
      </div>
    </div>
  )
}
