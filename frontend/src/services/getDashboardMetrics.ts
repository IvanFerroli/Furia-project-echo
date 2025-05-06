import axios from 'axios';
import {
  DashboardMetrics,
} from '../types/DashboardMetrics';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await axios.get<DashboardMetrics>(`${API_BASE}/metrics`);
  return response.data;
}
