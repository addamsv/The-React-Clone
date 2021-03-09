const state = require('./i');

describe('', () => {
  let someSate;
  beforeEach(() => {
    someSate = state.getArr();
  });
  test('should return list of smth', () => {
    expect(someSate).toBeDefined();

    // Types
    expect(someSate).toBeInstanceOf(Array);
    expect(someSate).toEqual(expect.any(Array));
    expect(someSate).toEqual(expect.anything());

    // Numbers
    expect(someSate.length).toBeGreaterThan(1);
    expect(someSate.length).toEqual(2);

    // Boolean
    expect(someSate.includes('a')).toBeTruthy();
    expect(someSate.includes('c')).toBeFalsy();

    // Strings
    expect(someSate[0]).toEqual('a');
    expect(someSate[0]).toMatch(/a/);
  });
});
