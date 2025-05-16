import axios from 'axios';
import {
  DashboardMetrics,
} from '../types/DashboardMetrics';
import { BASE_URL } from '../config';

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await axios.get<DashboardMetrics>(`${BASE_URL}/metrics`);
  return response.data;
}
