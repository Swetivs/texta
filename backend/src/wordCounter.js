function countWords(text) {
    if (!text) return [];

    // Transform in litere mici si extragem cuvintele folosind regex (doar caractere alfanumerice)
    const words = text.toLowerCase().match(/\b[\wăâîșț]+\b/g);
    
    if (!words) return [];

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

    return sortedFrequencies;
}

module.exports = { countWords };