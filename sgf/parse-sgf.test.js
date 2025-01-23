import { tokenize } from './parse-sgf';

describe('tokenize function', () => {
  test('should tokenize a simple SGF string with a single property', async () => {
    const sgf = '(;FF[4])';
    const expectedTokens = [
      { type: 'terminal', value: '(' },
      { type: 'terminal', value: ';' },
      { type: 'propId', value: 'FF' },
      { type: 'propVal', value: '4' },
      { type: 'terminal', value: ')' },
    ];
    await expect(tokenize(sgf)).resolves.toEqual(expectedTokens);
  });

  test('should handle escaped characters within property values', async () => {
    const sgf = String.raw`(;C[This is a comment with an escaped newline\
and a colon\:])`;
    const expectedTokens = [
      { type: 'terminal', value: '(' },
      { type: 'terminal', value: ';' },
      { type: 'propId', value: 'C' },
      { type: 'propVal', value: 'This is a comment with an escaped newlineand a colon<ESCAPEDCOLON>' },
      { type: 'terminal', value: ')' },
    ];
    await expect(tokenize(sgf)).resolves.toEqual(expectedTokens);
  });

  test('should throw an error for missing closing bracket', async () => {
    const sgf = '(;C[Missing closing bracket)';
    await expect(tokenize(sgf)).rejects.toThrow("missing ']'");
  });

  test('should throw an error for property ID without value', async () => {
    const sgf = '(;FF)';
    await expect(tokenize(sgf)).rejects.toThrow('expecting propVal after propId');
  });
});

