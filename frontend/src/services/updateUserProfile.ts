import axios from 'axios'

type ProfileData = {
  nickname: string
  profile_image: string
  bio: string
  city: string
  birthdate: string
  cpf?: string
}

export const updateUserProfile = async (userId: string, data: ProfileData) => {
  const response = await axios.patch(`http://localhost:3001/users/${userId}`, data)
  return response.data
}
