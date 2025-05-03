import api from './api'
import { UserMetrics } from '../types/UserMetrics'
import { getUserAwards } from './getUserAwards'

export async function getUserMetrics(userId: string): Promise<UserMetrics> {
  const [userResponse, awards] = await Promise.all([
    api.get(`/users/${userId}`),
    getUserAwards(userId)
  ])

  const user = userResponse.data

  const filledFields = [
    user.nickname,
    user.profile_image,
    user.bio,
    user.city,
    user.birthdate,
    user.cep
  ]
  const profileCompletion = Math.round(
    (filledFields.filter(Boolean).length / filledFields.length) * 100
  )

  return {
    totalPosts: 0, // ❌ mock
    totalLikes: 0, // ❌ mock
    topPost: 'Nenhuma mensagem encontrada', // ❌ mock
    longestStreak: 0, // ❌ mock
    activeDays: 0, // ❌ mock
    createdAt: user.created_at, // ✅ real
    profileCompletion, // ✅ real
    awardsCount: awards.length // ✅ real (vindo via getUserAwards)
  }
}
