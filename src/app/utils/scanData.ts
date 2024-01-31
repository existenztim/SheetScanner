import { IKeyValuePairs } from '../models/interfaces/IKeyValuePairs';

export const scanData = (data: any[], terms: string): any[] => {
  const searchTermsArray: string[] = terms
    .toLowerCase()
    .split(' ')
    .filter(term => term.trim() !== '');

  if (searchTermsArray.length === 0) {
    return [];
  }

  return (data as IKeyValuePairs[]).filter(item => {
    return searchTermsArray.every(term => {
      for (const key in item) {
        if (String(item[key]).toLowerCase().includes(term)) {
          return true;
        }
      }
      return false;
    });
  });
};
