const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { countWords } = require('./wordCounter');

const app = express();
const port = 3000;

// Set up storage for Multer
const upload = multer({ dest: 'uploads/' });

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// Endpoint to handle raw text input
app.post('/api/analyze-text', (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Niciun text valid furnizat.' });
    }

    const frequencies = countWords(text);
    res.json({ data: frequencies });
});

// Endpoint to handle file upload and process text
app.post('/api/analyze-file', upload.single('textFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Niciun fișier selectat.' });
    }

    const filePath = req.file.path;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Eroare la citirea fișierului.' });
        }

        // Count words and get sorted frequencies
        const frequencies = countWords(data);

        // Clean up the uploaded file after processing
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error('Eroare la stergerea fisierului:', unlinkErr);
        });

        res.json({ data: frequencies });
    });
});

app.listen(port, () => {
    console.log(`Serverul ruleaza la adresa http://localhost:${port}`);
});