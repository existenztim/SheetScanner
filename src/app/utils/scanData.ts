import { IKeyValuePairs } from '../models/interfaces/IKeyValuePairs';
import { INote } from '../models/interfaces/INote';

/**
 * Searches through an array of data based on given search terms.
 * @param {IKeyValuePairs[] | INote[]} data - The array of data types to search through.
 * @param {string} terms - The search terms separated by spaces.
 * @returns {IKeyValuePairs[] | INote[]} An array of matching items.
 */

export const scanData = (data: IKeyValuePairs[] | INote[], terms: string): IKeyValuePairs[] | INote[] => {
  // Convert search terms to an array and filter out empty terms
  const searchTermsArray: string[] = terms
    .toLowerCase()
    .split(' ')
    .filter(term => term.trim() !== '');

  if (searchTermsArray.length === 0) {
    return [];
  }

  // Filter the data based on search terms
  return (data as IKeyValuePairs[]).filter(item => {
    return searchTermsArray.every(term => {
      for (const key in item) {
        if (String(item[key]).toLowerCase().includes(term)) {
          return true; // If a match is found, return true
        }
      }
      return false; // If no match is found for the current term, return false
    });
  });
};
