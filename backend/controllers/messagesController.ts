import { Request, Response } from "express";
import {
	getAllMessages,
	createMessage,
	reactToMessage,
} from "../models/message";

export const getMessages = async (
	_req: Request,
	res: Response
): Promise<void> => {
	try {
		const messages = await getAllMessages();
		res.json(messages);
	} catch (err) {
		console.error("getMessages error:", err);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const postMessage = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { user_id, nickname, text, parent_id } = req.body;

	if (!text || !nickname) {
		res.status(400).json({ message: "Text and nickname are required" });
		return;
	}

	try {
		const newMsg = await createMessage({
			user_id,
			nickname,
			text,
			parent_id,
		});
		res.status(201).json(newMsg);
	} catch (err) {
		console.error("postMessage error:", err);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const patchReaction = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { type, user_id } = req.body;
	const { id } = req.params;

	if (!["like", "dislike"].includes(type)) {
		res.status(400).json({ message: "Reaction must be like or dislike" });
		return;
	}

	if (!user_id) {
		res.status(400).json({ message: "Missing user_id" });
		return;
	}

	try {
		await reactToMessage(id, user_id, type);
		res.json({ message: "Reaction updated" });
	} catch (err) {
		console.error("patchReaction error:", err);
		res.status(500).json({ message: "Internal server error" });
	}
};
