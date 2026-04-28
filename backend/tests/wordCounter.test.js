const { countWords } = require('../src/wordCounter');

describe('countWords function', () => {
    test('ar trebui să numere corect cuvintele dintr-o propoziție simplă', () => {
        const text = 'badger badger badger badger mushroom mushroom snake badger badger badger';
        const result = countWords(text);

        expect(result).toHaveLength(3);
        expect(result[0]).toEqual({ word: 'badger', count: 7 });
        expect(result[1]).toEqual({ word: 'mushroom', count: 2 });
        expect(result[2]).toEqual({ word: 'snake', count: 1 });
    });

    test('ar trebui să ignore semnele de punctuație și literele mari/mici', () => {
        const text = 'Hello, hello! World? WORLD.';
        const result = countWords(text);

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ word: 'hello', count: 2 });
        expect(result[1]).toEqual({ word: 'world', count: 2 });
    });

    test('ar trebui să proceseze corect diacriticele românești', () => {
        const text = 'șalău, Șalău! casă Casă';
        const result = countWords(text);

        expect(result).toHaveLength(2);
        // Poate sa difere în ordinea afișării dacă au aceeași frecvență, verificăm conținutul
        expect(result).toContainEqual({ word: 'șalău', count: 2 });
        expect(result).toContainEqual({ word: 'casă', count: 2 });
    });

    test('ar trebui să returneze un array gol pentru input vid', () => {
        expect(countWords('')).toEqual([]);
        expect(countWords(null)).toEqual([]);
    });
});