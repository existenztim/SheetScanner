import { IKeyValuePairs } from '@/app/models/interfaces/IKeyValuePairs';
import { scanData } from '@/app/utils/scanData';

describe('scanData function', () => {
  const testData: IKeyValuePairs[] = [
    { name: 'John Doe', age: '30', city: 'New York', country: 'USA' },
    { name: 'Jane Doe', age: '25', city: 'San Francisco', country: 'USA' },
    { name: 'Bob Smith', age: '40', city: 'Los Angeles', country: 'USA' },
  ];

  test('returns an empty array if search terms are empty', () => {
    const result = scanData(testData, '');
    expect(result).toEqual([]);
  });

  test('filters data based on search terms (case insensitive)', () => {
    const result1 = scanData(testData, 'John');
    expect(result1).toEqual([{ name: 'John Doe', age: '30', city: 'New York', country: 'USA' }]);

    const result2 = scanData(testData, 'doe new');
    expect(result2).toEqual([{ name: 'John Doe', age: '30', city: 'New York', country: 'USA' }]);

    const result3 = scanData(testData, 'Los');
    expect(result3).toEqual([{ name: 'Bob Smith', age: '40', city: 'Los Angeles', country: 'USA' }]);

    const resultWithManyHits = scanData(testData, 'USA');
    expect(resultWithManyHits).toHaveLength(3);
  });

  test('returns an empty array if no match is found', () => {
    const result = scanData(testData, 'Unknown');
    expect(result).toEqual([]);
  });

  test('handles empty data array', () => {
    const result = scanData([], 'John');
    expect(result).toEqual([]);
  });
});
