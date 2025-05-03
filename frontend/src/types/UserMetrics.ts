export interface UserMetrics {
    totalPosts: number        // ❌ mock
    totalLikes: number        // ❌ mock
    topPost: string           // ❌ mock
    longestStreak: number     // ❌ mock
    activeDays: number        // ❌ mock
    createdAt: string         // ✅ real
    profileCompletion: number // ✅ real (% baseado em campos preenchidos)
    awardsCount: number       // ✅ real
  }
  