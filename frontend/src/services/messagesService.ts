import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5174"; // ajuste conforme necessário

export async function fetchMessages() {
	const res = await axios.get(`${API_BASE}/messages`);
	return res.data;
}

export async function sendMessage(message: {
	user_id?: string;
	nickname: string;
	text: string;
	parent_id?: number;
}) {
	const res = await axios.post(`${API_BASE}/messages`, message);
	return res.data;
}

export async function reactToMessage(
	id: string,
	type: "like" | "dislike",
	user_id: string
) {
	const res = await axios.patch(`${API_BASE}/messages/${id}/reaction`, {
		type,
		user_id,
	});
	return res.data;
}
