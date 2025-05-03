import axios from 'axios'
import { ProfileData } from '../types/ProfileData'

export const getUserProfile = async (userId: string): Promise<ProfileData> => {
  const response = await axios.get(`http://localhost:3001/users/${userId}`)
  return response.data
}
