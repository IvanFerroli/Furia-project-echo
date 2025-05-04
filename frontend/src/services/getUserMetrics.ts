import api from './api'
import { UserMetrics } from '../types/UserMetrics'

export async function getUserMetrics(userId: string): Promise<UserMetrics> {
  const res = await api.get(`/users/${userId}/metrics`)
  return res.data
}
