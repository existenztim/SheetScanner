/**
 * Removes any blank spaces in strings (mainly used in URLs).
 *
 * @param {string | null | undefined} string - The input string.
 * @returns {string} The string with blank spaces removed.
 */

export const removeBlankSpace = (string: string | null | undefined): string => {
  const compressedString = string?.replace(/\s/g, '') || '';
  return compressedString;
};

/**
 * Cuts the end of strings that exceed the specified maxlength.
 * The last '...' is appended to inform the user that there is more to the string than is being represented.
 *
 * @param {string | undefined} string - The input string.
 * @param {number} maxlength - The maximum length of the string.
 * @returns {string} The shortened string.
 */

export const cutLongStrings = (string: string | undefined, maxlength: number) => {
  const shortenedString = `${string?.substring(0, maxlength)}...`;
  return shortenedString;
};

/**
 * To get the current date in 'YYYY-MM-DD HH:mm' format.
 * @returns {string} A string in 'YYYY-MM-DD HH:mm' format.
 */

export const getDate = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

  return formattedDate;
};
