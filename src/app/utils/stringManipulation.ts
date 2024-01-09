/**
 * To remove any blankspaces in strings (mainly used in URL:s)
 */
export const removeBlankSpace = (string: string | null | undefined) => {
  const compressedString = string?.replace(/\s/g, '') || '';
  return compressedString;
};
