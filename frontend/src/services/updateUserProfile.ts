import axios from 'axios'
import { ProfileData } from '../types/ProfileData'

export const updateUserProfile = async (userId: string, data: ProfileData) => {
  const response = await axios.patch(`http://localhost:3001/users/${userId}`, data)
  return response.data
}
