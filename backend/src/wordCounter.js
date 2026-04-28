function countWords(text) {
    if (!text) return { frequencies: [], totalWords: 0 };

    // Transform in litere mici si extragem cuvintele folosind regex (caractere alfanumerice + TOATE formele de diacritice, permitand '-' in interiorul cuvantului)
    const words = text.toLowerCase().match(/[a-z0-9ăâîșțşţ]+(?:-[a-z0-9ăâîșțşţ]+)*/g);
    
    if (!words) return { frequencies: [], totalWords: 0 };

    const frequencyMap = {};

    words.forEach(word => {
        frequencyMap[word] = (frequencyMap[word] || 0) + 1;
    });

    // Sortam descrescator dupa frecventa (in caz de egalitate, sortam alfabetic)
    const sortedFrequencies = Object.keys(frequencyMap).map(word => {
        return {
            word: word,
            count: frequencyMap[word]
        };
    }).sort((a, b) => {
        if (b.count === a.count) {
            return a.word.localeCompare(b.word);
        }
        return b.count - a.count;
    });

    return { frequencies: sortedFrequencies, totalWords: words.length };
}

module.exports = { countWords };