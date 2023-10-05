const http = require('http');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const express = require('express'); // Import Express.js
const cors = require('cors'); // Import the cors middleware

dotenv.config();

const apiKey = process.env.API_KEY;

// Create an Express.js app
const app = express();

// Use the cors middleware to allow requests from localhost:5500
app.use(cors());

// Serve static files (HTML, JavaScript, CSS)
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

// Define your API endpoint
app.get('/api/getApiKey', (req, res) => {
  res.json({ apiKey: apiKey });
});

// Start the server on port 3000
const server = http.createServer(app);
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// Helper function to determine content type based on file extension
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
