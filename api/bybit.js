export default async function handler(req, res) {
  const url = 'https://api.bybit.com' + req.url.replace('/api/bybit', '');
  const headers = {
    ...req.headers,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // 偽造 UA
  };

  const response = await fetch(url, {
    method: req.method,
    headers,
    body: req.method === 'GET' ? undefined : req.body
  });

  const body = await response.text(); // 不管回傳 JSON 或錯誤頁都能顯示
  res.status(response.status).send(body);
}
