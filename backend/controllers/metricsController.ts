import { Request, Response } from 'express';
import { getDashboardMetrics } from '../models/message';

export const getDashboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    const metrics = await getDashboardMetrics();
    res.json(metrics);
  } catch (err) {
    console.error('Erro ao obter métricas do dashboard:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
