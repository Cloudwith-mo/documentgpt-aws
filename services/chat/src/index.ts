import http from 'http';
import { getProvider } from '@docgpt/core/src/provider';

const PORT = 3001;
const provider = getProvider();

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/chat') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });
      const { messages } = JSON.parse(body || '{"messages":[]}');
      for await (const ev of provider.chat({ messages })) {
        if (ev.type === 'token') res.write(`data: ${ev.data}\n\n`);
      }
      res.end();
    });
    return;
  }
  res.statusCode = 404; res.end('not found');
});

server.listen(PORT, () => console.log(`chat service listening on :${PORT}`));
