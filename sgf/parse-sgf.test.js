import { tokenize } from './parse-sgf.js';

describe('tokenize function', () => {
  test('should tokenize a simple SGF string with a single property', () => {
    const sgf = '(;FF[4])';
    const expectedTokens = [
      { type: 'terminal', value: '(' },
      { type: 'terminal', value: ';' },
      { type: 'propId', value: 'FF' },
      { type: 'propVal', value: '4' },
      { type: 'terminal', value: ')' },
    ];
    expect(tokenize(sgf)).toEqual(expectedTokens);
  });

  test('should handle escaped characters within property values', () => {
    const sgf = String.raw`(;C[This is a comment with an escaped newline\
and a colon\:])`;
    const expectedTokens = [
      { type: 'terminal', value: '(' },
      { type: 'terminal', value: ';' },
      { type: 'propId', value: 'C' },
      { type: 'propVal', value: 'This is a comment with an escaped newlineand a colon<ESCAPEDCOLON>' },
      { type: 'terminal', value: ')' },
    ];
    expect(tokenize(sgf)).toEqual(expectedTokens);
  });

  test('should throw an error for missing closing bracket', () => {
    const sgf = '(;C[Missing closing bracket)';
    expect(tokenize(sgf)).toThrow("missing ']'");
  });

  test('should throw an error for property ID without value', () => {
    const sgf = '(;FF)';
    expect(tokenize(sgf)).toThrow('expecting propVal after propId');
  });
});

