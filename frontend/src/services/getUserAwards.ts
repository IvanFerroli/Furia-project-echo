import api from "./api";

export async function getUserAwards(userId: string) {
  const response = await api.get(`/awards/${userId}`);
  return response.data;
}
