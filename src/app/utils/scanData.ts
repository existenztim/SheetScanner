import { IKeyValuePairs } from '../models/interfaces/IKeyValuePairs';

export const scanData = (data: any[], terms: string): any[] => {
  // Convert search terms to lowercase and split into an array
  const searchTermsArray: string[] = terms
    .toLowerCase()
    .split(' ')
    .filter(term => term.trim() !== ''); // Remove empty terms

  // If no search terms provided, return an empty array
  if (searchTermsArray.length === 0) {
    return [];
  }

  // Filter the data array based on search terms
  return (data as IKeyValuePairs[]).filter(item => {
    // Check if every search term is present in at least one key-value pair of the item
    return searchTermsArray.every(term => {
      // Iterate over each key-value pair of the item
      for (const key in item) {
        // Convert the value to lowercase and check if it includes the search term
        if (String(item[key]).toLowerCase().includes(term)) {
          return true; // If found, return true for this search term
        }
      }
      return false; // If the term is not found in any key-value pair, return false
    });
  });
};
