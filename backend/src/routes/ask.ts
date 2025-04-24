import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.post('/', async (req, res) => {
  const prompt = req.body.prompt;
  const HF_API_KEY = process.env.HF_API_KEY;
  const HF_MODEL_URL = process.env.HF_MODEL_URL;

  try {
    const formattedPrompt = `Question: ${prompt}\nAnswer:`;

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
