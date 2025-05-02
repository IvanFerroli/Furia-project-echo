import { Request, Response } from 'express';
import { getAllUsers, getDashboardStats } from '../models/admin';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('getUsers error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStats = async (_req: Request, res: Response) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (err) {
    console.error('getStats error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
