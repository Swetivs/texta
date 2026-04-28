const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { countWords } = require('./wordCounter');
const LanguageDetect = require('languagedetect');
const { updateStats, getTop10 } = require('./statsManager');

const lngDetector = new LanguageDetect();
const app = express();
// Folosim un port furnizat de host-ul din cloud, in caz contrar ne legam la 3000 pe local
const port = process.env.PORT || 3000;

// Set up storage for Multer
const upload = multer({ dest: 'uploads/' });

// Middleware to parse JSON bodies limitat la 50MB (pentru bucati uriase de text)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// Endpoint pentru initializarea topurilor
app.get('/api/global-stats', (req, res) => {
    res.json(getTop10());
});

// Functie helper pentru procesarea limbii
function processTextLanguageAndStats(text, result) {
    const detected = lngDetector.detect(text, 1);
    let lang = 'unknown'; // default
    
    if (detected && detected.length > 0) {
        const primaryLang = detected[0][0]; 
        if (primaryLang === 'english') lang = 'en';
        else if (primaryLang === 'romanian') lang = 'ro';
    }

    if (lang === 'en' || lang === 'ro') {
        updateStats(lang, result.frequencies);
    }
    
    return lang;
}

// Endpoint to handle raw text input
app.post('/api/analyze-text', (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Niciun text valid furnizat.' });
    }

    const { performance } = require('perf_hooks');
    const start = performance.now();
    const result = countWords(text);
    const end = performance.now();
    const timeTaken = (end - start).toFixed(2); // ms

    const detectedLang = processTextLanguageAndStats(text, result);

    res.json({
        data: result.frequencies,
        totalWords: result.totalWords,
        timeTakenMs: timeTaken,
        detectedLang: detectedLang
    });
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

        const { performance } = require('perf_hooks');
        const start = performance.now();
        
        // Count words and get sorted frequencies
        const result = countWords(data);

        const end = performance.now();
        const timeTaken = (end - start).toFixed(2); // ms

        const detectedLang = processTextLanguageAndStats(data, result);

        // Clean up the uploaded file after processing
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error('Eroare la stergerea fisierului:', unlinkErr);
        });

        res.json({
            data: result.frequencies,
            totalWords: result.totalWords,
            timeTakenMs: timeTaken,
            detectedLang: detectedLang
        });
    });
});

app.listen(port, () => {
    console.log(`Serverul ruleaza la adresa http://localhost:${port}`);
});