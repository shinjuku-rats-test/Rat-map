import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/contexts/language-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ネズミレポート - 新宿区ドブネズミ報告アプリ",
  description: "新宿区内のドブネズミの位置を報告する市民参加型データ採取アプリ",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
