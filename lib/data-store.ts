"use client"

export interface Report {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  location: string
  lat: number
  lng: number
  description: string
  photo?: string
  timestamp: number
  likes: number
  dislikes: number
  status: "pending" | "approved" | "rejected"
  reviewedBy?: string[]
}

export interface UserProfile {
  id: string
  name: string
  avatar?: string
  points: number
  reportsCount: number
  reviewsCount: number
  badges: string[]
}

const STORAGE_KEY_REPORTS = "rat-reports"
const STORAGE_KEY_USER = "rat-user-profile"
const STORAGE_KEY_USER_VOTES = "rat-user-votes"

// Initialize default user profile
const defaultUser: UserProfile = {
  id: "user-1",
  name: "新人ハンター",
  points: 0,
  reportsCount: 0,
  reviewsCount: 0,
  badges: [],
}

// Sample initial reports
const initialReports: Report[] = [
  {
    id: "report-1",
    userId: "user-2",
    userName: "ベテランハンター",
    location: "新宿駅東口",
    lat: 35.6895,
    lng: 139.7006,
    description: "大きなドブネズミを発見しました。ゴミ箱の近くにいました。体長約20cm程度で、茶色い毛並みでした。",
    photo: "/rat-near-garbage.jpg",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    likes: 0,
    dislikes: 0,
    status: "pending",
    reviewedBy: [],
  },
  {
    id: "report-2",
    userId: "user-3",
    userName: "市民パトロール",
    location: "歌舞伎町一丁目",
    lat: 35.6938,
    lng: 139.7034,
    description: "複数のネズミが走っているのを見ました。夜間10時頃に目撃しました。飲食店の裏口付近で3匹ほど確認。",
    photo: "/multiple-rats-running.jpg",
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    likes: 0,
    dislikes: 0,
    status: "pending",
    reviewedBy: [],
  },
  {
    id: "report-3",
    userId: "user-4",
    userName: "環境ウォッチャー",
    location: "新宿三丁目駅周辺",
    lat: 35.6905,
    lng: 139.7063,
    description: "地下街の出口付近でネズミの痕跡を発見。糞が複数箇所にありました。衛生面が心配です。",
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    likes: 0,
    dislikes: 0,
    status: "pending",
    reviewedBy: [],
  },
  {
    id: "report-4",
    userId: "user-5",
    userName: "夜勤パトロール",
    location: "西新宿公園",
    lat: 35.692,
    lng: 139.689,
    description: "公園のベンチ下にネズミの巣があるようです。早朝5時頃に複数のネズミが出入りしていました。",
    photo: "/rat-near-park-bench-at-dawn.jpg",
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    likes: 0,
    dislikes: 0,
    status: "pending",
    reviewedBy: [],
  },
  {
    id: "report-5",
    userId: "user-6",
    userName: "商店街の見回り隊",
    location: "新宿御苑前駅",
    lat: 35.6875,
    lng: 139.7105,
    description: "駅構内のゴミ箱周辺で小型のネズミを目撃。素早く排水溝に逃げ込みました。",
    timestamp: Date.now() - 8 * 60 * 60 * 1000,
    likes: 0,
    dislikes: 0,
    status: "pending",
    reviewedBy: [],
  },
  {
    id: "report-6",
    userId: "user-7",
    userName: "深夜巡回員",
    location: "新宿中央公園",
    lat: 35.6897,
    lng: 139.6887,
    description: "公園のトイレ裏でネズミの群れを発見。10匹以上いたと思われます。食べ物の残骸が散乱していました。",
    photo: "/multiple-rats-near-trash-pile-at-night.jpg",
    timestamp: Date.now() - 12 * 60 * 60 * 1000,
    likes: 0,
    dislikes: 0,
    status: "pending",
    reviewedBy: [],
  },
  {
    id: "report-7",
    userId: "user-8",
    userName: "清掃ボランティア",
    location: "新宿駅西口",
    lat: 35.6896,
    lng: 139.6992,
    description: "地下道で大きなネズミを目撃。人を見ても逃げない様子で、かなり図々しい個体でした。",
    photo: "/large-brown-rat-in-subway-tunnel.jpg",
    timestamp: Date.now() - 18 * 60 * 60 * 1000,
    likes: 0,
    dislikes: 0,
    status: "pending",
    reviewedBy: [],
  },
  {
    id: "report-8",
    userId: "user-9",
    userName: "地域安全パトロール",
    location: "四谷三丁目",
    lat: 35.6875,
    lng: 139.7188,
    description: "マンションのゴミ置き場でネズミが袋を破って漁っていました。住民の方は注意が必要です。",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    likes: 0,
    dislikes: 0,
    status: "pending",
    reviewedBy: [],
  },
]

export class DataStore {
  static getReports(): Report[] {
    if (typeof window === "undefined") return initialReports
    const stored = localStorage.getItem(STORAGE_KEY_REPORTS)
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(initialReports))
      return initialReports
    }
    return JSON.parse(stored)
  }

  static addReport(report: Omit<Report, "id" | "timestamp" | "likes" | "dislikes" | "status" | "reviewedBy">): Report {
    const reports = this.getReports()
    const newReport: Report = {
      ...report,
      id: `report-${Date.now()}`,
      timestamp: Date.now(),
      likes: 0,
      dislikes: 0,
      status: "pending",
      reviewedBy: [],
    }
    reports.unshift(newReport)
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports))

    // Update user stats
    const user = this.getUserProfile()
    user.reportsCount++
    user.points += 10
    this.updateUserProfile(user)

    return newReport
  }

  static reviewReport(reportId: string, isApproved: boolean, userId: string): void {
    const reports = this.getReports()
    const report = reports.find((r) => r.id === reportId)
    if (!report || report.reviewedBy?.includes(userId)) return

    if (isApproved) {
      report.likes++
    } else {
      report.dislikes++
    }

    if (!report.reviewedBy) report.reviewedBy = []
    report.reviewedBy.push(userId)

    // Update status based on votes
    if (report.likes >= 3) report.status = "approved"
    if (report.dislikes >= 3) report.status = "rejected"

    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports))

    // Update user stats
    const user = this.getUserProfile()
    user.reviewsCount++
    user.points += 5
    this.updateUserProfile(user)

    // Save user vote
    this.saveUserVote(reportId)
  }

  static getUserProfile(): UserProfile {
    if (typeof window === "undefined") return defaultUser
    const stored = localStorage.getItem(STORAGE_KEY_USER)
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultUser))
      return defaultUser
    }
    return JSON.parse(stored)
  }

  static updateUserProfile(profile: Partial<UserProfile>): void {
    const current = this.getUserProfile()
    const updated = { ...current, ...profile }
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated))
  }

  static getUserVotes(): string[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEY_USER_VOTES)
    return stored ? JSON.parse(stored) : []
  }

  static saveUserVote(reportId: string): void {
    const votes = this.getUserVotes()
    if (!votes.includes(reportId)) {
      votes.push(reportId)
      localStorage.setItem(STORAGE_KEY_USER_VOTES, JSON.stringify(votes))
    }
  }

  static hasUserVoted(reportId: string): boolean {
    return this.getUserVotes().includes(reportId)
  }

  static getReportById(id: string): Report | undefined {
    return this.getReports().find((r) => r.id === id)
  }

  static getPendingReports(): Report[] {
    return this.getReports().filter((r) => r.status === "pending")
  }

  static getReportsToReview(): Report[] {
    const userId = this.getUserProfile().id
    return this.getReports().filter((r) => r.status === "pending" && !this.hasUserVoted(r.id))
  }

  static getUserReports(): Report[] {
    const userId = this.getUserProfile().id
    return this.getReports().filter((r) => r.userId === userId)
  }

  static getApprovedReports(): Report[] {
    return this.getReports().filter((r) => r.status === "approved")
  }

  static resetAllData(): void {
    if (typeof window === "undefined") return

    // Clear all stored data
    localStorage.removeItem(STORAGE_KEY_REPORTS)
    localStorage.removeItem(STORAGE_KEY_USER)
    localStorage.removeItem(STORAGE_KEY_USER_VOTES)

    // Reinitialize with default data
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(initialReports))
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultUser))
  }
}
