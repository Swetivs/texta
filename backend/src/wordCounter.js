function countWords(text) {
    if (!text) return { frequencies: [], totalWords: 0 };

    // Transform in litere mici si extragem cuvintele folosind regex (doar caractere alfanumerice + diacritice)
    const words = text.toLowerCase().match(/[a-z0-9ăâîșț]+/g);
    
    if (!words) return { frequencies: [], totalWords: 0 };

    const frequencyMap = {};

    words.forEach(word => {
        frequencyMap[word] = (frequencyMap[word] || 0) + 1;
    });

    // Sortam descrescator dupa frecventa
    const sortedFrequencies = Object.keys(frequencyMap).map(word => {
        return {
            word: word,
            count: frequencyMap[word]
        };
    }).sort((a, b) => b.count - a.count);

    return { frequencies: sortedFrequencies, totalWords: words.length };
}

module.exports = { countWords };