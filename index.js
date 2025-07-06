import express from 'express';
import https from 'https';
import { URL } from 'url';

const app = express();
app.use(express.json());

app.use('/bybit/*', (req, res) => {
  const path = req.originalUrl.replace('/bybit', '');
  const targetUrl = new URL('https://api.bybit.com' + path);

  const options = {
    hostname: targetUrl.hostname,
    path: targetUrl.pathname + targetUrl.search,
    method: req.method,
    headers: {
      ...req.headers,
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // UA spoof
    }
  };

  const proxy = https.request(options, (bybitRes) => {
    let data = '';
    bybitRes.on('data', (chunk) => data += chunk);
    bybitRes.on('end', () => {
      res.status(bybitRes.statusCode).send(data);
    });
  });

  proxy.on('error', (err) => {
    res.status(500).json({ error: true, message: err.message });
  });

  if (req.method !== 'GET' && req.body) {
    proxy.write(JSON.stringify(req.body));
  }

  proxy.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
