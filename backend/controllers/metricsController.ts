import { Request, Response } from "express";
import { getDashboardMetrics, getActivityStreak } from "../models/message";
import { getUserDemographics } from "../models/user";

export const getDashboard = async (
	_req: Request,
	res: Response
): Promise<void> => {
	try {
		const [metrics, demographics, streak] = await Promise.all([
			getDashboardMetrics(),
			getUserDemographics(),
			getActivityStreak(),
		]);
		console.log("✅ Streak from DB:", streak);

		res.json({
			...metrics,
			demographics,
			streak: streak ?? [],
		});
	} catch (err) {
		console.error("Erro ao obter métricas do dashboard:", err);
		res.status(500).json({ message: "Erro interno do servidor" });
	}
};
