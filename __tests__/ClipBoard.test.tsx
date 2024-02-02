import { render } from '@testing-library/react';
import ClipBoard from '../src/app/components/ClipBoard';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('ClipBoard component', () => {
  test('shouldRender is true when pathname includes "scanner"', () => {
    jest.spyOn(require('next/navigation'), 'usePathname').mockReturnValue('/some-path/scanner');
    const { container } = render(<ClipBoard />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('shouldRender is false when pathname does not include "scanner"', () => {
    jest.spyOn(require('next/navigation'), 'usePathname').mockReturnValue('/some-other-path');
    const { container } = render(<ClipBoard />);
    expect(container.firstChild).toBeNull();
  });
});
