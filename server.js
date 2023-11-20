const http = require('http');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

dotenv.config();

const apiKey = process.env.API_KEY;
const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default to 3000

app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/logos', express.static(path.join(__dirname, 'logos')));
app.use('/open-weather-symbols', express.static(path.join(__dirname, 'open-weather-symbols')));
app.use('/weather-backgrounds', express.static(path.join(__dirname, 'weather-backgrounds')));



// Serve styles.css before the default route
app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'styles.css'), { 'Content-Type': 'text/css' });
});


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

app.get('/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.js'), { 'Content-Type': 'text/javascript' });
});
res.sendFile(path.join(__dirname, 'index.js'), { 'Content-Type': 'text/javascript' });



app.get('/api/getApiKey', (req, res) => {
  res.json({ apiKey: apiKey });
});

const server = http.createServer(app);

// Update the server to listen on the specified hostname and port
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
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
