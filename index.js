import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.use('/bybit/*', async (req, res) => {
  const path = req.originalUrl.replace('/bybit', '');
  const target = 'https://api.bybit.com' + path;

  try {
    const response = await fetch(target, {
      method: req.method,
      headers: {
        ...req.headers,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // Spoof UA
      },
      body: req.method === 'GET' ? undefined : req.body
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
