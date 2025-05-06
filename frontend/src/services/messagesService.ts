import axios from "axios";
import { BASE_URL } from '../config';

export async function fetchMessages() {
	const res = await axios.get(`${BASE_URL}/messages`);
	return res.data;
}

export async function sendMessage(message: {
	user_id?: string;
	nickname: string;
	text: string;
	parent_id?: number;
}) {
	const res = await axios.post(`${BASE_URL}/messages`, message);
	return res.data;
}

export async function reactToMessage(
	id: string,
	type: "like" | "dislike",
	user_id: string
) {
	const res = await axios.patch(`${BASE_URL}/messages/${id}/reaction`, {
		type,
		user_id,
	});
	return res.data;
}
