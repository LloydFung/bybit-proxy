from flask import Flask, request, Response
import httpx

app = Flask(__name__)

@app.route('/bybit/<path:path>', methods=['GET', 'POST'])
def proxy(path):
    base_url = "https://api.bybit.com"
    # 🔧 正確組合 URL path 和原始 query string
    query_string = request.query_string.decode('utf-8')  # 原始未編碼
    url = f"{base_url}/{path}"
    if query_string:
        url += f"?{query_string}"  # 保留原樣 query

    headers = {k: v for k, v in request.headers if k.lower() != 'host'}
    headers['User-Agent'] = 'Mozilla/5.0'

    try:
        with httpx.Client(http2=True, timeout=10.0, verify=True) as client:
            if request.method == 'GET':
                r = client.get(url, headers=headers)
            else:
                r = client.post(url, headers=headers, content=request.data)

        return Response(r.content, status=r.status_code, content_type=r.headers.get('Content-Type'))

    except Exception as e:
        return {'error': True, 'message': str(e)}, 500

if __name__ == '__main__':
    app.run(port=3000)
