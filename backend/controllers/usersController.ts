import { Request, Response } from "express";
import {
	getUserById,
	updateUserProfile,
	getUserMetrics as getUserMetricsModel,
} from "../models/user";
import validateCpf from "../utils/validateCpf";

export const getUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const user = await getUserById(req.params.id);
		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}
		res.json(user);
	} catch (err) {
		console.error("getUser error:", err);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const patchUser = async (req: Request, res: Response): Promise<void> => {
	const { nickname, profile_image, bio, city, birthdate, cpf } = req.body;
	const userId = req.params.id;

	const isCpfValid = !cpf || validateCpf(cpf);
	if (cpf && !isCpfValid) {
		res.status(400).json({ message: "Invalid CPF format" });
		return;
	}

	const profile_completed = !!(nickname && profile_image && bio && city && birthdate);
	const verified = !!cpf && isCpfValid;

	try {
		await updateUserProfile(userId, {
			nickname,
			profile_image,
			bio,
			city,
			birthdate,
			cpf,
			profile_completed,
			verified,
		});
		res.json({ message: "Profile updated" });
	} catch (err) {
		console.error("patchUser error:", err);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getUserMetrics = async (req: Request, res: Response): Promise<void> => {
	try {
		const metrics = await getUserMetricsModel(req.params.id);
		res.json(metrics);
	} catch (err) {
		console.error("getUserMetrics error:", err);
		res.status(500).json({ message: "Internal server error" });
	}
};
