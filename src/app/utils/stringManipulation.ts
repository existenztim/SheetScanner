export const removeBlankSpace = (string: string | null | undefined): string => {
  const compressedString = string?.replace(/\s/g, '') || '';
  return compressedString;
};

export const cutLongStrings = (string: string | undefined, maxlength: number): string => {
  if (string && string?.length >= maxlength) {
    const shortenedString = `${string?.substring(0, maxlength)}...`;
    return shortenedString;
  } else {
    return string || '';
  }
};

export const getDate = (): string => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

  return formattedDate;
};
