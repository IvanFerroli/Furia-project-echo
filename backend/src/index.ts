import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import askRoute from './routes/ask';
import rosterRoute from './routes/roster';

dotenv.config();

const app = express(); 

app.use(cors());
app.use(express.json());
app.use('/ask', askRoute);
app.use('/api/roster', rosterRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('🔥 FURIA backend alive 🔥');
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`🔥 Backend on http://localhost:${PORT}`));
