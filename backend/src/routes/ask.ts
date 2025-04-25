import { Router } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const router = Router();

router.post('/', async (req, res) => {
  const prompt = req.body.prompt;
  const HF_API_KEY = process.env.HF_API_KEY;
  const HF_MODEL_URL = process.env.HF_MODEL_URL;

  try {
    // Load roster context
    const rosterPath = path.resolve(__dirname, '../../data/roster/current_roster.json');
    const rosterRaw = fs.readFileSync(rosterPath, 'utf-8');
    const roster = JSON.parse(rosterRaw);

    // Format roster into readable context
    const context = roster.map((player: any) =>
      `- ${player.nickname} (${player.name}), role: ${player.role}, joined: ${player.joinDate}`
    ).join('\n');

    const formattedPrompt = `Context:\n${context}\n\nQuestion: ${prompt}\nAnswer:`;

    const response = await axios.post(
      HF_MODEL_URL!,
      {
        inputs: formattedPrompt,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'axios/1.8.4',
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
          Connection: 'keep-alive',
          Host: 'api-inference.huggingface.co',
        },
      }
    );

    const output = response.data[0]?.generated_text || 'Erro ao gerar resposta.';
    res.json({ response: output });
  } catch (error) {
    console.error('[ERRO HUGGINGFACE]', error);
    res.status(500).json({ error: 'Erro ao consultar IA.' });
  }
});

export default router;
