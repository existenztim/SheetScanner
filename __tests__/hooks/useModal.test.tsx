import useModal from '@/app/hooks/useModal';
import { FormResponseTypes } from '@/app/models/enums/EFormResponse';
import { act, renderHook } from '@testing-library/react';

describe('useModal hook', () => {
  test('should update modal state when handleModalResponse is called', () => {
    const { result } = renderHook(() => useModal());

    const message = 'Test message';
    const type = FormResponseTypes.SUCCESS;

    act(() => {
      result.current.handleModalResponse(message, type);
    });

    expect(result.current.modal.message).toEqual(message);
    expect(result.current.modal.type).toEqual(type);
  });
});
