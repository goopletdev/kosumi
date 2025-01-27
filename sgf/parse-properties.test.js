import {
    parseProperty,
    range,
    number,
    real,
    text,
    simpleText,
    double,
    none,
    move,
    point,
    color,
    composed,
    eList,
    parseDates,
} from './parse-properties.js';

describe('private parsing properties', () => {
    test('range', () => {
        expect(range('4',1,5)).toEqual([4]);
        expect(() => range('6',0,3)).toThrow();
        expect(() => range('lmao',1,16)).toThrow('[lmao] is not allowed');
    });

    test('number', () => {
        expect(number('4')).toEqual([4]);
        expect(() => number('alpha')).toThrow();
    });

    test('real', () => {
        expect(real('4.5')).toEqual([4.5]);
        expect(() => real('catwoman')).toThrow('[catwoman] is not allowed');
    });

    test('text', () => {
        expect(text('tab\tcarriagereturn\r<ESCAPEDCOLON>'))
        .toEqual(['tab carriagereturn\n:']);
    });

    test('simpleText', () => {
        expect(simpleText('tab\tcarriagereturn\r<ESCAPEDCOLON>'))
        .toEqual(['tab carriagereturn :']);
    });

    test('double', () => {
        expect(double('2')).toEqual([2]);
        expect(() => double('3')).toThrow('[3] is not allowed');
    });

    test('none', () => {
        expect(() => none('pikachu')).toThrow('[pikachu] is not allowed');
        expect(none(undefined)).toEqual([]);
    });

    test('move', () => {
        expect(move('aa')).toEqual([[0,0]]);
        expect(() => move('the fitnessGram pacer test'))
        .toThrow('[the fitnessGram pacer test] is not allowed');
    });

    test('point', () => {
        expect(point('aa:bb')).toEqual([[0,0],[0,1],[1,0],[1,1]]);
    });

    test('color', () => {
        expect(color('B')).toEqual(['B']);
        expect(() => color('N')).toThrow('[N] is not allowed');
    });

    test('composed', () => {
        expect(composed('ab:cd',point,point)).toEqual([[0,1],[2,3]]);
    });

    test('eList', () => {
        expect(eList('')).toEqual([]);
    });

    test('parseDates', () => {
        expect(parseDates('1984-10-5,6,11-4')).toEqual([
            [1984,10,5],
            [1984,10,6],
            [1984,11,4]
        ]);
    });
});