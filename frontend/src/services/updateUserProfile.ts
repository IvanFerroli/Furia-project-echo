import axios from "axios";
import { ProfileData } from "../types/ProfileData";

export const updateUserProfile = async (userId: string, data: ProfileData) => {
	const response = await axios.patch(
		`${import.meta.env.VITE_API_URL}/users/${userId}`,
		data
	);

	return response.data;
};
