import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const root = process.cwd();
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const safe = normalize(url.pathname === '/' ? '/index.html' : url.pathname).replace(/^(\.\.[/\\])+/, '');
    const file = join(root, safe);
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch (error) {
    res.writeHead(404); res.end('Not found');
  }
});
const port = process.env.PORT || 5173;
server.listen(port, () => console.log(`Jewoulingo MVP running at http://localhost:${port}`));
