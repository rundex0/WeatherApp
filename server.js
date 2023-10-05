const http = require('http');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

dotenv.config();

const apiKey = process.env.API_KEY;
const app = express();
const hostname = process.env.HOST || 'localhost'; // Use environment variable or default to localhost
const port = process.env.PORT || 3000; // Use environment variable or default to 3000

app.use(cors());

app.get('/', (req, res) => {
  const filePath = 'index.html'; // Default to index.html
  const contentType = getContentType(filePath);

  fs.readFile(path.join(__dirname, filePath), (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

app.get('/api/getApiKey', (req, res) => {
  res.json({ apiKey: apiKey });
});

const server = http.createServer(app);

// Update the server to listen on the specified hostname and port
server.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}`);
});

function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.js':
      return 'text/javascript';
    case '.css':
      return 'text/css';
    default:
      return 'text/plain';
  }
}
