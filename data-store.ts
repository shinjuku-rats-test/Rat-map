// 型定義（全ての画面で必要な項目を網羅しました）
interface Report {
  id: number
  location: string
  count: number
  lat: number
  lng: number
  userId?: string
  userName?: string
  userAvatar?: string
  status?: string 
}

interface UserProfile {
  id: string
  name: string
  avatar: string
  reportsCount: number
  points: number
}

export class DataStore {
  private static STORAGE_KEY = 'rat_reports'
  private static USER_KEY = 'rat_user_profile'

  // 1. 全ての報告を取得
  static getReports(): Report[] {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem(this.STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  }

  // 2. 新しい報告を追加 (report-screen.tsxのエラーを直します)
  static addReport(reportData: any) {
    if (typeof window === 'undefined') return
    const reports = this.getReports()
    
    const newReport: Report = {
      id: Date.now(),
      location: reportData.location || "不明な場所",
      count: reportData.count || 1,
      lat: reportData.lat || 35.6895,
      lng: reportData.lng || 139.6917,
      userId: reportData.userId,
      userName: reportData.userName,
      userAvatar: reportData.userAvatar,
      status: 'pending'
    }

    reports.push(newReport)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports))

    const user = this.getUserProfile()
    this.saveUserProfile({
      ...user,
      reportsCount: user.reportsCount + 1,
      points: user.points + 10
    })
  }

  // 3. 審査用データを取得 (review-screen.tsxのエラーを直します)
  static getReportsToReview(): Report[] {
    return this.getReports()
  }

  // 4. 自分の報告を取得 (review-screen.tsx用)
  static getUserReports(): Report[] {
    return this.getReports()
  }

  // 5. 報告を削除 (今回のメイン機能)
  static deleteReport(id: number) {
    if (typeof window === 'undefined') return
    const reports = this.getReports()
    const filteredReports = reports.filter(r => r.id !== id)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredReports))

    const user = this.getUserProfile()
    this.saveUserProfile({
      ...user,
      reportsCount: Math.max(0, user.reportsCount - 1),
      points: Math.max(0, user.points - 10) 
    })
  }

  // 6. ユーザー情報を取得
  static getUserProfile(): UserProfile {
    const defaultUser = { id: 'u1', name: 'エージェント', avatar: '', reportsCount: 0, points: 0 }
    if (typeof window === 'undefined') return defaultUser
    const saved = localStorage.getItem(this.USER_KEY)
    return saved ? JSON.parse(saved) : defaultUser
  }

  // 7. ユーザー情報を保存
  static saveUserProfile(profile: UserProfile) {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.USER_KEY, JSON.stringify(profile))
  }
}