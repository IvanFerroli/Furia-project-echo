import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../../data/roster/current_roster.json');
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(rawData);
    res.json(data);
  } catch (error) {
    console.error('Error reading roster data:', error);
    res.status(500).json({ error: 'Failed to load roster data' });
  }
});

export default router;
