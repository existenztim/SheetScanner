import { removeBlankSpace, cutLongStrings, getDate } from '@/app/utils/stringManipulation';

describe('removeBlankSpace utility function', () => {
  test('removes blank spaces', () => {
    const result = removeBlankSpace('  hello world  ');
    expect(result).toBe('helloworld');
  });

  test('handles null or undefined input', () => {
    expect(removeBlankSpace(null)).toBe('');
    expect(removeBlankSpace(undefined)).toBe('');
  });
});

describe('cutLongStrings utility function', () => {
  test('cuts strings longer than maxlength and appends "...", when necessary', () => {
    const result = cutLongStrings('Hellooooo World!', 10);
    expect(result).toBe('Hellooooo ...');
  });

  test('handles undefined input', () => {
    expect(cutLongStrings(undefined, 10)).toBe('');
  });

  test('does not append "..." if the string is shorter than maxlength', () => {
    const result = cutLongStrings('Short string', 20);
    expect(result).toBe('Short string');
  });
});

describe('getDate utility function', () => {
  test('returns the current date in "YYYY-MM-DD HH:mm" format', () => {
    const mockDate = new Date(2022, 0, 1, 12, 34);
    jest.spyOn(global, 'Date').mockImplementationOnce(() => mockDate);

    const result = getDate();
    expect(result).toBe('2022-01-01 12:34');

    jest.restoreAllMocks();
  });
});
