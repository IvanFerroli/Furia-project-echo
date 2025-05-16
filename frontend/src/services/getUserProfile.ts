import axios from 'axios'
import { ProfileData } from '../types/ProfileData'
import { BASE_URL } from '../config';

export const getUserProfile = async (userId: string): Promise<ProfileData> => {
  const response = await axios.get(`${BASE_URL}/users/${userId}`);
  return response.data;
};
