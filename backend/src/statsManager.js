const fs = require('fs');
const path = require('path');

const statsFilePath = path.join(__dirname, '../globalStats.json');

function getStats() {
    if (fs.existsSync(statsFilePath)) {
        try {
            return JSON.parse(fs.readFileSync(statsFilePath, 'utf8'));
        } catch (e) {
            console.error('Eroare la parsarea stats:', e);
        }
    }
    return { en: {}, ro: {} };
}

function saveStats(stats) {
    fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2), 'utf8');
}

function updateStats(lang, wordFrequencies) {
    if (lang !== 'en' && lang !== 'ro') return; // Ne intereseaza doar EN si RO

    const stats = getStats();
    if (!stats[lang]) stats[lang] = {};

    wordFrequencies.forEach(item => {
        const w = item.word;
        stats[lang][w] = (stats[lang][w] || 0) + item.count;
    });

    saveStats(stats);
}

function getTop10() {
    const stats = getStats();
    const top = { en: [], ro: [] };

    ['en', 'ro'].forEach(lang => {
        if (!stats[lang]) return;

        // Convertim in array de inregistrari si le sortam
        const sorted = Object.keys(stats[lang]).map(w => {
            return { word: w, count: stats[lang][w] };
        }).sort((a, b) => {
            if (b.count === a.count) {
                return a.word.localeCompare(b.word);
            }
            return b.count - a.count;
        }).slice(0, 10);

        top[lang] = sorted;
    });

    return top;
}

module.exports = { updateStats, getTop10 };