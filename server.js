const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Gunakan dev = false agar Next.js berjalan dalam mode production
const dev = false; 
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log('> Server ready on Hostinger');
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});