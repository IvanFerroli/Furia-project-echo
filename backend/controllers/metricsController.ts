import { Request, Response } from 'express';
import { getDashboardMetrics } from '../models/message';
import { getUserDemographics } from '../models/user';

export const getDashboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [metrics, demographics] = await Promise.all([
      getDashboardMetrics(),
      getUserDemographics(),
    ]);

    res.json({
      ...metrics,
      demographics,
    });
  } catch (err) {
    console.error('Erro ao obter métricas do dashboard:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
