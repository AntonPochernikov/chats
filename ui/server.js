const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3003;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.svg': 'application/image/svg+xml'
};

const requestHandler = (req, res) => {
  console.log('request ', req.url);
  const filePath = req.url === '/' ? './build/index.html' : `./build/${req.url}`;
  const extname = String(path.extname(filePath)).toLowerCase();

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.readFile('./build/index.html', (e, index) => res.end(index));
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data, 'utf-8');
  });
};

const server = http.createServer();
server.on('request', requestHandler);
 
server.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`server is listening on ${port}`);
});
