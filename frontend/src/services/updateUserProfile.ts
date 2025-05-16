import axios from "axios";
import { ProfileData } from "../types/ProfileData";
import { BASE_URL } from '../config';

export const updateUserProfile = async (userId: string, data: ProfileData) => {
	const response = await axios.patch(
		`${BASE_URL}/users/${userId}`,
		data
	);

	return response.data;
};
