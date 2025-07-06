import express from 'express';
import axios from 'axios';
import https from 'https';

const app = express();
app.use(express.json());

const httpsAgent = new https.Agent({
  keepAlive: true,
  minVersion: 'TLSv1.2', // 明確要求使用 TLS 1.2+
  rejectUnauthorized: true
});

app.use('/bybit/*', async (req, res) => {
  const path = req.originalUrl.replace('/bybit', '');
  const targetUrl = 'https://api.bybit.com' + path;

  try {
    const axiosRes = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        ...req.headers,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // spoof UA
      },
      data: req.body,
      httpsAgent
    });

    res.status(axiosRes.status).send(axiosRes.data);
  } catch (err) {
    res.status(err?.response?.status || 500).json({
      error: true,
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
