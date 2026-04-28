const { countWords } = require('../src/wordCounter');

describe('countWords function', () => {
    test('ar trebui să numere corect cuvintele dintr-o propoziție simplă', () => {
        const text = 'badger badger badger badger mushroom mushroom snake badger badger badger';
        const result = countWords(text);

        expect(result.frequencies).toHaveLength(3);
        expect(result.totalWords).toBe(10);
        expect(result.frequencies[0]).toEqual({ word: 'badger', count: 7 });
        expect(result.frequencies[1]).toEqual({ word: 'mushroom', count: 2 });
        expect(result.frequencies[2]).toEqual({ word: 'snake', count: 1 });
    });

    test('ar trebui să ignore semnele de punctuație și literele mari/mici', () => {
        const text = 'Hello, hello! World? WORLD.';
        const result = countWords(text);

        expect(result.frequencies).toHaveLength(2);
        expect(result.totalWords).toBe(4);
        expect(result.frequencies[0]).toEqual({ word: 'hello', count: 2 });
        expect(result.frequencies[1]).toEqual({ word: 'world', count: 2 });
    });

    test('ar trebui să proceseze corect diacriticele românești', () => {
        const text = 'șalău, Șalău! casă Casă';
        const result = countWords(text);

        expect(result.frequencies).toHaveLength(2);
        expect(result.totalWords).toBe(4);
        // Poate sa difere în ordinea afișării dacă au aceeași frecvență, verificăm conținutul
        expect(result.frequencies).toContainEqual({ word: 'șalău', count: 2 });
        expect(result.frequencies).toContainEqual({ word: 'casă', count: 2 });
    });

    test('ar trebui să returneze un array gol pentru input vid', () => {
        expect(countWords('').frequencies).toEqual([]);
        expect(countWords(null).frequencies).toEqual([]);
        expect(countWords('').totalWords).toBe(0);
        expect(countWords(null).totalWords).toBe(0);
    });
});