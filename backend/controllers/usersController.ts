import { Request, Response } from "express";
import {
	getUserById,
	updateUserProfile,
	getUserMetrics as getUserMetricsModel,
	createUserIfMissing,
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
	const { nickname, profile_image, bio, city, birthdate, cpf, cep } = req.body;

	const userId = req.params.id;

	const isCpfValid = !cpf || validateCpf(cpf);
	if (cpf && !isCpfValid) {
		res.status(400).json({ message: "Invalid CPF format" });
		return;
	}

	const profile_completed = !!(
		nickname &&
		profile_image &&
		bio &&
		city &&
		birthdate &&
		cep
	);
	const verified = !!cpf && isCpfValid;

	try {
		await updateUserProfile(userId, {
            nickname,
            profile_image,
            bio,
            city,
            birthdate,
            cpf,
            cep,
            profile_completed,
            verified,
          });
          
		res.json({ message: "Profile updated" });
	} catch (err) {
		console.error("patchUser error:", err);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getUserMetrics = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const metrics = await getUserMetricsModel(req.params.id);
		res.json(metrics);
	} catch (err) {
		console.error("getUserMetrics error:", err);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const createUserIfNotExists = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id, email, displayName, photoURL } = req.body;

	if (!id || !email) {
		res.status(400).json({ message: "Missing id or email" });
		return;
	}

	try {
		await createUserIfMissing({
			id,
			email,
			nickname: displayName,
			profile_image: photoURL,
		});
		res.status(200).json({ message: "User checked/created" });
	} catch (err) {
		console.error("createUserIfNotExists error:", err);
		res.status(500).json({ message: "Internal server error" });
	}
};
