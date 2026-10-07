import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
let port = Number(portIndex >= 0 ? args[portIndex + 1] : process.env.PORT || 5173);
const root = fileURLToPath(new URL(args.includes('--dist') ? '../dist/' : '../', import.meta.url));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const target = path.resolve(root, relative);
    if (!target.startsWith(root) || relative.split('/').some(part => part.startsWith('.'))) {
      res.writeHead(403).end(); return;
    }
    const info = await stat(target);
    if (!info.isFile()) { res.writeHead(404).end(); return; }
    if (['.mp4', '.mp3'].includes(path.extname(target))) {
      const match = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
      const start = match ? Number(match[1]) : 0;
      const end = match && match[2] ? Math.min(Number(match[2]), info.size - 1) : info.size - 1;
      if (start > end || start >= info.size) { res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end(); return; }
      const headers = { 'Content-Type': path.extname(target) === '.mp3' ? 'audio/mpeg' : 'video/mp4', 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 };
      if (match) headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
      res.writeHead(match ? 206 : 200, headers);
      if (req.method === 'HEAD') res.end();
      else createReadStream(target, { start, end }).pipe(res);
      return;
    }
    res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(await readFile(target));
  } catch { res.writeHead(404).end('Not found'); }
});
server.on('error', error => {
  if (error.code === 'EADDRINUSE') server.listen(++port, '127.0.0.1');
  else throw error;
});
server.listen(port, '127.0.0.1', () => console.log(`Preview: http://localhost:${port}`));
