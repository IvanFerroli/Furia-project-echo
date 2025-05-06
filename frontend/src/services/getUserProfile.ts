import axios from 'axios'
import { ProfileData } from '../types/ProfileData'

export const getUserProfile = async (userId: string): Promise<ProfileData> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`);
  return response.data
}
