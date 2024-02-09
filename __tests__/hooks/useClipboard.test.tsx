import useClipboard from '@/app/hooks/useClipBoard';
import { act, renderHook } from '@testing-library/react';

//since navigator.writeText is not avaliable in node environment, only browser
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('useClipboard hook', () => {
  test('should update clipboardValue when handleClipboardValue is called', () => {
    const { result } = renderHook(() => useClipboard());
    const value = 'test value';
    const key = 'test key';

    act(() => {
      result.current.handleClipboardValue(value, key);
    });

    expect(result.current.clipboardValue.value).toEqual(value);
    expect(result.current.clipboardValue.key).toEqual(key);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(value);
  });
});
