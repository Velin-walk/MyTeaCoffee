import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets
app.use(express.static(__dirname));

// Ensure manifest.json and Manifest.json can both be requested
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'Manifest.json'));
});

// Dedicated Forest App route
app.get('/forest', (req, res) => {
  res.sendFile(path.join(__dirname, 'forest.html'));
});

// Single Page Application fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
