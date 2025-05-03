import { Request, Response } from "express";
import { getAwardsByUser, assignAward } from "../models/award";

export const getUserAwards = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.params.userId;
		if (!userId) {
			res.status(400).json({ message: "User ID is required" });
			return;
		}

		const awards = await getAwardsByUser(userId);
		res.json(awards);
	} catch (err) {
		console.error("getUserAwards error:", err);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const postAward = async (req: Request, res: Response): Promise<void> => {
	const { user_id, award_type } = req.body;

	if (!user_id || !award_type) {
		res.status(400).json({ message: "user_id and award_type are required" });
		return;
	}

	try {
		await assignAward(user_id, award_type);
		res.status(201).json({ message: "Award assigned" });
	} catch (err) {
		console.error("postAward error:", err);
		res.status(500).json({ message: "Internal server error" });
	}
};
