import { useState } from 'react';

const useClipboard = () => {
  const [clipboardValue, setClipboardValue] = useState<{ value: string; key: string }>({ value: '', key: '' });

  const handleClipboardValue = (value: string, key: string) => {
    setClipboardValue({ value, key });
    navigator.clipboard.writeText(value);
  };

  return { clipboardValue, handleClipboardValue };
};

export default useClipboard;
