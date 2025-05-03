import axios from 'axios'

export const getUserProfile = async (userId: string) => {
  const response = await axios.get(`http://localhost:3001/users/${userId}`)
  return response.data
}
